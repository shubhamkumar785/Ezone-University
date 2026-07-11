package com.ezone.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VerifyOtpRequest {
    @NotBlank(message = "Login ID cannot be blank")
    private String loginId;

    @NotBlank(message = "OTP cannot be blank")
    private String otp;
}
