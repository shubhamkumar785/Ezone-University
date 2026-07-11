package com.ezone.auth.service.impl;

import com.ezone.auth.entity.User;
import com.ezone.auth.service.EmailTemplateService;
import org.springframework.stereotype.Service;

@Service
public class EmailTemplateServiceImpl implements EmailTemplateService {

    @Override
    public String getOtpEmailSubject() {
        return "EZone University Login OTP";
    }

    @Override
    public String getOtpEmailBody(User user, String otpCode) {
        return String.format(
                "Hello %s\n\nYour OTP is:\n\n%s\n\nOTP expires in 30 minutes.\n\nDo not share this OTP.",
                user.getFullName(), otpCode
        );
    }
}
