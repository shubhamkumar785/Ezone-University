package com.ezone.dashboard.mapper;

import com.ezone.dashboard.dto.AttendanceTrendDto;
import com.ezone.dashboard.dto.DepartmentDistributionDto;
import com.ezone.dashboard.dto.EnrollmentTrendDto;
import com.ezone.dashboard.dto.FeeReportDto;
import com.ezone.dashboard.entity.AttendanceTrend;
import com.ezone.dashboard.entity.DepartmentDistribution;
import com.ezone.dashboard.entity.EnrollmentTrend;
import com.ezone.dashboard.entity.FeeReport;
import org.springframework.stereotype.Component;

@Component
public class DashboardTrendMapper {

    public EnrollmentTrendDto toDto(EnrollmentTrend entity) {
        if (entity == null) return null;
        return EnrollmentTrendDto.builder()
                .month(entity.getMonth())
                .students(entity.getStudents())
                .build();
    }

    public AttendanceTrendDto toDto(AttendanceTrend entity) {
        if (entity == null) return null;
        return AttendanceTrendDto.builder()
                .month(entity.getMonth())
                .present(entity.getPresent())
                .absent(entity.getAbsent())
                .build();
    }

    public DepartmentDistributionDto toDto(DepartmentDistribution entity) {
        if (entity == null) return null;
        return DepartmentDistributionDto.builder()
                .department(entity.getDepartment())
                .students(entity.getStudents())
                .build();
    }

    public FeeReportDto toDto(FeeReport entity) {
        if (entity == null) return null;
        return FeeReportDto.builder()
                .month(entity.getMonth())
                .collected(Math.round(entity.getCollected()))
                .target(Math.round(entity.getTarget()))
                .build();
    }
}
