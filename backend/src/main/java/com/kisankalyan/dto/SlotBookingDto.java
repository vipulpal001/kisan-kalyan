package com.kisankalyan.dto;

import com.kisankalyan.entity.enums.BookingStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.List;

public class SlotBookingDto {

    public static class AvailabilityRequest {
        private Long centerId;
        private LocalDate date;
        private BigDecimal quantity;
        private Long produceId;

        public AvailabilityRequest() {}

        public AvailabilityRequest(Long centerId, LocalDate date, BigDecimal quantity, Long produceId) {

            this.centerId = centerId;

            this.date = date;

            this.quantity = quantity;

            this.produceId = produceId;

        }

        public Long getCenterId() { return this.centerId; }

        public void setCenterId(Long centerId) { this.centerId = centerId; }

        public LocalDate getDate() { return this.date; }

        public void setDate(LocalDate date) { this.date = date; }

        public BigDecimal getQuantity() { return this.quantity; }

        public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }

        public Long getProduceId() { return this.produceId; }

        public void setProduceId(Long produceId) { this.produceId = produceId; }

        public static Builder builder() { return new Builder(); }

        public static class Builder {

            private Long centerId;

            private LocalDate date;

            private BigDecimal quantity;

            private Long produceId;

            public Builder centerId(Long centerId) { this.centerId = centerId; return this; }

            public Builder date(LocalDate date) { this.date = date; return this; }

            public Builder quantity(BigDecimal quantity) { this.quantity = quantity; return this; }

            public Builder produceId(Long produceId) { this.produceId = produceId; return this; }

            public AvailabilityRequest build() {

                AvailabilityRequest obj = new AvailabilityRequest();

                obj.centerId = this.centerId;

                obj.date = this.date;

                obj.quantity = this.quantity;

                obj.produceId = this.produceId;

                return obj;

            }

        }

    }


    public static class FreeInterval {
        private OffsetDateTime startTime;
        private OffsetDateTime endTime;
        private long durationMinutes;
        private Long counterId;
        private Integer counterNumber;
        private String counterName;

        public FreeInterval() {}

        public FreeInterval(OffsetDateTime startTime, OffsetDateTime endTime, long durationMinutes, Long counterId, Integer counterNumber, String counterName) {

            this.startTime = startTime;

            this.endTime = endTime;

            this.durationMinutes = durationMinutes;

            this.counterId = counterId;

            this.counterNumber = counterNumber;

            this.counterName = counterName;

        }

        public OffsetDateTime getStartTime() { return this.startTime; }

        public void setStartTime(OffsetDateTime startTime) { this.startTime = startTime; }

        public OffsetDateTime getEndTime() { return this.endTime; }

        public void setEndTime(OffsetDateTime endTime) { this.endTime = endTime; }

        public long getDurationMinutes() { return this.durationMinutes; }

        public void setDurationMinutes(long durationMinutes) { this.durationMinutes = durationMinutes; }

        public Long getCounterId() { return this.counterId; }

        public void setCounterId(Long counterId) { this.counterId = counterId; }

        public Integer getCounterNumber() { return this.counterNumber; }

        public void setCounterNumber(Integer counterNumber) { this.counterNumber = counterNumber; }

        public String getCounterName() { return this.counterName; }

        public void setCounterName(String counterName) { this.counterName = counterName; }

        public static Builder builder() { return new Builder(); }

        public static class Builder {

            private OffsetDateTime startTime;

            private OffsetDateTime endTime;

            private long durationMinutes;

            private Long counterId;

            private Integer counterNumber;

            private String counterName;

            public Builder startTime(OffsetDateTime startTime) { this.startTime = startTime; return this; }

            public Builder endTime(OffsetDateTime endTime) { this.endTime = endTime; return this; }

            public Builder durationMinutes(long durationMinutes) { this.durationMinutes = durationMinutes; return this; }

            public Builder counterId(Long counterId) { this.counterId = counterId; return this; }

            public Builder counterNumber(Integer counterNumber) { this.counterNumber = counterNumber; return this; }

            public Builder counterName(String counterName) { this.counterName = counterName; return this; }

            public FreeInterval build() {

                FreeInterval obj = new FreeInterval();

                obj.startTime = this.startTime;

                obj.endTime = this.endTime;

                obj.durationMinutes = this.durationMinutes;

                obj.counterId = this.counterId;

                obj.counterNumber = this.counterNumber;

                obj.counterName = this.counterName;

                return obj;

            }

        }

    }


    public static class TimeSlotAvailabilityResponse {
        private Long slotId;
        private LocalDate slotDate;
        private LocalTime startTime;
        private LocalTime endTime;
        private String timeRangeLabel;
        private int maxBookings;
        private int currentBookings;
        private boolean isAvailable;
        private List<FreeInterval> freeIntervals;
        private BigDecimal availableCapacityQuintals;
        private String message;

        public TimeSlotAvailabilityResponse() {}

        public TimeSlotAvailabilityResponse(Long slotId, LocalDate slotDate, LocalTime startTime, LocalTime endTime, String timeRangeLabel, int maxBookings, int currentBookings, boolean isAvailable, List<FreeInterval> freeIntervals, BigDecimal availableCapacityQuintals, String message) {

            this.slotId = slotId;

            this.slotDate = slotDate;

            this.startTime = startTime;

            this.endTime = endTime;

            this.timeRangeLabel = timeRangeLabel;

            this.maxBookings = maxBookings;

            this.currentBookings = currentBookings;

            this.isAvailable = isAvailable;

            this.freeIntervals = freeIntervals;

            this.availableCapacityQuintals = availableCapacityQuintals;

            this.message = message;

        }

        public Long getSlotId() { return this.slotId; }

        public void setSlotId(Long slotId) { this.slotId = slotId; }

        public LocalDate getSlotDate() { return this.slotDate; }

        public void setSlotDate(LocalDate slotDate) { this.slotDate = slotDate; }

        public LocalTime getStartTime() { return this.startTime; }

        public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

        public LocalTime getEndTime() { return this.endTime; }

        public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

        public String getTimeRangeLabel() { return this.timeRangeLabel; }

        public void setTimeRangeLabel(String timeRangeLabel) { this.timeRangeLabel = timeRangeLabel; }

        public int getMaxBookings() { return this.maxBookings; }

        public void setMaxBookings(int maxBookings) { this.maxBookings = maxBookings; }

        public int getCurrentBookings() { return this.currentBookings; }

        public void setCurrentBookings(int currentBookings) { this.currentBookings = currentBookings; }

        public boolean getIsAvailable() { return this.isAvailable; }

        public void setIsAvailable(boolean isAvailable) { this.isAvailable = isAvailable; }

        public List<FreeInterval> getFreeIntervals() { return this.freeIntervals; }

        public void setFreeIntervals(List<FreeInterval> freeIntervals) { this.freeIntervals = freeIntervals; }

        public BigDecimal getAvailableCapacityQuintals() { return this.availableCapacityQuintals; }

        public void setAvailableCapacityQuintals(BigDecimal availableCapacityQuintals) { this.availableCapacityQuintals = availableCapacityQuintals; }

        public String getMessage() { return this.message; }

        public void setMessage(String message) { this.message = message; }

        public static Builder builder() { return new Builder(); }

        public static class Builder {

            private Long slotId;

            private LocalDate slotDate;

            private LocalTime startTime;

            private LocalTime endTime;

            private String timeRangeLabel;

            private int maxBookings;

            private int currentBookings;

            private boolean isAvailable;

            private List<FreeInterval> freeIntervals;

            private BigDecimal availableCapacityQuintals;

            private String message;

            public Builder slotId(Long slotId) { this.slotId = slotId; return this; }

            public Builder slotDate(LocalDate slotDate) { this.slotDate = slotDate; return this; }

            public Builder startTime(LocalTime startTime) { this.startTime = startTime; return this; }

            public Builder endTime(LocalTime endTime) { this.endTime = endTime; return this; }

            public Builder timeRangeLabel(String timeRangeLabel) { this.timeRangeLabel = timeRangeLabel; return this; }

            public Builder maxBookings(int maxBookings) { this.maxBookings = maxBookings; return this; }

            public Builder currentBookings(int currentBookings) { this.currentBookings = currentBookings; return this; }

            public Builder isAvailable(boolean isAvailable) { this.isAvailable = isAvailable; return this; }

            public Builder freeIntervals(List<FreeInterval> freeIntervals) { this.freeIntervals = freeIntervals; return this; }

            public Builder availableCapacityQuintals(BigDecimal availableCapacityQuintals) { this.availableCapacityQuintals = availableCapacityQuintals; return this; }

            public Builder message(String message) { this.message = message; return this; }

            public TimeSlotAvailabilityResponse build() {

                TimeSlotAvailabilityResponse obj = new TimeSlotAvailabilityResponse();

                obj.slotId = this.slotId;

                obj.slotDate = this.slotDate;

                obj.startTime = this.startTime;

                obj.endTime = this.endTime;

                obj.timeRangeLabel = this.timeRangeLabel;

                obj.maxBookings = this.maxBookings;

                obj.currentBookings = this.currentBookings;

                obj.isAvailable = this.isAvailable;

                obj.freeIntervals = this.freeIntervals;

                obj.availableCapacityQuintals = this.availableCapacityQuintals;

                obj.message = this.message;

                return obj;

            }

        }

    }


    public static class CreateBookingRequest {
        private Long centerId;
        private Long produceId;
        private Long slotId;
        private BigDecimal estimatedQuantity;

        public CreateBookingRequest() {}

        public CreateBookingRequest(Long centerId, Long produceId, Long slotId, BigDecimal estimatedQuantity) {

            this.centerId = centerId;

            this.produceId = produceId;

            this.slotId = slotId;

            this.estimatedQuantity = estimatedQuantity;

        }

        public Long getCenterId() { return this.centerId; }

        public void setCenterId(Long centerId) { this.centerId = centerId; }

        public Long getProduceId() { return this.produceId; }

        public void setProduceId(Long produceId) { this.produceId = produceId; }

        public Long getSlotId() { return this.slotId; }

        public void setSlotId(Long slotId) { this.slotId = slotId; }

        public BigDecimal getEstimatedQuantity() { return this.estimatedQuantity; }

        public void setEstimatedQuantity(BigDecimal estimatedQuantity) { this.estimatedQuantity = estimatedQuantity; }

        public static Builder builder() { return new Builder(); }

        public static class Builder {

            private Long centerId;

            private Long produceId;

            private Long slotId;

            private BigDecimal estimatedQuantity;

            public Builder centerId(Long centerId) { this.centerId = centerId; return this; }

            public Builder produceId(Long produceId) { this.produceId = produceId; return this; }

            public Builder slotId(Long slotId) { this.slotId = slotId; return this; }

            public Builder estimatedQuantity(BigDecimal estimatedQuantity) { this.estimatedQuantity = estimatedQuantity; return this; }

            public CreateBookingRequest build() {

                CreateBookingRequest obj = new CreateBookingRequest();

                obj.centerId = this.centerId;

                obj.produceId = this.produceId;

                obj.slotId = this.slotId;

                obj.estimatedQuantity = this.estimatedQuantity;

                return obj;

            }

        }

    }


    public static class BookingResponse {
        private Long bookingId;
        private String bookingReference;
        private String tokenNumber;
        private BookingStatus bookingStatus;
        private Long farmerId;
        private String farmerName;
        private Long centerId;
        private String centerName;
        private String centerLocation;
        private Long produceId;
        private String produceName;
        private BigDecimal mspRate;
        private BigDecimal estimatedQuantity;
        private BigDecimal estimatedTotalValue;
        private LocalDate slotDate;
        private LocalTime slotStartTime;
        private LocalTime slotEndTime;
        private OffsetDateTime allocatedStartTime;
        private OffsetDateTime allocatedEndTime;
        private Long counterId;
        private Integer counterNumber;
        private String counterName;
        private String qrCodeToken;
        private OffsetDateTime qrVerifiedAt;
        private OffsetDateTime verificationDeadline;
        private OffsetDateTime bookedAt;
        private String message;

        public BookingResponse() {}

        public BookingResponse(Long bookingId, String bookingReference, String tokenNumber, BookingStatus bookingStatus, Long farmerId, String farmerName, Long centerId, String centerName, String centerLocation, Long produceId, String produceName, BigDecimal mspRate, BigDecimal estimatedQuantity, BigDecimal estimatedTotalValue, LocalDate slotDate, LocalTime slotStartTime, LocalTime slotEndTime, OffsetDateTime allocatedStartTime, OffsetDateTime allocatedEndTime, Long counterId, Integer counterNumber, String counterName, String qrCodeToken, OffsetDateTime qrVerifiedAt, OffsetDateTime verificationDeadline, OffsetDateTime bookedAt, String message) {

            this.bookingId = bookingId;

            this.bookingReference = bookingReference;

            this.tokenNumber = tokenNumber;

            this.bookingStatus = bookingStatus;

            this.farmerId = farmerId;

            this.farmerName = farmerName;

            this.centerId = centerId;

            this.centerName = centerName;

            this.centerLocation = centerLocation;

            this.produceId = produceId;

            this.produceName = produceName;

            this.mspRate = mspRate;

            this.estimatedQuantity = estimatedQuantity;

            this.estimatedTotalValue = estimatedTotalValue;

            this.slotDate = slotDate;

            this.slotStartTime = slotStartTime;

            this.slotEndTime = slotEndTime;

            this.allocatedStartTime = allocatedStartTime;

            this.allocatedEndTime = allocatedEndTime;

            this.counterId = counterId;

            this.counterNumber = counterNumber;

            this.counterName = counterName;

            this.qrCodeToken = qrCodeToken;

            this.qrVerifiedAt = qrVerifiedAt;

            this.verificationDeadline = verificationDeadline;

            this.bookedAt = bookedAt;

            this.message = message;

        }

        public Long getBookingId() { return this.bookingId; }

        public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

        public String getBookingReference() { return this.bookingReference; }

        public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }

        public String getTokenNumber() { return this.tokenNumber; }

        public void setTokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; }

        public BookingStatus getBookingStatus() { return this.bookingStatus; }

        public void setBookingStatus(BookingStatus bookingStatus) { this.bookingStatus = bookingStatus; }

        public Long getFarmerId() { return this.farmerId; }

        public void setFarmerId(Long farmerId) { this.farmerId = farmerId; }

        public String getFarmerName() { return this.farmerName; }

        public void setFarmerName(String farmerName) { this.farmerName = farmerName; }

        public Long getCenterId() { return this.centerId; }

        public void setCenterId(Long centerId) { this.centerId = centerId; }

        public String getCenterName() { return this.centerName; }

        public void setCenterName(String centerName) { this.centerName = centerName; }

        public String getCenterLocation() { return this.centerLocation; }

        public void setCenterLocation(String centerLocation) { this.centerLocation = centerLocation; }

        public Long getProduceId() { return this.produceId; }

        public void setProduceId(Long produceId) { this.produceId = produceId; }

        public String getProduceName() { return this.produceName; }

        public void setProduceName(String produceName) { this.produceName = produceName; }

        public BigDecimal getMspRate() { return this.mspRate; }

        public void setMspRate(BigDecimal mspRate) { this.mspRate = mspRate; }

        public BigDecimal getEstimatedQuantity() { return this.estimatedQuantity; }

        public void setEstimatedQuantity(BigDecimal estimatedQuantity) { this.estimatedQuantity = estimatedQuantity; }

        public BigDecimal getEstimatedTotalValue() { return this.estimatedTotalValue; }

        public void setEstimatedTotalValue(BigDecimal estimatedTotalValue) { this.estimatedTotalValue = estimatedTotalValue; }

        public LocalDate getSlotDate() { return this.slotDate; }

        public void setSlotDate(LocalDate slotDate) { this.slotDate = slotDate; }

        public LocalTime getSlotStartTime() { return this.slotStartTime; }

        public void setSlotStartTime(LocalTime slotStartTime) { this.slotStartTime = slotStartTime; }

        public LocalTime getSlotEndTime() { return this.slotEndTime; }

        public void setSlotEndTime(LocalTime slotEndTime) { this.slotEndTime = slotEndTime; }

        public OffsetDateTime getAllocatedStartTime() { return this.allocatedStartTime; }

        public void setAllocatedStartTime(OffsetDateTime allocatedStartTime) { this.allocatedStartTime = allocatedStartTime; }

        public OffsetDateTime getAllocatedEndTime() { return this.allocatedEndTime; }

        public void setAllocatedEndTime(OffsetDateTime allocatedEndTime) { this.allocatedEndTime = allocatedEndTime; }

        public Long getCounterId() { return this.counterId; }

        public void setCounterId(Long counterId) { this.counterId = counterId; }

        public Integer getCounterNumber() { return this.counterNumber; }

        public void setCounterNumber(Integer counterNumber) { this.counterNumber = counterNumber; }

        public String getCounterName() { return this.counterName; }

        public void setCounterName(String counterName) { this.counterName = counterName; }

        public String getQrCodeToken() { return this.qrCodeToken; }

        public void setQrCodeToken(String qrCodeToken) { this.qrCodeToken = qrCodeToken; }

        public OffsetDateTime getQrVerifiedAt() { return this.qrVerifiedAt; }

        public void setQrVerifiedAt(OffsetDateTime qrVerifiedAt) { this.qrVerifiedAt = qrVerifiedAt; }

        public OffsetDateTime getVerificationDeadline() { return this.verificationDeadline; }

        public void setVerificationDeadline(OffsetDateTime verificationDeadline) { this.verificationDeadline = verificationDeadline; }

        public OffsetDateTime getBookedAt() { return this.bookedAt; }

        public void setBookedAt(OffsetDateTime bookedAt) { this.bookedAt = bookedAt; }

        public String getMessage() { return this.message; }

        public void setMessage(String message) { this.message = message; }

        public static Builder builder() { return new Builder(); }

        public static class Builder {

            private Long bookingId;

            private String bookingReference;

            private String tokenNumber;

            private BookingStatus bookingStatus;

            private Long farmerId;

            private String farmerName;

            private Long centerId;

            private String centerName;

            private String centerLocation;

            private Long produceId;

            private String produceName;

            private BigDecimal mspRate;

            private BigDecimal estimatedQuantity;

            private BigDecimal estimatedTotalValue;

            private LocalDate slotDate;

            private LocalTime slotStartTime;

            private LocalTime slotEndTime;

            private OffsetDateTime allocatedStartTime;

            private OffsetDateTime allocatedEndTime;

            private Long counterId;

            private Integer counterNumber;

            private String counterName;

            private String qrCodeToken;

            private OffsetDateTime qrVerifiedAt;

            private OffsetDateTime verificationDeadline;

            private OffsetDateTime bookedAt;

            private String message;

            public Builder bookingId(Long bookingId) { this.bookingId = bookingId; return this; }

            public Builder bookingReference(String bookingReference) { this.bookingReference = bookingReference; return this; }

            public Builder tokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; return this; }

            public Builder bookingStatus(BookingStatus bookingStatus) { this.bookingStatus = bookingStatus; return this; }

            public Builder farmerId(Long farmerId) { this.farmerId = farmerId; return this; }

            public Builder farmerName(String farmerName) { this.farmerName = farmerName; return this; }

            public Builder centerId(Long centerId) { this.centerId = centerId; return this; }

            public Builder centerName(String centerName) { this.centerName = centerName; return this; }

            public Builder centerLocation(String centerLocation) { this.centerLocation = centerLocation; return this; }

            public Builder produceId(Long produceId) { this.produceId = produceId; return this; }

            public Builder produceName(String produceName) { this.produceName = produceName; return this; }

            public Builder mspRate(BigDecimal mspRate) { this.mspRate = mspRate; return this; }

            public Builder estimatedQuantity(BigDecimal estimatedQuantity) { this.estimatedQuantity = estimatedQuantity; return this; }

            public Builder estimatedTotalValue(BigDecimal estimatedTotalValue) { this.estimatedTotalValue = estimatedTotalValue; return this; }

            public Builder slotDate(LocalDate slotDate) { this.slotDate = slotDate; return this; }

            public Builder slotStartTime(LocalTime slotStartTime) { this.slotStartTime = slotStartTime; return this; }

            public Builder slotEndTime(LocalTime slotEndTime) { this.slotEndTime = slotEndTime; return this; }

            public Builder allocatedStartTime(OffsetDateTime allocatedStartTime) { this.allocatedStartTime = allocatedStartTime; return this; }

            public Builder allocatedEndTime(OffsetDateTime allocatedEndTime) { this.allocatedEndTime = allocatedEndTime; return this; }

            public Builder counterId(Long counterId) { this.counterId = counterId; return this; }

            public Builder counterNumber(Integer counterNumber) { this.counterNumber = counterNumber; return this; }

            public Builder counterName(String counterName) { this.counterName = counterName; return this; }

            public Builder qrCodeToken(String qrCodeToken) { this.qrCodeToken = qrCodeToken; return this; }

            public Builder qrVerifiedAt(OffsetDateTime qrVerifiedAt) { this.qrVerifiedAt = qrVerifiedAt; return this; }

            public Builder verificationDeadline(OffsetDateTime verificationDeadline) { this.verificationDeadline = verificationDeadline; return this; }

            public Builder bookedAt(OffsetDateTime bookedAt) { this.bookedAt = bookedAt; return this; }

            public Builder message(String message) { this.message = message; return this; }

            public BookingResponse build() {

                BookingResponse obj = new BookingResponse();

                obj.bookingId = this.bookingId;

                obj.bookingReference = this.bookingReference;

                obj.tokenNumber = this.tokenNumber;

                obj.bookingStatus = this.bookingStatus;

                obj.farmerId = this.farmerId;

                obj.farmerName = this.farmerName;

                obj.centerId = this.centerId;

                obj.centerName = this.centerName;

                obj.centerLocation = this.centerLocation;

                obj.produceId = this.produceId;

                obj.produceName = this.produceName;

                obj.mspRate = this.mspRate;

                obj.estimatedQuantity = this.estimatedQuantity;

                obj.estimatedTotalValue = this.estimatedTotalValue;

                obj.slotDate = this.slotDate;

                obj.slotStartTime = this.slotStartTime;

                obj.slotEndTime = this.slotEndTime;

                obj.allocatedStartTime = this.allocatedStartTime;

                obj.allocatedEndTime = this.allocatedEndTime;

                obj.counterId = this.counterId;

                obj.counterNumber = this.counterNumber;

                obj.counterName = this.counterName;

                obj.qrCodeToken = this.qrCodeToken;

                obj.qrVerifiedAt = this.qrVerifiedAt;

                obj.verificationDeadline = this.verificationDeadline;

                obj.bookedAt = this.bookedAt;

                obj.message = this.message;

                return obj;

            }

        }

    }


    public static class CancelBookingRequest {
        private String reason;

        public CancelBookingRequest() {}

        public CancelBookingRequest(String reason) {

            this.reason = reason;

        }

        public String getReason() { return this.reason; }

        public void setReason(String reason) { this.reason = reason; }

        public static Builder builder() { return new Builder(); }

        public static class Builder {

            private String reason;

            public Builder reason(String reason) { this.reason = reason; return this; }

            public CancelBookingRequest build() {

                CancelBookingRequest obj = new CancelBookingRequest();

                obj.reason = this.reason;

                return obj;

            }

        }

    }


    public static class QrVerificationRequest {
        private String qrToken;

        public QrVerificationRequest() {}

        public QrVerificationRequest(String qrToken) {

            this.qrToken = qrToken;

        }

        public String getQrToken() { return this.qrToken; }

        public void setQrToken(String qrToken) { this.qrToken = qrToken; }

        public static Builder builder() { return new Builder(); }

        public static class Builder {

            private String qrToken;

            public Builder qrToken(String qrToken) { this.qrToken = qrToken; return this; }

            public QrVerificationRequest build() {

                QrVerificationRequest obj = new QrVerificationRequest();

                obj.qrToken = this.qrToken;

                return obj;

            }

        }

    }

}