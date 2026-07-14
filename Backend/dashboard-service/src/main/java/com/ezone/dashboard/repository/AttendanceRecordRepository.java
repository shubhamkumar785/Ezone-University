package com.ezone.dashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ezone.dashboard.entity.AttendanceRecord;

@Repository
public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {
    List<AttendanceRecord> findByEnrollmentId(Long enrollmentId);
    
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
