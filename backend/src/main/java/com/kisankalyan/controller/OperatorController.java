package com.kisankalyan.controller;

import com.kisankalyan.dto.MandiProcessDto;
import com.kisankalyan.dto.SlotBookingDto;
import com.kisankalyan.service.BookingService;
import com.kisankalyan.service.MandiProcessService;
import com.kisankalyan.service.SlotAllocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/operator")
public class OperatorController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private MandiProcessService mandiProcessService;

    @Autowired
    private SlotAllocationService slotAllocationService;

    @GetMapping("/queue")
    public ResponseEntity<List<MandiProcessDto.QueueStatusResponse>> getLiveQueue(
            @RequestParam(required = false) Long centerId) {
        return ResponseEntity.ok(mandiProcessService.getLiveQueue(centerId));
    }

    @PostMapping("/qr/verify")
    public ResponseEntity<SlotBookingDto.BookingResponse> verifyArrival(
            @RequestBody SlotBookingDto.QrVerificationRequest request) {
        return ResponseEntity.ok(bookingService.verifyArrivalQr(request.getQrToken()));
    }

    @PostMapping("/queue/{queueStatusId}/call")
    public ResponseEntity<MandiProcessDto.QueueStatusResponse> callNextToken(
            @PathVariable Long queueStatusId,
            @RequestParam(required = false) Long counterId) {
        return ResponseEntity.ok(mandiProcessService.callNextToken(queueStatusId, counterId));
    }

    @PostMapping("/quality-check")
    public ResponseEntity<MandiProcessDto.ProcurementEntryResponse> submitQualityCheck(
            @RequestBody MandiProcessDto.QualityCheckRequest request) {
        return ResponseEntity.ok(mandiProcessService.recordQualityCheck(request));
    }

    @PostMapping("/weighbridge")
    public ResponseEntity<MandiProcessDto.ProcurementEntryResponse> submitWeighbridge(
            @RequestBody MandiProcessDto.WeighbridgeRequest request) {
        return ResponseEntity.ok(mandiProcessService.recordWeighbridge(request));
    }

    @PostMapping("/bookings/{bookingId}/no-show")
    public ResponseEntity<String> markNoShow(
            @PathVariable Long bookingId,
            @RequestParam(required = false) String reason) {
        slotAllocationService.handleNoShowAndReallocate(bookingId, reason);
        return ResponseEntity.ok("Booking marked as NO_SHOW and gap re-allocated successfully.");
    }
}
