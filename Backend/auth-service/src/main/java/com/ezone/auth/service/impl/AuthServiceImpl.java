package com.ezone.auth.service.impl;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ezone.auth.config.RateLimitConfig;
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

import io.github.bucket4j.Bucket;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

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
    
    // TODO: TEMPORARY - Bypass authentication for testing dashboards
    @Override
    @Transactional
    public LoginResponse bypassLogin(String loginId, String requestedRole) {
        log.warn("⚠️ BYPASS LOGIN USED - This is for testing only! LoginId: {}, Role: {}", loginId, requestedRole);
        
        // Try to find the user, if not found, return a default response based on loginId pattern or requested role
        User user = userRepository.findByLoginId(loginId).orElse(null);
        
        if (user != null) {
            // User found - use their actual data
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
        } else {
            // User not found - create a mock response based on requested role or loginId
            String role = "STUDENT"; // default
            String fullName = "Test User";
            
            if (requestedRole != null && !requestedRole.isBlank()) {
                role = requestedRole.toUpperCase();
                fullName = "Test " + role.substring(0, 1).toUpperCase() + role.substring(1).toLowerCase();
            } else if (loginId != null) {
                String lowerLoginId = loginId.toLowerCase();
                if (lowerLoginId.contains("admin")) {
                    role = "ADMIN";
                    fullName = "Test Admin";
                } else if (lowerLoginId.contains("teacher") || lowerLoginId.contains("faculty") || lowerLoginId.startsWith("tch")) {
                    role = "TEACHER";
                    fullName = "Test Teacher";
                } else if (lowerLoginId.contains("student")) {
                    role = "STUDENT";
                    fullName = "Test Student";
                }
            }
            
            log.warn("⚠️ User not found in DB, generating mock response for: {} with role: {}", loginId, role);
            
            String jwtToken = jwtService.generateToken(loginId, com.ezone.auth.enums.Role.valueOf(role));
            
            return LoginResponse.builder()
                    .jwtToken(jwtToken)
                    .loginId(loginId)
                    .fullName(fullName)
                    .role(com.ezone.auth.enums.Role.valueOf(role))
                    .expiresIn(jwtService.getExpirationTime())
                    .build();
        }
    }
}
