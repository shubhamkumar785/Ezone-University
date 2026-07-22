package com.ezone.dashboard.repository;

import com.ezone.dashboard.entity.AttendanceRecord;
import com.ezone.dashboard.entity.AttendanceSessionStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {

    List<AttendanceRecord> findByEnrollmentId(Long enrollmentId);

    /**
     * Fetch all attendance records for a batch of enrollments within a date range.
     * Used by the Day Wise Attendance service — month-scoped, never semester-wide.
     */
    List<AttendanceRecord> findByEnrollmentIdInAndAttendanceDateBetween(
            List<Long> enrollmentIds, LocalDate startDate, LocalDate endDate);

    /**
     * Fetch only student-visible records (excludes DRAFT).
     * Enforces the attendance lock lifecycle: students see SUBMITTED, VERIFIED, LOCKED only.
     */
    @Query("SELECT a FROM AttendanceRecord a " +
           "WHERE a.enrollmentId IN :enrollmentIds " +
           "AND a.attendanceDate BETWEEN :startDate AND :endDate " +
           "AND (a.lockStatus IS NULL OR a.lockStatus <> :draftStatus)")
    List<AttendanceRecord> findVisibleByEnrollmentIdInAndDateRange(
            @Param("enrollmentIds") List<Long> enrollmentIds,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("draftStatus") AttendanceSessionStatus draftStatus);

    @Query("SELECT COUNT(a) FROM AttendanceRecord a WHERE a.enrollmentId = :enrollmentId")
    Long countTotalByEnrollmentId(@Param("enrollmentId") Long enrollmentId);

    @Query("SELECT COUNT(a) FROM AttendanceRecord a WHERE a.enrollmentId = :enrollmentId AND a.status = 'PRESENT'")
    Long countPresentByEnrollmentId(@Param("enrollmentId") Long enrollmentId);

    @Query("SELECT COUNT(a) FROM AttendanceRecord a WHERE a.enrollmentId = :enrollmentId AND a.status = 'ABSENT'")
    Long countAbsentByEnrollmentId(@Param("enrollmentId") Long enrollmentId);

    @Query("SELECT COUNT(a) FROM AttendanceRecord a WHERE a.enrollmentId = :enrollmentId AND a.status = 'MEDICAL'")
    Long countMedicalByEnrollmentId(@Param("enrollmentId") Long enrollmentId);

    @Query("SELECT COUNT(a) FROM AttendanceRecord a WHERE a.enrollmentId = :enrollmentId AND a.status = 'EVENT'")
    Long countEventByEnrollmentId(@Param("enrollmentId") Long enrollmentId);
}
