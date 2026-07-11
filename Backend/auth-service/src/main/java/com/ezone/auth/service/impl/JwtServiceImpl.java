package com.ezone.auth.service.impl;

import com.ezone.auth.enums.Role;
import com.ezone.auth.service.JwtService;
import com.ezone.auth.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JwtServiceImpl implements JwtService {

    private final JwtUtil jwtUtil;

    @Override
    public String generateToken(String loginId, Role role) {
        return jwtUtil.generateToken(loginId, role);
    }

    @Override
    public boolean validateToken(String token, String loginId) {
        return jwtUtil.validateToken(token, loginId);
    }

    @Override
    public String extractLoginId(String token) {
        return jwtUtil.extractLoginId(token);
    }

    @Override
    public String extractRole(String token) {
        return jwtUtil.extractRole(token);
    }

    @Override
    public long getExpirationTime() {
        return jwtUtil.getExpirationTime();
    }
}
