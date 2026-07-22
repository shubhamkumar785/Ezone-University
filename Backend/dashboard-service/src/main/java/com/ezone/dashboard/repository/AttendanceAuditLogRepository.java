package com.ezone.dashboard.repository;

import com.ezone.dashboard.entity.AttendanceAuditLog;
import com.ezone.dashboard.entity.AuditActionType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceAuditLogRepository extends JpaRepository<AttendanceAuditLog, Long> {

    List<AttendanceAuditLog> findByStudentLoginIdAndTermCodeOrderByCreatedAtDesc(
            String studentLoginId, String termCode);

    List<AttendanceAuditLog> findByTenantIdAndTermCodeAndActionTypeOrderByCreatedAtDesc(
            String tenantId, String termCode, AuditActionType actionType);
}
