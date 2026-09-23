package com.kisankalyan.entity;

import com.kisankalyan.entity.enums.ProduceUnit;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "agricultural_produce")
public class AgriculturalProduce {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "produce_id")
    private Long produceId;

    @Column(name = "produce_code", nullable = false, unique = true, length = 30)
    private String produceCode;

    @Column(name = "produce_name", nullable = false, length = 100)
    private String produceName;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "season", length = 50)
    private String season;

    @Column(name = "msp_rate", nullable = false, precision = 10, scale = 2)
    private BigDecimal mspRate;

    @Enumerated(EnumType.STRING)
    @Column(name = "unit", nullable = false, length = 20)
    private ProduceUnit unit;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = OffsetDateTime.now();
        }
    }

    public AgriculturalProduce() {}

    public AgriculturalProduce(Long produceId, String produceCode, String produceName, String category, String season, BigDecimal mspRate, ProduceUnit unit, Boolean isActive, OffsetDateTime createdAt) {
        this.produceId = produceId;
        this.produceCode = produceCode;
        this.produceName = produceName;
        this.category = category;
        this.season = season;
        this.mspRate = mspRate;
        this.unit = unit;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }

    public Long getProduceId() { return this.produceId; }
    public void setProduceId(Long produceId) { this.produceId = produceId; }

    public String getProduceCode() { return this.produceCode; }
    public void setProduceCode(String produceCode) { this.produceCode = produceCode; }

    public String getProduceName() { return this.produceName; }
    public void setProduceName(String produceName) { this.produceName = produceName; }

    public String getCategory() { return this.category; }
    public void setCategory(String category) { this.category = category; }

    public String getSeason() { return this.season; }
    public void setSeason(String season) { this.season = season; }

    public BigDecimal getMspRate() { return this.mspRate; }
    public void setMspRate(BigDecimal mspRate) { this.mspRate = mspRate; }

    public ProduceUnit getUnit() { return this.unit; }
    public void setUnit(ProduceUnit unit) { this.unit = unit; }

    public Boolean getIsActive() { return this.isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public OffsetDateTime getCreatedAt() { return this.createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long produceId;
        private String produceCode;
        private String produceName;
        private String category;
        private String season;
        private BigDecimal mspRate;
        private ProduceUnit unit;
        private Boolean isActive;
        private OffsetDateTime createdAt;

        public Builder produceId(Long produceId) { this.produceId = produceId; return this; }
        public Builder produceCode(String produceCode) { this.produceCode = produceCode; return this; }
        public Builder produceName(String produceName) { this.produceName = produceName; return this; }
        public Builder category(String category) { this.category = category; return this; }
        public Builder season(String season) { this.season = season; return this; }
        public Builder mspRate(BigDecimal mspRate) { this.mspRate = mspRate; return this; }
        public Builder unit(ProduceUnit unit) { this.unit = unit; return this; }
        public Builder isActive(Boolean isActive) { this.isActive = isActive; return this; }
        public Builder createdAt(OffsetDateTime createdAt) { this.createdAt = createdAt; return this; }

        public AgriculturalProduce build() {
            AgriculturalProduce obj = new AgriculturalProduce();
            obj.produceId = this.produceId;
            obj.produceCode = this.produceCode;
            obj.produceName = this.produceName;
            obj.category = this.category;
            obj.season = this.season;
            obj.mspRate = this.mspRate;
            obj.unit = this.unit;
            obj.isActive = this.isActive;
            obj.createdAt = this.createdAt;
            return obj;
        }
    }

}
