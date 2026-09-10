package com.kisankalyan.service;

import com.kisankalyan.dto.AdminAnalyticsDto;
import com.kisankalyan.entity.*;
import com.kisankalyan.entity.enums.*;
import com.kisankalyan.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class AdminAnalyticsService {

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private ProcurementCentreRepository centreRepository;

    @Autowired
    private SlotBookingRepository bookingRepository;

    @Autowired
    private ProcurementEntryRepository procurementEntryRepository;

    @Autowired
    private QueueStatusRepository queueStatusRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private StorageLocationRepository storageLocationRepository;

    @Autowired
    private CounterRepository counterRepository;

    public AdminAnalyticsDto getDashboardAnalytics() {
        long totalFarmers = farmerRepository.count();

        List<ProcurementCentre> centres = centreRepository.findAll();
        long activeCentres = centres.stream()
                .filter(c -> c.getStatus() == CentreStatus.ACTIVE)
                .count();

        List<SlotBooking> allBookings = bookingRepository.findAll();
        long todayBookings = allBookings.size();

        long waitingInQueue = queueStatusRepository.findAll().stream()
                .filter(q -> q.getCurrentStatus() == QueueCurrentStatus.WAITING || q.getCurrentStatus() == QueueCurrentStatus.CALLED)
                .count();

        long totalNoShows = allBookings.stream()
                .filter(b -> b.getBookingStatus() == BookingStatus.NO_SHOW)
                .count();

        long completedProcurements = allBookings.stream()
                .filter(b -> b.getBookingStatus() == BookingStatus.COMPLETED)
                .count();

        List<ProcurementEntry> entries = procurementEntryRepository.findAll();
        BigDecimal todayProcurement = entries.stream()
                .map(e -> e.getActualQuantityQuintals() != null ? e.getActualQuantityQuintals() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<Payment> payments = paymentRepository.findAll();
        BigDecimal totalPayments = payments.stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<StorageLocation> locations = storageLocationRepository.findAll();
        BigDecimal totalCap = locations.stream()
                .map(StorageLocation::getCapacityQuintals)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalOccupied = locations.stream()
                .map(StorageLocation::getOccupiedQuintals)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<AdminAnalyticsDto.CentrePerformanceSummary> perfList = new ArrayList<>();
        for (ProcurementCentre c : centres) {
            long countersCount = counterRepository.findByCenter(c).size();
            long bCount = allBookings.stream().filter(b -> b.getCenter().getCenterId().equals(c.getCenterId())).count();
            perfList.add(new AdminAnalyticsDto.CentrePerformanceSummary(
                    c.getCenterId(),
                    c.getCenterName(),
                    c.getDistrict(),
                    c.getCapacityPerDay(),
                    c.getCurrentDailyQuantity(),
                    countersCount,
                    bCount
            ));
        }

        return new AdminAnalyticsDto(
                totalFarmers,
                activeCentres,
                todayBookings,
                todayProcurement,
                waitingInQueue,
                totalNoShows,
                completedProcurements,
                totalPayments,
                totalCap,
                totalOccupied,
                perfList
        );
    }
}
