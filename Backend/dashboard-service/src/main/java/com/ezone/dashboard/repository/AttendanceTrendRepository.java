package com.ezone.dashboard.repository;

import com.ezone.dashboard.entity.AttendanceTrend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttendanceTrendRepository extends JpaRepository<AttendanceTrend, Long> {
}
