package com.ezone.dashboard.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {
    private Double attendancePercentage;
    private Integer pendingAssignments;
    private Integer completedAssignments;
    private Integer upcomingExams;
    private List<NotificationItem> latestNotifications;
    
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
