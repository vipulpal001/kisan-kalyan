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

        // Seed default procurement centre if empty
        ProcurementCentre centre;
        if (centreRepository.count() == 0) {
            centre = centreRepository.save(new ProcurementCentre(
                    null, "APMC-CHUNAR", "Chunar APMC Center",
                    "Chunar Kheda, Mirzapur, Uttar Pradesh",
                    "Chunar Kheda", "Mirzapur", "Uttar Pradesh",
                    BigDecimal.valueOf(25.1234567), BigDecimal.valueOf(82.8765432),
                    BigDecimal.valueOf(1000.00), BigDecimal.valueOf(0.00),
                    "1800-180-1551", CentreStatus.ACTIVE, null,
                    BigDecimal.valueOf(10.00) // 10 min/quintal processing rate
            ));
        } else {
            centre = centreRepository.findAll().get(0);
            if (centre.getProcessingMinutesPerQuintal() == null) {
                centre.setProcessingMinutesPerQuintal(BigDecimal.valueOf(10.00));
                centreRepository.save(centre);
            }
        }

        // Seed default counters
        Counter counter2 = null;
        if (counterRepository.count() == 0) {
            counterRepository.save(new Counter(null, centre, 1, "Weighbridge 1 (मुख्य तौल कांटा)", null, "A-101", CounterType.WEIGHBRIDGE, CentreStatus.ACTIVE, null));
            counter2 = counterRepository.save(new Counter(null, centre, 2, "Weighbridge 2 (अतिरिक्त तौल कांटा)", null, "A-102", CounterType.WEIGHBRIDGE, CentreStatus.ACTIVE, null));
            counterRepository.save(new Counter(null, centre, 3, "Quality & Moisture Helpdesk", null, null, CounterType.HELP_DESK, CentreStatus.ACTIVE, null));
        } else {
            counter2 = counterRepository.findAll().stream().filter(c -> c.getCounterNumber() != null && c.getCounterNumber() == 2).findFirst().orElse(counterRepository.findAll().get(0));
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
