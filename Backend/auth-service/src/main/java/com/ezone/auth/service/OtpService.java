package com.ezone.auth.service;

import com.ezone.auth.entity.User;

public interface OtpService {
    String generateAndSaveOtp(User user);
    void verifyOtp(User user, String otpCode);
}
