package com.kisankalyan.entity;

import com.kisankalyan.entity.enums.AllocationStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(
    name = "slot_allocation",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_slot_allocation_booking", columnNames = {"booking_id"})
    }
)
public class SlotAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "allocation_id")
    private Long allocationId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", referencedColumnName = "booking_id", nullable = false, unique = true)
    private SlotBooking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "counter_id", referencedColumnName = "counter_id", nullable = false)
    private Counter counter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_id", referencedColumnName = "slot_id", nullable = false)
    private TimeSlot slot;

    @Column(name = "allocated_start_time", nullable = false)
    private OffsetDateTime allocatedStartTime;

    @Column(name = "allocated_end_time", nullable = false)
    private OffsetDateTime allocatedEndTime;

    @Column(name = "allocated_quantity_quintals", nullable = false, precision = 10, scale = 2)
    private BigDecimal allocatedQuantityQuintals;

    @Enumerated(EnumType.STRING)
    @Column(name = "allocation_status", nullable = false, length = 30)
    private AllocationStatus allocationStatus;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = OffsetDateTime.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = OffsetDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    public SlotAllocation() {}

    public SlotAllocation(Long allocationId, SlotBooking booking, Counter counter, TimeSlot slot, OffsetDateTime allocatedStartTime, OffsetDateTime allocatedEndTime, BigDecimal allocatedQuantityQuintals, AllocationStatus allocationStatus, OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.allocationId = allocationId;
        this.booking = booking;
        this.counter = counter;
        this.slot = slot;
        this.allocatedStartTime = allocatedStartTime;
        this.allocatedEndTime = allocatedEndTime;
        this.allocatedQuantityQuintals = allocatedQuantityQuintals;
        this.allocationStatus = allocationStatus;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getAllocationId() { return this.allocationId; }
    public void setAllocationId(Long allocationId) { this.allocationId = allocationId; }

    public SlotBooking getBooking() { return this.booking; }
    public void setBooking(SlotBooking booking) { this.booking = booking; }

    public Counter getCounter() { return this.counter; }
    public void setCounter(Counter counter) { this.counter = counter; }

    public TimeSlot getSlot() { return this.slot; }
    public void setSlot(TimeSlot slot) { this.slot = slot; }

    public OffsetDateTime getAllocatedStartTime() { return this.allocatedStartTime; }
    public void setAllocatedStartTime(OffsetDateTime allocatedStartTime) { this.allocatedStartTime = allocatedStartTime; }

    public OffsetDateTime getAllocatedEndTime() { return this.allocatedEndTime; }
    public void setAllocatedEndTime(OffsetDateTime allocatedEndTime) { this.allocatedEndTime = allocatedEndTime; }

    public BigDecimal getAllocatedQuantityQuintals() { return this.allocatedQuantityQuintals; }
    public void setAllocatedQuantityQuintals(BigDecimal allocatedQuantityQuintals) { this.allocatedQuantityQuintals = allocatedQuantityQuintals; }

    public AllocationStatus getAllocationStatus() { return this.allocationStatus; }
    public void setAllocationStatus(AllocationStatus allocationStatus) { this.allocationStatus = allocationStatus; }

    public OffsetDateTime getCreatedAt() { return this.createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return this.updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long allocationId;
        private SlotBooking booking;
        private Counter counter;
        private TimeSlot slot;
        private OffsetDateTime allocatedStartTime;
        private OffsetDateTime allocatedEndTime;
        private BigDecimal allocatedQuantityQuintals;
        private AllocationStatus allocationStatus;
        private OffsetDateTime createdAt;
        private OffsetDateTime updatedAt;

        public Builder allocationId(Long allocationId) { this.allocationId = allocationId; return this; }
        public Builder booking(SlotBooking booking) { this.booking = booking; return this; }
        public Builder counter(Counter counter) { this.counter = counter; return this; }
        public Builder slot(TimeSlot slot) { this.slot = slot; return this; }
        public Builder allocatedStartTime(OffsetDateTime allocatedStartTime) { this.allocatedStartTime = allocatedStartTime; return this; }
        public Builder allocatedEndTime(OffsetDateTime allocatedEndTime) { this.allocatedEndTime = allocatedEndTime; return this; }
        public Builder allocatedQuantityQuintals(BigDecimal allocatedQuantityQuintals) { this.allocatedQuantityQuintals = allocatedQuantityQuintals; return this; }
        public Builder allocationStatus(AllocationStatus allocationStatus) { this.allocationStatus = allocationStatus; return this; }
        public Builder createdAt(OffsetDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public SlotAllocation build() {
            SlotAllocation obj = new SlotAllocation();
            obj.allocationId = this.allocationId;
            obj.booking = this.booking;
            obj.counter = this.counter;
            obj.slot = this.slot;
            obj.allocatedStartTime = this.allocatedStartTime;
            obj.allocatedEndTime = this.allocatedEndTime;
            obj.allocatedQuantityQuintals = this.allocatedQuantityQuintals;
            obj.allocationStatus = this.allocationStatus;
            obj.createdAt = this.createdAt;
            obj.updatedAt = this.updatedAt;
            return obj;
        }
    }

}
