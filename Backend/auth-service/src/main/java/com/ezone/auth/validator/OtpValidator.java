package com.ezone.auth.validator;

import com.ezone.auth.dto.VerifyOtpRequest;
import org.springframework.stereotype.Component;

@Component
public class OtpValidator {
    public void validate(VerifyOtpRequest request) {
        if (request.getLoginId() == null || request.getLoginId().trim().isEmpty()) {
            throw new IllegalArgumentException("Login ID cannot be empty");
        }
        if (request.getOtp() == null || request.getOtp().trim().isEmpty() || request.getOtp().length() != 6) {
            throw new IllegalArgumentException("Invalid OTP format");
        }
    }
}
