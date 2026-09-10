package com.kisankalyan.entity;

import com.kisankalyan.entity.enums.NotificationType;
import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "notification")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long notificationId;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private AppUser user;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", referencedColumnName = "booking_id")
    private SlotBooking booking;

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(name = "notification_type", nullable = false, length = 40)
    private NotificationType notificationType;

    @Column(name = "is_read", nullable = false)
    private Boolean isRead;

    @Column(name = "sent_at", nullable = false, insertable = false, updatable = false)
    private OffsetDateTime sentAt;

    public Notification() {}

    public Notification(Long notificationId, AppUser user, SlotBooking booking, String message, NotificationType notificationType, Boolean isRead, OffsetDateTime sentAt) {
        this.notificationId = notificationId;
        this.user = user;
        this.booking = booking;
        this.message = message;
        this.notificationType = notificationType;
        this.isRead = isRead;
        this.sentAt = sentAt;
    }

    public Long getNotificationId() { return this.notificationId; }
    public void setNotificationId(Long notificationId) { this.notificationId = notificationId; }

    public AppUser getUser() { return this.user; }
    public void setUser(AppUser user) { this.user = user; }

    public SlotBooking getBooking() { return this.booking; }
    public void setBooking(SlotBooking booking) { this.booking = booking; }

    public String getMessage() { return this.message; }
    public void setMessage(String message) { this.message = message; }

    public NotificationType getNotificationType() { return this.notificationType; }
    public void setNotificationType(NotificationType notificationType) { this.notificationType = notificationType; }

    public Boolean getIsRead() { return this.isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }

    public OffsetDateTime getSentAt() { return this.sentAt; }
    public void setSentAt(OffsetDateTime sentAt) { this.sentAt = sentAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long notificationId;
        private AppUser user;
        private SlotBooking booking;
        private String message;
        private NotificationType notificationType;
        private Boolean isRead;
        private OffsetDateTime sentAt;

        public Builder notificationId(Long notificationId) { this.notificationId = notificationId; return this; }
        public Builder user(AppUser user) { this.user = user; return this; }
        public Builder booking(SlotBooking booking) { this.booking = booking; return this; }
        public Builder message(String message) { this.message = message; return this; }
        public Builder notificationType(NotificationType notificationType) { this.notificationType = notificationType; return this; }
        public Builder isRead(Boolean isRead) { this.isRead = isRead; return this; }
        public Builder sentAt(OffsetDateTime sentAt) { this.sentAt = sentAt; return this; }

        public Notification build() {
            Notification obj = new Notification();
            obj.notificationId = this.notificationId;
            obj.user = this.user;
            obj.booking = this.booking;
            obj.message = this.message;
            obj.notificationType = this.notificationType;
            obj.isRead = this.isRead;
            obj.sentAt = this.sentAt;
            return obj;
        }
    }

}
