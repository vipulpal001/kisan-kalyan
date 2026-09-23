package com.kisankalyan.entity;

import com.kisankalyan.entity.enums.StorageRecordStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "storage_record")
public class StorageRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "storage_record_id")
    private Long storageRecordId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "storage_id", referencedColumnName = "storage_id", nullable = false)
    private StorageLocation storageLocation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entry_id", referencedColumnName = "entry_id", nullable = false)
    private ProcurementEntry procurementEntry;

    @Column(name = "quantity_quintals", nullable = false, precision = 12, scale = 2)
    private BigDecimal quantityQuintals;

    @Column(name = "storage_date", nullable = false, updatable = false)
    private OffsetDateTime storageDate;

    @PrePersist
    protected void onCreate() {
        if (this.storageDate == null) {
            this.storageDate = OffsetDateTime.now();
        }
    }

    @Column(name = "release_date")
    private OffsetDateTime releaseDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "storage_status", nullable = false, length = 20)
    private StorageRecordStatus storageStatus;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    public StorageRecord() {}

    public StorageRecord(Long storageRecordId, StorageLocation storageLocation, ProcurementEntry procurementEntry, BigDecimal quantityQuintals, OffsetDateTime storageDate, OffsetDateTime releaseDate, StorageRecordStatus storageStatus, String remarks) {
        this.storageRecordId = storageRecordId;
        this.storageLocation = storageLocation;
        this.procurementEntry = procurementEntry;
        this.quantityQuintals = quantityQuintals;
        this.storageDate = storageDate;
        this.releaseDate = releaseDate;
        this.storageStatus = storageStatus;
        this.remarks = remarks;
    }

    public Long getStorageRecordId() { return this.storageRecordId; }
    public void setStorageRecordId(Long storageRecordId) { this.storageRecordId = storageRecordId; }

    public StorageLocation getStorageLocation() { return this.storageLocation; }
    public void setStorageLocation(StorageLocation storageLocation) { this.storageLocation = storageLocation; }

    public ProcurementEntry getProcurementEntry() { return this.procurementEntry; }
    public void setProcurementEntry(ProcurementEntry procurementEntry) { this.procurementEntry = procurementEntry; }

    public BigDecimal getQuantityQuintals() { return this.quantityQuintals; }
    public void setQuantityQuintals(BigDecimal quantityQuintals) { this.quantityQuintals = quantityQuintals; }

    public OffsetDateTime getStorageDate() { return this.storageDate; }
    public void setStorageDate(OffsetDateTime storageDate) { this.storageDate = storageDate; }

    public OffsetDateTime getReleaseDate() { return this.releaseDate; }
    public void setReleaseDate(OffsetDateTime releaseDate) { this.releaseDate = releaseDate; }

    public StorageRecordStatus getStorageStatus() { return this.storageStatus; }
    public void setStorageStatus(StorageRecordStatus storageStatus) { this.storageStatus = storageStatus; }

    public String getRemarks() { return this.remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long storageRecordId;
        private StorageLocation storageLocation;
        private ProcurementEntry procurementEntry;
        private BigDecimal quantityQuintals;
        private OffsetDateTime storageDate;
        private OffsetDateTime releaseDate;
        private StorageRecordStatus storageStatus;
        private String remarks;

        public Builder storageRecordId(Long storageRecordId) { this.storageRecordId = storageRecordId; return this; }
        public Builder storageLocation(StorageLocation storageLocation) { this.storageLocation = storageLocation; return this; }
        public Builder procurementEntry(ProcurementEntry procurementEntry) { this.procurementEntry = procurementEntry; return this; }
        public Builder quantityQuintals(BigDecimal quantityQuintals) { this.quantityQuintals = quantityQuintals; return this; }
        public Builder storageDate(OffsetDateTime storageDate) { this.storageDate = storageDate; return this; }
        public Builder releaseDate(OffsetDateTime releaseDate) { this.releaseDate = releaseDate; return this; }
        public Builder storageStatus(StorageRecordStatus storageStatus) { this.storageStatus = storageStatus; return this; }
        public Builder remarks(String remarks) { this.remarks = remarks; return this; }

        public StorageRecord build() {
            StorageRecord obj = new StorageRecord();
            obj.storageRecordId = this.storageRecordId;
            obj.storageLocation = this.storageLocation;
            obj.procurementEntry = this.procurementEntry;
            obj.quantityQuintals = this.quantityQuintals;
            obj.storageDate = this.storageDate;
            obj.releaseDate = this.releaseDate;
            obj.storageStatus = this.storageStatus;
            obj.remarks = this.remarks;
            return obj;
        }
    }

}
