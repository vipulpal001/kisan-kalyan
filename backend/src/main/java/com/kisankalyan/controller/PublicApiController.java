package com.kisankalyan.controller;

import com.kisankalyan.dto.SlotBookingDto;
import com.kisankalyan.entity.AgriculturalProduce;
import com.kisankalyan.entity.ProcurementCentre;
import com.kisankalyan.repository.AgriculturalProduceRepository;
import com.kisankalyan.repository.ProcurementCentreRepository;
import com.kisankalyan.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
public class PublicApiController {

    @Autowired
    private AgriculturalProduceRepository produceRepository;

    @Autowired
    private ProcurementCentreRepository centreRepository;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private com.kisankalyan.service.MandiProcessService mandiProcessService;

    @Autowired
    private com.kisankalyan.service.AdminAnalyticsService adminAnalyticsService;

    @Autowired
    private javax.sql.DataSource dataSource;

    @GetMapping("/health")
    public ResponseEntity<java.util.Map<String, Object>> getHealth() {
        boolean dbOk = false;
        String dbProduct = "PostgreSQL";
        try (java.sql.Connection conn = dataSource.getConnection()) {
            dbOk = conn.isValid(2);
            dbProduct = conn.getMetaData().getDatabaseProductName() + " " + conn.getMetaData().getDatabaseProductVersion();
        } catch (Exception e) {
            dbOk = false;
        }
        return ResponseEntity.ok(java.util.Map.of(
                "status", "UP",
                "service", "Kisan Kalyan Backend",
                "database", dbOk ? "CONNECTED" : "DISCONNECTED",
                "databaseProduct", dbProduct
        ));
    }

    @GetMapping("/produce")
    public ResponseEntity<List<AgriculturalProduce>> getProduceList() {
        return ResponseEntity.ok(produceRepository.findByIsActiveTrue());
    }

    @GetMapping("/centers")
    public ResponseEntity<List<ProcurementCentre>> getCentres() {
        return ResponseEntity.ok(centreRepository.findByStatus(com.kisankalyan.entity.enums.CentreStatus.ACTIVE));
    }

    @GetMapping("/centers/{id}")
    public ResponseEntity<ProcurementCentre> getCentreById(@PathVariable Long id) {
        return centreRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/centers/{centerId}/availability")
    public ResponseEntity<List<SlotBookingDto.TimeSlotAvailabilityResponse>> getSlotAvailability(
            @PathVariable Long centerId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) BigDecimal quantity) {
        return ResponseEntity.ok(bookingService.getCenterSlotAvailability(centerId, date, quantity));
    }

    @GetMapping("/queue/public")
    public ResponseEntity<List<com.kisankalyan.dto.MandiProcessDto.QueueStatusResponse>> getPublicQueue(
            @RequestParam(required = false) Long centerId) {
        return ResponseEntity.ok(mandiProcessService.getLiveQueue(centerId));
    }

    @GetMapping("/stats/public")
    public ResponseEntity<com.kisankalyan.dto.AdminAnalyticsDto> getPublicStats() {
        return ResponseEntity.ok(adminAnalyticsService.getDashboardAnalytics());
    }
}
