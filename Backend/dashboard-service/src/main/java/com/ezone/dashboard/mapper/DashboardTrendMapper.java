package com.ezone.dashboard.mapper;

import com.ezone.dashboard.dto.*;
import com.ezone.dashboard.entity.*;
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

    public RecentActivityDto toDto(RecentActivity entity) {
        if (entity == null) return null;
        return RecentActivityDto.builder()
                .id(entity.getId())
                .time(entity.getTime())
                .module(entity.getModule())
                .message(entity.getMessage())
                .statusColor(entity.getStatusColor())
                .build();
    }

    public PendingLeaveDto toDto(PendingLeave entity) {
        if (entity == null) return null;
        return PendingLeaveDto.builder()
                .id(entity.getId())
                .employee(entity.getEmployee())
                .department(entity.getDepartment())
                .leaveType(entity.getLeaveType())
                .status(entity.getStatus())
                .initials(entity.getInitials())
                .time(entity.getTime())
                .duration(entity.getDuration())
                .build();
    }

    public SystemAlertDto toDto(SystemAlert entity) {
        if (entity == null) return null;
        return SystemAlertDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .message(entity.getMessage())
                .severity(entity.getSeverity())
                .timestamp(entity.getTimestamp())
                .build();
    }
}
