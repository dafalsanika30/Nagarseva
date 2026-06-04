// repository/CitizenRepository.java
package com.nagarseva.repository;

import com.nagarseva.entity.Citizen;
import com.nagarseva.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CitizenRepository
        extends JpaRepository<Citizen, Long> {

    // Find by email — used in login + JWT filter
    Optional<Citizen> findByEmail(String email);

    // Check email exists — used in register
    boolean existsByEmail(String email);

    // Check mobile exists — used in register
    boolean existsByMobile(String mobile);

    // Count all citizens — used in dashboard stats
    long countByRole(UserRole role);

    // Get all citizens by role with pagination
    // Used in admin → citizens tab
    Page<Citizen> findByRole(UserRole role, Pageable pageable);

    // Search citizens by name OR email
    // Used in admin → citizens search
    Page<Citizen> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String name,
            String email,
            Pageable pageable
    );
}