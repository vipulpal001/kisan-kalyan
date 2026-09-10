package com.kisankalyan.entity;

import com.kisankalyan.entity.enums.CommonStatus;
import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "staff")
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "staff_id")
    private Long staffId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", unique = true)
    private AppUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id", referencedColumnName = "center_id")
    private ProcurementCentre center;

    @Column(name = "staff_name", nullable = false, length = 100)
    private String staffName;

    @Column(name = "designation", nullable = false, length = 100)
    private String designation;

    @Column(name = "phone_number", nullable = false, unique = true, length = 15)
    private String phoneNumber;

    @Column(name = "employee_code", unique = true, length = 30)
    private String employeeCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private CommonStatus status;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    public Staff() {}

    public Staff(Long staffId, AppUser user, ProcurementCentre center, String staffName, String designation, String phoneNumber, String employeeCode, CommonStatus status, OffsetDateTime createdAt) {
        this.staffId = staffId;
        this.user = user;
        this.center = center;
        this.staffName = staffName;
        this.designation = designation;
        this.phoneNumber = phoneNumber;
        this.employeeCode = employeeCode;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getStaffId() { return this.staffId; }
    public void setStaffId(Long staffId) { this.staffId = staffId; }

    public AppUser getUser() { return this.user; }
    public void setUser(AppUser user) { this.user = user; }

    public ProcurementCentre getCenter() { return this.center; }
    public void setCenter(ProcurementCentre center) { this.center = center; }

    public String getStaffName() { return this.staffName; }
    public void setStaffName(String staffName) { this.staffName = staffName; }

    public String getDesignation() { return this.designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getPhoneNumber() { return this.phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getEmployeeCode() { return this.employeeCode; }
    public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }

    public CommonStatus getStatus() { return this.status; }
    public void setStatus(CommonStatus status) { this.status = status; }

    public OffsetDateTime getCreatedAt() { return this.createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long staffId;
        private AppUser user;
        private ProcurementCentre center;
        private String staffName;
        private String designation;
        private String phoneNumber;
        private String employeeCode;
        private CommonStatus status;
        private OffsetDateTime createdAt;

        public Builder staffId(Long staffId) { this.staffId = staffId; return this; }
        public Builder user(AppUser user) { this.user = user; return this; }
        public Builder center(ProcurementCentre center) { this.center = center; return this; }
        public Builder staffName(String staffName) { this.staffName = staffName; return this; }
        public Builder designation(String designation) { this.designation = designation; return this; }
        public Builder phoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; return this; }
        public Builder employeeCode(String employeeCode) { this.employeeCode = employeeCode; return this; }
        public Builder status(CommonStatus status) { this.status = status; return this; }
        public Builder createdAt(OffsetDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Staff build() {
            Staff obj = new Staff();
            obj.staffId = this.staffId;
            obj.user = this.user;
            obj.center = this.center;
            obj.staffName = this.staffName;
            obj.designation = this.designation;
            obj.phoneNumber = this.phoneNumber;
            obj.employeeCode = this.employeeCode;
            obj.status = this.status;
            obj.createdAt = this.createdAt;
            return obj;
        }
    }

}
