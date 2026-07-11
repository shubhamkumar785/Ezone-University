package com.ezone.auth.dto;

import com.ezone.auth.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String jwtToken;
    private String loginId;
    private String fullName;
    private Role role;
    private long expiresIn;
}
