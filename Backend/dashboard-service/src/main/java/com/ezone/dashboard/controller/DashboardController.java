package com.ezone.dashboard.controller;

import com.ezone.dashboard.dto.*;
import com.ezone.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService service;

    @GetMapping("/overview")
    public ResponseEntity<DashboardOverviewDto> getOverview() {
        return ResponseEntity.ok(service.getOverview());
    }

    @GetMapping("/enrollment-trend")
    public ResponseEntity<List<EnrollmentTrendDto>> getEnrollmentTrend() {
        return ResponseEntity.ok(service.getEnrollmentTrends());
    }

    @GetMapping("/attendance-trend")
    public ResponseEntity<List<AttendanceTrendDto>> getAttendanceTrend() {
        return ResponseEntity.ok(service.getAttendanceTrends());
    }

    @GetMapping("/department-distribution")
    public ResponseEntity<List<DepartmentDistributionDto>> getDepartmentDistribution() {
        return ResponseEntity.ok(service.getDepartmentDistributions());
    }

    @GetMapping("/fee-report")
    public ResponseEntity<List<FeeReportDto>> getFeeReport() {
        return ResponseEntity.ok(service.getFeeReports());
    }

    @GetMapping("/recent-activities")
    public ResponseEntity<Page<RecentActivityDto>> getRecentActivities(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(service.getRecentActivities(page, size));
    }

    @GetMapping("/pending-leaves")
    public ResponseEntity<Page<PendingLeaveDto>> getPendingLeaves(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(service.getPendingLeaves(page, size));
    }

    @GetMapping("/system-alerts")
    public ResponseEntity<Page<SystemAlertDto>> getSystemAlerts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(service.getSystemAlerts(page, size));
    }
}
