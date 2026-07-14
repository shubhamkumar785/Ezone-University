package com.ezone.dashboard.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ezone.dashboard.dto.StudentAttendanceResponse;
import com.ezone.dashboard.service.AttendanceService;
import com.ezone.dashboard.util.JwtUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/student/attendance")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AttendanceController {
    
    private final AttendanceService attendanceService;
    private final JwtUtil jwtUtil;
    
    @GetMapping("/{termCode}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentAttendanceResponse> getAttendance(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String termCode) {
        
        String token = authHeader.substring(7);
        String loginId = jwtUtil.extractLoginId(token);
        
        log.info("Attendance request from loginId: {} for termCode: {}", loginId, termCode);
        
        StudentAttendanceResponse attendance = attendanceService.getStudentAttendance(loginId, termCode);
        return ResponseEntity.ok(attendance);
    }
    
    @GetMapping("/{termCode}/export")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentAttendanceResponse> exportAttendance(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String termCode) {
        
        String token = authHeader.substring(7);
        String loginId = jwtUtil.extractLoginId(token);
        
        log.info("Attendance export request from loginId: {} for termCode: {}", loginId, termCode);
        
        StudentAttendanceResponse attendance = attendanceService.exportStudentAttendance(loginId, termCode);
        return ResponseEntity.ok(attendance);
    }
}
