package com.kisankalyan.entity;

import com.kisankalyan.entity.enums.BookingStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "slot_booking")
public class SlotBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long bookingId;

    @Column(name = "booking_reference", nullable = false, unique = true, length = 30)
    private String bookingReference;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", referencedColumnName = "farmer_id", nullable = false)
    private Farmer farmer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id", referencedColumnName = "center_id", nullable = false)
    private ProcurementCentre center;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produce_id", referencedColumnName = "produce_id", nullable = false)
    private AgriculturalProduce produce;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_id", referencedColumnName = "slot_id", nullable = false)
    private TimeSlot slot;

    @Column(name = "estimated_quantity", nullable = false, precision = 10, scale = 2)
    private BigDecimal estimatedQuantity;

    @Column(name = "token_number", unique = true, length = 30)
    private String tokenNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "booking_status", nullable = false, length = 30)
    private BookingStatus bookingStatus;

    @Column(name = "booked_at", nullable = false, updatable = false)
    private OffsetDateTime bookedAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (this.bookedAt == null) {
            this.bookedAt = OffsetDateTime.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = OffsetDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    @Column(name = "qr_verified_at")
    private OffsetDateTime qrVerifiedAt;

    @Column(name = "verification_deadline")
    private OffsetDateTime verificationDeadline;

    @Column(name = "no_show_at")
    private OffsetDateTime noShowAt;

    @Column(name = "cancel_reason", columnDefinition = "TEXT")
    private String cancelReason;

    public SlotBooking() {}

    public SlotBooking(Long bookingId, String bookingReference, Farmer farmer, ProcurementCentre center, AgriculturalProduce produce, TimeSlot slot, BigDecimal estimatedQuantity, String tokenNumber, BookingStatus bookingStatus, OffsetDateTime bookedAt, OffsetDateTime updatedAt, OffsetDateTime qrVerifiedAt, OffsetDateTime verificationDeadline, OffsetDateTime noShowAt, String cancelReason) {
        this.bookingId = bookingId;
        this.bookingReference = bookingReference;
        this.farmer = farmer;
        this.center = center;
        this.produce = produce;
        this.slot = slot;
        this.estimatedQuantity = estimatedQuantity;
        this.tokenNumber = tokenNumber;
        this.bookingStatus = bookingStatus;
        this.bookedAt = bookedAt;
        this.updatedAt = updatedAt;
        this.qrVerifiedAt = qrVerifiedAt;
        this.verificationDeadline = verificationDeadline;
        this.noShowAt = noShowAt;
        this.cancelReason = cancelReason;
    }

    public Long getBookingId() { return this.bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public String getBookingReference() { return this.bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }

    public Farmer getFarmer() { return this.farmer; }
    public void setFarmer(Farmer farmer) { this.farmer = farmer; }

    public ProcurementCentre getCenter() { return this.center; }
    public void setCenter(ProcurementCentre center) { this.center = center; }

    public AgriculturalProduce getProduce() { return this.produce; }
    public void setProduce(AgriculturalProduce produce) { this.produce = produce; }

    public TimeSlot getSlot() { return this.slot; }
    public void setSlot(TimeSlot slot) { this.slot = slot; }

    public BigDecimal getEstimatedQuantity() { return this.estimatedQuantity; }
    public void setEstimatedQuantity(BigDecimal estimatedQuantity) { this.estimatedQuantity = estimatedQuantity; }

    public String getTokenNumber() { return this.tokenNumber; }
    public void setTokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; }

    public BookingStatus getBookingStatus() { return this.bookingStatus; }
    public void setBookingStatus(BookingStatus bookingStatus) { this.bookingStatus = bookingStatus; }

    public OffsetDateTime getBookedAt() { return this.bookedAt; }
    public void setBookedAt(OffsetDateTime bookedAt) { this.bookedAt = bookedAt; }

    public OffsetDateTime getUpdatedAt() { return this.updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }

    public OffsetDateTime getQrVerifiedAt() { return this.qrVerifiedAt; }
    public void setQrVerifiedAt(OffsetDateTime qrVerifiedAt) { this.qrVerifiedAt = qrVerifiedAt; }

    public OffsetDateTime getVerificationDeadline() { return this.verificationDeadline; }
    public void setVerificationDeadline(OffsetDateTime verificationDeadline) { this.verificationDeadline = verificationDeadline; }

    public OffsetDateTime getNoShowAt() { return this.noShowAt; }
    public void setNoShowAt(OffsetDateTime noShowAt) { this.noShowAt = noShowAt; }

    public String getCancelReason() { return this.cancelReason; }
    public void setCancelReason(String cancelReason) { this.cancelReason = cancelReason; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long bookingId;
        private String bookingReference;
        private Farmer farmer;
        private ProcurementCentre center;
        private AgriculturalProduce produce;
        private TimeSlot slot;
        private BigDecimal estimatedQuantity;
        private String tokenNumber;
        private BookingStatus bookingStatus;
        private OffsetDateTime bookedAt;
        private OffsetDateTime updatedAt;
        private OffsetDateTime qrVerifiedAt;
        private OffsetDateTime verificationDeadline;
        private OffsetDateTime noShowAt;
        private String cancelReason;

        public Builder bookingId(Long bookingId) { this.bookingId = bookingId; return this; }
        public Builder bookingReference(String bookingReference) { this.bookingReference = bookingReference; return this; }
        public Builder farmer(Farmer farmer) { this.farmer = farmer; return this; }
        public Builder center(ProcurementCentre center) { this.center = center; return this; }
        public Builder produce(AgriculturalProduce produce) { this.produce = produce; return this; }
        public Builder slot(TimeSlot slot) { this.slot = slot; return this; }
        public Builder estimatedQuantity(BigDecimal estimatedQuantity) { this.estimatedQuantity = estimatedQuantity; return this; }
        public Builder tokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; return this; }
        public Builder bookingStatus(BookingStatus bookingStatus) { this.bookingStatus = bookingStatus; return this; }
        public Builder bookedAt(OffsetDateTime bookedAt) { this.bookedAt = bookedAt; return this; }
        public Builder updatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public Builder qrVerifiedAt(OffsetDateTime qrVerifiedAt) { this.qrVerifiedAt = qrVerifiedAt; return this; }
        public Builder verificationDeadline(OffsetDateTime verificationDeadline) { this.verificationDeadline = verificationDeadline; return this; }
        public Builder noShowAt(OffsetDateTime noShowAt) { this.noShowAt = noShowAt; return this; }
        public Builder cancelReason(String cancelReason) { this.cancelReason = cancelReason; return this; }

        public SlotBooking build() {
            SlotBooking obj = new SlotBooking();
            obj.bookingId = this.bookingId;
            obj.bookingReference = this.bookingReference;
            obj.farmer = this.farmer;
            obj.center = this.center;
            obj.produce = this.produce;
            obj.slot = this.slot;
            obj.estimatedQuantity = this.estimatedQuantity;
            obj.tokenNumber = this.tokenNumber;
            obj.bookingStatus = this.bookingStatus;
            obj.bookedAt = this.bookedAt;
            obj.updatedAt = this.updatedAt;
            obj.qrVerifiedAt = this.qrVerifiedAt;
            obj.verificationDeadline = this.verificationDeadline;
            obj.noShowAt = this.noShowAt;
            obj.cancelReason = this.cancelReason;
            return obj;
        }
    }

}
