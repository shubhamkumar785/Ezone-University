package com.ezone.dashboard.repository;

import com.ezone.dashboard.entity.RecentActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecentActivityRepository extends JpaRepository<RecentActivity, Long> {
}
