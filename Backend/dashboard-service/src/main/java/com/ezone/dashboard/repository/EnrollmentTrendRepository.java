package com.ezone.dashboard.repository;

import com.ezone.dashboard.entity.EnrollmentTrend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnrollmentTrendRepository extends JpaRepository<EnrollmentTrend, Long> {
}
