package com.kisankalyan.dto;

import com.kisankalyan.entity.enums.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
public class AuthDto {

    public static class LoginRequest {
        @NotBlank(message = "Username is required")
        private String username;

        @NotBlank(message = "Password is required")
        private String password;

        public LoginRequest() {}

        public LoginRequest(String username, String password) {

            this.username = username;

            this.password = password;

        }

        public String getUsername() { return this.username; }

        public void setUsername(String username) { this.username = username; }

        public String getPassword() { return this.password; }

        public void setPassword(String password) { this.password = password; }

        public static Builder builder() { return new Builder(); }

        public static class Builder {

            private String username;

            private String password;

            public Builder username(String username) { this.username = username; return this; }

            public Builder password(String password) { this.password = password; return this; }

            public LoginRequest build() {

                LoginRequest obj = new LoginRequest();

                obj.username = this.username;

                obj.password = this.password;

                return obj;

            }

        }

    }


    public static class AuthResponse {
        private String token;
        private String type = "Bearer";
        private Long userId;
        private String username;
        private UserRole role;
        private String name;
        private Long farmerId;
        private Long staffId;
        private Long centerId;

        public AuthResponse() {}

        public AuthResponse(String token, String type, Long userId, String username, UserRole role, String name, Long farmerId, Long staffId, Long centerId) {

            this.token = token;

            this.type = type;

            this.userId = userId;

            this.username = username;

            this.role = role;

            this.name = name;

            this.farmerId = farmerId;

            this.staffId = staffId;

            this.centerId = centerId;

        }

        public String getToken() { return this.token; }

        public void setToken(String token) { this.token = token; }

        public String getType() { return this.type; }

        public void setType(String type) { this.type = type; }

        public Long getUserId() { return this.userId; }

        public void setUserId(Long userId) { this.userId = userId; }

        public String getUsername() { return this.username; }

        public void setUsername(String username) { this.username = username; }

        public UserRole getRole() { return this.role; }

        public void setRole(UserRole role) { this.role = role; }

        public String getName() { return this.name; }

        public void setName(String name) { this.name = name; }

        public Long getFarmerId() { return this.farmerId; }

        public void setFarmerId(Long farmerId) { this.farmerId = farmerId; }

        public Long getStaffId() { return this.staffId; }

        public void setStaffId(Long staffId) { this.staffId = staffId; }

        public Long getCenterId() { return this.centerId; }

        public void setCenterId(Long centerId) { this.centerId = centerId; }

        public static Builder builder() { return new Builder(); }

        public static class Builder {

            private String token;

            private String type;

            private Long userId;

            private String username;

            private UserRole role;

            private String name;

            private Long farmerId;

            private Long staffId;

            private Long centerId;

            public Builder token(String token) { this.token = token; return this; }

            public Builder type(String type) { this.type = type; return this; }

            public Builder userId(Long userId) { this.userId = userId; return this; }

            public Builder username(String username) { this.username = username; return this; }

            public Builder role(UserRole role) { this.role = role; return this; }

            public Builder name(String name) { this.name = name; return this; }

            public Builder farmerId(Long farmerId) { this.farmerId = farmerId; return this; }

            public Builder staffId(Long staffId) { this.staffId = staffId; return this; }

            public Builder centerId(Long centerId) { this.centerId = centerId; return this; }

            public AuthResponse build() {

                AuthResponse obj = new AuthResponse();

                obj.token = this.token;

                obj.type = this.type;

                obj.userId = this.userId;

                obj.username = this.username;

                obj.role = this.role;

                obj.name = this.name;

                obj.farmerId = this.farmerId;

                obj.staffId = this.staffId;

                obj.centerId = this.centerId;

                return obj;

            }

        }

    }


    public static class RegisterFarmerRequest {
        @NotBlank(message = "Username is required")
        private String username;

        @NotBlank(message = "Password is required")
        private String password;

        @NotBlank(message = "Full Name is required")
        private String name;

        @NotBlank(message = "Phone number is required")
        private String phoneNumber;

        private String aadhaarNumber;
        private String bankAccountNumber;
        private String bankName;
        private String ifscCode;
        private String address;
        private String village;
        private String district;
        private String state;

        public RegisterFarmerRequest() {}

        public RegisterFarmerRequest(String username, String password, String name, String phoneNumber, String aadhaarNumber, String bankAccountNumber, String bankName, String ifscCode, String address, String village, String district, String state) {

            this.username = username;

            this.password = password;

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

        }

        public String getUsername() { return this.username; }

        public void setUsername(String username) { this.username = username; }

        public String getPassword() { return this.password; }

        public void setPassword(String password) { this.password = password; }

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

        public static Builder builder() { return new Builder(); }

        public static class Builder {

            private String username;

            private String password;

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

            public Builder username(String username) { this.username = username; return this; }

            public Builder password(String password) { this.password = password; return this; }

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

            public RegisterFarmerRequest build() {

                RegisterFarmerRequest obj = new RegisterFarmerRequest();

                obj.username = this.username;

                obj.password = this.password;

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

                return obj;

            }

        }

    }

    public static class ForgotPasswordRequest {
        @NotBlank(message = "उपयोगकर्ता नाम अथवा मोबाइल नंबर अनिवार्य है / Username or phone number is required")
        private String usernameOrPhone;

        public ForgotPasswordRequest() {}
        public ForgotPasswordRequest(String usernameOrPhone) { this.usernameOrPhone = usernameOrPhone; }

        public String getUsernameOrPhone() { return usernameOrPhone; }
        public void setUsernameOrPhone(String usernameOrPhone) { this.usernameOrPhone = usernameOrPhone; }
    }

    public static class ForgotPasswordResponse {
        private boolean success;
        private String username;
        private String maskedPhone;
        private String message;

        public ForgotPasswordResponse() {}
        public ForgotPasswordResponse(boolean success, String username, String maskedPhone, String message) {
            this.success = success;
            this.username = username;
            this.maskedPhone = maskedPhone;
            this.message = message;
        }

        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getMaskedPhone() { return maskedPhone; }
        public void setMaskedPhone(String maskedPhone) { this.maskedPhone = maskedPhone; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class ResetPasswordRequest {
        @NotBlank(message = "उपयोगकर्ता नाम अथवा मोबाइल नंबर अनिवार्य है")
        private String usernameOrPhone;

        @NotBlank(message = "सत्यापन के लिए पंजीकृत 10-अंकीय मोबाइल नंबर दर्ज करें")
        private String phoneNumber;

        @NotBlank(message = "नया पासवर्ड अनिवार्य है")
        private String newPassword;

        public ResetPasswordRequest() {}
        public ResetPasswordRequest(String usernameOrPhone, String phoneNumber, String newPassword) {
            this.usernameOrPhone = usernameOrPhone;
            this.phoneNumber = phoneNumber;
            this.newPassword = newPassword;
        }

        public String getUsernameOrPhone() { return usernameOrPhone; }
        public void setUsernameOrPhone(String usernameOrPhone) { this.usernameOrPhone = usernameOrPhone; }
        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    public static class MessageResponse {
        private boolean success;
        private String message;

        public MessageResponse() {}
        public MessageResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }

        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}