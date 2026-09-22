package com.kisankalyan.entity;

import com.kisankalyan.entity.enums.CentreStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "procurement_centre")
public class ProcurementCentre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "center_id")
    private Long centerId;

    @Column(name = "center_code", nullable = false, unique = true, length = 20)
    private String centerCode;

    @Column(name = "center_name", nullable = false, length = 150)
    private String centerName;

    @Column(name = "center_location", nullable = false, columnDefinition = "TEXT")
    private String centerLocation;

    @Column(name = "village", length = 100)
    private String village;

    @Column(name = "district", length = 100)
    private String district;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "latitude", precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "capacity_per_day", nullable = false, precision = 12, scale = 2)
    private BigDecimal capacityPerDay;

    @Column(name = "current_daily_quantity", nullable = false, precision = 12, scale = 2)
    private BigDecimal currentDailyQuantity;

    @Column(name = "contact_number", length = 15)
    private String contactNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private CentreStatus status;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "processing_minutes_per_quintal", precision = 10, scale = 2)
    private BigDecimal processingMinutesPerQuintal;

    @Column(name = "authorized_signatory_name", length = 150)
    private String authorizedSignatoryName;

    @Column(name = "signature_data", columnDefinition = "TEXT")
    private String signatureData;

    public ProcurementCentre() {}

    public ProcurementCentre(Long centerId, String centerCode, String centerName, String centerLocation, String village, String district, String state, BigDecimal latitude, BigDecimal longitude, BigDecimal capacityPerDay, BigDecimal currentDailyQuantity, String contactNumber, CentreStatus status, OffsetDateTime createdAt, BigDecimal processingMinutesPerQuintal) {
        this.centerId = centerId;
        this.centerCode = centerCode;
        this.centerName = centerName;
        this.centerLocation = centerLocation;
        this.village = village;
        this.district = district;
        this.state = state;
        this.latitude = latitude;
        this.longitude = longitude;
        this.capacityPerDay = capacityPerDay;
        this.currentDailyQuantity = currentDailyQuantity;
        this.contactNumber = contactNumber;
        this.status = status;
        this.createdAt = createdAt;
        this.processingMinutesPerQuintal = processingMinutesPerQuintal;
    }

    public ProcurementCentre(Long centerId, String centerCode, String centerName, String centerLocation, String village, String district, String state, BigDecimal latitude, BigDecimal longitude, BigDecimal capacityPerDay, BigDecimal currentDailyQuantity, String contactNumber, CentreStatus status, OffsetDateTime createdAt, BigDecimal processingMinutesPerQuintal, String authorizedSignatoryName, String signatureData) {
        this(centerId, centerCode, centerName, centerLocation, village, district, state, latitude, longitude, capacityPerDay, currentDailyQuantity, contactNumber, status, createdAt, processingMinutesPerQuintal);
        this.authorizedSignatoryName = authorizedSignatoryName;
        this.signatureData = signatureData;
    }

    public Long getCenterId() { return this.centerId; }
    public void setCenterId(Long centerId) { this.centerId = centerId; }

    public String getCenterCode() { return this.centerCode; }
    public void setCenterCode(String centerCode) { this.centerCode = centerCode; }

    public String getCenterName() { return this.centerName; }
    public void setCenterName(String centerName) { this.centerName = centerName; }

    public String getCenterLocation() { return this.centerLocation; }
    public void setCenterLocation(String centerLocation) { this.centerLocation = centerLocation; }

    public String getVillage() { return this.village; }
    public void setVillage(String village) { this.village = village; }

    public String getDistrict() { return this.district; }
    public void setDistrict(String district) { this.district = district; }

    public String getState() { return this.state; }
    public void setState(String state) { this.state = state; }

    public BigDecimal getLatitude() { return this.latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return this.longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public BigDecimal getCapacityPerDay() { return this.capacityPerDay; }
    public void setCapacityPerDay(BigDecimal capacityPerDay) { this.capacityPerDay = capacityPerDay; }

    public BigDecimal getCurrentDailyQuantity() { return this.currentDailyQuantity; }
    public void setCurrentDailyQuantity(BigDecimal currentDailyQuantity) { this.currentDailyQuantity = currentDailyQuantity; }

    public String getContactNumber() { return this.contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public CentreStatus getStatus() { return this.status; }
    public void setStatus(CentreStatus status) { this.status = status; }

    public OffsetDateTime getCreatedAt() { return this.createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public BigDecimal getProcessingMinutesPerQuintal() { return this.processingMinutesPerQuintal; }
    public void setProcessingMinutesPerQuintal(BigDecimal processingMinutesPerQuintal) { this.processingMinutesPerQuintal = processingMinutesPerQuintal; }

    public String getAuthorizedSignatoryName() { return this.authorizedSignatoryName; }
    public void setAuthorizedSignatoryName(String authorizedSignatoryName) { this.authorizedSignatoryName = authorizedSignatoryName; }

    public String getSignatureData() { return this.signatureData; }
    public void setSignatureData(String signatureData) { this.signatureData = signatureData; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long centerId;
        private String centerCode;
        private String centerName;
        private String centerLocation;
        private String village;
        private String district;
        private String state;
        private BigDecimal latitude;
        private BigDecimal longitude;
        private BigDecimal capacityPerDay;
        private BigDecimal currentDailyQuantity;
        private String contactNumber;
        private CentreStatus status;
        private OffsetDateTime createdAt;
        private BigDecimal processingMinutesPerQuintal;
        private String authorizedSignatoryName;
        private String signatureData;

        public Builder centerId(Long centerId) { this.centerId = centerId; return this; }
        public Builder centerCode(String centerCode) { this.centerCode = centerCode; return this; }
        public Builder centerName(String centerName) { this.centerName = centerName; return this; }
        public Builder centerLocation(String centerLocation) { this.centerLocation = centerLocation; return this; }
        public Builder village(String village) { this.village = village; return this; }
        public Builder district(String district) { this.district = district; return this; }
        public Builder state(String state) { this.state = state; return this; }
        public Builder latitude(BigDecimal latitude) { this.latitude = latitude; return this; }
        public Builder longitude(BigDecimal longitude) { this.longitude = longitude; return this; }
        public Builder capacityPerDay(BigDecimal capacityPerDay) { this.capacityPerDay = capacityPerDay; return this; }
        public Builder currentDailyQuantity(BigDecimal currentDailyQuantity) { this.currentDailyQuantity = currentDailyQuantity; return this; }
        public Builder contactNumber(String contactNumber) { this.contactNumber = contactNumber; return this; }
        public Builder status(CentreStatus status) { this.status = status; return this; }
        public Builder createdAt(OffsetDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder processingMinutesPerQuintal(BigDecimal processingMinutesPerQuintal) { this.processingMinutesPerQuintal = processingMinutesPerQuintal; return this; }
        public Builder authorizedSignatoryName(String authorizedSignatoryName) { this.authorizedSignatoryName = authorizedSignatoryName; return this; }
        public Builder signatureData(String signatureData) { this.signatureData = signatureData; return this; }

        public ProcurementCentre build() {
            ProcurementCentre obj = new ProcurementCentre();
            obj.centerId = this.centerId;
            obj.centerCode = this.centerCode;
            obj.centerName = this.centerName;
            obj.centerLocation = this.centerLocation;
            obj.village = this.village;
            obj.district = this.district;
            obj.state = this.state;
            obj.latitude = this.latitude;
            obj.longitude = this.longitude;
            obj.capacityPerDay = this.capacityPerDay;
            obj.currentDailyQuantity = this.currentDailyQuantity;
            obj.contactNumber = this.contactNumber;
            obj.status = this.status;
            obj.createdAt = this.createdAt;
            obj.processingMinutesPerQuintal = this.processingMinutesPerQuintal;
            obj.authorizedSignatoryName = this.authorizedSignatoryName;
            obj.signatureData = this.signatureData;
            return obj;
        }
    }
}
