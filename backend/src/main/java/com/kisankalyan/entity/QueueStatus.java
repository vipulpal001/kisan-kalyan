package com.kisankalyan.entity;

import com.kisankalyan.entity.enums.QueueCurrentStatus;
import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "queue_status")
public class QueueStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "queue_status_id")
    private Long queueStatusId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", referencedColumnName = "booking_id", nullable = false, unique = true)
    private SlotBooking booking;

    @Column(name = "token_number", nullable = false, length = 30)
    private String tokenNumber;

    @Column(name = "queue_position")
    private Integer queuePosition;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_status", nullable = false, length = 30)
    private QueueCurrentStatus currentStatus;

    @Column(name = "estimated_wait_time")
    private Integer estimatedWaitTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "counter_id", referencedColumnName = "counter_id")
    private Counter counter;

    @Column(name = "called_at")
    private OffsetDateTime calledAt;

    @Column(name = "arrived_at")
    private OffsetDateTime arrivedAt;

    @Column(name = "completed_at")
    private OffsetDateTime completedAt;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    public QueueStatus() {}

    public QueueStatus(Long queueStatusId, SlotBooking booking, String tokenNumber, Integer queuePosition, QueueCurrentStatus currentStatus, Integer estimatedWaitTime, Counter counter, OffsetDateTime calledAt, OffsetDateTime arrivedAt, OffsetDateTime completedAt, OffsetDateTime createdAt) {
        this.queueStatusId = queueStatusId;
        this.booking = booking;
        this.tokenNumber = tokenNumber;
        this.queuePosition = queuePosition;
        this.currentStatus = currentStatus;
        this.estimatedWaitTime = estimatedWaitTime;
        this.counter = counter;
        this.calledAt = calledAt;
        this.arrivedAt = arrivedAt;
        this.completedAt = completedAt;
        this.createdAt = createdAt;
    }

    public Long getQueueStatusId() { return this.queueStatusId; }
    public void setQueueStatusId(Long queueStatusId) { this.queueStatusId = queueStatusId; }

    public SlotBooking getBooking() { return this.booking; }
    public void setBooking(SlotBooking booking) { this.booking = booking; }

    public String getTokenNumber() { return this.tokenNumber; }
    public void setTokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; }

    public Integer getQueuePosition() { return this.queuePosition; }
    public void setQueuePosition(Integer queuePosition) { this.queuePosition = queuePosition; }

    public QueueCurrentStatus getCurrentStatus() { return this.currentStatus; }
    public void setCurrentStatus(QueueCurrentStatus currentStatus) { this.currentStatus = currentStatus; }

    public Integer getEstimatedWaitTime() { return this.estimatedWaitTime; }
    public void setEstimatedWaitTime(Integer estimatedWaitTime) { this.estimatedWaitTime = estimatedWaitTime; }

    public Counter getCounter() { return this.counter; }
    public void setCounter(Counter counter) { this.counter = counter; }

    public OffsetDateTime getCalledAt() { return this.calledAt; }
    public void setCalledAt(OffsetDateTime calledAt) { this.calledAt = calledAt; }

    public OffsetDateTime getArrivedAt() { return this.arrivedAt; }
    public void setArrivedAt(OffsetDateTime arrivedAt) { this.arrivedAt = arrivedAt; }

    public OffsetDateTime getCompletedAt() { return this.completedAt; }
    public void setCompletedAt(OffsetDateTime completedAt) { this.completedAt = completedAt; }

    public OffsetDateTime getCreatedAt() { return this.createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long queueStatusId;
        private SlotBooking booking;
        private String tokenNumber;
        private Integer queuePosition;
        private QueueCurrentStatus currentStatus;
        private Integer estimatedWaitTime;
        private Counter counter;
        private OffsetDateTime calledAt;
        private OffsetDateTime arrivedAt;
        private OffsetDateTime completedAt;
        private OffsetDateTime createdAt;

        public Builder queueStatusId(Long queueStatusId) { this.queueStatusId = queueStatusId; return this; }
        public Builder booking(SlotBooking booking) { this.booking = booking; return this; }
        public Builder tokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; return this; }
        public Builder queuePosition(Integer queuePosition) { this.queuePosition = queuePosition; return this; }
        public Builder currentStatus(QueueCurrentStatus currentStatus) { this.currentStatus = currentStatus; return this; }
        public Builder estimatedWaitTime(Integer estimatedWaitTime) { this.estimatedWaitTime = estimatedWaitTime; return this; }
        public Builder counter(Counter counter) { this.counter = counter; return this; }
        public Builder calledAt(OffsetDateTime calledAt) { this.calledAt = calledAt; return this; }
        public Builder arrivedAt(OffsetDateTime arrivedAt) { this.arrivedAt = arrivedAt; return this; }
        public Builder completedAt(OffsetDateTime completedAt) { this.completedAt = completedAt; return this; }
        public Builder createdAt(OffsetDateTime createdAt) { this.createdAt = createdAt; return this; }

        public QueueStatus build() {
            QueueStatus obj = new QueueStatus();
            obj.queueStatusId = this.queueStatusId;
            obj.booking = this.booking;
            obj.tokenNumber = this.tokenNumber;
            obj.queuePosition = this.queuePosition;
            obj.currentStatus = this.currentStatus;
            obj.estimatedWaitTime = this.estimatedWaitTime;
            obj.counter = this.counter;
            obj.calledAt = this.calledAt;
            obj.arrivedAt = this.arrivedAt;
            obj.completedAt = this.completedAt;
            obj.createdAt = this.createdAt;
            return obj;
        }
    }

}
