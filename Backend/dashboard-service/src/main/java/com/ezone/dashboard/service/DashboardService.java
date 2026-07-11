package com.ezone.dashboard.service;

import com.ezone.dashboard.dto.*;
import com.ezone.dashboard.entity.DashboardOverview;
import com.ezone.dashboard.exception.ResourceNotFoundException;
import com.ezone.dashboard.mapper.DashboardOverviewMapper;
import com.ezone.dashboard.mapper.DashboardTrendMapper;
import com.ezone.dashboard.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DashboardOverviewRepository overviewRepository;
    private final EnrollmentTrendRepository enrollmentRepository;
    private final AttendanceTrendRepository attendanceRepository;
    private final DepartmentDistributionRepository departmentRepository;
    private final FeeReportRepository feeRepository;

    private final DashboardOverviewMapper overviewMapper;
    private final DashboardTrendMapper trendMapper;

    @Transactional(readOnly = true)
    public DashboardOverviewDto getOverview() {
        DashboardOverview overview = overviewRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Dashboard statistics not seeded yet"));
        return overviewMapper.toDto(overview);
    }

    @Transactional(readOnly = true)
    public List<EnrollmentTrendDto> getEnrollmentTrends() {
        return enrollmentRepository.findAll().stream()
                .map(trendMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AttendanceTrendDto> getAttendanceTrends() {
        return attendanceRepository.findAll().stream()
                .map(trendMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DepartmentDistributionDto> getDepartmentDistributions() {
        return departmentRepository.findAll().stream()
                .map(trendMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FeeReportDto> getFeeReports() {
        return feeRepository.findAll().stream()
                .map(trendMapper::toDto)
                .collect(Collectors.toList());
    }
}
