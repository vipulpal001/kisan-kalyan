package com.kisankalyan.controller;

import com.kisankalyan.dto.AuthDto;
import com.kisankalyan.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthDto.AuthResponse> login(@Valid @RequestBody AuthDto.LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register-farmer")
    public ResponseEntity<AuthDto.AuthResponse> registerFarmer(@Valid @RequestBody AuthDto.RegisterFarmerRequest request) {
        return ResponseEntity.ok(authService.registerFarmer(request));
    }
}
