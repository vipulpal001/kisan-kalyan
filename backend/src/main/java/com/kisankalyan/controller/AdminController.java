package com.kisankalyan.controller;

import com.kisankalyan.dto.AdminAnalyticsDto;
import com.kisankalyan.service.AdminAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminAnalyticsService adminAnalyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminAnalyticsDto> getDashboardStats() {
        return ResponseEntity.ok(adminAnalyticsService.getDashboardAnalytics());
    }
}
