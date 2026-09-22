package com.kisankalyan.service;

import com.kisankalyan.dto.MandiProcessDto;
import com.kisankalyan.entity.*;
import com.kisankalyan.entity.enums.*;
import com.kisankalyan.exception.ApiException;
import com.kisankalyan.exception.ResourceNotFoundException;
import com.kisankalyan.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MandiProcessService {

    @Autowired
    private SlotBookingRepository bookingRepository;

    @Autowired
    private QueueStatusRepository queueStatusRepository;

    @Autowired
    private ProcurementEntryRepository procurementEntryRepository;

    @Autowired
    private JFormRepository jFormRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private StorageLocationRepository storageLocationRepository;

    @Autowired
    private StorageRecordRepository storageRecordRepository;

    @Autowired
    private CounterRepository counterRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private WebSocketBroadcastService webSocketBroadcastService;

    @Autowired
    private AdminAnalyticsService adminAnalyticsService;

    public Optional<MandiProcessDto.ProcurementEntryResponse> getProcurementEntryByBooking(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .flatMap(procurementEntryRepository::findByBooking)
                .map(this::mapToProcurementResponse);
    }

    public Optional<MandiProcessDto.JFormResponse> getJFormByBooking(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .flatMap(procurementEntryRepository::findByBooking)
                .flatMap(jFormRepository::findByEntry)
                .map(this::mapToJFormResponse);
    }

    public Optional<MandiProcessDto.PaymentResponse> getPaymentByBooking(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .flatMap(procurementEntryRepository::findByBooking)
                .flatMap(entry -> paymentRepository.findAll().stream().filter(p -> p.getEntry().getEntryId().equals(entry.getEntryId())).findFirst())
                .map(p -> MandiProcessDto.PaymentResponse.builder()
                        .paymentId(p.getPaymentId())
                        .entryId(p.getEntry().getEntryId())
                        .amount(p.getAmount())
                        .paymentMode(p.getPaymentMode())
                        .paymentStatus(p.getPaymentStatus())
                        .transactionReference(p.getTransactionReference())
                        .bankName(p.getBankName())
                        .paymentDate(p.getPaymentDate())
                        .failureReason(p.getFailureReason())
                        .build());
    }

    public List<MandiProcessDto.QueueStatusResponse> getLiveQueue(Long centerId) {
        List<QueueStatus> queueList = queueStatusRepository.findAll();
        if (centerId != null) {
            queueList = queueList.stream()
                    .filter(q -> q.getBooking().getCenter().getCenterId().equals(centerId))
                    .collect(Collectors.toList());
        }

        return queueList.stream().map(this::mapToQueueResponse).collect(Collectors.toList());
    }

    @Transactional
    public MandiProcessDto.QueueStatusResponse callNextToken(Long queueStatusId, Long counterId) {
        QueueStatus qs = queueStatusRepository.findById(queueStatusId)
                .orElseThrow(() -> new ResourceNotFoundException("QueueStatus", "queueStatusId", queueStatusId));

        if (counterId != null) {
            Counter counter = counterRepository.findById(counterId)
                    .orElseThrow(() -> new ResourceNotFoundException("Counter", "counterId", counterId));
            qs.setCounter(counter);
            counter.setCurrentToken(qs.getTokenNumber());
            counterRepository.save(counter);
        }

        qs.setCurrentStatus(QueueCurrentStatus.CALLED);
        qs.setCalledAt(OffsetDateTime.now());
        queueStatusRepository.save(qs);

        SlotBooking booking = qs.getBooking();
        booking.setBookingStatus(BookingStatus.PROCESSING);
        bookingRepository.save(booking);

        MandiProcessDto.QueueStatusResponse resp = mapToQueueResponse(qs);
        webSocketBroadcastService.broadcastTokenCalled(resp);
        webSocketBroadcastService.broadcastQueueUpdate(booking.getCenter().getCenterId(), getLiveQueue(booking.getCenter().getCenterId()));
        webSocketBroadcastService.broadcastBookingUpdate(booking);

        if (booking.getFarmer() != null && booking.getFarmer().getUser() != null) {
            Notification notif = Notification.builder()
                    .user(booking.getFarmer().getUser())
                    .booking(booking)
                    .notificationType(NotificationType.TOKEN_CALLED)
                    .message("🔔 टोकन " + qs.getTokenNumber() + " काउंटर " + (qs.getCounter() != null ? qs.getCounter().getCounterNumber() : "1") + " पर पुकारा गया है। कृपया आगे बढ़ें।")
                    .isRead(false)
                    .build();
            notificationRepository.save(notif);
            webSocketBroadcastService.broadcastFarmerNotification(booking.getFarmer().getUser().getUsername(), notif.getMessage());
        }

        return resp;
    }

    @Transactional
    public MandiProcessDto.ProcurementEntryResponse recordQualityCheck(MandiProcessDto.QualityCheckRequest request) {
        SlotBooking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("SlotBooking", "bookingId", request.getBookingId()));

        ProcurementEntry entry = procurementEntryRepository.findByBooking(booking)
                .orElse(ProcurementEntry.builder()
                        .booking(booking)
                        .qciStatus(QciStatus.PENDING)
                        .entryStatus(EntryStatus.IN_PROGRESS)
                        .build());

        entry.setMoisturePercentage(request.getMoisturePercentage());
        entry.setForeignMatterPercentage(request.getForeignMatterPercentage());
        String grade = request.getQualityGrade();
        if (grade != null) {
            if (grade.contains("Grade A")) grade = "FAQ Grade A";
            else if (grade.contains("Grade B")) grade = "FAQ Grade B";
            else if (grade.length() > 20) grade = grade.substring(0, 20);
        }
        entry.setQualityGrade(grade);
        entry.setQciStatus(request.getQciStatus() != null ? request.getQciStatus() : QciStatus.PASSED);

        entry = procurementEntryRepository.save(entry);
        webSocketBroadcastService.broadcastQueueUpdate(booking.getCenter().getCenterId(), getLiveQueue(booking.getCenter().getCenterId()));
        webSocketBroadcastService.broadcastBookingUpdate(booking);

        if (booking.getFarmer() != null && booking.getFarmer().getUser() != null) {
            Notification notif = Notification.builder()
                    .user(booking.getFarmer().getUser())
                    .booking(booking)
                    .notificationType(NotificationType.QUALITY_UPDATE)
                    .message("✅ गुणवत्ता जांच पूर्ण: नमी " + entry.getMoisturePercentage() + "%, ग्रेड: " + entry.getQualityGrade() + " (" + entry.getQciStatus() + ")")
                    .isRead(false)
                    .build();
            notificationRepository.save(notif);
            webSocketBroadcastService.broadcastFarmerNotification(booking.getFarmer().getUser().getUsername(), notif.getMessage());
        }

        return mapToProcurementResponse(entry);
    }

    @Transactional
    public MandiProcessDto.ProcurementEntryResponse recordWeighbridge(MandiProcessDto.WeighbridgeRequest request) {
        SlotBooking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("SlotBooking", "bookingId", request.getBookingId()));

        ProcurementEntry entry = procurementEntryRepository.findByBooking(booking)
                .orElse(ProcurementEntry.builder()
                        .booking(booking)
                        .qciStatus(QciStatus.PASSED)
                        .entryStatus(EntryStatus.IN_PROGRESS)
                        .build());

        BigDecimal gross = request.getGrossWeightKg();
        BigDecimal tare = request.getTareWeightKg();
        BigDecimal net = gross.subtract(tare);
        if (net.compareTo(BigDecimal.ZERO) < 0) {
            throw new ApiException("सकल वजन (Gross Weight) खाली वजन (Tare Weight) से अधिक होना चाहिए / Gross weight must be greater than tare weight");
        }

        BigDecimal quintals = net.divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        entry.setGrossWeightKg(gross);
        entry.setTareWeightKg(tare);
        entry.setNetWeightKg(net);
        entry.setActualQuantityQuintals(quintals);
        entry.setEntryStatus(EntryStatus.COMPLETED);

        entry = procurementEntryRepository.save(entry);

        // Auto-generate J-Form on weighment completion
        generateJForm(entry);

        // Update booking status to COMPLETED
        booking.setBookingStatus(BookingStatus.COMPLETED);
        bookingRepository.save(booking);

        // Update queue status
        Optional<QueueStatus> qsOpt = queueStatusRepository.findByBooking(booking);
        qsOpt.ifPresent(qs -> {
            qs.setCurrentStatus(QueueCurrentStatus.COMPLETED);
            qs.setCompletedAt(OffsetDateTime.now());
            queueStatusRepository.save(qs);
        });

        webSocketBroadcastService.broadcastQueueUpdate(booking.getCenter().getCenterId(), getLiveQueue(booking.getCenter().getCenterId()));
        webSocketBroadcastService.broadcastBookingUpdate(booking);
        webSocketBroadcastService.broadcastAdminAnalytics(adminAnalyticsService.getDashboardAnalytics());

        if (booking.getFarmer() != null && booking.getFarmer().getUser() != null) {
            Notification notif = Notification.builder()
                    .user(booking.getFarmer().getUser())
                    .booking(booking)
                    .notificationType(NotificationType.WEIGHMENT_UPDATE)
                    .message("🌾 तौल पूर्ण: " + entry.getActualQuantityQuintals() + " क्विंटल। डिजिटल J-Form जारी कर दिया गया है एवं DBT भुगतान शुरू हो चुका है।")
                    .isRead(false)
                    .build();
            notificationRepository.save(notif);
            webSocketBroadcastService.broadcastFarmerNotification(booking.getFarmer().getUser().getUsername(), notif.getMessage());
        }

        return mapToProcurementResponse(entry);
    }

    @Transactional
    public MandiProcessDto.JFormResponse generateJForm(ProcurementEntry entry) {
        Optional<JForm> existing = jFormRepository.findByEntry(entry);
        if (existing.isPresent()) {
            return mapToJFormResponse(existing.get());
        }

        ProcurementCentre center = entry.getBooking().getCenter();
        String sigName = (center != null && center.getAuthorizedSignatoryName() != null)
                ? center.getAuthorizedSignatoryName()
                : "APMC Mandi Secretary";
        String sigData = (center != null) ? center.getSignatureData() : null;

        String jFormNum = "JF-" + LocalDate.now().getYear() + "-" + (entry.getEntryId() + 1000);
        JForm jForm = JForm.builder()
                .entry(entry)
                .jFormNumber(jFormNum)
                .issueDate(LocalDate.now())
                .status(JFormStatus.ISSUED)
                .documentPath("/documents/jforms/" + jFormNum + ".pdf")
                .authorizedSignatoryName(sigName)
                .signatureData(sigData)
                .build();

        jForm = jFormRepository.save(jForm);

        BigDecimal msp = entry.getBooking().getProduce().getMspRate();
        BigDecimal qty = entry.getActualQuantityQuintals() != null ? entry.getActualQuantityQuintals() : entry.getBooking().getEstimatedQuantity();

        // Auto-allocate storage location
        List<StorageLocation> locations = storageLocationRepository.findAll().stream()
                .filter(loc -> loc.getCenter().getCenterId().equals(entry.getBooking().getCenter().getCenterId()))
                .filter(loc -> loc.getStorageStatus() == StorageLocationStatus.ACTIVE)
                .toList();

        if (!locations.isEmpty()) {
            StorageLocation chosenLoc = locations.get(0);
            BigDecimal available = chosenLoc.getCapacityQuintals().subtract(chosenLoc.getOccupiedQuintals());
            if (available.compareTo(qty) >= 0) {
                chosenLoc.setOccupiedQuintals(chosenLoc.getOccupiedQuintals().add(qty));
                storageLocationRepository.save(chosenLoc);

                StorageRecord record = StorageRecord.builder()
                        .storageLocation(chosenLoc)
                        .procurementEntry(entry)
                        .quantityQuintals(qty)
                        .storageDate(OffsetDateTime.now())
                        .storageStatus(StorageRecordStatus.STORED)
                        .remarks("Automated intake upon weighment verification")
                        .build();
                storageRecordRepository.save(record);
            }
        }

        // Auto-initiate Payment record
        BigDecimal amount = qty.multiply(msp).setScale(2, RoundingMode.HALF_UP);

        Payment payment = Payment.builder()
                .entry(entry)
                .amount(amount)
                .paymentMode(PaymentMode.DBT)
                .paymentStatus(PaymentStatus.PROCESSING)
                .transactionReference("TXN-" + System.currentTimeMillis())
                .bankName(entry.getBooking().getFarmer().getBankName() != null ? entry.getBooking().getFarmer().getBankName() : "State Bank of India")
                .paymentDate(OffsetDateTime.now().plusDays(1))
                .build();
        paymentRepository.save(payment);

        return mapToJFormResponse(jForm);
    }

    public List<MandiProcessDto.JFormResponse> getFarmerJForms(Long farmerId) {
        return jFormRepository.findAll().stream()
                .filter(jf -> jf.getEntry().getBooking().getFarmer().getFarmerId().equals(farmerId))
                .map(this::mapToJFormResponse)
                .collect(Collectors.toList());
    }

    public List<MandiProcessDto.PaymentResponse> getFarmerPayments(Long farmerId) {
        return paymentRepository.findAll().stream()
                .filter(p -> p.getEntry().getBooking().getFarmer().getFarmerId().equals(farmerId))
                .map(p -> MandiProcessDto.PaymentResponse.builder()
                        .paymentId(p.getPaymentId())
                        .entryId(p.getEntry().getEntryId())
                        .amount(p.getAmount())
                        .paymentMode(p.getPaymentMode())
                        .paymentStatus(p.getPaymentStatus())
                        .transactionReference(p.getTransactionReference())
                        .bankName(p.getBankName())
                        .paymentDate(p.getPaymentDate())
                        .failureReason(p.getFailureReason())
                        .build())
                .collect(Collectors.toList());
    }

    private MandiProcessDto.QueueStatusResponse mapToQueueResponse(QueueStatus q) {
        return MandiProcessDto.QueueStatusResponse.builder()
                .queueStatusId(q.getQueueStatusId())
                .bookingId(q.getBooking().getBookingId())
                .bookingReference(q.getBooking().getBookingReference())
                .tokenNumber(q.getTokenNumber())
                .queuePosition(q.getQueuePosition())
                .currentStatus(q.getCurrentStatus())
                .estimatedWaitTime(q.getEstimatedWaitTime())
                .counterId(q.getCounter() != null ? q.getCounter().getCounterId() : null)
                .counterNumber(q.getCounter() != null ? q.getCounter().getCounterNumber() : null)
                .counterName(q.getCounter() != null ? q.getCounter().getCounterName() : null)
                .farmerName(q.getBooking().getFarmer().getName())
                .produceName(q.getBooking().getProduce().getProduceName())
                .quantity(q.getBooking().getEstimatedQuantity())
                .calledAt(q.getCalledAt())
                .arrivedAt(q.getArrivedAt())
                .completedAt(q.getCompletedAt())
                .build();
    }

    private MandiProcessDto.ProcurementEntryResponse mapToProcurementResponse(ProcurementEntry e) {
        BigDecimal msp = e.getBooking().getProduce().getMspRate();
        BigDecimal qty = e.getActualQuantityQuintals() != null ? e.getActualQuantityQuintals() : e.getBooking().getEstimatedQuantity();
        BigDecimal total = qty.multiply(msp).setScale(2, RoundingMode.HALF_UP);

        return MandiProcessDto.ProcurementEntryResponse.builder()
                .entryId(e.getEntryId())
                .bookingId(e.getBooking().getBookingId())
                .bookingReference(e.getBooking().getBookingReference())
                .tokenNumber(e.getBooking().getTokenNumber())
                .farmerName(e.getBooking().getFarmer().getName())
                .produceName(e.getBooking().getProduce().getProduceName())
                .grossWeightKg(e.getGrossWeightKg())
                .tareWeightKg(e.getTareWeightKg())
                .netWeightKg(e.getNetWeightKg())
                .actualQuantityQuintals(e.getActualQuantityQuintals())
                .moisturePercentage(e.getMoisturePercentage())
                .foreignMatterPercentage(e.getForeignMatterPercentage())
                .qualityGrade(e.getQualityGrade())
                .qciStatus(e.getQciStatus())
                .entryStatus(e.getEntryStatus())
                .entryDatetime(e.getEntryDatetime())
                .mspRate(msp)
                .totalAmount(total)
                .build();
    }

    public Optional<StorageRecord> getStorageRecordByBooking(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .flatMap(procurementEntryRepository::findByBooking)
                .map(storageRecordRepository::findByProcurementEntry)
                .flatMap(list -> list.stream().findFirst());
    }

    private MandiProcessDto.JFormResponse mapToJFormResponse(JForm jf) {
        ProcurementEntry e = jf.getEntry();
        BigDecimal msp = e.getBooking().getProduce().getMspRate();
        BigDecimal qty = e.getActualQuantityQuintals() != null ? e.getActualQuantityQuintals() : e.getBooking().getEstimatedQuantity();
        BigDecimal total = qty.multiply(msp).setScale(2, RoundingMode.HALF_UP);

        String sigName = jf.getAuthorizedSignatoryName() != null
                ? jf.getAuthorizedSignatoryName()
                : (e.getBooking().getCenter() != null ? e.getBooking().getCenter().getAuthorizedSignatoryName() : null);

        String sigData = jf.getSignatureData() != null
                ? jf.getSignatureData()
                : (e.getBooking().getCenter() != null ? e.getBooking().getCenter().getSignatureData() : null);

        return MandiProcessDto.JFormResponse.builder()
                .jFormId(jf.getJFormId())
                .entryId(e.getEntryId())
                .jFormNumber(jf.getJFormNumber())
                .issueDate(jf.getIssueDate())
                .status(jf.getStatus())
                .farmerName(e.getBooking().getFarmer().getName())
                .farmerVillage(e.getBooking().getFarmer().getVillage())
                .farmerDistrict(e.getBooking().getFarmer().getDistrict())
                .centerName(e.getBooking().getCenter().getCenterName())
                .produceName(e.getBooking().getProduce().getProduceName())
                .quantityQuintals(qty)
                .ratePerQuintal(msp)
                .totalAmount(total)
                .documentPath(jf.getDocumentPath())
                .authorizedSignatoryName(sigName)
                .signatureData(sigData)
                .build();
    }
}
