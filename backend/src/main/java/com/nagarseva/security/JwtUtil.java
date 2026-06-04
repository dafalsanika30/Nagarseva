package com.nagarseva.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;

    private Key key;

    @PostConstruct
    public void init() {
        // Use plain string → no Base64 decode
        key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Generate JWT
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract email
    public String getEmail(String token) {
        return getClaims(token).getSubject();
    }

    // Extract role
    public String getRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    // Validate token (IMPORTANT FIX)
    public boolean isValid(String token, String email) {
        return getEmail(token).equals(email) && !isExpired(token);
    }

    // Check expiration
    public boolean isExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }

    // Get claims
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}