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

    private Long getFarmerId(Authentication auth) {
        String username = auth.getName();
        Farmer farmer = farmerRepository.findAll().stream()
                .filter(f -> f.getUser() != null && f.getUser().getUsername().equals(username))
                .findFirst()
                .orElseThrow(() -> new ApiException("Farmer profile not associated with this user"));
        return farmer.getFarmerId();
    }

    private Farmer getFarmer(Authentication auth) {
        String username = auth.getName();
        return farmerRepository.findAll().stream()
                .filter(f -> f.getUser() != null && f.getUser().getUsername().equals(username))
                .findFirst()
                .orElseThrow(() -> new ApiException("Farmer profile not associated with this user"));
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

        // Find active booking: BOOKED, ARRIVED, IN_QUEUE, PROCESSING, or latest
        SlotBookingDto.BookingResponse activeBooking = bookings.stream()
                .filter(b -> b.getBookingStatus() != com.kisankalyan.entity.enums.BookingStatus.CANCELLED
                          && b.getBookingStatus() != com.kisankalyan.entity.enums.BookingStatus.NO_SHOW)
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
        List<com.kisankalyan.entity.Notification> notifications = notificationRepository.findByUserOrderBySentAtDesc(farmer.getUser());
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

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("farmer", farmerMap);
        response.put("activeBooking", activeBooking);
        response.put("allBookings", bookings);
        response.put("queuePosition", queuePosition);
        response.put("estimatedWaitTimeMinutes", waitTimeMinutes);
        response.put("unreadNotificationsCount", unreadCount);
        response.put("notifications", notifList);
        response.put("centres", centerList);

        return ResponseEntity.ok(response);
    }
}
