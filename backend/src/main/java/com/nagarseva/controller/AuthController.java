// controller/AuthController.java
package com.nagarseva.controller;

import com.nagarseva.dto.request.LoginRequest;
import com.nagarseva.dto.request.RegisterRequest;
import com.nagarseva.dto.response.ApiResponse;
import com.nagarseva.dto.response.AuthResponse;
import com.nagarseva.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(
            @RequestBody @Valid RegisterRequest req) {
        authService.register(req);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Registration successful", null));
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @RequestBody @Valid LoginRequest req) {
        return ResponseEntity.ok(
                ApiResponse.ok(authService.login(req))
        );
    }
}