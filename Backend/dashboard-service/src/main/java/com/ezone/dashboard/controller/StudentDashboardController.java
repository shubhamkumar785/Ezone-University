package com.ezone.dashboard.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ezone.dashboard.dto.DashboardSummaryResponse;
import com.ezone.dashboard.dto.StudentProfileResponse;
import com.ezone.dashboard.service.StudentDashboardService;
import com.ezone.dashboard.util.JwtUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class StudentDashboardController {
    
    private final StudentDashboardService studentDashboardService;
    private final JwtUtil jwtUtil;
    
    @GetMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentProfileResponse> getProfile(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        String loginId = jwtUtil.extractLoginId(token);
        String role = jwtUtil.extractRole(token);
        
        log.info("Profile request from loginId: {}, role: {}", loginId, role);
        
        StudentProfileResponse profile = studentDashboardService.getStudentProfile(loginId);
        return ResponseEntity.ok(profile);
    }
    
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<DashboardSummaryResponse> getDashboard(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        String loginId = jwtUtil.extractLoginId(token);
        String role = jwtUtil.extractRole(token);
        
        log.info("Dashboard request from loginId: {}, role: {}", loginId, role);
        
        DashboardSummaryResponse dashboard = studentDashboardService.getDashboardSummary(loginId);
        return ResponseEntity.ok(dashboard);
    }
}
