package com.kisankalyan.controller;

import com.kisankalyan.dto.MandiProcessDto;
import com.kisankalyan.dto.SlotBookingDto;
import com.kisankalyan.entity.Farmer;
import com.kisankalyan.exception.ApiException;
import com.kisankalyan.repository.FarmerRepository;
import com.kisankalyan.service.BookingService;
import com.kisankalyan.service.MandiProcessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farmer")
public class FarmerController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private MandiProcessService mandiProcessService;

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private com.kisankalyan.repository.AppUserRepository appUserRepository;

    @Autowired
    private com.kisankalyan.repository.NotificationRepository notificationRepository;

    @Autowired
    private com.kisankalyan.repository.SlotAllocationRepository allocationRepository;

    @Autowired
    private com.kisankalyan.repository.QueueStatusRepository queueStatusRepository;

    @Autowired
    private com.kisankalyan.repository.ProcurementCentreRepository centreRepository;

    @Autowired
    private com.kisankalyan.repository.StorageLocationRepository storageLocationRepository;

    private Long getFarmerId(Authentication auth) {
        String username = auth != null ? auth.getName() : "";
        return farmerRepository.findAll().stream()
                .filter(f -> f.getUser() != null && f.getUser().getUsername().equals(username))
                .map(Farmer::getFarmerId)
                .findFirst()
                .orElseGet(() -> farmerRepository.findAll().stream().findFirst().map(Farmer::getFarmerId).orElse(1L));
    }

    private Farmer getFarmer(Authentication auth) {
        String username = auth != null ? auth.getName() : "";
        return farmerRepository.findAll().stream()
                .filter(f -> f.getUser() != null && f.getUser().getUsername().equals(username))
                .findFirst()
                .orElseGet(() -> farmerRepository.findAll().stream().findFirst().orElseThrow(() -> new ApiException("No farmer profile found")));
    }

    @GetMapping("/profile")
    public ResponseEntity<Farmer> getProfile(Authentication auth) {
        return ResponseEntity.ok(getFarmer(auth));
    }

    @PostMapping("/book-slot")
    public ResponseEntity<SlotBookingDto.BookingResponse> bookSlot(
            Authentication auth,
            @RequestBody SlotBookingDto.CreateBookingRequest request) {
        Long farmerId = getFarmerId(auth);
        return ResponseEntity.ok(bookingService.createBooking(farmerId, request));
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<SlotBookingDto.BookingResponse>> getMyBookings(Authentication auth) {
        Long farmerId = getFarmerId(auth);
        return ResponseEntity.ok(bookingService.getFarmerBookings(farmerId));
    }

    @GetMapping("/bookings/{id}")
    public ResponseEntity<SlotBookingDto.BookingResponse> getBookingDetail(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PostMapping("/bookings/{id}/cancel")
    public ResponseEntity<SlotBookingDto.BookingResponse> cancelBooking(
            @PathVariable Long id,
            @RequestBody(required = false) SlotBookingDto.CancelBookingRequest req) {
        String reason = req != null ? req.getReason() : null;
        return ResponseEntity.ok(bookingService.cancelBooking(id, reason));
    }

    @PutMapping("/bookings/{id}/reschedule")
    public ResponseEntity<SlotBookingDto.BookingResponse> rescheduleBooking(
            @PathVariable Long id,
            @RequestBody SlotBookingDto.RescheduleRequest request) {
        return ResponseEntity.ok(bookingService.rescheduleBooking(id, request.getNewSlotId()));
    }

    @GetMapping("/j-forms")
    public ResponseEntity<List<MandiProcessDto.JFormResponse>> getMyJForms(Authentication auth) {
        Long farmerId = getFarmerId(auth);
        return ResponseEntity.ok(mandiProcessService.getFarmerJForms(farmerId));
    }

    @GetMapping("/payments")
    public ResponseEntity<List<MandiProcessDto.PaymentResponse>> getMyPayments(Authentication auth) {
        Long farmerId = getFarmerId(auth);
        return ResponseEntity.ok(mandiProcessService.getFarmerPayments(farmerId));
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<java.util.Map<String, Object>>> getMyNotifications(Authentication auth) {
        String username = auth.getName();
        com.kisankalyan.entity.AppUser user = appUserRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException("User not found"));
        List<com.kisankalyan.entity.Notification> notifications = notificationRepository.findByUserOrderBySentAtDesc(user);
        List<java.util.Map<String, Object>> notifList = notifications.stream().map(n -> {
            java.util.Map<String, Object> m = new java.util.HashMap<>();
            m.put("notificationId", n.getNotificationId());
            m.put("message", n.getMessage());
            m.put("notificationType", n.getNotificationType() != null ? n.getNotificationType().name() : "GENERAL");
            m.put("isRead", n.getIsRead());
            m.put("sentAt", n.getSentAt());
            return m;
        }).toList();
        return ResponseEntity.ok(notifList);
    }

    @PutMapping("/notifications/{id}/read")
    public ResponseEntity<String> markNotificationAsRead(@PathVariable Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
        return ResponseEntity.ok("Notification marked as read");
    }

    @PutMapping("/notifications/read-all")
    public ResponseEntity<String> markAllNotificationsAsRead(Authentication auth) {
        String username = auth.getName();
        com.kisankalyan.entity.AppUser user = appUserRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException("User not found"));
        List<com.kisankalyan.entity.Notification> list = notificationRepository.findByUserAndIsReadFalse(user);
        for (com.kisankalyan.entity.Notification n : list) {
            n.setIsRead(true);
            notificationRepository.save(n);
        }
        return ResponseEntity.ok("All notifications marked as read");
    }

    @GetMapping("/dashboard-summary")
    public ResponseEntity<java.util.Map<String, Object>> getDashboardSummary(Authentication auth) {
        Farmer farmer = getFarmer(auth);
        List<SlotBookingDto.BookingResponse> bookings = bookingService.getFarmerBookings(farmer.getFarmerId());

        // Find active booking: prioritize in-progress status (BOOKED, ARRIVED), or latest
        SlotBookingDto.BookingResponse activeBooking = bookings.stream()
                .filter(b -> b.getBookingStatus() == com.kisankalyan.entity.enums.BookingStatus.BOOKED
                          || b.getBookingStatus() == com.kisankalyan.entity.enums.BookingStatus.ARRIVED)
                .findFirst()
                .orElse(bookings.isEmpty() ? null : bookings.get(0));

        // Queue status
        Integer queuePosition = 1;
        Integer waitTimeMinutes = 10;
        if (activeBooking != null && activeBooking.getTokenNumber() != null) {
            final String tokenNum = activeBooking.getTokenNumber();
            var qsList = queueStatusRepository.findAll().stream()
                    .filter(q -> tokenNum.equals(q.getTokenNumber()))
                    .findFirst();
            if (qsList.isPresent()) {
                queuePosition = qsList.get().getQueuePosition();
                waitTimeMinutes = qsList.get().getEstimatedWaitTime();
            }
        }

        // Unread notifications
        List<com.kisankalyan.entity.Notification> notifications = (farmer.getUser() != null)
                ? notificationRepository.findByUserOrderBySentAtDesc(farmer.getUser())
                : java.util.Collections.emptyList();
        long unreadCount = notifications.stream().filter(n -> !Boolean.TRUE.equals(n.getIsRead())).count();
        List<java.util.Map<String, Object>> notifList = notifications.stream().map(n -> {
            java.util.Map<String, Object> m = new java.util.HashMap<>();
            m.put("notificationId", n.getNotificationId());
            m.put("message", n.getMessage());
            m.put("notificationType", n.getNotificationType() != null ? n.getNotificationType().name() : "GENERAL");
            m.put("isRead", n.getIsRead());
            m.put("sentAt", n.getSentAt());
            return m;
        }).toList();

        // Farmer profile map
        java.util.Map<String, Object> farmerMap = new java.util.HashMap<>();
        farmerMap.put("farmerId", farmer.getFarmerId());
        farmerMap.put("name", farmer.getName());
        farmerMap.put("phoneNumber", farmer.getPhoneNumber());
        farmerMap.put("aadhaarNumber", farmer.getAadhaarNumber());
        farmerMap.put("bankName", farmer.getBankName());
        farmerMap.put("bankAccountNumber", farmer.getBankAccountNumber());
        farmerMap.put("ifscCode", farmer.getIfscCode());
        farmerMap.put("village", farmer.getVillage());
        farmerMap.put("district", farmer.getDistrict());
        farmerMap.put("state", farmer.getState());

        // Procurement Centres mapped to clean DTO map
        List<java.util.Map<String, Object>> centerList = centreRepository.findAll().stream().map(c -> {
            java.util.Map<String, Object> cm = new java.util.HashMap<>();
            cm.put("centerId", c.getCenterId());
            cm.put("centerCode", c.getCenterCode());
            cm.put("centerName", c.getCenterName());
            cm.put("centerLocation", c.getCenterLocation());
            cm.put("village", c.getVillage());
            cm.put("district", c.getDistrict());
            cm.put("state", c.getState());
            cm.put("contactNumber", c.getContactNumber());
            return cm;
        }).toList();

        // Procurement Entry, J-Form, Payment, Storage Record for active booking if any
        Object activeProcurementEntry = null;
        Object activeJForm = null;
        Object activePayment = null;
        Object activeStorageRecord = null;
        if (activeBooking != null) {
            activeProcurementEntry = mandiProcessService.getProcurementEntryByBooking(activeBooking.getBookingId()).orElse(null);
            activeJForm = mandiProcessService.getJFormByBooking(activeBooking.getBookingId()).orElse(null);
            activePayment = mandiProcessService.getPaymentByBooking(activeBooking.getBookingId()).orElse(null);
            var srOpt = mandiProcessService.getStorageRecordByBooking(activeBooking.getBookingId());
            if (srOpt.isPresent()) {
                var sr = srOpt.get();
                java.util.Map<String, Object> sm = new java.util.HashMap<>();
                sm.put("recordId", sr.getStorageRecordId());
                sm.put("quantityQuintals", sr.getQuantityQuintals());
                sm.put("storageStatus", sr.getStorageStatus() != null ? sr.getStorageStatus().name() : "STORED");
                sm.put("storageDate", sr.getStorageDate());
                sm.put("remarks", sr.getRemarks());
                if (sr.getStorageLocation() != null) {
                    sm.put("locationName", sr.getStorageLocation().getStorageName());
                    sm.put("locationCode", sr.getStorageLocation().getStorageCode());
                    sm.put("storageType", sr.getStorageLocation().getStorageStatus() != null ? sr.getStorageLocation().getStorageStatus().name() : "SILO");
                }
                activeStorageRecord = sm;
            }
        }

        long storageCount = storageLocationRepository.count();
        if (storageCount == 0) storageCount = 12;

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("farmer", farmerMap);
        response.put("activeBooking", activeBooking);
        response.put("allBookings", bookings);
        response.put("procurementEntry", activeProcurementEntry);
        response.put("jForm", activeJForm);
        response.put("payment", activePayment);
        response.put("storageRecord", activeStorageRecord);
        response.put("storageLocationsCount", storageCount);
        response.put("queuePosition", queuePosition);
        response.put("estimatedWaitTimeMinutes", waitTimeMinutes);
        response.put("unreadNotificationsCount", unreadCount);
        response.put("notifications", notifList);
        response.put("centres", centerList);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/bookings/{id}/details")
    public ResponseEntity<java.util.Map<String, Object>> getBookingDetails(@PathVariable Long id) {
        SlotBookingDto.BookingResponse booking = bookingService.getBookingById(id);
        var entry = mandiProcessService.getProcurementEntryByBooking(id).orElse(null);
        var jForm = mandiProcessService.getJFormByBooking(id).orElse(null);
        var payment = mandiProcessService.getPaymentByBooking(id).orElse(null);
        var storageRecord = mandiProcessService.getStorageRecordByBooking(id).orElse(null);

        java.util.Map<String, Object> map = new java.util.HashMap<>();
        map.put("booking", booking);
        map.put("procurementEntry", entry);
        map.put("jForm", jForm);
        map.put("payment", payment);
        map.put("storageRecord", storageRecord);

        return ResponseEntity.ok(map);
    }
}
