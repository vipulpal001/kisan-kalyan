package com.kisankalyan.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "farmer")
public class Farmer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "farmer_id")
    private Long farmerId;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", unique = true)
    private AppUser user;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "phone_number", nullable = false, unique = true, length = 15)
    private String phoneNumber;

    @Column(name = "aadhaar_number", unique = true, length = 12)
    private String aadhaarNumber;

    @Column(name = "bank_account_number", length = 30)
    private String bankAccountNumber;

    @Column(name = "bank_name", length = 100)
    private String bankName;

    @Column(name = "ifsc_code", length = 11)
    private String ifscCode;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "village", length = 100)
    private String village;

    @Column(name = "district", length = 100)
    private String district;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    public Farmer() {}

    public Farmer(Long farmerId, AppUser user, String name, String phoneNumber, String aadhaarNumber, String bankAccountNumber, String bankName, String ifscCode, String address, String village, String district, String state, OffsetDateTime createdAt) {
        this.farmerId = farmerId;
        this.user = user;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.aadhaarNumber = aadhaarNumber;
        this.bankAccountNumber = bankAccountNumber;
        this.bankName = bankName;
        this.ifscCode = ifscCode;
        this.address = address;
        this.village = village;
        this.district = district;
        this.state = state;
        this.createdAt = createdAt;
    }

    public Long getFarmerId() { return this.farmerId; }
    public void setFarmerId(Long farmerId) { this.farmerId = farmerId; }

    public AppUser getUser() { return this.user; }
    public void setUser(AppUser user) { this.user = user; }

    public String getName() { return this.name; }
    public void setName(String name) { this.name = name; }

    public String getPhoneNumber() { return this.phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getAadhaarNumber() { return this.aadhaarNumber; }
    public void setAadhaarNumber(String aadhaarNumber) { this.aadhaarNumber = aadhaarNumber; }

    public String getBankAccountNumber() { return this.bankAccountNumber; }
    public void setBankAccountNumber(String bankAccountNumber) { this.bankAccountNumber = bankAccountNumber; }

    public String getBankName() { return this.bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }

    public String getIfscCode() { return this.ifscCode; }
    public void setIfscCode(String ifscCode) { this.ifscCode = ifscCode; }

    public String getAddress() { return this.address; }
    public void setAddress(String address) { this.address = address; }

    public String getVillage() { return this.village; }
    public void setVillage(String village) { this.village = village; }

    public String getDistrict() { return this.district; }
    public void setDistrict(String district) { this.district = district; }

    public String getState() { return this.state; }
    public void setState(String state) { this.state = state; }

    public OffsetDateTime getCreatedAt() { return this.createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long farmerId;
        private AppUser user;
        private String name;
        private String phoneNumber;
        private String aadhaarNumber;
        private String bankAccountNumber;
        private String bankName;
        private String ifscCode;
        private String address;
        private String village;
        private String district;
        private String state;
        private OffsetDateTime createdAt;

        public Builder farmerId(Long farmerId) { this.farmerId = farmerId; return this; }
        public Builder user(AppUser user) { this.user = user; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder phoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; return this; }
        public Builder aadhaarNumber(String aadhaarNumber) { this.aadhaarNumber = aadhaarNumber; return this; }
        public Builder bankAccountNumber(String bankAccountNumber) { this.bankAccountNumber = bankAccountNumber; return this; }
        public Builder bankName(String bankName) { this.bankName = bankName; return this; }
        public Builder ifscCode(String ifscCode) { this.ifscCode = ifscCode; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public Builder village(String village) { this.village = village; return this; }
        public Builder district(String district) { this.district = district; return this; }
        public Builder state(String state) { this.state = state; return this; }
        public Builder createdAt(OffsetDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Farmer build() {
            Farmer obj = new Farmer();
            obj.farmerId = this.farmerId;
            obj.user = this.user;
            obj.name = this.name;
            obj.phoneNumber = this.phoneNumber;
            obj.aadhaarNumber = this.aadhaarNumber;
            obj.bankAccountNumber = this.bankAccountNumber;
            obj.bankName = this.bankName;
            obj.ifscCode = this.ifscCode;
            obj.address = this.address;
            obj.village = this.village;
            obj.district = this.district;
            obj.state = this.state;
            obj.createdAt = this.createdAt;
            return obj;
        }
    }

}
