package com.ezone.auth.util;

import com.ezone.auth.enums.Role;
import java.util.UUID;

public class IdGenerator {
    
    public static String generateId(Role role) {
        String prefix;
        switch (role) {
            case STUDENT: prefix = "STU"; break;
            case TEACHER: prefix = "TCH"; break;
            case ADMIN: prefix = "ADM"; break;
            default: prefix = "USR";
        }
        // Simple generation logic, usually would involve database sequence
        String uniqueSuffix = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return prefix + uniqueSuffix;
    }
}
