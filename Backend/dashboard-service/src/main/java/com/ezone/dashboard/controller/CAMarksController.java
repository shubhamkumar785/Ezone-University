package com.ezone.dashboard.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ezone.dashboard.dto.AcademicTermResponse;
import com.ezone.dashboard.dto.CAMarksResponse;
import com.ezone.dashboard.service.CAMarksService;
import com.ezone.dashboard.util.JwtUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/student/ca-marks")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class CAMarksController {
    
    private final CAMarksService caMarksService;
    private final JwtUtil jwtUtil;
    
    @GetMapping("/active-term")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<AcademicTermResponse> getActiveTerm(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String loginId = jwtUtil.extractLoginId(token);
        
        log.info("Active term request from loginId: {}", loginId);
        
        AcademicTermResponse activeTerm = caMarksService.getActiveTerm();
        return ResponseEntity.ok(activeTerm);
    }
    
    @GetMapping("/terms")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<AcademicTermResponse>> getAllTerms(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String loginId = jwtUtil.extractLoginId(token);
        
        log.info("All terms request from loginId: {}", loginId);
        
        List<AcademicTermResponse> terms = caMarksService.getAllTerms();
        return ResponseEntity.ok(terms);
    }
    
    @GetMapping("/{termCode}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<CAMarksResponse> getCAMarks(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String termCode) {
        
        String token = authHeader.substring(7);
        String loginId = jwtUtil.extractLoginId(token);
        
        log.info("CA marks request from loginId: {} for termCode: {}", loginId, termCode);
        
        CAMarksResponse caMarks = caMarksService.getCAMarks(loginId, termCode);
        return ResponseEntity.ok(caMarks);
    }
}
