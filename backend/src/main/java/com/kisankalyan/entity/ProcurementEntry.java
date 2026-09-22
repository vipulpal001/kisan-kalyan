package com.kisankalyan.entity;

import com.kisankalyan.entity.enums.EntryStatus;
import com.kisankalyan.entity.enums.QciStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "procurement_entry")
public class ProcurementEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "entry_id")
    private Long entryId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", referencedColumnName = "booking_id", nullable = false, unique = true)
    private SlotBooking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", referencedColumnName = "staff_id")
    private Staff staff;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "counter_id", referencedColumnName = "counter_id")
    private Counter counter;

    @Column(name = "gross_weight_kg", precision = 12, scale = 2)
    private BigDecimal grossWeightKg;

    @Column(name = "tare_weight_kg", precision = 12, scale = 2)
    private BigDecimal tareWeightKg;

    @Column(name = "net_weight_kg", precision = 12, scale = 2)
    private BigDecimal netWeightKg;

    @Column(name = "actual_quantity_quintals", precision = 12, scale = 2)
    private BigDecimal actualQuantityQuintals;

    @Column(name = "moisture_percentage", precision = 5, scale = 2)
    private BigDecimal moisturePercentage;

    @Column(name = "foreign_matter_percentage", precision = 5, scale = 2)
    private BigDecimal foreignMatterPercentage;

    @Column(name = "quality_grade", length = 100)
    private String qualityGrade;

    @Enumerated(EnumType.STRING)
    @Column(name = "qci_status", length = 20)
    private QciStatus qciStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "entry_status", length = 30)
    private EntryStatus entryStatus;

    @Column(name = "entry_datetime", nullable = false, insertable = false, updatable = false)
    private OffsetDateTime entryDatetime;

    public ProcurementEntry() {}

    public ProcurementEntry(Long entryId, SlotBooking booking, Staff staff, Counter counter, BigDecimal grossWeightKg, BigDecimal tareWeightKg, BigDecimal netWeightKg, BigDecimal actualQuantityQuintals, BigDecimal moisturePercentage, BigDecimal foreignMatterPercentage, String qualityGrade, QciStatus qciStatus, EntryStatus entryStatus, OffsetDateTime entryDatetime) {
        this.entryId = entryId;
        this.booking = booking;
        this.staff = staff;
        this.counter = counter;
        this.grossWeightKg = grossWeightKg;
        this.tareWeightKg = tareWeightKg;
        this.netWeightKg = netWeightKg;
        this.actualQuantityQuintals = actualQuantityQuintals;
        this.moisturePercentage = moisturePercentage;
        this.foreignMatterPercentage = foreignMatterPercentage;
        this.qualityGrade = qualityGrade;
        this.qciStatus = qciStatus;
        this.entryStatus = entryStatus;
        this.entryDatetime = entryDatetime;
    }

    public Long getEntryId() { return this.entryId; }
    public void setEntryId(Long entryId) { this.entryId = entryId; }

    public SlotBooking getBooking() { return this.booking; }
    public void setBooking(SlotBooking booking) { this.booking = booking; }

    public Staff getStaff() { return this.staff; }
    public void setStaff(Staff staff) { this.staff = staff; }

    public Counter getCounter() { return this.counter; }
    public void setCounter(Counter counter) { this.counter = counter; }

    public BigDecimal getGrossWeightKg() { return this.grossWeightKg; }
    public void setGrossWeightKg(BigDecimal grossWeightKg) { this.grossWeightKg = grossWeightKg; }

    public BigDecimal getTareWeightKg() { return this.tareWeightKg; }
    public void setTareWeightKg(BigDecimal tareWeightKg) { this.tareWeightKg = tareWeightKg; }

    public BigDecimal getNetWeightKg() { return this.netWeightKg; }
    public void setNetWeightKg(BigDecimal netWeightKg) { this.netWeightKg = netWeightKg; }

    public BigDecimal getActualQuantityQuintals() { return this.actualQuantityQuintals; }
    public void setActualQuantityQuintals(BigDecimal actualQuantityQuintals) { this.actualQuantityQuintals = actualQuantityQuintals; }

    public BigDecimal getMoisturePercentage() { return this.moisturePercentage; }
    public void setMoisturePercentage(BigDecimal moisturePercentage) { this.moisturePercentage = moisturePercentage; }

    public BigDecimal getForeignMatterPercentage() { return this.foreignMatterPercentage; }
    public void setForeignMatterPercentage(BigDecimal foreignMatterPercentage) { this.foreignMatterPercentage = foreignMatterPercentage; }

    public String getQualityGrade() { return this.qualityGrade; }
    public void setQualityGrade(String qualityGrade) { this.qualityGrade = qualityGrade; }

    public QciStatus getQciStatus() { return this.qciStatus; }
    public void setQciStatus(QciStatus qciStatus) { this.qciStatus = qciStatus; }

    public EntryStatus getEntryStatus() { return this.entryStatus; }
    public void setEntryStatus(EntryStatus entryStatus) { this.entryStatus = entryStatus; }

    public OffsetDateTime getEntryDatetime() { return this.entryDatetime; }
    public void setEntryDatetime(OffsetDateTime entryDatetime) { this.entryDatetime = entryDatetime; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long entryId;
        private SlotBooking booking;
        private Staff staff;
        private Counter counter;
        private BigDecimal grossWeightKg;
        private BigDecimal tareWeightKg;
        private BigDecimal netWeightKg;
        private BigDecimal actualQuantityQuintals;
        private BigDecimal moisturePercentage;
        private BigDecimal foreignMatterPercentage;
        private String qualityGrade;
        private QciStatus qciStatus;
        private EntryStatus entryStatus;
        private OffsetDateTime entryDatetime;

        public Builder entryId(Long entryId) { this.entryId = entryId; return this; }
        public Builder booking(SlotBooking booking) { this.booking = booking; return this; }
        public Builder staff(Staff staff) { this.staff = staff; return this; }
        public Builder counter(Counter counter) { this.counter = counter; return this; }
        public Builder grossWeightKg(BigDecimal grossWeightKg) { this.grossWeightKg = grossWeightKg; return this; }
        public Builder tareWeightKg(BigDecimal tareWeightKg) { this.tareWeightKg = tareWeightKg; return this; }
        public Builder netWeightKg(BigDecimal netWeightKg) { this.netWeightKg = netWeightKg; return this; }
        public Builder actualQuantityQuintals(BigDecimal actualQuantityQuintals) { this.actualQuantityQuintals = actualQuantityQuintals; return this; }
        public Builder moisturePercentage(BigDecimal moisturePercentage) { this.moisturePercentage = moisturePercentage; return this; }
        public Builder foreignMatterPercentage(BigDecimal foreignMatterPercentage) { this.foreignMatterPercentage = foreignMatterPercentage; return this; }
        public Builder qualityGrade(String qualityGrade) { this.qualityGrade = qualityGrade; return this; }
        public Builder qciStatus(QciStatus qciStatus) { this.qciStatus = qciStatus; return this; }
        public Builder entryStatus(EntryStatus entryStatus) { this.entryStatus = entryStatus; return this; }
        public Builder entryDatetime(OffsetDateTime entryDatetime) { this.entryDatetime = entryDatetime; return this; }

        public ProcurementEntry build() {
            ProcurementEntry obj = new ProcurementEntry();
            obj.entryId = this.entryId;
            obj.booking = this.booking;
            obj.staff = this.staff;
            obj.counter = this.counter;
            obj.grossWeightKg = this.grossWeightKg;
            obj.tareWeightKg = this.tareWeightKg;
            obj.netWeightKg = this.netWeightKg;
            obj.actualQuantityQuintals = this.actualQuantityQuintals;
            obj.moisturePercentage = this.moisturePercentage;
            obj.foreignMatterPercentage = this.foreignMatterPercentage;
            obj.qualityGrade = this.qualityGrade;
            obj.qciStatus = this.qciStatus;
            obj.entryStatus = this.entryStatus;
            obj.entryDatetime = this.entryDatetime;
            return obj;
        }
    }

}
