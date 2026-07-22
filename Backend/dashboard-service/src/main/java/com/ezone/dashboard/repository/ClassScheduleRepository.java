package com.ezone.dashboard.repository;

import com.ezone.dashboard.entity.ClassSchedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassScheduleRepository extends JpaRepository<ClassSchedule, Long> {

    /**
     * Fetch all active class schedules for a set of enrollment IDs within a term.
     * Used by the Day Wise Attendance service to determine which periods have scheduled classes.
     */
    List<ClassSchedule> findByEnrollmentIdInAndTermCodeAndStatus(
            List<Long> enrollmentIds, String termCode, String status);

    /**
     * Fetch schedules with tenant isolation.
     * Always prefer this overload in production multi-tenant queries.
     */
    List<ClassSchedule> findByEnrollmentIdInAndTermCodeAndStatusAndTenantId(
            List<Long> enrollmentIds, String termCode, String status, String tenantId);
}
