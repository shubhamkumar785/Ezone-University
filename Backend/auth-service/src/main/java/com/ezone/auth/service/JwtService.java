package com.ezone.auth.service;

import com.ezone.auth.enums.Role;

public interface JwtService {
    String generateToken(String loginId, Role role);
    boolean validateToken(String token, String loginId);
    String extractLoginId(String token);
    String extractRole(String token);
    long getExpirationTime();
}
