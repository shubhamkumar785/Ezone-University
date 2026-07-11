package com.ezone.auth.service;

public interface EmailService {
    void sendOtpEmail(String to, String subject, String body);
}
