package com.ezone.auth.repository;

import com.ezone.auth.entity.Otp;
import com.ezone.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {
    Optional<Otp> findTopByUserOrderByCreatedAtDesc(User user);
    Optional<Otp> findByUserAndOtpCodeAndUsedFalse(User user, String otpCode);
}
