// service/AuthService.java
package com.nagarseva.service;

import com.nagarseva.dto.request.LoginRequest;
import com.nagarseva.dto.request.RegisterRequest;
import com.nagarseva.dto.response.AuthResponse;
import com.nagarseva.entity.Citizen;
import com.nagarseva.enums.UserRole;
import com.nagarseva.exception.ResourceNotFoundException;
import com.nagarseva.repository.CitizenRepository;
import com.nagarseva.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final CitizenRepository     citizenRepository;
    private final PasswordEncoder       passwordEncoder;
    private final JwtUtil               jwtUtil;
    private final AuthenticationManager authManager;
//     private final EmailService emailService;

    // Register new citizen
    public void register(RegisterRequest req) {

        if (citizenRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered.");
        }
        if (citizenRepository.existsByMobile(req.getMobile())) {
            throw new RuntimeException("Mobile already registered.");
        }

        Citizen citizen = new Citizen();
        citizen.setName(req.getName());
        citizen.setEmail(req.getEmail());
        citizen.setMobile(req.getMobile());
        citizen.setAddress(req.getAddress());
        citizen.setRole(UserRole.CITIZEN);
        citizen.setPassword(
                passwordEncoder.encode(req.getPassword())
        );

        Citizen saved = citizenRepository.save(citizen);

        // Send welcome email in background
        // emailService.sendWelcomeEmail(
        //         saved.getEmail(),
        //         saved.getName()
        // );

    }

    // Login — returns JWT token
    public AuthResponse login(LoginRequest req) {

        // Spring Security verifies email + password
        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            req.getEmail(),
                            req.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid email or password.");
        }

        Citizen citizen = citizenRepository
                .findByEmail(req.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        if (!citizen.isActive()) {
            throw new RuntimeException(
                    "Your account has been blocked. Contact admin."
            );
        }

        String token = jwtUtil.generateToken(
                citizen.getEmail(),
                citizen.getRole().name()
        );

        return AuthResponse.builder()
                .token(token)
                .id(citizen.getId())
                .name(citizen.getName())
                .email(citizen.getEmail())
                .role(citizen.getRole().name())
                .build();
    }
}