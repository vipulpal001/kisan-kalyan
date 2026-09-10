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

    @GetMapping("/health")
    public ResponseEntity<java.util.Map<String, String>> getHealth() {
        return ResponseEntity.ok(java.util.Map.of("status", "UP", "service", "Kisan Kalyan Backend"));
    }

    @GetMapping("/produce")
    public ResponseEntity<List<AgriculturalProduce>> getProduceList() {
        return ResponseEntity.ok(produceRepository.findByIsActiveTrue());
    }

    @GetMapping("/centers")
    public ResponseEntity<List<ProcurementCentre>> getCentres() {
        return ResponseEntity.ok(centreRepository.findAll());
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
}
