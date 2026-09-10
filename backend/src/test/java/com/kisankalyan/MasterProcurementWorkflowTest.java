package com.kisankalyan;

import com.kisankalyan.dto.SlotBookingDto;
import com.kisankalyan.entity.*;
import com.kisankalyan.entity.enums.BookingStatus;
import com.kisankalyan.entity.enums.QciStatus;
import com.kisankalyan.repository.*;
import com.kisankalyan.service.BookingService;
import com.kisankalyan.service.MandiProcessService;
import com.kisankalyan.service.SlotAllocationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class MasterProcurementWorkflowTest {

    @Autowired
    private SlotAllocationService allocationService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private MandiProcessService mandiProcessService;

    @Autowired
    private ProcurementCentreRepository centreRepository;

    @Autowired
    private CounterRepository counterRepository;

    @Autowired
    private AgriculturalProduceRepository produceRepository;

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private SlotBookingRepository slotBookingRepository;

    @Autowired
    private SlotAllocationRepository slotAllocationRepository;

    @Autowired
    private StorageLocationRepository storageLocationRepository;

    @Autowired
    private StorageRecordRepository storageRecordRepository;

    @Test
    public void testDynamicAllocationFormulas() {
        ProcurementCentre centre = new ProcurementCentre();
        centre.setProcessingMinutesPerQuintal(BigDecimal.valueOf(10));

        // 1 quintal = 10 min
        assertEquals(10, allocationService.calculateProcessingDurationMinutes(centre, BigDecimal.valueOf(1)));
        // 2 quintals = 20 min
        assertEquals(20, allocationService.calculateProcessingDurationMinutes(centre, BigDecimal.valueOf(2)));
        // 5 quintals = 50 min
        assertEquals(50, allocationService.calculateProcessingDurationMinutes(centre, BigDecimal.valueOf(5)));
        // 10 quintals = 100 min
        assertEquals(100, allocationService.calculateProcessingDurationMinutes(centre, BigDecimal.valueOf(10)));
    }

    @Test
    @Transactional
    public void testCompleteProcurementLifecycle() {
        List<ProcurementCentre> centres = centreRepository.findAll();
        assertFalse(centres.isEmpty(), "At least one centre must exist in DB");
        ProcurementCentre centre = centres.stream()
                .filter(c -> !counterRepository.findByCenter(c).isEmpty())
                .findFirst()
                .orElse(centres.get(0));

        List<AgriculturalProduce> produceList = produceRepository.findByIsActiveTrue();
        assertFalse(produceList.isEmpty(), "At least one produce must exist in DB");
        AgriculturalProduce produce = produceList.get(0);

        List<Farmer> farmers = farmerRepository.findAll();
        assertFalse(farmers.isEmpty(), "At least one farmer must exist in DB");
        Farmer farmer = farmers.get(0);

        LocalDate testDate = LocalDate.now().plusDays(1);
        List<SlotBookingDto.TimeSlotAvailabilityResponse> availability = 
                bookingService.getCenterSlotAvailability(centre.getCenterId(), testDate, BigDecimal.valueOf(5));
        assertNotNull(availability);
        assertFalse(availability.isEmpty());

        Long slotId = availability.get(0).getSlotId();

        // 1. Create Dynamic Booking (5 quintals = 50 minutes)
        SlotBookingDto.CreateBookingRequest req = SlotBookingDto.CreateBookingRequest.builder()
                .centerId(centre.getCenterId())
                .produceId(produce.getProduceId())
                .slotId(slotId)
                .estimatedQuantity(BigDecimal.valueOf(5))
                .build();

        SlotBookingDto.BookingResponse bookingResp = bookingService.createBooking(farmer.getFarmerId(), req);
        assertNotNull(bookingResp);
        assertEquals(BookingStatus.BOOKED, bookingResp.getBookingStatus());
        assertNotNull(bookingResp.getTokenNumber());
        assertNotNull(bookingResp.getAllocatedStartTime());
        assertNotNull(bookingResp.getAllocatedEndTime());

        // Verification deadline must strictly be 10 minutes before start time
        SlotBooking booking = slotBookingRepository.findById(bookingResp.getBookingId()).orElseThrow();
        assertEquals(bookingResp.getAllocatedStartTime().minusMinutes(10), booking.getVerificationDeadline());

        // 2. Gate Arrival & QR Verification
        SlotBookingDto.BookingResponse verified = bookingService.verifyArrivalQr(bookingResp.getBookingReference());
        assertEquals(BookingStatus.ARRIVED, verified.getBookingStatus());
        assertNotNull(verified.getQrVerifiedAt());

        // 3. Prevent duplicate QR scan
        assertThrows(Exception.class, () -> bookingService.verifyArrivalQr(bookingResp.getBookingReference()));

        // 4. Operator Call Next Token
        List<com.kisankalyan.dto.MandiProcessDto.QueueStatusResponse> queue = 
                mandiProcessService.getLiveQueue(centre.getCenterId());
        assertFalse(queue.isEmpty());
        var queueItem = queue.stream().filter(q -> q.getBookingId().equals(booking.getBookingId())).findFirst().orElseThrow();
        mandiProcessService.callNextToken(queueItem.getQueueStatusId(), queueItem.getCounterId());

        // 5. Quality Inspection & Weighbridge Processing
        var qcReq = com.kisankalyan.dto.MandiProcessDto.QualityCheckRequest.builder()
                .bookingId(booking.getBookingId())
                .moisturePercentage(BigDecimal.valueOf(11.5))
                .foreignMatterPercentage(BigDecimal.valueOf(0.5))
                .qualityGrade("GRADE_A")
                .qciStatus(QciStatus.PASSED)
                .build();
        mandiProcessService.recordQualityCheck(qcReq);

        var weighReq = com.kisankalyan.dto.MandiProcessDto.WeighbridgeRequest.builder()
                .bookingId(booking.getBookingId())
                .grossWeightKg(BigDecimal.valueOf(5200))
                .tareWeightKg(BigDecimal.valueOf(200)) // Net = 5000 kg = 50 Quintals
                .build();
        var procResp = mandiProcessService.recordWeighbridge(weighReq);
        assertNotNull(procResp);
        assertEquals(0, new BigDecimal("5000").compareTo(procResp.getNetWeightKg()));

        // 6. Verify J-Form and Payment automatically created
        var jforms = mandiProcessService.getFarmerJForms(farmer.getFarmerId());
        assertFalse(jforms.isEmpty());

        var payments = mandiProcessService.getFarmerPayments(farmer.getFarmerId());
        assertFalse(payments.isEmpty());
    }
}
