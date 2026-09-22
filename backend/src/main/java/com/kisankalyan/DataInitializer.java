package com.kisankalyan;

import com.kisankalyan.entity.*;
import com.kisankalyan.entity.enums.*;
import com.kisankalyan.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AppUserRepository userRepository;

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private ProcurementCentreRepository centreRepository;

    @Autowired
    private CounterRepository counterRepository;

    @Autowired
    private AgriculturalProduceRepository produceRepository;

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SlotBookingRepository slotBookingRepository;

    @Autowired
    private SlotAllocationRepository slotAllocationRepository;

    @Autowired
    private QueueStatusRepository queueStatusRepository;

    @Autowired
    private StorageLocationRepository storageLocationRepository;

    @Override
    public void run(String... args) throws Exception {
        // Seed default produce if empty
        if (produceRepository.count() == 0) {
            produceRepository.save(new AgriculturalProduce(null, "WHEAT-2026", "गेहूं (Wheat)", "Cereals", "Rabi 2026", BigDecimal.valueOf(2275.00), ProduceUnit.QUINTAL, true, null));
            produceRepository.save(new AgriculturalProduce(null, "PADDY-2026", "धान (चावल / Rice)", "Cereals", "Kharif 2026", BigDecimal.valueOf(2300.00), ProduceUnit.QUINTAL, true, null));
            produceRepository.save(new AgriculturalProduce(null, "MAIZE-2026", "मक्का (Maize)", "Cereals", "Kharif 2026", BigDecimal.valueOf(2090.00), ProduceUnit.QUINTAL, true, null));
            produceRepository.save(new AgriculturalProduce(null, "MUSTARD-2026", "सरसों (Mustard)", "Oilseeds", "Rabi 2026", BigDecimal.valueOf(5650.00), ProduceUnit.QUINTAL, true, null));
            produceRepository.save(new AgriculturalProduce(null, "GRAM-2026", "चना (Gram)", "Pulses", "Rabi 2026", BigDecimal.valueOf(5440.00), ProduceUnit.QUINTAL, true, null));
        }

        // Seed 4 canonical active procurement centres
        String sigSvg1 = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='50'><path d='M10 35 Q 35 10, 60 25 T 100 20 T 130 35' stroke='%23054122' stroke-width='2.5' fill='none'/><text x='15' y='45' font-family='sans-serif' font-size='9' fill='%23054122'>S. Verma (APMC)</text></svg>";
        String sigSvg2 = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='50'><path d='M10 30 Q 40 5, 70 28 T 110 15 T 130 30' stroke='%23054122' stroke-width='2.5' fill='none'/><text x='15' y='45' font-family='sans-serif' font-size='9' fill='%23054122'>R. Kumar (Mandi)</text></svg>";
        String sigSvg3 = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='50'><path d='M12 28 Q 45 8, 75 25 T 105 18 T 130 32' stroke='%23054122' stroke-width='2.5' fill='none'/><text x='15' y='45' font-family='sans-serif' font-size='9' fill='%23054122'>A. Singh (In-Charge)</text></svg>";
        String sigSvg4 = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='50'><path d='M10 25 Q 35 12, 65 30 T 105 15 T 135 28' stroke='%23054122' stroke-width='2.5' fill='none'/><text x='15' y='45' font-family='sans-serif' font-size='9' fill='%23054122'>M. Tiwari (QCI)</text></svg>";

        ProcurementCentre centre1 = centreRepository.findByCenterCode("APMC-CHUNAR").orElseGet(() -> {
            return centreRepository.save(new ProcurementCentre(
                    null, "APMC-CHUNAR", "चुनार कृषि उपज मंडी समिति (Chunar APMC Center)",
                    "Chunar Kheda, Mirzapur, Uttar Pradesh",
                    "Chunar Kheda", "Mirzapur", "Uttar Pradesh",
                    BigDecimal.valueOf(25.1234567), BigDecimal.valueOf(82.8765432),
                    BigDecimal.valueOf(1000.00), BigDecimal.valueOf(0.00),
                    "1800-180-1551", CentreStatus.ACTIVE, null,
                    BigDecimal.valueOf(0.25), "सुरेश वर्मा (Suresh Verma, Mandi Officer)", sigSvg1
            ));
        });

        ProcurementCentre centre2 = centreRepository.findByCenterCode("MANDI-MIRZAPUR").orElseGet(() -> {
            return centreRepository.save(new ProcurementCentre(
                    null, "MANDI-MIRZAPUR", "मीरजापुर मुख्य अनाज मंडी (Mirzapur Main Mandi)",
                    "शास्त्री ब्रिज के पास, मीरजापुर",
                    "Shastri Bridge", "Mirzapur", "Uttar Pradesh",
                    BigDecimal.valueOf(25.1462000), BigDecimal.valueOf(82.5690000),
                    BigDecimal.valueOf(1200.00), BigDecimal.valueOf(0.00),
                    "1800-180-1552", CentreStatus.ACTIVE, null,
                    BigDecimal.valueOf(0.25), "राजेश कुमार (Rajesh Kumar, Mandi Inspector)", sigSvg2
            ));
        });

        ProcurementCentre centre3 = centreRepository.findByCenterCode("CEN-AHRAURA").orElseGet(() -> {
            return centreRepository.save(new ProcurementCentre(
                    null, "CEN-AHRAURA", "अहरौरा क्रय केंद्र (Ahraura Procurement Centre)",
                    "मंडी समिति, अहरौरा, मीरजापुर",
                    "Ahraura", "Mirzapur", "Uttar Pradesh",
                    BigDecimal.valueOf(25.0185000), BigDecimal.valueOf(83.0234000),
                    BigDecimal.valueOf(800.00), BigDecimal.valueOf(0.00),
                    "1800-180-1553", CentreStatus.ACTIVE, null,
                    BigDecimal.valueOf(0.25), "अनिल सिंह (Anil Singh, Procurement In-Charge)", sigSvg3
            ));
        });

        ProcurementCentre centre4 = centreRepository.findByCenterCode("CEN-LALGANJ").orElseGet(() -> {
            return centreRepository.save(new ProcurementCentre(
                    null, "CEN-LALGANJ", "लालगंज सरकारी खरीद केंद्र (Lalganj Procurement Centre)",
                    "रीवा रोड, लालगंज, मीरजापुर",
                    "Lalganj", "Mirzapur", "Uttar Pradesh",
                    BigDecimal.valueOf(24.9580000), BigDecimal.valueOf(82.3550000),
                    BigDecimal.valueOf(900.00), BigDecimal.valueOf(0.00),
                    "1800-180-1554", CentreStatus.ACTIVE, null,
                    BigDecimal.valueOf(0.25), "मनोज तिवारी (Manoj Tiwari, QCI Officer)", sigSvg4
            ));
        });

        ProcurementCentre centre = centre1;
        for (ProcurementCentre c : centreRepository.findAll()) {
            c.setProcessingMinutesPerQuintal(BigDecimal.valueOf(0.25));
            if (c.getAuthorizedSignatoryName() == null) {
                c.setAuthorizedSignatoryName("सुरेश वर्मा (Suresh Verma, Mandi Officer)");
                c.setSignatureData(sigSvg1);
            }
            centreRepository.save(c);
        }

        // Seed counters for all centres
        Counter counter2 = null;
        for (ProcurementCentre pc : List.of(centre1, centre2, centre3, centre4)) {
            if (counterRepository.findByCenter(pc).isEmpty()) {
                counterRepository.save(new Counter(null, pc, 1, "Weighbridge 1 (मुख्य तौल कांटा)", null, "A-101", CounterType.WEIGHBRIDGE, CentreStatus.ACTIVE, null));
                Counter c2 = counterRepository.save(new Counter(null, pc, 2, "Weighbridge 2 (अतिरिक्त तौल कांटा)", null, "A-102", CounterType.WEIGHBRIDGE, CentreStatus.ACTIVE, null));
                counterRepository.save(new Counter(null, pc, 3, "Quality & Moisture Helpdesk", null, null, CounterType.HELP_DESK, CentreStatus.ACTIVE, null));
                if (pc.getCenterId().equals(centre.getCenterId())) {
                    counter2 = c2;
                }
            }
        }
        if (counter2 == null) {
            counter2 = counterRepository.findAll().stream().filter(c -> c.getCounterNumber() != null && c.getCounterNumber() == 2).findFirst().orElse(counterRepository.findAll().get(0));
        }

        // Seed Storage Locations for each centre
        for (ProcurementCentre pc : List.of(centre1, centre2, centre3, centre4)) {
            if (storageLocationRepository.findByCenter(pc).isEmpty()) {
                storageLocationRepository.save(new StorageLocation(null, pc, "GDN-" + pc.getCenterId() + "-A", "गोदाम ए - वैज्ञानिक भंडारण (Godown A - Scientific Storage)", "सेक्टर A शेड", BigDecimal.valueOf(5000.00), BigDecimal.valueOf(450.00), StorageLocationStatus.ACTIVE, null));
                storageLocationRepository.save(new StorageLocation(null, pc, "SILO-" + pc.getCenterId() + "-1", "साइलो यूनिट 1 - आधुनिक अनाज भंडारण (Silo Unit 1 - Steel Grain Silo)", "साइलो परिसर", BigDecimal.valueOf(3500.00), BigDecimal.valueOf(120.00), StorageLocationStatus.ACTIVE, null));
                storageLocationRepository.save(new StorageLocation(null, pc, "WRH-" + pc.getCenterId() + "-CWC", "केंद्रीय भंडारण निगम बफर गोदाम (CWC Buffer Godown)", "CWC वेयरहाउस", BigDecimal.valueOf(4000.00), BigDecimal.valueOf(0.00), StorageLocationStatus.ACTIVE, null));
            }
        }

        // Seed users (FARMER, OPERATOR, ADMIN) with phone number existence checks
        if (userRepository.findByUsername("farmer").isEmpty() && userRepository.findByPhoneNumber("9876543210").isEmpty()) {
            AppUser fUser = userRepository.save(new AppUser(null, "farmer", passwordEncoder.encode("farmer123"), UserRole.FARMER, "9876543210", true, null));
            farmerRepository.save(new Farmer(null, fUser, "Ramesh Singh (रमेश सिंह)", "9876543210", "123456789012", "918273645012", "State Bank of India", "SBIN0001234", "Village Chunar Kheda", "Chunar Kheda", "Mirzapur", "Uttar Pradesh", null));
        }

        if (userRepository.findByUsername("operator").isEmpty() && userRepository.findByPhoneNumber("9876543211").isEmpty()) {
            AppUser opUser = userRepository.save(new AppUser(null, "operator", passwordEncoder.encode("operator123"), UserRole.OPERATOR, "9876543211", true, null));
            staffRepository.save(new Staff(null, opUser, centre, "Suresh Verma (सुरेश वर्मा)", "Weighbridge In-Charge", "9876543211", "OP-101", CommonStatus.ACTIVE, null));
        }

        if (userRepository.findByUsername("admin").isEmpty() && userRepository.findByPhoneNumber("9876543212").isEmpty()) {
            AppUser admUser = userRepository.save(new AppUser(null, "admin", passwordEncoder.encode("admin123"), UserRole.ADMIN, "9876543212", true, null));
            staffRepository.save(new Staff(null, admUser, centre, "District Collector / Mandi Admin", "Chief Mandi Administrator", "9876543212", "ADM-001", CommonStatus.ACTIVE, null));
        }

        // Find primary farmer user for notifications and active booking
        AppUser rUser = userRepository.findByUsername("ramesh.singh").or(() -> userRepository.findByUsername("farmer")).orElse(null);
        if (rUser != null) {
            // Seed notifications if empty
            if (notificationRepository.findByUserOrderBySentAtDesc(rUser).isEmpty()) {
                notificationRepository.save(new Notification(null, rUser, null, "आपका टोकन A-102 चुनार APMC क्रय केंद्र पर सफलतापूर्वक आरक्षित हो गया है।", NotificationType.SLOT_CONFIRMATION, false, java.time.OffsetDateTime.now().minusMinutes(35)));
                notificationRepository.save(new Notification(null, rUser, null, "कतार अपडेट: आप कतार में 5वें स्थान पर हैं। अनुमानित प्रतीक्षा समय ~12 मिनट।", NotificationType.QUEUE_UPDATE, false, java.time.OffsetDateTime.now().minusMinutes(12)));
                notificationRepository.save(new Notification(null, rUser, null, "किसान कल्याण पोर्टल पर आपका स्वागत है। आधार-सीडेड बैंक विवरण सफलतापूर्वक सत्यापित है।", NotificationType.GENERAL, true, java.time.OffsetDateTime.now().minusHours(2)));
            }

            // Seed active booking A-102 if not present
            Farmer rFarmer = farmerRepository.findByUser(rUser).orElse(null);
            if (rFarmer != null && slotBookingRepository.findByTokenNumber("A-102").isEmpty()) {
                AgriculturalProduce wheat = produceRepository.findAll().stream().filter(p -> p.getProduceName().contains("Wheat") || p.getProduceName().contains("गेहूं")).findFirst().orElse(produceRepository.findAll().get(0));
                
                TimeSlot slot = timeSlotRepository.findAll().stream().findFirst().orElseGet(() -> {
                    return timeSlotRepository.save(TimeSlot.builder()
                            .center(centre)
                            .slotDate(LocalDate.now())
                            .startTime(LocalTime.of(9, 0))
                            .endTime(LocalTime.of(10, 0))
                            .maxBookings(20)
                            .bookedCount(1)
                            .status(TimeSlotStatus.AVAILABLE)
                            .build());
                });

                SlotBooking activeBooking = SlotBooking.builder()
                        .bookingReference("BK-2026-98124")
                        .tokenNumber("A-102")
                        .farmer(rFarmer)
                        .center(centre)
                        .produce(wheat)
                        .slot(slot)
                        .estimatedQuantity(BigDecimal.valueOf(50.00))
                        .bookingStatus(BookingStatus.BOOKED)
                        .verificationDeadline(java.time.OffsetDateTime.now().plusMinutes(10))
                        .bookedAt(java.time.OffsetDateTime.now().minusMinutes(35))
                        .build();
                activeBooking = slotBookingRepository.save(activeBooking);

                // Slot allocation on Counter 2
                SlotAllocation allocation = SlotAllocation.builder()
                        .booking(activeBooking)
                        .counter(counter2 != null ? counter2 : counterRepository.findAll().get(0))
                        .slot(slot)
                        .allocatedStartTime(java.time.OffsetDateTime.now().plusMinutes(20))
                        .allocatedEndTime(java.time.OffsetDateTime.now().plusMinutes(70))
                        .allocatedQuantityQuintals(BigDecimal.valueOf(50.00))
                        .allocationStatus(AllocationStatus.ALLOCATED)
                        .build();
                slotAllocationRepository.save(allocation);

                // Queue status
                QueueStatus qs = QueueStatus.builder()
                        .booking(activeBooking)
                        .tokenNumber("A-102")
                        .queuePosition(5)
                        .currentStatus(QueueCurrentStatus.WAITING)
                        .estimatedWaitTime(12)
                        .counter(allocation.getCounter())
                        .build();
                queueStatusRepository.save(qs);
            }
        }
    }
}
