package com.ezone.dashboard.repository;

import com.ezone.dashboard.entity.StudentNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentNotificationRepository extends JpaRepository<StudentNotification, Long> {
    List<StudentNotification> findTop5ByLoginIdOrderByCreatedAtDesc(String loginId);
    List<StudentNotification> findByLoginIdOrderByCreatedAtDesc(String loginId);
}
