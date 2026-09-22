package com.kisankalyan.dto;

import com.kisankalyan.entity.enums.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

public class MandiProcessDto {

    public static class QueueStatusResponse {
        private Long queueStatusId;
        private Long bookingId;
        private String bookingReference;
        private String tokenNumber;
        private Integer queuePosition;
        private QueueCurrentStatus currentStatus;
        private Integer estimatedWaitTime;
        private Long counterId;
        private Integer counterNumber;
        private String counterName;
        private String farmerName;
        private String produceName;
        private BigDecimal quantity;
        private OffsetDateTime calledAt;
        private OffsetDateTime arrivedAt;
        private OffsetDateTime completedAt;

        public QueueStatusResponse() {}

        public QueueStatusResponse(Long queueStatusId, Long bookingId, String bookingReference, String tokenNumber, Integer queuePosition, QueueCurrentStatus currentStatus, Integer estimatedWaitTime, Long counterId, Integer counterNumber, String counterName, String farmerName, String produceName, BigDecimal quantity, OffsetDateTime calledAt, OffsetDateTime arrivedAt, OffsetDateTime completedAt) {

            this.queueStatusId = queueStatusId;

            this.bookingId = bookingId;

            this.bookingReference = bookingReference;

            this.tokenNumber = tokenNumber;

            this.queuePosition = queuePosition;

            this.currentStatus = currentStatus;

            this.estimatedWaitTime = estimatedWaitTime;

            this.counterId = counterId;

            this.counterNumber = counterNumber;

            this.counterName = counterName;

            this.farmerName = farmerName;

            this.produceName = produceName;

            this.quantity = quantity;

            this.calledAt = calledAt;

            this.arrivedAt = arrivedAt;

            this.completedAt = completedAt;

        }

        public Long getQueueStatusId() { return this.queueStatusId; }

        public void setQueueStatusId(Long queueStatusId) { this.queueStatusId = queueStatusId; }

        public Long getBookingId() { return this.bookingId; }

        public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

        public String getBookingReference() { return this.bookingReference; }

        public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }

        public String getTokenNumber() { return this.tokenNumber; }

        public void setTokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; }

        public Integer getQueuePosition() { return this.queuePosition; }

        public void setQueuePosition(Integer queuePosition) { this.queuePosition = queuePosition; }

        public QueueCurrentStatus getCurrentStatus() { return this.currentStatus; }

        public void setCurrentStatus(QueueCurrentStatus currentStatus) { this.currentStatus = currentStatus; }

        public Integer getEstimatedWaitTime() { return this.estimatedWaitTime; }

        public void setEstimatedWaitTime(Integer estimatedWaitTime) { this.estimatedWaitTime = estimatedWaitTime; }

        public Long getCounterId() { return this.counterId; }

        public void setCounterId(Long counterId) { this.counterId = counterId; }

        public Integer getCounterNumber() { return this.counterNumber; }

        public void setCounterNumber(Integer counterNumber) { this.counterNumber = counterNumber; }

        public String getCounterName() { return this.counterName; }

        public void setCounterName(String counterName) { this.counterName = counterName; }

        public String getFarmerName() { return this.farmerName; }

        public void setFarmerName(String farmerName) { this.farmerName = farmerName; }

        public String getProduceName() { return this.produceName; }

        public void setProduceName(String produceName) { this.produceName = produceName; }

        public BigDecimal getQuantity() { return this.quantity; }

        public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }

        public OffsetDateTime getCalledAt() { return this.calledAt; }

        public void setCalledAt(OffsetDateTime calledAt) { this.calledAt = calledAt; }

        public OffsetDateTime getArrivedAt() { return this.arrivedAt; }

        public void setArrivedAt(OffsetDateTime arrivedAt) { this.arrivedAt = arrivedAt; }

        public OffsetDateTime getCompletedAt() { return this.completedAt; }

        public void setCompletedAt(OffsetDateTime completedAt) { this.completedAt = completedAt; }

        public static Builder builder() { return new Builder(); }

        public static class Builder {

            private Long queueStatusId;

            private Long bookingId;

            private String bookingReference;

            private String tokenNumber;

            private Integer queuePosition;

            private QueueCurrentStatus currentStatus;

            private Integer estimatedWaitTime;

            private Long counterId;

            private Integer counterNumber;

            private String counterName;

            private String farmerName;

            private String produceName;

            private BigDecimal quantity;

            private OffsetDateTime calledAt;

            private OffsetDateTime arrivedAt;

            private OffsetDateTime completedAt;

            public Builder queueStatusId(Long queueStatusId) { this.queueStatusId = queueStatusId; return this; }

            public Builder bookingId(Long bookingId) { this.bookingId = bookingId; return this; }

            public Builder bookingReference(String bookingReference) { this.bookingReference = bookingReference; return this; }

            public Builder tokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; return this; }

            public Builder queuePosition(Integer queuePosition) { this.queuePosition = queuePosition; return this; }

            public Builder currentStatus(QueueCurrentStatus currentStatus) { this.currentStatus = currentStatus; return this; }

            public Builder estimatedWaitTime(Integer estimatedWaitTime) { this.estimatedWaitTime = estimatedWaitTime; return this; }

            public Builder counterId(Long counterId) { this.counterId = counterId; return this; }

            public Builder counterNumber(Integer counterNumber) { this.counterNumber = counterNumber; return this; }

            public Builder counterName(String counterName) { this.counterName = counterName; return this; }

            public Builder farmerName(String farmerName) { this.farmerName = farmerName; return this; }

            public Builder produceName(String produceName) { this.produceName = produceName; return this; }

            public Builder quantity(BigDecimal quantity) { this.quantity = quantity; return this; }

            public Builder calledAt(OffsetDateTime calledAt) { this.calledAt = calledAt; return this; }

            public Builder arrivedAt(OffsetDateTime arrivedAt) { this.arrivedAt = arrivedAt; return this; }

            public Builder completedAt(OffsetDateTime completedAt) { this.completedAt = completedAt; return this; }

            public QueueStatusResponse build() {

                QueueStatusResponse obj = new QueueStatusResponse();

                obj.queueStatusId = this.queueStatusId;

                obj.bookingId = this.bookingId;

                obj.bookingReference = this.bookingReference;

                obj.tokenNumber = this.tokenNumber;

                obj.queuePosition = this.queuePosition;

                obj.currentStatus = this.currentStatus;

                obj.estimatedWaitTime = this.estimatedWaitTime;

                obj.counterId = this.counterId;

                obj.counterNumber = this.counterNumber;

                obj.counterName = this.counterName;

                obj.farmerName = this.farmerName;

                obj.produceName = this.produceName;

                obj.quantity = this.quantity;

                obj.calledAt = this.calledAt;

                obj.arrivedAt = this.arrivedAt;

                obj.completedAt = this.completedAt;

                return obj;

            }

        }

    }


    public static class QualityCheckRequest {
        private Long bookingId;
        private BigDecimal moisturePercentage;
        private BigDecimal foreignMatterPercentage;
        private String qualityGrade;
        private QciStatus qciStatus;

        public QualityCheckRequest() {}

        public QualityCheckRequest(Long bookingId, BigDecimal moisturePercentage, BigDecimal foreignMatterPercentage, String qualityGrade, QciStatus qciStatus) {

            this.bookingId = bookingId;

            this.moisturePercentage = moisturePercentage;

            this.foreignMatterPercentage = foreignMatterPercentage;

            this.qualityGrade = qualityGrade;

            this.qciStatus = qciStatus;

        }

        public Long getBookingId() { return this.bookingId; }

        public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

        public BigDecimal getMoisturePercentage() { return this.moisturePercentage; }

        public void setMoisturePercentage(BigDecimal moisturePercentage) { this.moisturePercentage = moisturePercentage; }

        public BigDecimal getForeignMatterPercentage() { return this.foreignMatterPercentage; }

        public void setForeignMatterPercentage(BigDecimal foreignMatterPercentage) { this.foreignMatterPercentage = foreignMatterPercentage; }

        public String getQualityGrade() { return this.qualityGrade; }

        public void setQualityGrade(String qualityGrade) { this.qualityGrade = qualityGrade; }

        public QciStatus getQciStatus() { return this.qciStatus; }

        public void setQciStatus(QciStatus qciStatus) { this.qciStatus = qciStatus; }

        public static Builder builder() { return new Builder(); }

        public static class Builder {

            private Long bookingId;

            private BigDecimal moisturePercentage;

            private BigDecimal foreignMatterPercentage;

            private String qualityGrade;

            private QciStatus qciStatus;

            public Builder bookingId(Long bookingId) { this.bookingId = bookingId; return this; }

            public Builder moisturePercentage(BigDecimal moisturePercentage) { this.moisturePercentage = moisturePercentage; return this; }

            public Builder foreignMatterPercentage(BigDecimal foreignMatterPercentage) { this.foreignMatterPercentage = foreignMatterPercentage; return this; }

            public Builder qualityGrade(String qualityGrade) { this.qualityGrade = qualityGrade; return this; }

            public Builder qciStatus(QciStatus qciStatus) { this.qciStatus = qciStatus; return this; }

            public QualityCheckRequest build() {

                QualityCheckRequest obj = new QualityCheckRequest();

                obj.bookingId = this.bookingId;

                obj.moisturePercentage = this.moisturePercentage;

                obj.foreignMatterPercentage = this.foreignMatterPercentage;

                obj.qualityGrade = this.qualityGrade;

                obj.qciStatus = this.qciStatus;

                return obj;

            }

        }

    }


    public static class WeighbridgeRequest {
        private Long bookingId;
        private BigDecimal grossWeightKg;
        private BigDecimal tareWeightKg;

        public WeighbridgeRequest() {}

        public WeighbridgeRequest(Long bookingId, BigDecimal grossWeightKg, BigDecimal tareWeightKg) {

            this.bookingId = bookingId;

            this.grossWeightKg = grossWeightKg;

            this.tareWeightKg = tareWeightKg;

        }

        public Long getBookingId() { return this.bookingId; }

        public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

        public BigDecimal getGrossWeightKg() { return this.grossWeightKg; }

        public void setGrossWeightKg(BigDecimal grossWeightKg) { this.grossWeightKg = grossWeightKg; }

        public BigDecimal getTareWeightKg() { return this.tareWeightKg; }

        public void setTareWeightKg(BigDecimal tareWeightKg) { this.tareWeightKg = tareWeightKg; }

        public static Builder builder() { return new Builder(); }

        public static class Builder {

            private Long bookingId;

            private BigDecimal grossWeightKg;

            private BigDecimal tareWeightKg;

            public Builder bookingId(Long bookingId) { this.bookingId = bookingId; return this; }

            public Builder grossWeightKg(BigDecimal grossWeightKg) { this.grossWeightKg = grossWeightKg; return this; }

            public Builder tareWeightKg(BigDecimal tareWeightKg) { this.tareWeightKg = tareWeightKg; return this; }

            public WeighbridgeRequest build() {

                WeighbridgeRequest obj = new WeighbridgeRequest();

                obj.bookingId = this.bookingId;

                obj.grossWeightKg = this.grossWeightKg;

                obj.tareWeightKg = this.tareWeightKg;

                return obj;

            }

        }

    }


    public static class ProcurementEntryResponse {
        private Long entryId;
        private Long bookingId;
        private String bookingReference;
        private String tokenNumber;
        private String farmerName;
        private String produceName;
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
        private BigDecimal mspRate;
        private BigDecimal totalAmount;

        public ProcurementEntryResponse() {}

        public ProcurementEntryResponse(Long entryId, Long bookingId, String bookingReference, String tokenNumber, String farmerName, String produceName, BigDecimal grossWeightKg, BigDecimal tareWeightKg, BigDecimal netWeightKg, BigDecimal actualQuantityQuintals, BigDecimal moisturePercentage, BigDecimal foreignMatterPercentage, String qualityGrade, QciStatus qciStatus, EntryStatus entryStatus, OffsetDateTime entryDatetime, BigDecimal mspRate, BigDecimal totalAmount) {

            this.entryId = entryId;

            this.bookingId = bookingId;

            this.bookingReference = bookingReference;

            this.tokenNumber = tokenNumber;

            this.farmerName = farmerName;

            this.produceName = produceName;

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

            this.mspRate = mspRate;

            this.totalAmount = totalAmount;

        }

        public Long getEntryId() { return this.entryId; }

        public void setEntryId(Long entryId) { this.entryId = entryId; }

        public Long getBookingId() { return this.bookingId; }

        public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

        public String getBookingReference() { return this.bookingReference; }

        public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }

        public String getTokenNumber() { return this.tokenNumber; }

        public void setTokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; }

        public String getFarmerName() { return this.farmerName; }

        public void setFarmerName(String farmerName) { this.farmerName = farmerName; }

        public String getProduceName() { return this.produceName; }

        public void setProduceName(String produceName) { this.produceName = produceName; }

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

        public BigDecimal getMspRate() { return this.mspRate; }

        public void setMspRate(BigDecimal mspRate) { this.mspRate = mspRate; }

        public BigDecimal getTotalAmount() { return this.totalAmount; }

        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

        public static Builder builder() { return new Builder(); }

        public static class Builder {

            private Long entryId;

            private Long bookingId;

            private String bookingReference;

            private String tokenNumber;

            private String farmerName;

            private String produceName;

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

            private BigDecimal mspRate;

            private BigDecimal totalAmount;

            public Builder entryId(Long entryId) { this.entryId = entryId; return this; }

            public Builder bookingId(Long bookingId) { this.bookingId = bookingId; return this; }

            public Builder bookingReference(String bookingReference) { this.bookingReference = bookingReference; return this; }

            public Builder tokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; return this; }

            public Builder farmerName(String farmerName) { this.farmerName = farmerName; return this; }

            public Builder produceName(String produceName) { this.produceName = produceName; return this; }

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

            public Builder mspRate(BigDecimal mspRate) { this.mspRate = mspRate; return this; }

            public Builder totalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; return this; }

            public ProcurementEntryResponse build() {

                ProcurementEntryResponse obj = new ProcurementEntryResponse();

                obj.entryId = this.entryId;

                obj.bookingId = this.bookingId;

                obj.bookingReference = this.bookingReference;

                obj.tokenNumber = this.tokenNumber;

                obj.farmerName = this.farmerName;

                obj.produceName = this.produceName;

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

                obj.mspRate = this.mspRate;

                obj.totalAmount = this.totalAmount;

                return obj;

            }

        }

    }


    public static class JFormResponse {
        private Long jFormId;
        private Long entryId;
        private String jFormNumber;
        private LocalDate issueDate;
        private JFormStatus status;
        private String farmerName;
        private String farmerVillage;
        private String farmerDistrict;
        private String centerName;
        private String produceName;
        private BigDecimal quantityQuintals;
        private BigDecimal ratePerQuintal;
        private BigDecimal totalAmount;
        private String documentPath;
        private String authorizedSignatoryName;
        private String signatureData;

        public JFormResponse() {}

        public JFormResponse(Long jFormId, Long entryId, String jFormNumber, LocalDate issueDate, JFormStatus status, String farmerName, String farmerVillage, String farmerDistrict, String centerName, String produceName, BigDecimal quantityQuintals, BigDecimal ratePerQuintal, BigDecimal totalAmount, String documentPath) {
            this.jFormId = jFormId;
            this.entryId = entryId;
            this.jFormNumber = jFormNumber;
            this.issueDate = issueDate;
            this.status = status;
            this.farmerName = farmerName;
            this.farmerVillage = farmerVillage;
            this.farmerDistrict = farmerDistrict;
            this.centerName = centerName;
            this.produceName = produceName;
            this.quantityQuintals = quantityQuintals;
            this.ratePerQuintal = ratePerQuintal;
            this.totalAmount = totalAmount;
            this.documentPath = documentPath;
        }

        public JFormResponse(Long jFormId, Long entryId, String jFormNumber, LocalDate issueDate, JFormStatus status, String farmerName, String farmerVillage, String farmerDistrict, String centerName, String produceName, BigDecimal quantityQuintals, BigDecimal ratePerQuintal, BigDecimal totalAmount, String documentPath, String authorizedSignatoryName, String signatureData) {
            this(jFormId, entryId, jFormNumber, issueDate, status, farmerName, farmerVillage, farmerDistrict, centerName, produceName, quantityQuintals, ratePerQuintal, totalAmount, documentPath);
            this.authorizedSignatoryName = authorizedSignatoryName;
            this.signatureData = signatureData;
        }

        public Long getJFormId() { return this.jFormId; }
        public void setJFormId(Long jFormId) { this.jFormId = jFormId; }
        public Long getEntryId() { return this.entryId; }
        public void setEntryId(Long entryId) { this.entryId = entryId; }
        public String getJFormNumber() { return this.jFormNumber; }
        public void setJFormNumber(String jFormNumber) { this.jFormNumber = jFormNumber; }
        public LocalDate getIssueDate() { return this.issueDate; }
        public void setIssueDate(LocalDate issueDate) { this.issueDate = issueDate; }
        public JFormStatus getStatus() { return this.status; }
        public void setStatus(JFormStatus status) { this.status = status; }
        public String getFarmerName() { return this.farmerName; }
        public void setFarmerName(String farmerName) { this.farmerName = farmerName; }
        public String getFarmerVillage() { return this.farmerVillage; }
        public void setFarmerVillage(String farmerVillage) { this.farmerVillage = farmerVillage; }
        public String getFarmerDistrict() { return this.farmerDistrict; }
        public void setFarmerDistrict(String farmerDistrict) { this.farmerDistrict = farmerDistrict; }
        public String getCenterName() { return this.centerName; }
        public void setCenterName(String centerName) { this.centerName = centerName; }
        public String getProduceName() { return this.produceName; }
        public void setProduceName(String produceName) { this.produceName = produceName; }
        public BigDecimal getQuantityQuintals() { return this.quantityQuintals; }
        public void setQuantityQuintals(BigDecimal quantityQuintals) { this.quantityQuintals = quantityQuintals; }
        public BigDecimal getRatePerQuintal() { return this.ratePerQuintal; }
        public void setRatePerQuintal(BigDecimal ratePerQuintal) { this.ratePerQuintal = ratePerQuintal; }
        public BigDecimal getTotalAmount() { return this.totalAmount; }
        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
        public String getDocumentPath() { return this.documentPath; }
        public void setDocumentPath(String documentPath) { this.documentPath = documentPath; }
        public String getAuthorizedSignatoryName() { return this.authorizedSignatoryName; }
        public void setAuthorizedSignatoryName(String authorizedSignatoryName) { this.authorizedSignatoryName = authorizedSignatoryName; }
        public String getSignatureData() { return this.signatureData; }
        public void setSignatureData(String signatureData) { this.signatureData = signatureData; }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private Long jFormId;
            private Long entryId;
            private String jFormNumber;
            private LocalDate issueDate;
            private JFormStatus status;
            private String farmerName;
            private String farmerVillage;
            private String farmerDistrict;
            private String centerName;
            private String produceName;
            private BigDecimal quantityQuintals;
            private BigDecimal ratePerQuintal;
            private BigDecimal totalAmount;
            private String documentPath;
            private String authorizedSignatoryName;
            private String signatureData;

            public Builder jFormId(Long jFormId) { this.jFormId = jFormId; return this; }
            public Builder entryId(Long entryId) { this.entryId = entryId; return this; }
            public Builder jFormNumber(String jFormNumber) { this.jFormNumber = jFormNumber; return this; }
            public Builder issueDate(LocalDate issueDate) { this.issueDate = issueDate; return this; }
            public Builder status(JFormStatus status) { this.status = status; return this; }
            public Builder farmerName(String farmerName) { this.farmerName = farmerName; return this; }
            public Builder farmerVillage(String farmerVillage) { this.farmerVillage = farmerVillage; return this; }
            public Builder farmerDistrict(String farmerDistrict) { this.farmerDistrict = farmerDistrict; return this; }
            public Builder centerName(String centerName) { this.centerName = centerName; return this; }
            public Builder produceName(String produceName) { this.produceName = produceName; return this; }
            public Builder quantityQuintals(BigDecimal quantityQuintals) { this.quantityQuintals = quantityQuintals; return this; }
            public Builder ratePerQuintal(BigDecimal ratePerQuintal) { this.ratePerQuintal = ratePerQuintal; return this; }
            public Builder totalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; return this; }
            public Builder documentPath(String documentPath) { this.documentPath = documentPath; return this; }
            public Builder authorizedSignatoryName(String authorizedSignatoryName) { this.authorizedSignatoryName = authorizedSignatoryName; return this; }
            public Builder signatureData(String signatureData) { this.signatureData = signatureData; return this; }

            public JFormResponse build() {
                JFormResponse obj = new JFormResponse();
                obj.jFormId = this.jFormId;
                obj.entryId = this.entryId;
                obj.jFormNumber = this.jFormNumber;
                obj.issueDate = this.issueDate;
                obj.status = this.status;
                obj.farmerName = this.farmerName;
                obj.farmerVillage = this.farmerVillage;
                obj.farmerDistrict = this.farmerDistrict;
                obj.centerName = this.centerName;
                obj.produceName = this.produceName;
                obj.quantityQuintals = this.quantityQuintals;
                obj.ratePerQuintal = this.ratePerQuintal;
                obj.totalAmount = this.totalAmount;
                obj.documentPath = this.documentPath;
                obj.authorizedSignatoryName = this.authorizedSignatoryName;
                obj.signatureData = this.signatureData;
                return obj;
            }
        }

    }


    public static class PaymentResponse {
        private Long paymentId;
        private Long entryId;
        private BigDecimal amount;
        private PaymentMode paymentMode;
        private PaymentStatus paymentStatus;
        private String transactionReference;
        private String bankName;
        private OffsetDateTime paymentDate;
        private String failureReason;

        public PaymentResponse() {}

        public PaymentResponse(Long paymentId, Long entryId, BigDecimal amount, PaymentMode paymentMode, PaymentStatus paymentStatus, String transactionReference, String bankName, OffsetDateTime paymentDate, String failureReason) {

            this.paymentId = paymentId;

            this.entryId = entryId;

            this.amount = amount;

            this.paymentMode = paymentMode;

            this.paymentStatus = paymentStatus;

            this.transactionReference = transactionReference;

            this.bankName = bankName;

            this.paymentDate = paymentDate;

            this.failureReason = failureReason;

        }

        public Long getPaymentId() { return this.paymentId; }

        public void setPaymentId(Long paymentId) { this.paymentId = paymentId; }

        public Long getEntryId() { return this.entryId; }

        public void setEntryId(Long entryId) { this.entryId = entryId; }

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

        public static Builder builder() { return new Builder(); }

        public static class Builder {

            private Long paymentId;

            private Long entryId;

            private BigDecimal amount;

            private PaymentMode paymentMode;

            private PaymentStatus paymentStatus;

            private String transactionReference;

            private String bankName;

            private OffsetDateTime paymentDate;

            private String failureReason;

            public Builder paymentId(Long paymentId) { this.paymentId = paymentId; return this; }

            public Builder entryId(Long entryId) { this.entryId = entryId; return this; }

            public Builder amount(BigDecimal amount) { this.amount = amount; return this; }

            public Builder paymentMode(PaymentMode paymentMode) { this.paymentMode = paymentMode; return this; }

            public Builder paymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; return this; }

            public Builder transactionReference(String transactionReference) { this.transactionReference = transactionReference; return this; }

            public Builder bankName(String bankName) { this.bankName = bankName; return this; }

            public Builder paymentDate(OffsetDateTime paymentDate) { this.paymentDate = paymentDate; return this; }

            public Builder failureReason(String failureReason) { this.failureReason = failureReason; return this; }

            public PaymentResponse build() {

                PaymentResponse obj = new PaymentResponse();

                obj.paymentId = this.paymentId;

                obj.entryId = this.entryId;

                obj.amount = this.amount;

                obj.paymentMode = this.paymentMode;

                obj.paymentStatus = this.paymentStatus;

                obj.transactionReference = this.transactionReference;

                obj.bankName = this.bankName;

                obj.paymentDate = this.paymentDate;

                obj.failureReason = this.failureReason;

                return obj;

            }

        }

    }


    public static class StorageRecordResponse {
        private Long storageRecordId;
        private Long storageId;
        private String storageCode;
        private String storageName;
        private Long entryId;
        private BigDecimal quantityQuintals;
        private OffsetDateTime storageDate;
        private StorageRecordStatus storageStatus;
        private String remarks;

        public StorageRecordResponse() {}

        public StorageRecordResponse(Long storageRecordId, Long storageId, String storageCode, String storageName, Long entryId, BigDecimal quantityQuintals, OffsetDateTime storageDate, StorageRecordStatus storageStatus, String remarks) {

            this.storageRecordId = storageRecordId;

            this.storageId = storageId;

            this.storageCode = storageCode;

            this.storageName = storageName;

            this.entryId = entryId;

            this.quantityQuintals = quantityQuintals;

            this.storageDate = storageDate;

            this.storageStatus = storageStatus;

            this.remarks = remarks;

        }

        public Long getStorageRecordId() { return this.storageRecordId; }

        public void setStorageRecordId(Long storageRecordId) { this.storageRecordId = storageRecordId; }

        public Long getStorageId() { return this.storageId; }

        public void setStorageId(Long storageId) { this.storageId = storageId; }

        public String getStorageCode() { return this.storageCode; }

        public void setStorageCode(String storageCode) { this.storageCode = storageCode; }

        public String getStorageName() { return this.storageName; }

        public void setStorageName(String storageName) { this.storageName = storageName; }

        public Long getEntryId() { return this.entryId; }

        public void setEntryId(Long entryId) { this.entryId = entryId; }

        public BigDecimal getQuantityQuintals() { return this.quantityQuintals; }

        public void setQuantityQuintals(BigDecimal quantityQuintals) { this.quantityQuintals = quantityQuintals; }

        public OffsetDateTime getStorageDate() { return this.storageDate; }

        public void setStorageDate(OffsetDateTime storageDate) { this.storageDate = storageDate; }

        public StorageRecordStatus getStorageStatus() { return this.storageStatus; }

        public void setStorageStatus(StorageRecordStatus storageStatus) { this.storageStatus = storageStatus; }

        public String getRemarks() { return this.remarks; }

        public void setRemarks(String remarks) { this.remarks = remarks; }

        public static Builder builder() { return new Builder(); }

        public static class Builder {

            private Long storageRecordId;

            private Long storageId;

            private String storageCode;

            private String storageName;

            private Long entryId;

            private BigDecimal quantityQuintals;

            private OffsetDateTime storageDate;

            private StorageRecordStatus storageStatus;

            private String remarks;

            public Builder storageRecordId(Long storageRecordId) { this.storageRecordId = storageRecordId; return this; }

            public Builder storageId(Long storageId) { this.storageId = storageId; return this; }

            public Builder storageCode(String storageCode) { this.storageCode = storageCode; return this; }

            public Builder storageName(String storageName) { this.storageName = storageName; return this; }

            public Builder entryId(Long entryId) { this.entryId = entryId; return this; }

            public Builder quantityQuintals(BigDecimal quantityQuintals) { this.quantityQuintals = quantityQuintals; return this; }

            public Builder storageDate(OffsetDateTime storageDate) { this.storageDate = storageDate; return this; }

            public Builder storageStatus(StorageRecordStatus storageStatus) { this.storageStatus = storageStatus; return this; }

            public Builder remarks(String remarks) { this.remarks = remarks; return this; }

            public StorageRecordResponse build() {

                StorageRecordResponse obj = new StorageRecordResponse();

                obj.storageRecordId = this.storageRecordId;

                obj.storageId = this.storageId;

                obj.storageCode = this.storageCode;

                obj.storageName = this.storageName;

                obj.entryId = this.entryId;

                obj.quantityQuintals = this.quantityQuintals;

                obj.storageDate = this.storageDate;

                obj.storageStatus = this.storageStatus;

                obj.remarks = this.remarks;

                return obj;

            }

        }

    }

}