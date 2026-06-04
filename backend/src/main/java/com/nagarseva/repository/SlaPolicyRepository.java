// repository/SlaPolicyRepository.java
package com.nagarseva.repository;

import com.nagarseva.entity.SlaPolicy;
import com.nagarseva.enums.DepartmentType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SlaPolicyRepository
        extends JpaRepository<SlaPolicy, Long> {

    // Find SLA policy by department type
    // Used when complaint is submitted to get deadline hours
    // Also used by admin to update SLA policy
    Optional<SlaPolicy> findByDepartmentType(DepartmentType type);
}