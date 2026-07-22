package com.ezone.dashboard.service;

import com.ezone.dashboard.entity.AttendanceAuditLog;
import com.ezone.dashboard.entity.AuditActionType;
import com.ezone.dashboard.repository.AttendanceAuditLogRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Writes compliance audit logs asynchronously.
 * Never blocks the student's attendance API response.
 *
 * Logged events:
 *   - STUDENT_VIEWED  → student fetched day-wise attendance
 *   - TEACHER_MARKED  → teacher submitted attendance for a period
 *   - TEACHER_UPDATED → teacher modified previously submitted attendance
 *   - ADMIN_MODIFIED  → admin overrode an attendance record
 *   - ADMIN_LOCKED    → admin locked attendance for a date/term
 *   - EXPORT_GENERATED → student or admin downloaded an attendance report
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AttendanceAuditService {

    private final AttendanceAuditLogRepository auditLogRepository;

    /**
     * Write an audit log entry asynchronously on the dedicated audit thread pool.
     *
     * @param tenantId         Tenant the action belongs to
     * @param termCode         Academic term code
     * @param studentLoginId   The student whose data was accessed / modified
     * @param actionType       Category of the action
     * @param performedBy      LoginId of the actor (student, teacher, or admin)
     * @param ipAddress        Client IP address (may be null)
     * @param details          Optional context string (e.g., "month=1&year=2026")
     */
    @Async("auditTaskExecutor")
    public void logAction(
            String tenantId,
            String termCode,
            String studentLoginId,
            AuditActionType actionType,
            String performedBy,
            String ipAddress,
            String details) {
        try {
            AttendanceAuditLog entry = AttendanceAuditLog.builder()
                    .tenantId(tenantId)
                    .termCode(termCode)
                    .studentLoginId(studentLoginId)
                    .actionType(actionType)
                    .actionDate(details)
                    .performedBy(performedBy)
                    .ipAddress(ipAddress)
                    .details(details)
                    .createdAt(LocalDateTime.now())
                    .build();

            auditLogRepository.save(entry);
            log.debug("Audit log saved: action={}, student={}, term={}", actionType, studentLoginId, termCode);
        } catch (Exception e) {
            // Audit failure must never propagate to the caller
            log.error("Failed to write audit log for action={}, student={}: {}", actionType, studentLoginId, e.getMessage());
        }
    }
}
