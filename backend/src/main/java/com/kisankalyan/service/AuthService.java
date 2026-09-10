package com.kisankalyan.service;

import com.kisankalyan.dto.AuthDto;
import com.kisankalyan.entity.AppUser;
import com.kisankalyan.entity.Farmer;
import com.kisankalyan.entity.Staff;
import com.kisankalyan.entity.enums.CommonStatus;
import com.kisankalyan.entity.enums.UserRole;
import com.kisankalyan.exception.ApiException;
import com.kisankalyan.repository.AppUserRepository;
import com.kisankalyan.repository.FarmerRepository;
import com.kisankalyan.repository.StaffRepository;
import com.kisankalyan.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        AppUser user = appUserRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ApiException("User not found"));

        AuthDto.AuthResponse response = AuthDto.AuthResponse.builder()
                .token(jwt)
                .userId(user.getUserId())
                .username(user.getUsername())
                .role(user.getRole())
                .name(user.getUsername())
                .build();

        if (user.getRole() == UserRole.FARMER) {
            Optional<Farmer> farmer = farmerRepository.findByUser(user);
            farmer.ifPresent(f -> {
                response.setFarmerId(f.getFarmerId());
                response.setName(f.getName());
            });
        } else if (user.getRole() == UserRole.OPERATOR || user.getRole() == UserRole.ADMIN) {
            Optional<Staff> staff = staffRepository.findByUser(user);
            staff.ifPresent(s -> {
                response.setStaffId(s.getStaffId());
                response.setName(s.getStaffName());
                if (s.getCenter() != null) {
                    response.setCenterId(s.getCenter().getCenterId());
                }
            });
        }

        return response;
    }

    @Transactional
    public AuthDto.AuthResponse registerFarmer(AuthDto.RegisterFarmerRequest request) {
        if (appUserRepository.existsByUsername(request.getUsername())) {
            throw new ApiException("यह यूज़रनेम पहले से पंजीकृत है / Username already exists");
        }

        if (farmerRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new ApiException("यह मोबाइल नंबर पहले से पंजीकृत है / Phone number already exists");
        }

        if (request.getAadhaarNumber() != null && !request.getAadhaarNumber().isBlank()
                && farmerRepository.existsByAadhaarNumber(request.getAadhaarNumber())) {
            throw new ApiException("यह आधार नंबर पहले से पंजीकृत है / Aadhaar number already exists");
        }

        // 1. Create AppUser
        AppUser user = AppUser.builder()
                .username(request.getUsername())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.FARMER)
                .phoneNumber(request.getPhoneNumber())
                .isActive(true)
                .build();
        user = appUserRepository.save(user);

        // 2. Create Farmer profile
        Farmer farmer = Farmer.builder()
                .user(user)
                .name(request.getName())
                .phoneNumber(request.getPhoneNumber())
                .aadhaarNumber(request.getAadhaarNumber())
                .bankAccountNumber(request.getBankAccountNumber())
                .bankName(request.getBankName())
                .ifscCode(request.getIfscCode())
                .address(request.getAddress())
                .village(request.getVillage())
                .district(request.getDistrict())
                .state(request.getState())
                .build();
        farmer = farmerRepository.save(farmer);

        // 3. Authenticate and create token
        String jwt = tokenProvider.generateTokenFromUsername(user.getUsername());

        return AuthDto.AuthResponse.builder()
                .token(jwt)
                .userId(user.getUserId())
                .username(user.getUsername())
                .role(user.getRole())
                .name(farmer.getName())
                .farmerId(farmer.getFarmerId())
                .build();
    }
}
