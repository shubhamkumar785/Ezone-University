package com.ezone.dashboard.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ezone.dashboard.entity.AcademicCalendar;

@Repository
public interface AcademicCalendarRepository extends JpaRepository<AcademicCalendar, Long> {
    List<AcademicCalendar> findByEventDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT a FROM AcademicCalendar a WHERE a.eventDate >= :startDate AND a.eventDate <= :endDate AND (a.termCode = :termCode OR a.termCode IS NULL)")
    List<AcademicCalendar> findByDateRangeAndTerm(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("termCode") String termCode);
}
