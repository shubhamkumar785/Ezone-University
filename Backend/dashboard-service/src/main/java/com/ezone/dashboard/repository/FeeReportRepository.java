package com.ezone.dashboard.repository;

import com.ezone.dashboard.entity.FeeReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeeReportRepository extends JpaRepository<FeeReport, Long> {
}
