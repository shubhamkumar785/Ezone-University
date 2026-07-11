package com.ezone.auth.service.impl;

import com.ezone.auth.dto.LoginResponse;
import com.ezone.auth.dto.SendOtpRequest;
import com.ezone.auth.dto.VerifyOtpRequest;
import com.ezone.auth.entity.User;
import com.ezone.auth.enums.AccountStatus;
import com.ezone.auth.exception.RateLimitException;
import com.ezone.auth.exception.UserNotFoundException;
import com.ezone.auth.repository.UserRepository;
import com.ezone.auth.service.AuthService;
import com.ezone.auth.service.EmailService;
import com.ezone.auth.service.EmailTemplateService;
import com.ezone.auth.service.JwtService;
import com.ezone.auth.service.OtpService;
import com.ezone.auth.validator.LoginValidator;
import com.ezone.auth.validator.OtpValidator;
import com.ezone.auth.config.RateLimitConfig;
import io.github.bucket4j.Bucket;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final OtpService otpService;
    private final EmailService emailService;
    private final EmailTemplateService emailTemplateService;
    private final JwtService jwtService;
    private final LoginValidator loginValidator;
    private final OtpValidator otpValidator;
    private final RateLimitConfig rateLimitConfig;

    @Override
    @Transactional
    public void sendOtp(SendOtpRequest request) {
        log.info("Received Login ID: {}", request.getLoginId());
        try {
            loginValidator.validate(request);

            Bucket bucket = rateLimitConfig.resolveBucket(request.getLoginId());
            if (!bucket.tryConsume(1)) {
                log.error("Rate limit exceeded for Login ID: {}", request.getLoginId());
                throw new RateLimitException("Maximum OTP requests exceeded. Please try again later.");
            }

            User user = userRepository.findByLoginId(request.getLoginId())
                    .orElseThrow(() -> {
                        log.error("User not found with login ID: {}", request.getLoginId());
                        return new UserNotFoundException("User not found with login ID: " + request.getLoginId());
                    });
            
            log.info("User Found: {}", user.getLoginId());

            if (user.getAccountStatus() != AccountStatus.ACTIVE) {
                log.error("Account inactive for user: {}", user.getLoginId());
                throw new IllegalArgumentException("Account is not active.");
            }

            log.info("Generating OTP for user: {}", user.getLoginId());
            String otpCode = otpService.generateAndSaveOtp(user);
            log.info("OTP Saved Successfully for user: {}", user.getLoginId());
            
            String subject = emailTemplateService.getOtpEmailSubject();
            String body = emailTemplateService.getOtpEmailBody(user, otpCode);
            
            log.info("Sending Email to: {}", user.getEmail());
            emailService.sendOtpEmail(user.getEmail(), subject, body);
            log.info("Email Sent Successfully to: {}", user.getEmail());
            
            user.setLastOtpSentTime(LocalDateTime.now());
            userRepository.save(user);
            log.info("Returning Response for Send OTP.");
        } catch (Exception e) {
            log.error("Failed during sendOtp for loginId: {}. Reason: {}", request.getLoginId(), e.getMessage(), e);
            throw e;
        }
    }

    @Override
    @Transactional
    public LoginResponse verifyOtp(VerifyOtpRequest request) {
        otpValidator.validate(request);

        User user = userRepository.findByLoginId(request.getLoginId())
                .orElseThrow(() -> new UserNotFoundException("User not found with login ID: " + request.getLoginId()));

        otpService.verifyOtp(user, request.getOtp());

        user.setLastLogin(LocalDateTime.now());
        user.setFailedLoginAttempts(0);
        userRepository.save(user);

        String jwtToken = jwtService.generateToken(user.getLoginId(), user.getRole());

        return LoginResponse.builder()
                .jwtToken(jwtToken)
                .loginId(user.getLoginId())
                .fullName(user.getFullName())
                .role(user.getRole())
                .expiresIn(jwtService.getExpirationTime())
                .build();
    }

    @Override
    @Transactional
    public void logout(String loginId) {
        // Since JWT is stateless, real logout is handled client-side by dropping the token.
        // For a stateful approach, we could blacklist the token here.
        // We will just verify the user exists for completeness.
        userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new UserNotFoundException("User not found with login ID: " + loginId));
    }
}
