package com.ezone.auth.service;

import com.ezone.auth.entity.User;

public interface EmailTemplateService {
    String getOtpEmailSubject();
    String getOtpEmailBody(User user, String otpCode);
}
