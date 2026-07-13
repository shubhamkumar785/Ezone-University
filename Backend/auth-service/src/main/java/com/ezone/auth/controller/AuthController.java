package com.ezone.auth.controller;

import com.ezone.auth.dto.LoginResponse;
import com.ezone.auth.dto.SendOtpRequest;
import com.ezone.auth.dto.VerifyOtpRequest;
import com.ezone.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        // TODO: TEMPORARY - Bypass OTP validation for testing
        // Just return success without checking database or sending email
        return ResponseEntity.ok().body(java.util.Map.of("message", "OTP sent successfully to registered email."));
        
        // COMMENTED OUT - Original OTP sending
        // authService.sendOtp(request);
        // return ResponseEntity.ok().body(java.util.Map.of("message", "OTP sent successfully to registered email."));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<LoginResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        // TODO: TEMPORARY - Bypass authentication for testing
        LoginResponse response = authService.bypassLogin(request.getLoginId());
        return ResponseEntity.ok(response);
        
        // COMMENTED OUT - Original OTP verification
        // LoginResponse response = authService.verifyOtp(request);
        // return ResponseEntity.ok(response);
    }
    
    // TODO: TEMPORARY - Direct login bypass endpoint for testing dashboards
    @PostMapping("/bypass-login")
    public ResponseEntity<LoginResponse> bypassLogin(@RequestBody java.util.Map<String, String> request) {
        String loginId = request.get("loginId");
        LoginResponse response = authService.bypassLogin(loginId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String token) {
        // In a stateless JWT system, the client deletes the token. 
        // We return a 200 OK to acknowledge the logout request.
        return ResponseEntity.ok().body(java.util.Map.of("message", "Logged out successfully"));
    }
}
