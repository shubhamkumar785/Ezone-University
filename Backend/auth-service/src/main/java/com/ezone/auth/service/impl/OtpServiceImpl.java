package com.ezone.auth.service.impl;

import com.ezone.auth.entity.Otp;
import com.ezone.auth.entity.User;
import com.ezone.auth.exception.InvalidOtpException;
import com.ezone.auth.exception.OtpAlreadyUsedException;
import com.ezone.auth.exception.OtpExpiredException;
import com.ezone.auth.repository.OtpRepository;
import com.ezone.auth.service.OtpService;
import com.ezone.auth.util.OtpGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private final OtpRepository otpRepository;
    private static final int OTP_EXPIRY_MINUTES = 30;

    @Override
    public String generateAndSaveOtp(User user) {
        String otpCode = OtpGenerator.generateOtp();
        
        Otp otp = Otp.builder()
                .user(user)
                .otpCode(otpCode)
                .expiryTime(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES))
                .used(false)
                .build();
                
        otpRepository.save(otp);
        return otpCode;
    }

    @Override
    public void verifyOtp(User user, String otpCode) {
        Otp otp = otpRepository.findByUserAndOtpCodeAndUsedFalse(user, otpCode)
                .orElseThrow(() -> new InvalidOtpException("Invalid OTP or OTP does not match."));

        otp.setAttemptCount(otp.getAttemptCount() + 1);

        if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
            otpRepository.save(otp);
            throw new OtpExpiredException("OTP has expired.");
        }

        if (otp.isUsed()) {
            throw new OtpAlreadyUsedException("OTP has already been used.");
        }

        otp.setUsed(true);
        otp.setVerifiedAt(LocalDateTime.now());
        otpRepository.save(otp);
    }
}
