// service/CustomUserDetailsService.java
package com.nagarseva.service;

import com.nagarseva.entity.Citizen;
import com.nagarseva.repository.CitizenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final CitizenRepository citizenRepository;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        Citizen citizen = citizenRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found: " + email
                        )
                );

        // Role must be prefixed with ROLE_ for Spring Security
        return new org.springframework.security.core.userdetails.User(
                citizen.getEmail(),
                citizen.getPassword(),
                citizen.isActive(),
                true, true, true,
                List.of(new SimpleGrantedAuthority(
                        "ROLE_" + citizen.getRole().name()
                ))
        );
    }
}