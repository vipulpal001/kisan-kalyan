package com.kisankalyan.dto;

import java.math.BigDecimal;
import java.util.List;

public class AdminAnalyticsDto {

    private long totalFarmers;
    private long activeCentres;
    private long todayBookings;
    private BigDecimal todayProcurementQuintals;
    private long waitingInQueue;
    private long totalNoShows;
    private long completedProcurements;
    private BigDecimal totalPaymentsDisbursed;
    private BigDecimal totalStorageCapacityQuintals;
    private BigDecimal totalStorageOccupiedQuintals;
    private List<CentrePerformanceSummary> centrePerformances;

    public AdminAnalyticsDto() {}

    public AdminAnalyticsDto(long totalFarmers, long activeCentres, long todayBookings,
                             BigDecimal todayProcurementQuintals, long waitingInQueue,
                             long totalNoShows, long completedProcurements,
                             BigDecimal totalPaymentsDisbursed, BigDecimal totalStorageCapacityQuintals,
                             BigDecimal totalStorageOccupiedQuintals,
                             List<CentrePerformanceSummary> centrePerformances) {
        this.totalFarmers = totalFarmers;
        this.activeCentres = activeCentres;
        this.todayBookings = todayBookings;
        this.todayProcurementQuintals = todayProcurementQuintals;
        this.waitingInQueue = waitingInQueue;
        this.totalNoShows = totalNoShows;
        this.completedProcurements = completedProcurements;
        this.totalPaymentsDisbursed = totalPaymentsDisbursed;
        this.totalStorageCapacityQuintals = totalStorageCapacityQuintals;
        this.totalStorageOccupiedQuintals = totalStorageOccupiedQuintals;
        this.centrePerformances = centrePerformances;
    }

    public static class CentrePerformanceSummary {
        private Long centerId;
        private String centerName;
        private String district;
        private BigDecimal capacityPerDay;
        private BigDecimal currentDailyQuantity;
        private long activeCounters;
        private long bookingsCount;

        public CentrePerformanceSummary() {}

        public CentrePerformanceSummary(Long centerId, String centerName, String district,
                                        BigDecimal capacityPerDay, BigDecimal currentDailyQuantity,
                                        long activeCounters, long bookingsCount) {
            this.centerId = centerId;
            this.centerName = centerName;
            this.district = district;
            this.capacityPerDay = capacityPerDay;
            this.currentDailyQuantity = currentDailyQuantity;
            this.activeCounters = activeCounters;
            this.bookingsCount = bookingsCount;
        }

        public Long getCenterId() { return centerId; }
        public void setCenterId(Long centerId) { this.centerId = centerId; }

        public String getCenterName() { return centerName; }
        public void setCenterName(String centerName) { this.centerName = centerName; }

        public String getDistrict() { return district; }
        public void setDistrict(String district) { this.district = district; }

        public BigDecimal getCapacityPerDay() { return capacityPerDay; }
        public void setCapacityPerDay(BigDecimal capacityPerDay) { this.capacityPerDay = capacityPerDay; }

        public BigDecimal getCurrentDailyQuantity() { return currentDailyQuantity; }
        public void setCurrentDailyQuantity(BigDecimal currentDailyQuantity) { this.currentDailyQuantity = currentDailyQuantity; }

        public long getActiveCounters() { return activeCounters; }
        public void setActiveCounters(long activeCounters) { this.activeCounters = activeCounters; }

        public long getBookingsCount() { return bookingsCount; }
        public void setBookingsCount(long bookingsCount) { this.bookingsCount = bookingsCount; }
    }

    public long getTotalFarmers() { return totalFarmers; }
    public void setTotalFarmers(long totalFarmers) { this.totalFarmers = totalFarmers; }

    public long getActiveCentres() { return activeCentres; }
    public void setActiveCentres(long activeCentres) { this.activeCentres = activeCentres; }

    public long getTodayBookings() { return todayBookings; }
    public void setTodayBookings(long todayBookings) { this.todayBookings = todayBookings; }

    public BigDecimal getTodayProcurementQuintals() { return todayProcurementQuintals; }
    public void setTodayProcurementQuintals(BigDecimal todayProcurementQuintals) { this.todayProcurementQuintals = todayProcurementQuintals; }

    public long getWaitingInQueue() { return waitingInQueue; }
    public void setWaitingInQueue(long waitingInQueue) { this.waitingInQueue = waitingInQueue; }

    public long getTotalNoShows() { return totalNoShows; }
    public void setTotalNoShows(long totalNoShows) { this.totalNoShows = totalNoShows; }

    public long getCompletedProcurements() { return completedProcurements; }
    public void setCompletedProcurements(long completedProcurements) { this.completedProcurements = completedProcurements; }

    public BigDecimal getTotalPaymentsDisbursed() { return totalPaymentsDisbursed; }
    public void setTotalPaymentsDisbursed(BigDecimal totalPaymentsDisbursed) { this.totalPaymentsDisbursed = totalPaymentsDisbursed; }

    public BigDecimal getTotalStorageCapacityQuintals() { return totalStorageCapacityQuintals; }
    public void setTotalStorageCapacityQuintals(BigDecimal totalStorageCapacityQuintals) { this.totalStorageCapacityQuintals = totalStorageCapacityQuintals; }

    public BigDecimal getTotalStorageOccupiedQuintals() { return totalStorageOccupiedQuintals; }
    public void setTotalStorageOccupiedQuintals(BigDecimal totalStorageOccupiedQuintals) { this.totalStorageOccupiedQuintals = totalStorageOccupiedQuintals; }

    public List<CentrePerformanceSummary> getCentrePerformances() { return centrePerformances; }
    public void setCentrePerformances(List<CentrePerformanceSummary> centrePerformances) { this.centrePerformances = centrePerformances; }
}
