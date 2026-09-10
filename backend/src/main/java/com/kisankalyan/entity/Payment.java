package com.kisankalyan.entity;

import com.kisankalyan.entity.enums.PaymentMode;
import com.kisankalyan.entity.enums.PaymentStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "payment")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long paymentId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entry_id", referencedColumnName = "entry_id", nullable = false, unique = true)
    private ProcurementEntry entry;

    @Column(name = "amount", nullable = false, precision = 14, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_mode", nullable = false, length = 30)
    private PaymentMode paymentMode;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 30)
    private PaymentStatus paymentStatus;

    @Column(name = "transaction_reference", unique = true, length = 100)
    private String transactionReference;

    @Column(name = "bank_name", length = 100)
    private String bankName;

    @Column(name = "payment_date")
    private OffsetDateTime paymentDate;

    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    public Payment() {}

    public Payment(Long paymentId, ProcurementEntry entry, BigDecimal amount, PaymentMode paymentMode, PaymentStatus paymentStatus, String transactionReference, String bankName, OffsetDateTime paymentDate, String failureReason, OffsetDateTime createdAt) {
        this.paymentId = paymentId;
        this.entry = entry;
        this.amount = amount;
        this.paymentMode = paymentMode;
        this.paymentStatus = paymentStatus;
        this.transactionReference = transactionReference;
        this.bankName = bankName;
        this.paymentDate = paymentDate;
        this.failureReason = failureReason;
        this.createdAt = createdAt;
    }

    public Long getPaymentId() { return this.paymentId; }
    public void setPaymentId(Long paymentId) { this.paymentId = paymentId; }

    public ProcurementEntry getEntry() { return this.entry; }
    public void setEntry(ProcurementEntry entry) { this.entry = entry; }

    public BigDecimal getAmount() { return this.amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public PaymentMode getPaymentMode() { return this.paymentMode; }
    public void setPaymentMode(PaymentMode paymentMode) { this.paymentMode = paymentMode; }

    public PaymentStatus getPaymentStatus() { return this.paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getTransactionReference() { return this.transactionReference; }
    public void setTransactionReference(String transactionReference) { this.transactionReference = transactionReference; }

    public String getBankName() { return this.bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }

    public OffsetDateTime getPaymentDate() { return this.paymentDate; }
    public void setPaymentDate(OffsetDateTime paymentDate) { this.paymentDate = paymentDate; }

    public String getFailureReason() { return this.failureReason; }
    public void setFailureReason(String failureReason) { this.failureReason = failureReason; }

    public OffsetDateTime getCreatedAt() { return this.createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long paymentId;
        private ProcurementEntry entry;
        private BigDecimal amount;
        private PaymentMode paymentMode;
        private PaymentStatus paymentStatus;
        private String transactionReference;
        private String bankName;
        private OffsetDateTime paymentDate;
        private String failureReason;
        private OffsetDateTime createdAt;

        public Builder paymentId(Long paymentId) { this.paymentId = paymentId; return this; }
        public Builder entry(ProcurementEntry entry) { this.entry = entry; return this; }
        public Builder amount(BigDecimal amount) { this.amount = amount; return this; }
        public Builder paymentMode(PaymentMode paymentMode) { this.paymentMode = paymentMode; return this; }
        public Builder paymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; return this; }
        public Builder transactionReference(String transactionReference) { this.transactionReference = transactionReference; return this; }
        public Builder bankName(String bankName) { this.bankName = bankName; return this; }
        public Builder paymentDate(OffsetDateTime paymentDate) { this.paymentDate = paymentDate; return this; }
        public Builder failureReason(String failureReason) { this.failureReason = failureReason; return this; }
        public Builder createdAt(OffsetDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Payment build() {
            Payment obj = new Payment();
            obj.paymentId = this.paymentId;
            obj.entry = this.entry;
            obj.amount = this.amount;
            obj.paymentMode = this.paymentMode;
            obj.paymentStatus = this.paymentStatus;
            obj.transactionReference = this.transactionReference;
            obj.bankName = this.bankName;
            obj.paymentDate = this.paymentDate;
            obj.failureReason = this.failureReason;
            obj.createdAt = this.createdAt;
            return obj;
        }
    }

}
