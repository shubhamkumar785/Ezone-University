package com.ezone.auth.config;

import java.time.LocalDateTime;
import java.util.Arrays;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.ezone.auth.entity.User;
import com.ezone.auth.enums.AccountStatus;
import com.ezone.auth.enums.Role;
import com.ezone.auth.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AuthDataSeeder implements CommandLineRunner {
    
    private final UserRepository userRepository;
    
    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            System.out.println("✅ Seeding test users...");
            seedUsers();
            System.out.println("✅ Test users seeded successfully");
        }
    }
    
    private void seedUsers() {
        // Admin User
        User admin = User.builder()
                .loginId("admin")
                .fullName("System Administrator")
                .email("admin@ezone.edu")
                .phone("+91-9999999999")
                .role(Role.ADMIN)
                .accountStatus(AccountStatus.ACTIVE)
                .lastLogin(LocalDateTime.now())
                .build();
        
        // Teacher Users
        User teacher1 = User.builder()
                .loginId("teacher001")
                .fullName("Dr. Rajesh Kumar")
                .email("rajesh.kumar@ezone.edu")
                .phone("+91-9876543200")
                .role(Role.TEACHER)
                .accountStatus(AccountStatus.ACTIVE)
                .lastLogin(LocalDateTime.now())
                .build();
        
        // Student Users (matching dashboard-service Student entities)
        User student1 = User.builder()
                .loginId("2024CSE001")
                .fullName("Rahul Kumar")
                .email("rahul.kumar@ezone.edu")
                .phone("+91-9876543210")
                .role(Role.STUDENT)
                .accountStatus(AccountStatus.ACTIVE)
                .lastLogin(LocalDateTime.now())
                .build();
        
        User student2 = User.builder()
                .loginId("2024CSE002")
                .fullName("Priya Sharma")
                .email("priya.sharma@ezone.edu")
                .phone("+91-9876543211")
                .role(Role.STUDENT)
                .accountStatus(AccountStatus.ACTIVE)
                .lastLogin(LocalDateTime.now())
                .build();
        
        User student3 = User.builder()
                .loginId("2024ME001")
                .fullName("Amit Verma")
                .email("amit.verma@ezone.edu")
                .phone("+91-9876543212")
                .role(Role.STUDENT)
                .accountStatus(AccountStatus.ACTIVE)
                .lastLogin(LocalDateTime.now())
                .build();
        
        userRepository.saveAll(Arrays.asList(admin, teacher1, student1, student2, student3));
        System.out.println("Created 5 test users: 1 admin, 1 teacher, 3 students");
    }
}
