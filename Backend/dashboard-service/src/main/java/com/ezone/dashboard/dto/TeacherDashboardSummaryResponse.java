package com.ezone.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherDashboardSummaryResponse {
    
    private List<NotificationItem> unreadNotifications;
    private int notificationCount;
    
    // Overview Stats
    private int totalClassesAssigned;
    private int totalStudentsMentored;
    private int pendingAssignmentsToGrade;
    private double facultyAttendancePercentage;
    
    // Personal Attendance Data (mocked for now)
    private int daysPresent;
    private int totalWorkingDays;
    private int leavesTaken;
    
    // Additional helpful fields
    private String nextClass;
    private String nextClassTime;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NotificationItem {
        private Long id;
        private String title;
        private String message;
        private String time;
        private String type;
    }
}
