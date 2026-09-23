package com.kisankalyan.entity;

import com.kisankalyan.entity.enums.CentreStatus;
import com.kisankalyan.entity.enums.CounterType;
import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(
    name = "counter",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_center_counter", columnNames = {"center_id", "counter_number"})
    }
)
public class Counter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "counter_id")
    private Long counterId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id", referencedColumnName = "center_id", nullable = false)
    private ProcurementCentre center;

    @Column(name = "counter_number", nullable = false)
    private Integer counterNumber;

    @Column(name = "counter_name", length = 100)
    private String counterName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operator_id", referencedColumnName = "staff_id")
    private Staff operator;

    @Column(name = "current_token", length = 30)
    private String currentToken;

    @Enumerated(EnumType.STRING)
    @Column(name = "counter_type", nullable = false, length = 30)
    private CounterType counterType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private CentreStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = OffsetDateTime.now();
        }
    }

    public Counter() {}

    public Counter(Long counterId, ProcurementCentre center, Integer counterNumber, String counterName, Staff operator, String currentToken, CounterType counterType, CentreStatus status, OffsetDateTime createdAt) {
        this.counterId = counterId;
        this.center = center;
        this.counterNumber = counterNumber;
        this.counterName = counterName;
        this.operator = operator;
        this.currentToken = currentToken;
        this.counterType = counterType;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getCounterId() { return this.counterId; }
    public void setCounterId(Long counterId) { this.counterId = counterId; }

    public ProcurementCentre getCenter() { return this.center; }
    public void setCenter(ProcurementCentre center) { this.center = center; }

    public Integer getCounterNumber() { return this.counterNumber; }
    public void setCounterNumber(Integer counterNumber) { this.counterNumber = counterNumber; }

    public String getCounterName() { return this.counterName; }
    public void setCounterName(String counterName) { this.counterName = counterName; }

    public Staff getOperator() { return this.operator; }
    public void setOperator(Staff operator) { this.operator = operator; }

    public String getCurrentToken() { return this.currentToken; }
    public void setCurrentToken(String currentToken) { this.currentToken = currentToken; }

    public CounterType getCounterType() { return this.counterType; }
    public void setCounterType(CounterType counterType) { this.counterType = counterType; }

    public CentreStatus getStatus() { return this.status; }
    public void setStatus(CentreStatus status) { this.status = status; }

    public OffsetDateTime getCreatedAt() { return this.createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long counterId;
        private ProcurementCentre center;
        private Integer counterNumber;
        private String counterName;
        private Staff operator;
        private String currentToken;
        private CounterType counterType;
        private CentreStatus status;
        private OffsetDateTime createdAt;

        public Builder counterId(Long counterId) { this.counterId = counterId; return this; }
        public Builder center(ProcurementCentre center) { this.center = center; return this; }
        public Builder counterNumber(Integer counterNumber) { this.counterNumber = counterNumber; return this; }
        public Builder counterName(String counterName) { this.counterName = counterName; return this; }
        public Builder operator(Staff operator) { this.operator = operator; return this; }
        public Builder currentToken(String currentToken) { this.currentToken = currentToken; return this; }
        public Builder counterType(CounterType counterType) { this.counterType = counterType; return this; }
        public Builder status(CentreStatus status) { this.status = status; return this; }
        public Builder createdAt(OffsetDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Counter build() {
            Counter obj = new Counter();
            obj.counterId = this.counterId;
            obj.center = this.center;
            obj.counterNumber = this.counterNumber;
            obj.counterName = this.counterName;
            obj.operator = this.operator;
            obj.currentToken = this.currentToken;
            obj.counterType = this.counterType;
            obj.status = this.status;
            obj.createdAt = this.createdAt;
            return obj;
        }
    }

}
