package com.ezone.auth.service;

import com.ezone.auth.dto.LoginResponse;
import com.ezone.auth.dto.SendOtpRequest;
import com.ezone.auth.dto.VerifyOtpRequest;

public interface AuthService {
    void sendOtp(SendOtpRequest request);
    LoginResponse verifyOtp(VerifyOtpRequest request);
    void logout(String loginId);

}
