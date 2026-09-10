package com.kisankalyan.entity;

import com.kisankalyan.entity.enums.StorageLocationStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "storage_location")
public class StorageLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "storage_id")
    private Long storageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id", referencedColumnName = "center_id", nullable = false)
    private ProcurementCentre center;

    @Column(name = "storage_code", nullable = false, unique = true, length = 30)
    private String storageCode;

    @Column(name = "storage_name", nullable = false, length = 150)
    private String storageName;

    @Column(name = "location_description", columnDefinition = "TEXT")
    private String locationDescription;

    @Column(name = "capacity_quintals", nullable = false, precision = 12, scale = 2)
    private BigDecimal capacityQuintals;

    @Column(name = "occupied_quintals", nullable = false, precision = 12, scale = 2)
    private BigDecimal occupiedQuintals;

    @Enumerated(EnumType.STRING)
    @Column(name = "storage_status", nullable = false, length = 20)
    private StorageLocationStatus storageStatus;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    public StorageLocation() {}

    public StorageLocation(Long storageId, ProcurementCentre center, String storageCode, String storageName, String locationDescription, BigDecimal capacityQuintals, BigDecimal occupiedQuintals, StorageLocationStatus storageStatus, OffsetDateTime createdAt) {
        this.storageId = storageId;
        this.center = center;
        this.storageCode = storageCode;
        this.storageName = storageName;
        this.locationDescription = locationDescription;
        this.capacityQuintals = capacityQuintals;
        this.occupiedQuintals = occupiedQuintals;
        this.storageStatus = storageStatus;
        this.createdAt = createdAt;
    }

    public Long getStorageId() { return this.storageId; }
    public void setStorageId(Long storageId) { this.storageId = storageId; }

    public ProcurementCentre getCenter() { return this.center; }
    public void setCenter(ProcurementCentre center) { this.center = center; }

    public String getStorageCode() { return this.storageCode; }
    public void setStorageCode(String storageCode) { this.storageCode = storageCode; }

    public String getStorageName() { return this.storageName; }
    public void setStorageName(String storageName) { this.storageName = storageName; }

    public String getLocationDescription() { return this.locationDescription; }
    public void setLocationDescription(String locationDescription) { this.locationDescription = locationDescription; }

    public BigDecimal getCapacityQuintals() { return this.capacityQuintals; }
    public void setCapacityQuintals(BigDecimal capacityQuintals) { this.capacityQuintals = capacityQuintals; }

    public BigDecimal getOccupiedQuintals() { return this.occupiedQuintals; }
    public void setOccupiedQuintals(BigDecimal occupiedQuintals) { this.occupiedQuintals = occupiedQuintals; }

    public StorageLocationStatus getStorageStatus() { return this.storageStatus; }
    public void setStorageStatus(StorageLocationStatus storageStatus) { this.storageStatus = storageStatus; }

    public OffsetDateTime getCreatedAt() { return this.createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long storageId;
        private ProcurementCentre center;
        private String storageCode;
        private String storageName;
        private String locationDescription;
        private BigDecimal capacityQuintals;
        private BigDecimal occupiedQuintals;
        private StorageLocationStatus storageStatus;
        private OffsetDateTime createdAt;

        public Builder storageId(Long storageId) { this.storageId = storageId; return this; }
        public Builder center(ProcurementCentre center) { this.center = center; return this; }
        public Builder storageCode(String storageCode) { this.storageCode = storageCode; return this; }
        public Builder storageName(String storageName) { this.storageName = storageName; return this; }
        public Builder locationDescription(String locationDescription) { this.locationDescription = locationDescription; return this; }
        public Builder capacityQuintals(BigDecimal capacityQuintals) { this.capacityQuintals = capacityQuintals; return this; }
        public Builder occupiedQuintals(BigDecimal occupiedQuintals) { this.occupiedQuintals = occupiedQuintals; return this; }
        public Builder storageStatus(StorageLocationStatus storageStatus) { this.storageStatus = storageStatus; return this; }
        public Builder createdAt(OffsetDateTime createdAt) { this.createdAt = createdAt; return this; }

        public StorageLocation build() {
            StorageLocation obj = new StorageLocation();
            obj.storageId = this.storageId;
            obj.center = this.center;
            obj.storageCode = this.storageCode;
            obj.storageName = this.storageName;
            obj.locationDescription = this.locationDescription;
            obj.capacityQuintals = this.capacityQuintals;
            obj.occupiedQuintals = this.occupiedQuintals;
            obj.storageStatus = this.storageStatus;
            obj.createdAt = this.createdAt;
            return obj;
        }
    }

}
