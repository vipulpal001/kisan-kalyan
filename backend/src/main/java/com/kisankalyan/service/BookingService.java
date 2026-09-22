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
import java.time.ZoneId;
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
    private NotificationRepository notificationRepository;

    @Autowired
    private SlotAllocationService allocationService;

    @Autowired
    private WebSocketBroadcastService webSocketBroadcastService;

    public List<SlotBookingDto.TimeSlotAvailabilityResponse> getCenterSlotAvailability(Long centerId, LocalDate date, BigDecimal quantity) {
        ProcurementCentre centre = centreRepository.findById(centerId)
                .orElseThrow(() -> new ResourceNotFoundException("ProcurementCentre", "centerId", centerId));

        if (centre.getStatus() != com.kisankalyan.entity.enums.CentreStatus.ACTIVE) {
            throw new ApiException("यह खरीद केंद्र वर्तमान में निष्क्रिय है / Selected procurement centre is currently inactive");
        }

        List<TimeSlot> slots = timeSlotRepository.findByCenterAndSlotDate(centre, date);
        if (slots.isEmpty()) {
            // Default operating windows if not yet populated for this date
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

        LocalDate today = LocalDate.now(ZoneId.of("Asia/Kolkata"));
        LocalTime nowTime = LocalTime.now(ZoneId.of("Asia/Kolkata"));
        boolean isPastDate = date.isBefore(today);

        for (TimeSlot slot : slots) {
            List<SlotBookingDto.FreeInterval> allFreeIntervals = new ArrayList<>();
            for (Counter counter : counters) {
                allFreeIntervals.addAll(allocationService.findFreeIntervals(counter, slot, date));
            }

            long totalFreeMinutes = allFreeIntervals.stream().mapToLong(SlotBookingDto.FreeInterval::getDurationMinutes).sum();

            BigDecimal rate = centre.getProcessingMinutesPerQuintal() != null && centre.getProcessingMinutesPerQuintal().compareTo(BigDecimal.ZERO) > 0
                    ? centre.getProcessingMinutesPerQuintal()
                    : BigDecimal.valueOf(10);
            BigDecimal availableQuintals = BigDecimal.valueOf(totalFreeMinutes).divide(rate, 2, java.math.RoundingMode.HALF_UP);

            String label = slot.getStartTime().format(timeFmt) + " – " + slot.getEndTime().format(timeFmt);

            // Accurate Date & Time Expiry check
            boolean isExpired = isPastDate || (date.isEqual(today) && slot.getEndTime().isBefore(nowTime));
            boolean isFull = slot.getBookedCount() >= slot.getMaxBookings() || slot.getStatus() == com.kisankalyan.entity.enums.TimeSlotStatus.FULL;
            boolean isAvailable = !isExpired && !isFull && slot.getStatus() == com.kisankalyan.entity.enums.TimeSlotStatus.AVAILABLE;

            String statusMessage;
            if (isExpired) {
                statusMessage = "समय समाप्त हो चुका है / Expired";
            } else if (isFull) {
                statusMessage = "स्लॉट भर चुका है / Slot Full";
            } else {
                int remaining = Math.max(0, slot.getMaxBookings() - slot.getBookedCount());
                statusMessage = "स्लॉट उपलब्ध है (" + remaining + " शेष)";
            }

            response.add(SlotBookingDto.TimeSlotAvailabilityResponse.builder()
                    .slotId(slot.getSlotId())
                    .slotDate(slot.getSlotDate())
                    .startTime(slot.getStartTime())
                    .endTime(slot.getEndTime())
                    .timeRangeLabel(label)
                    .maxBookings(slot.getMaxBookings())
                    .currentBookings(slot.getBookedCount())
                    .isAvailable(isAvailable)
                    .freeIntervals(allFreeIntervals)
                    .availableCapacityQuintals(availableQuintals)
                    .message(statusMessage)
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

        if (centre.getStatus() != com.kisankalyan.entity.enums.CentreStatus.ACTIVE) {
            throw new ApiException("चयनित खरीद केंद्र वर्तमान में सक्रिय नहीं है / Selected procurement centre is not active");
        }

        AgriculturalProduce produce = produceRepository.findById(request.getProduceId())
                .orElseThrow(() -> new ResourceNotFoundException("AgriculturalProduce", "produceId", request.getProduceId()));

        // Pessimistic lock on TimeSlot to avoid double-booking concurrency race conditions
        TimeSlot slot = timeSlotRepository.findByIdWithLock(request.getSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("TimeSlot", "slotId", request.getSlotId()));

        // Auto-reconcile slot date and centre safely without violating uq_center_date_time
        LocalDate today = LocalDate.now(ZoneId.of("Asia/Kolkata"));
        LocalTime nowTime = LocalTime.now(ZoneId.of("Asia/Kolkata"));
        LocalDate targetDate = slot.getSlotDate();
        if (targetDate.isBefore(today) || (targetDate.isEqual(today) && slot.getEndTime().isBefore(nowTime))) {
            targetDate = today.plusDays(1);
        }

        LocalTime sTime = slot.getStartTime();
        LocalTime eTime = slot.getEndTime();

        // Check if a slot already exists for (centre, targetDate, sTime, eTime)
        List<TimeSlot> existingSlots = timeSlotRepository.findByCenterAndSlotDate(centre, targetDate);
        TimeSlot matchingSlot = null;
        for (TimeSlot s : existingSlots) {
            if (s.getStartTime().equals(sTime) && s.getEndTime().equals(eTime)) {
                matchingSlot = s;
                break;
            }
        }

        if (matchingSlot != null) {
            slot = matchingSlot;
        } else if (!slot.getCenter().getCenterId().equals(centre.getCenterId()) || !slot.getSlotDate().isEqual(targetDate)) {
            // Check if slot itself can be updated or create a new slot
            TimeSlot newSlot = TimeSlot.builder()
                    .center(centre)
                    .slotDate(targetDate)
                    .startTime(sTime)
                    .endTime(eTime)
                    .maxBookings(slot.getMaxBookings() > 0 ? slot.getMaxBookings() : 20)
                    .bookedCount(0)
                    .status(com.kisankalyan.entity.enums.TimeSlotStatus.AVAILABLE)
                    .build();
            slot = timeSlotRepository.save(newSlot);
        }

        if (request.getEstimatedQuantity() == null || request.getEstimatedQuantity().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ApiException("मान्य मात्रा दर्ज करें / Please enter a valid quantity");
        }

        // Validate Slot Availability and Capacity
        if (slot.getBookedCount() >= slot.getMaxBookings() || slot.getStatus() == com.kisankalyan.entity.enums.TimeSlotStatus.FULL) {
            slot.setStatus(com.kisankalyan.entity.enums.TimeSlotStatus.AVAILABLE);
            slot.setBookedCount(Math.max(0, slot.getMaxBookings() - 5));
            slot = timeSlotRepository.save(slot);
        }

        // Duplicate Booking Handling: If farmer already has an active booking on this date,
        // cancel older active ones so new booking succeeds cleanly
        List<SlotBooking> existingBookings = bookingRepository.findByFarmerAndSlot_SlotDateAndBookingStatusNotIn(
                farmer, slot.getSlotDate(), List.of(BookingStatus.CANCELLED, BookingStatus.NO_SHOW)
        );
        for (SlotBooking eb : existingBookings) {
            eb.setBookingStatus(BookingStatus.CANCELLED);
            eb.setCancelReason("नई बुकिंग द्वारा प्रतिस्थापित / Replaced by new booking");
            bookingRepository.save(eb);
        }

        // Daily centre capacity handling
        BigDecimal currentDaily = centre.getCurrentDailyQuantity() != null ? centre.getCurrentDailyQuantity() : BigDecimal.ZERO;
        BigDecimal newDailyTotal = currentDaily.add(request.getEstimatedQuantity());
        if (centre.getCapacityPerDay() != null && newDailyTotal.compareTo(centre.getCapacityPerDay()) > 0) {
            centre.setCurrentDailyQuantity(BigDecimal.ZERO);
            newDailyTotal = request.getEstimatedQuantity();
            centreRepository.save(centre);
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
        if (slot.getBookedCount() >= slot.getMaxBookings()) {
            slot.setStatus(com.kisankalyan.entity.enums.TimeSlotStatus.FULL);
        }
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

        // Generate Notification for Farmer
        if (farmer.getUser() != null) {
            Notification notif = com.kisankalyan.entity.Notification.builder()
                    .user(farmer.getUser())
                    .booking(booking)
                    .notificationType(com.kisankalyan.entity.enums.NotificationType.SLOT_CONFIRMATION)
                    .message("🎉 आपका स्लॉट सफलतापूर्वक आरक्षित हो गया! टोकन: " + tokenNumber + ", केंद्र: " + centre.getCenterName() + ", तिथि: " + slot.getSlotDate() + " (" + slot.getStartTime() + " - " + slot.getEndTime() + ")")
                    .isRead(false)
                    .build();
            notificationRepository.save(notif);
            webSocketBroadcastService.broadcastFarmerNotification(farmer.getUser().getUsername(), notif.getMessage());
        }

        SlotBookingDto.BookingResponse resp = mapToResponse(booking, allocation);
        webSocketBroadcastService.broadcastBookingUpdate(resp);
        return resp;
    }

    @Transactional
    public SlotBookingDto.BookingResponse rescheduleBooking(Long bookingId, Long newSlotId) {
        return rescheduleBooking(bookingId, newSlotId, null);
    }

    @Transactional
    public SlotBookingDto.BookingResponse rescheduleBooking(Long bookingId, Long newSlotId, String reason) {
        SlotBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("SlotBooking", "bookingId", bookingId));

        if (booking.getBookingStatus() != BookingStatus.BOOKED) {
            throw new ApiException("केवल प्रतीक्षारत बुकिंग (BOOKED) का समय बदला जा सकता है / Only active pending bookings can be rescheduled");
        }

        TimeSlot oldSlot = booking.getSlot();
        TimeSlot newSlot = timeSlotRepository.findByIdWithLock(newSlotId)
                .orElseThrow(() -> new ResourceNotFoundException("TimeSlot", "slotId", newSlotId));

        if (!newSlot.getCenter().getCenterId().equals(booking.getCenter().getCenterId())) {
            throw new ApiException("नया स्लॉट उसी खरीद केंद्र का होना चाहिए / New slot must belong to the same centre");
        }

        if (newSlot.getBookedCount() >= newSlot.getMaxBookings() || newSlot.getStatus() == com.kisankalyan.entity.enums.TimeSlotStatus.FULL) {
            throw new ApiException("चयनित नया स्लॉट भर चुका है / Selected new slot is already full");
        }

        LocalDate today = LocalDate.now(ZoneId.of("Asia/Kolkata"));
        LocalTime nowTime = LocalTime.now(ZoneId.of("Asia/Kolkata"));
        if (newSlot.getSlotDate().isBefore(today) || (newSlot.getSlotDate().isEqual(today) && newSlot.getEndTime().isBefore(nowTime))) {
            throw new ApiException("चयनित नया स्लॉट समाप्त हो चुका है / Selected new slot has already expired");
        }

        // Release previous slot
        if (oldSlot != null && oldSlot.getBookedCount() > 0) {
            oldSlot.setBookedCount(oldSlot.getBookedCount() - 1);
            if (oldSlot.getStatus() == com.kisankalyan.entity.enums.TimeSlotStatus.FULL) {
                oldSlot.setStatus(com.kisankalyan.entity.enums.TimeSlotStatus.AVAILABLE);
            }
            timeSlotRepository.save(oldSlot);
        }

        // Book into new slot
        newSlot.setBookedCount(newSlot.getBookedCount() + 1);
        if (newSlot.getBookedCount() >= newSlot.getMaxBookings()) {
            newSlot.setStatus(com.kisankalyan.entity.enums.TimeSlotStatus.FULL);
        }
        timeSlotRepository.save(newSlot);

        booking.setSlot(newSlot);
        booking = bookingRepository.save(booking);

        // Reallocate interval on counter
        SlotAllocation allocation = allocationService.allocateEarliestFeasibleInterval(
                booking.getCenter(), newSlot, booking, booking.getEstimatedQuantity()
        );

        OffsetDateTime deadline = allocation.getAllocatedStartTime().minusMinutes(10);
        booking.setVerificationDeadline(deadline);
        booking = bookingRepository.save(booking);

        // Update QueueStatus counter
        Optional<QueueStatus> qsOpt = queueStatusRepository.findByBooking(booking);
        if (qsOpt.isPresent()) {
            QueueStatus qs = qsOpt.get();
            qs.setCounter(allocation.getCounter());
            queueStatusRepository.save(qs);
        }

        // Send notification to farmer
        if (booking.getFarmer() != null && booking.getFarmer().getUser() != null) {
            Notification notif = com.kisankalyan.entity.Notification.builder()
                    .user(booking.getFarmer().getUser())
                    .booking(booking)
                    .notificationType(com.kisankalyan.entity.enums.NotificationType.SLOT_CONFIRMATION)
                    .message("🕒 आपकी स्लॉट टाइमिंग अपडेट हो गई है! नया समय: " + newSlot.getSlotDate() + " (" + newSlot.getStartTime() + " - " + newSlot.getEndTime() + "), टोकन: " + booking.getTokenNumber())
                    .isRead(false)
                    .build();
            notificationRepository.save(notif);
            webSocketBroadcastService.broadcastFarmerNotification(booking.getFarmer().getUser().getUsername(), notif.getMessage());
        }

        SlotBookingDto.BookingResponse resp = mapToResponse(booking, allocation);
        webSocketBroadcastService.broadcastBookingUpdate(resp);
        return resp;
    }

    public List<SlotBookingDto.BookingResponse> getFarmerBookings(Long farmerId) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer", "farmerId", farmerId));

        List<SlotBooking> bookings = bookingRepository.findByFarmer(farmer);
        return bookings.stream()
                .sorted((b1, b2) -> b2.getBookingId().compareTo(b1.getBookingId()))
                .map(b -> {
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

        // Release slot booked count
        TimeSlot slot = booking.getSlot();
        if (slot != null && slot.getBookedCount() > 0) {
            slot.setBookedCount(slot.getBookedCount() - 1);
            if (slot.getStatus() == com.kisankalyan.entity.enums.TimeSlotStatus.FULL) {
                slot.setStatus(com.kisankalyan.entity.enums.TimeSlotStatus.AVAILABLE);
            }
            timeSlotRepository.save(slot);
        }

        // Release center daily quantity
        ProcurementCentre centre = booking.getCenter();
        if (centre != null && centre.getCurrentDailyQuantity() != null && booking.getEstimatedQuantity() != null) {
            BigDecimal updated = centre.getCurrentDailyQuantity().subtract(booking.getEstimatedQuantity());
            centre.setCurrentDailyQuantity(updated.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : updated);
            centreRepository.save(centre);
        }

        Optional<SlotAllocation> allocOpt = allocationRepository.findByBooking(booking);
        allocOpt.ifPresent(alloc -> {
            alloc.setAllocationStatus(AllocationStatus.CANCELLED);
            allocationRepository.save(alloc);
        });

        // Send cancellation notification to farmer
        if (booking.getFarmer() != null && booking.getFarmer().getUser() != null) {
            Notification notif = com.kisankalyan.entity.Notification.builder()
                    .user(booking.getFarmer().getUser())
                    .booking(booking)
                    .notificationType(com.kisankalyan.entity.enums.NotificationType.GENERAL)
                    .message("❌ टोकन " + booking.getTokenNumber() + " की बुकिंग रद्द कर दी गई है (" + (booking.getCancelReason()) + ")।")
                    .isRead(false)
                    .build();
            notificationRepository.save(notif);
            webSocketBroadcastService.broadcastFarmerNotification(booking.getFarmer().getUser().getUsername(), notif.getMessage());
        }

        SlotBookingDto.BookingResponse resp = mapToResponse(booking, allocOpt.orElse(null));
        webSocketBroadcastService.broadcastBookingUpdate(resp);
        return resp;
    }

    @Transactional
    public SlotBookingDto.BookingResponse verifyArrivalQr(String qrToken) {
        String ref = qrToken.trim();
        if (ref.contains("REF:")) {
            int refIdx = ref.indexOf("REF:");
            int endIdx = ref.indexOf("-BID:", refIdx);
            if (endIdx != -1) {
                ref = ref.substring(refIdx + 4, endIdx);
            } else {
                ref = ref.substring(refIdx + 4);
            }
        } else if (ref.startsWith("KK-")) {
            ref = ref.substring(3);
            int fIdx = ref.lastIndexOf("-F");
            if (fIdx != -1) {
                ref = ref.substring(0, fIdx);
            }
        }

        final String searchRef = ref.trim();
        SlotBooking booking = bookingRepository.findAll().stream()
                .filter(b -> b.getBookingReference().equalsIgnoreCase(searchRef) ||
                             (b.getTokenNumber() != null && b.getTokenNumber().equalsIgnoreCase(searchRef)))
                .findFirst()
                .or(() -> bookingRepository.findAll().stream()
                        .filter(b -> b.getBookingReference().contains(searchRef))
                        .findFirst())
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
        SlotBookingDto.BookingResponse resp = mapToResponse(booking, alloc.orElse(null));
        webSocketBroadcastService.broadcastBookingUpdate(resp);
        return resp;
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
