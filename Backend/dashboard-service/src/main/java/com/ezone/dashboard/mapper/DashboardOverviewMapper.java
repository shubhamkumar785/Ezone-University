package com.ezone.dashboard.mapper;

import com.ezone.dashboard.dto.DashboardOverviewDto;
import com.ezone.dashboard.entity.DashboardOverview;
import org.springframework.stereotype.Component;

@Component
public class DashboardOverviewMapper {

    public DashboardOverviewDto toDto(DashboardOverview entity) {
        if (entity == null) {
            return null;
        }
        return DashboardOverviewDto.builder()
                .totalStudents(entity.getTotalStudents())
                .totalTeachers(entity.getTotalTeachers())
                .totalDepartments(entity.getTotalDepartments())
                .activeCourses(entity.getActiveCourses())
                .averageAttendance(entity.getAverageAttendance())
                .pendingLeaves(entity.getPendingLeaves())
                .activeAlerts(entity.getActiveAlerts())
                .feeCollected(Math.round(entity.getFeeCollected()))
                .build();
    }
}
