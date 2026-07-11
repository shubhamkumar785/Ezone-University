package com.ezone.dashboard.repository;

import com.ezone.dashboard.entity.DashboardOverview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DashboardOverviewRepository extends JpaRepository<DashboardOverview, Long> {
}
