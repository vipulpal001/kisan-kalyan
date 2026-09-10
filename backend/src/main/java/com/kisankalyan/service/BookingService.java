package com.kisankalyan.service;

import com.kisankalyan.dto.SlotBookingDto;
import com.kisankalyan.entity.*;
import com.kisankalyan.entity.enums.AllocationStatus;
import com.kisankalyan.entity.enums.BookingStatus;
import com.kisankalyan.entity.enums.QueueCurrentStatus;
import com.kisankalyan.exception.ApiException;
import com.kisankalyan.exception.ResourceNotFoundException;
import com.kisankalyan.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private SlotBookingRepository bookingRepository;

    @Autowired
    private SlotAllocationRepository allocationRepository;

    @Autowired
    private ProcurementCentreRepository centreRepository;

    @Autowired
    private AgriculturalProduceRepository produceRepository;

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private CounterRepository counterRepository;

    @Autowired
    private QueueStatusRepository queueStatusRepository;

    @Autowired
    private SlotAllocationService allocationService;

    public List<SlotBookingDto.TimeSlotAvailabilityResponse> getCenterSlotAvailability(Long centerId, LocalDate date, BigDecimal quantity) {
        ProcurementCentre centre = centreRepository.findById(centerId)
                .orElseThrow(() -> new ResourceNotFoundException("ProcurementCentre", "centerId", centerId));

        List<TimeSlot> slots = timeSlotRepository.findByCenterAndSlotDate(centre, date);
        if (slots.isEmpty()) {
            // Default 4 operating windows if not yet populated for this date
            slots = initializeDefaultTimeSlotsForDate(centre, date);
        }

        List<Counter> counters = counterRepository.findByCenter(centre).stream()
                .filter(c -> "ACTIVE".equalsIgnoreCase(c.getStatus().name()))
                .toList();

        long reqDuration = (quantity != null && quantity.compareTo(BigDecimal.ZERO) > 0)
                ? allocationService.calculateProcessingDurationMinutes(centre, quantity)
                : 10;

        List<SlotBookingDto.TimeSlotAvailabilityResponse> response = new ArrayList<>();
        DateTimeFormatter timeFmt = DateTimeFormatter.ofPattern("hh:mm a");

        for (TimeSlot slot : slots) {
            List<SlotBookingDto.FreeInterval> allFreeIntervals = new ArrayList<>();
            for (Counter counter : counters) {
                allFreeIntervals.addAll(allocationService.findFreeIntervals(counter, slot, date));
            }

            boolean canFit = allFreeIntervals.stream().anyMatch(interval -> interval.getDurationMinutes() >= reqDuration);
            long totalFreeMinutes = allFreeIntervals.stream().mapToLong(SlotBookingDto.FreeInterval::getDurationMinutes).sum();

            BigDecimal rate = centre.getProcessingMinutesPerQuintal() != null ? centre.getProcessingMinutesPerQuintal() : BigDecimal.valueOf(10);
            BigDecimal availableQuintals = BigDecimal.valueOf(totalFreeMinutes).divide(rate, 2, BigDecimal.ROUND_HALF_UP);

            String label = slot.getStartTime().format(timeFmt) + " – " + slot.getEndTime().format(timeFmt);

            response.add(SlotBookingDto.TimeSlotAvailabilityResponse.builder()
                    .slotId(slot.getSlotId())
                    .slotDate(slot.getSlotDate())
                    .startTime(slot.getStartTime())
                    .endTime(slot.getEndTime())
                    .timeRangeLabel(label)
                    .maxBookings(slot.getMaxBookings())
                    .currentBookings(slot.getBookedCount())
                    .isAvailable(canFit && slot.getBookedCount() < slot.getMaxBookings())
                    .freeIntervals(allFreeIntervals)
                    .availableCapacityQuintals(availableQuintals)
                    .message(canFit ? "स्लॉट उपलब्ध है (" + allFreeIntervals.size() + " विकल्प)" : "पर्याप्त समय उपलब्ध नहीं है")
                    .build());
        }

        return response;
    }

    private List<TimeSlot> initializeDefaultTimeSlotsForDate(ProcurementCentre centre, LocalDate date) {
        LocalTime[][] times = {
                {LocalTime.of(9, 0), LocalTime.of(10, 0)},
                {LocalTime.of(10, 0), LocalTime.of(11, 0)},
                {LocalTime.of(11, 0), LocalTime.of(12, 0)},
                {LocalTime.of(12, 0), LocalTime.of(13, 0)},
                {LocalTime.of(14, 0), LocalTime.of(15, 0)},
                {LocalTime.of(15, 0), LocalTime.of(16, 0)},
                {LocalTime.of(16, 0), LocalTime.of(17, 0)}
        };

        List<TimeSlot> created = new ArrayList<>();
        for (LocalTime[] t : times) {
            TimeSlot s = TimeSlot.builder()
                    .center(centre)
                    .slotDate(date)
                    .startTime(t[0])
                    .endTime(t[1])
                    .maxBookings(20)
                    .bookedCount(0)
                    .status(com.kisankalyan.entity.enums.TimeSlotStatus.AVAILABLE)
                    .build();
            created.add(timeSlotRepository.save(s));
        }
        return created;
    }

    @Transactional
    public SlotBookingDto.BookingResponse createBooking(Long farmerId, SlotBookingDto.CreateBookingRequest request) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer", "farmerId", farmerId));

        ProcurementCentre centre = centreRepository.findById(request.getCenterId())
                .orElseThrow(() -> new ResourceNotFoundException("ProcurementCentre", "centerId", request.getCenterId()));

        AgriculturalProduce produce = produceRepository.findById(request.getProduceId())
                .orElseThrow(() -> new ResourceNotFoundException("AgriculturalProduce", "produceId", request.getProduceId()));

        TimeSlot slot = timeSlotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("TimeSlot", "slotId", request.getSlotId()));

        if (request.getEstimatedQuantity() == null || request.getEstimatedQuantity().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ApiException("मान्य मात्रा दर्ज करें / Please enter a valid quantity");
        }

        // Daily capacity validation
        BigDecimal newDailyTotal = centre.getCurrentDailyQuantity().add(request.getEstimatedQuantity());
        if (centre.getCapacityPerDay() != null && newDailyTotal.compareTo(centre.getCapacityPerDay()) > 0) {
            throw new ApiException("केंद्र की दैनिक खरीद क्षमता पूरी हो चुकी है / Centre daily capacity exceeded");
        }

        // Generate unique identifiers respecting database unique constraint
        String bookingRef = "BK-" + (System.currentTimeMillis() % 1000000) + "-" + ((int)(Math.random() * 900) + 100);
        long totalCount = bookingRepository.count() + 101;
        String tokenNumber = "T-" + totalCount + "-" + ((int)(Math.random() * 90) + 10);

        SlotBooking booking = SlotBooking.builder()
                .bookingReference(bookingRef)
                .farmer(farmer)
                .center(centre)
                .produce(produce)
                .slot(slot)
                .estimatedQuantity(request.getEstimatedQuantity())
                .tokenNumber(tokenNumber)
                .bookingStatus(BookingStatus.BOOKED)
                .build();

        booking = bookingRepository.save(booking);

        // Core Dynamic Multi-counter allocation
        SlotAllocation allocation = allocationService.allocateEarliestFeasibleInterval(
                centre, slot, booking, request.getEstimatedQuantity()
        );

        // Set verification deadline = strictly 10 mins before allocated start time
        OffsetDateTime deadline = allocation.getAllocatedStartTime().minusMinutes(10);
        booking.setVerificationDeadline(deadline);
        bookingRepository.save(booking);

        // Update centre and slot counts
        centre.setCurrentDailyQuantity(newDailyTotal);
        centreRepository.save(centre);

        slot.setBookedCount(slot.getBookedCount() + 1);
        timeSlotRepository.save(slot);

        // Create QueueStatus record
        QueueStatus queueStatus = QueueStatus.builder()
                .booking(booking)
                .tokenNumber(tokenNumber)
                .queuePosition(slot.getBookedCount())
                .currentStatus(QueueCurrentStatus.WAITING)
                .estimatedWaitTime(slot.getBookedCount() * 10)
                .counter(allocation.getCounter())
                .build();
        queueStatusRepository.save(queueStatus);

        return mapToResponse(booking, allocation);
    }

    public List<SlotBookingDto.BookingResponse> getFarmerBookings(Long farmerId) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer", "farmerId", farmerId));

        List<SlotBooking> bookings = bookingRepository.findByFarmer(farmer);
        return bookings.stream().map(b -> {
            Optional<SlotAllocation> alloc = allocationRepository.findByBooking(b);
            return mapToResponse(b, alloc.orElse(null));
        }).collect(Collectors.toList());
    }

    public SlotBookingDto.BookingResponse getBookingById(Long bookingId) {
        SlotBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("SlotBooking", "bookingId", bookingId));
        Optional<SlotAllocation> alloc = allocationRepository.findByBooking(booking);
        return mapToResponse(booking, alloc.orElse(null));
    }

    @Transactional
    public SlotBookingDto.BookingResponse cancelBooking(Long bookingId, String reason) {
        SlotBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("SlotBooking", "bookingId", bookingId));

        booking.setBookingStatus(BookingStatus.CANCELLED);
        booking.setCancelReason(reason != null ? reason : "किसान द्वारा रद्द / Cancelled by farmer");
        bookingRepository.save(booking);

        Optional<SlotAllocation> allocOpt = allocationRepository.findByBooking(booking);
        allocOpt.ifPresent(alloc -> {
            alloc.setAllocationStatus(AllocationStatus.CANCELLED);
            allocationRepository.save(alloc);
        });

        return mapToResponse(booking, allocOpt.orElse(null));
    }

    @Transactional
    public SlotBookingDto.BookingResponse verifyArrivalQr(String qrToken) {
        String ref = qrToken.trim();
        if (ref.contains("REF:")) {
            int refIdx = ref.indexOf("REF:");
            int endIdx = ref.indexOf("-", refIdx);
            if (endIdx != -1) {
                ref = ref.substring(refIdx + 4, endIdx);
            } else {
                ref = ref.substring(refIdx + 4);
            }
        } else if (ref.startsWith("KK-")) {
            String[] parts = ref.split("-");
            if (parts.length > 1) {
                ref = parts[1];
            }
        }

        final String searchRef = ref.trim();
        SlotBooking booking = bookingRepository.findAll().stream()
                .filter(b -> b.getBookingReference().equalsIgnoreCase(searchRef) ||
                             b.getBookingReference().contains(searchRef) ||
                             (b.getTokenNumber() != null && b.getTokenNumber().equalsIgnoreCase(searchRef)))
                .findFirst()
                .orElseThrow(() -> new ApiException("अमान्य या अज्ञात QR कोड / Invalid or unknown QR code: " + searchRef));

        if (booking.getQrVerifiedAt() != null || booking.getBookingStatus() == BookingStatus.ARRIVED) {
            throw new ApiException("यह QR कोड पहले ही सत्यापित किया जा चुका है / This QR has already been verified.");
        }

        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new ApiException("यह बुकिंग रद्द कर दी गई है / Booking has been cancelled.");
        }

        if (booking.getBookingStatus() == BookingStatus.NO_SHOW) {
            throw new ApiException("सत्यापन समय समाप्त होने के कारण यह बुकिंग No-Show हो चुकी है / Booking marked as NO-SHOW.");
        }

        // Verification deadline check
        if (booking.getVerificationDeadline() != null && OffsetDateTime.now().isAfter(booking.getVerificationDeadline().plusMinutes(10))) {
            throw new ApiException("QR सत्यापन समयसीमा समाप्त हो चुकी है / QR verification deadline elapsed.");
        }

        booking.setBookingStatus(BookingStatus.ARRIVED);
        booking.setQrVerifiedAt(OffsetDateTime.now());
        booking = bookingRepository.save(booking);

        Optional<QueueStatus> qsOpt = queueStatusRepository.findByBooking(booking);
        if (qsOpt.isPresent()) {
            QueueStatus qs = qsOpt.get();
            qs.setCurrentStatus(QueueCurrentStatus.WAITING);
            qs.setArrivedAt(OffsetDateTime.now());
            queueStatusRepository.save(qs);
        } else {
            Optional<SlotAllocation> allocOpt = allocationRepository.findByBooking(booking);
            QueueStatus qs = QueueStatus.builder()
                    .booking(booking)
                    .tokenNumber(booking.getTokenNumber())
                    .queuePosition(1)
                    .currentStatus(QueueCurrentStatus.WAITING)
                    .estimatedWaitTime(10)
                    .counter(allocOpt.map(SlotAllocation::getCounter).orElse(null))
                    .arrivedAt(OffsetDateTime.now())
                    .build();
            queueStatusRepository.save(qs);
        }

        Optional<SlotAllocation> alloc = allocationRepository.findByBooking(booking);
        return mapToResponse(booking, alloc.orElse(null));
    }

    private SlotBookingDto.BookingResponse mapToResponse(SlotBooking b, SlotAllocation alloc) {
        BigDecimal estValue = b.getEstimatedQuantity().multiply(b.getProduce().getMspRate());

        String qrToken = "KK-" + b.getBookingReference() + "-F" + b.getFarmer().getFarmerId();

        return SlotBookingDto.BookingResponse.builder()
                .bookingId(b.getBookingId())
                .bookingReference(b.getBookingReference())
                .tokenNumber(b.getTokenNumber())
                .bookingStatus(b.getBookingStatus())
                .farmerId(b.getFarmer().getFarmerId())
                .farmerName(b.getFarmer().getName())
                .centerId(b.getCenter().getCenterId())
                .centerName(b.getCenter().getCenterName())
                .centerLocation(b.getCenter().getCenterLocation())
                .produceId(b.getProduce().getProduceId())
                .produceName(b.getProduce().getProduceName())
                .mspRate(b.getProduce().getMspRate())
                .estimatedQuantity(b.getEstimatedQuantity())
                .estimatedTotalValue(estValue)
                .slotDate(b.getSlot().getSlotDate())
                .slotStartTime(b.getSlot().getStartTime())
                .slotEndTime(b.getSlot().getEndTime())
                .allocatedStartTime(alloc != null ? alloc.getAllocatedStartTime() : null)
                .allocatedEndTime(alloc != null ? alloc.getAllocatedEndTime() : null)
                .counterId(alloc != null ? alloc.getCounter().getCounterId() : null)
                .counterNumber(alloc != null ? alloc.getCounter().getCounterNumber() : null)
                .counterName(alloc != null ? alloc.getCounter().getCounterName() : null)
                .qrCodeToken(qrToken)
                .qrVerifiedAt(b.getQrVerifiedAt())
                .verificationDeadline(b.getVerificationDeadline())
                .bookedAt(b.getBookedAt())
                .message("स्लॉट सफलतापूर्वक बुक हो गया / Slot booked successfully")
                .build();
    }
}
