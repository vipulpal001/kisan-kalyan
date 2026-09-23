package com.kisankalyan.entity;

import com.kisankalyan.entity.enums.TimeSlotStatus;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;

@Entity
@Table(
    name = "time_slot",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_center_date_time", columnNames = {"center_id", "slot_date", "start_time", "end_time"})
    }
)
public class TimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "slot_id")
    private Long slotId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id", referencedColumnName = "center_id", nullable = false)
    private ProcurementCentre center;

    @Column(name = "slot_date", nullable = false)
    private LocalDate slotDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "max_bookings", nullable = false)
    private Integer maxBookings;

    @Column(name = "booked_count", nullable = false)
    private Integer bookedCount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private TimeSlotStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = OffsetDateTime.now();
        }
    }

    public TimeSlot() {}

    public TimeSlot(Long slotId, ProcurementCentre center, LocalDate slotDate, LocalTime startTime, LocalTime endTime, Integer maxBookings, Integer bookedCount, TimeSlotStatus status, OffsetDateTime createdAt) {
        this.slotId = slotId;
        this.center = center;
        this.slotDate = slotDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.maxBookings = maxBookings;
        this.bookedCount = bookedCount;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getSlotId() { return this.slotId; }
    public void setSlotId(Long slotId) { this.slotId = slotId; }

    public ProcurementCentre getCenter() { return this.center; }
    public void setCenter(ProcurementCentre center) { this.center = center; }

    public LocalDate getSlotDate() { return this.slotDate; }
    public void setSlotDate(LocalDate slotDate) { this.slotDate = slotDate; }

    public LocalTime getStartTime() { return this.startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return this.endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public Integer getMaxBookings() { return this.maxBookings; }
    public void setMaxBookings(Integer maxBookings) { this.maxBookings = maxBookings; }

    public Integer getBookedCount() { return this.bookedCount; }
    public void setBookedCount(Integer bookedCount) { this.bookedCount = bookedCount; }

    public TimeSlotStatus getStatus() { return this.status; }
    public void setStatus(TimeSlotStatus status) { this.status = status; }

    public OffsetDateTime getCreatedAt() { return this.createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long slotId;
        private ProcurementCentre center;
        private LocalDate slotDate;
        private LocalTime startTime;
        private LocalTime endTime;
        private Integer maxBookings;
        private Integer bookedCount;
        private TimeSlotStatus status;
        private OffsetDateTime createdAt;

        public Builder slotId(Long slotId) { this.slotId = slotId; return this; }
        public Builder center(ProcurementCentre center) { this.center = center; return this; }
        public Builder slotDate(LocalDate slotDate) { this.slotDate = slotDate; return this; }
        public Builder startTime(LocalTime startTime) { this.startTime = startTime; return this; }
        public Builder endTime(LocalTime endTime) { this.endTime = endTime; return this; }
        public Builder maxBookings(Integer maxBookings) { this.maxBookings = maxBookings; return this; }
        public Builder bookedCount(Integer bookedCount) { this.bookedCount = bookedCount; return this; }
        public Builder status(TimeSlotStatus status) { this.status = status; return this; }
        public Builder createdAt(OffsetDateTime createdAt) { this.createdAt = createdAt; return this; }

        public TimeSlot build() {
            TimeSlot obj = new TimeSlot();
            obj.slotId = this.slotId;
            obj.center = this.center;
            obj.slotDate = this.slotDate;
            obj.startTime = this.startTime;
            obj.endTime = this.endTime;
            obj.maxBookings = this.maxBookings;
            obj.bookedCount = this.bookedCount;
            obj.status = this.status;
            obj.createdAt = this.createdAt;
            return obj;
        }
    }

}
