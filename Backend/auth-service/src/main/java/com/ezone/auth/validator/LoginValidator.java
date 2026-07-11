package com.ezone.auth.validator;

import com.ezone.auth.dto.SendOtpRequest;
import org.springframework.stereotype.Component;

@Component
public class LoginValidator {
    public void validate(SendOtpRequest request) {
        if (request.getLoginId() == null || request.getLoginId().trim().isEmpty()) {
            throw new IllegalArgumentException("Login ID cannot be empty");
        }
    }
}
