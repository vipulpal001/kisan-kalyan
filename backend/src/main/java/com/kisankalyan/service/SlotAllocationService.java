package com.kisankalyan.service;

import com.kisankalyan.dto.SlotBookingDto;
import com.kisankalyan.entity.*;
import com.kisankalyan.entity.enums.AllocationStatus;
import com.kisankalyan.entity.enums.BookingStatus;
import com.kisankalyan.exception.ApiException;
import com.kisankalyan.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;

@Service
public class SlotAllocationService {

    @Autowired
    private ProcurementCentreRepository centreRepository;

    @Autowired
    private CounterRepository counterRepository;

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    @Autowired
    private SlotBookingRepository slotBookingRepository;

    @Autowired
    private SlotAllocationRepository slotAllocationRepository;

    public long calculateProcessingDurationMinutes(ProcurementCentre centre, BigDecimal quantityQuintals) {
        BigDecimal rate = (centre != null && centre.getProcessingMinutesPerQuintal() != null && centre.getProcessingMinutesPerQuintal().compareTo(BigDecimal.ZERO) > 0)
                ? centre.getProcessingMinutesPerQuintal()
                : BigDecimal.valueOf(10);
        return quantityQuintals.multiply(rate).setScale(0, RoundingMode.CEILING).longValue();
    }

    public List<SlotBookingDto.FreeInterval> findFreeIntervals(Counter counter, TimeSlot slot, LocalDate date) {
        LocalTime windowStart = slot.getStartTime();
        LocalTime windowEnd = slot.getEndTime();

        OffsetDateTime slotStart = date.atTime(windowStart).atOffset(ZoneOffset.ofHoursMinutes(5, 30));
        OffsetDateTime slotEnd = date.atTime(windowEnd).atOffset(ZoneOffset.ofHoursMinutes(5, 30));

        List<SlotAllocation> allocations = slotAllocationRepository.findByCounterAndAllocationStatus(
                counter, AllocationStatus.ALLOCATED
        );

        // Filter and sort active allocations inside this slot window
        List<SlotAllocation> slotAllocations = allocations.stream()
                .filter(a -> !(a.getAllocatedEndTime().isBefore(slotStart) || a.getAllocatedStartTime().isAfter(slotEnd)))
                .sorted(Comparator.comparing(SlotAllocation::getAllocatedStartTime))
                .toList();

        List<SlotBookingDto.FreeInterval> freeIntervals = new ArrayList<>();
        OffsetDateTime currentFreeStart = slotStart;

        for (SlotAllocation alloc : slotAllocations) {
            OffsetDateTime allocStart = alloc.getAllocatedStartTime();
            OffsetDateTime allocEnd = alloc.getAllocatedEndTime();

            if (allocStart.isAfter(currentFreeStart)) {
                long duration = java.time.Duration.between(currentFreeStart, allocStart).toMinutes();
                if (duration > 0) {
                    freeIntervals.add(SlotBookingDto.FreeInterval.builder()
                            .startTime(currentFreeStart)
                            .endTime(allocStart)
                            .durationMinutes(duration)
                            .counterId(counter.getCounterId())
                            .counterNumber(counter.getCounterNumber())
                            .counterName(counter.getCounterName())
                            .build());
                }
            }
            if (allocEnd.isAfter(currentFreeStart)) {
                currentFreeStart = allocEnd;
            }
        }

        if (currentFreeStart.isBefore(slotEnd)) {
            long duration = java.time.Duration.between(currentFreeStart, slotEnd).toMinutes();
            if (duration > 0) {
                freeIntervals.add(SlotBookingDto.FreeInterval.builder()
                        .startTime(currentFreeStart)
                        .endTime(slotEnd)
                        .durationMinutes(duration)
                        .counterId(counter.getCounterId())
                        .counterNumber(counter.getCounterNumber())
                        .counterName(counter.getCounterName())
                        .build());
            }
        }

        return freeIntervals;
    }

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public SlotAllocation allocateEarliestFeasibleInterval(ProcurementCentre centre,
                                                          TimeSlot slot,
                                                          SlotBooking booking,
                                                          BigDecimal quantityQuintals) {
        long requiredDuration = calculateProcessingDurationMinutes(centre, quantityQuintals);

        List<Counter> activeCounters = counterRepository.findByCenter(centre).stream()
                .filter(c -> "ACTIVE".equalsIgnoreCase(c.getStatus().name()))
                .toList();

        if (activeCounters.isEmpty()) {
            throw new ApiException("इस केंद्र पर कोई काउंटर सक्रिय नहीं है / No active counter found at this center");
        }

        SlotBookingDto.FreeInterval chosenInterval = null;
        Counter chosenCounter = null;

        LocalDate slotDate = slot.getSlotDate();

        for (Counter counter : activeCounters) {
            List<SlotBookingDto.FreeInterval> intervals = findFreeIntervals(counter, slot, slotDate);
            for (SlotBookingDto.FreeInterval interval : intervals) {
                if (interval.getDurationMinutes() >= requiredDuration) {
                    if (chosenInterval == null || interval.getStartTime().isBefore(chosenInterval.getStartTime())) {
                        chosenInterval = interval;
                        chosenCounter = counter;
                    }
                }
            }
        }

        if (chosenInterval == null || chosenCounter == null) {
            throw new ApiException("चयनित समय में पर्याप्त खाली स्लॉट उपलब्ध नहीं है / Insufficient continuous time window available for this quantity");
        }

        OffsetDateTime allocStartTime = chosenInterval.getStartTime();
        OffsetDateTime allocEndTime = allocStartTime.plusMinutes(requiredDuration);

        // 1. Pessimistic lock on chosen counter to ensure absolute isolation
        Counter lockedCounter = counterRepository.findWithLockingById(chosenCounter.getCounterId())
                .orElse(chosenCounter);

        // 2. Concurrency guard: double-check no conflicting allocation on this counter under lock
        List<SlotAllocation> conflicts = slotAllocationRepository.findConflictingAllocations(
                lockedCounter, allocStartTime, allocEndTime
        );

        if (!conflicts.isEmpty()) {
            throw new ApiException("यह समय अभी किसी अन्य किसान द्वारा बुक किया जा चुका है। कृपया पुनः प्रयास करें। / Slot was just booked by another farmer. Please try again.");
        }

        SlotAllocation allocation = SlotAllocation.builder()
                .booking(booking)
                .counter(lockedCounter)
                .slot(slot)
                .allocatedStartTime(allocStartTime)
                .allocatedEndTime(allocEndTime)
                .allocatedQuantityQuintals(quantityQuintals)
                .allocationStatus(AllocationStatus.ALLOCATED)
                .build();

        return slotAllocationRepository.save(allocation);
    }

    @Transactional
    public void handleNoShowAndReallocate(Long bookingId, String cancelReason) {
        SlotBooking booking = slotBookingRepository.findById(bookingId)
                .orElseThrow(() -> new ApiException("Booking not found: " + bookingId));

        if (booking.getBookingStatus() == BookingStatus.COMPLETED ||
            booking.getBookingStatus() == BookingStatus.ARRIVED) {
            return;
        }

        booking.setBookingStatus(BookingStatus.NO_SHOW);
        booking.setNoShowAt(OffsetDateTime.now());
        booking.setCancelReason(cancelReason != null ? cancelReason : "निर्धारित समय पर QR सत्यापन नहीं हुआ। (No-Show)");
        slotBookingRepository.save(booking);

        Optional<SlotAllocation> allocationOpt = slotAllocationRepository.findByBooking(booking);
        if (allocationOpt.isPresent()) {
            SlotAllocation alloc = allocationOpt.get();
            alloc.setAllocationStatus(AllocationStatus.RELEASED);
            slotAllocationRepository.save(alloc);

            // Reallocation: check if there are waiting bookings on the same center and slot
            reallocateReleasedInterval(alloc);
        }
    }

    private void reallocateReleasedInterval(SlotAllocation releasedAlloc) {
        OffsetDateTime currentGapStart = releasedAlloc.getAllocatedStartTime();
        OffsetDateTime gapEnd = releasedAlloc.getAllocatedEndTime();

        ProcurementCentre centre = releasedAlloc.getCounter().getCenter();
        TimeSlot slot = releasedAlloc.getSlot();

        // 1. Query later booked farmers for the same centre on the same date
        List<SlotBooking> laterBookings = slotBookingRepository.findByCenterAndBookingStatus(
                centre, BookingStatus.BOOKED
        ).stream()
        .filter(b -> b.getSlot() != null && b.getSlot().getSlotDate().equals(slot.getSlotDate()))
        .toList();

        // Sort candidates deterministically: earlier original allocated start time first, then booking time
        List<SlotBooking> sortedCandidates = new ArrayList<>(laterBookings);
        sortedCandidates.sort((b1, b2) -> {
            Optional<SlotAllocation> a1 = slotAllocationRepository.findByBooking(b1);
            Optional<SlotAllocation> a2 = slotAllocationRepository.findByBooking(b2);
            if (a1.isPresent() && a2.isPresent()) {
                int cmp = a1.get().getAllocatedStartTime().compareTo(a2.get().getAllocatedStartTime());
                if (cmp != 0) return cmp;
            }
            return b1.getBookedAt().compareTo(b2.getBookedAt());
        });

        for (SlotBooking candidate : sortedCandidates) {
            long remainingGap = java.time.Duration.between(currentGapStart, gapEnd).toMinutes();
            if (remainingGap <= 0) break;

            long reqDuration = calculateProcessingDurationMinutes(centre, candidate.getEstimatedQuantity());

            Optional<SlotAllocation> candAllocOpt = slotAllocationRepository.findByBooking(candidate);
            if (candAllocOpt.isEmpty()) continue;

            SlotAllocation candAlloc = candAllocOpt.get();

            // Candidate can move earlier only if their required duration fits the available gap
            // and their original allocation was strictly after currentGapStart
            if (reqDuration <= remainingGap && candAlloc.getAllocatedStartTime().isAfter(currentGapStart)) {
                OffsetDateTime newStart = currentGapStart;
                OffsetDateTime newEnd = newStart.plusMinutes(reqDuration);

                // Update allocation record in-place to preserve audit history and avoid unique constraint conflict
                candAlloc.setCounter(releasedAlloc.getCounter());
                candAlloc.setSlot(slot);
                candAlloc.setAllocatedStartTime(newStart);
                candAlloc.setAllocatedEndTime(newEnd);
                candAlloc.setAllocationStatus(AllocationStatus.ALLOCATED);
                slotAllocationRepository.save(candAlloc);

                // Update verification deadline to strictly 10 minutes before new start time
                candidate.setVerificationDeadline(newStart.minusMinutes(10));
                slotBookingRepository.save(candidate);

                // Advance the gap pointer forward for potential additional small allocations
                currentGapStart = newEnd;
            }
        }
    }
}
