// repository/SlaRepository.java
package com.nagarseva.repository;

import com.nagarseva.entity.Department;
import com.nagarseva.entity.SLA;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface SlaRepository
        extends JpaRepository<SLA, Long> {

    long countByBreachedTrue();

    List<SLA> findByBreachedTrue();

    long countByComplaint_DepartmentAndBreachedTrue(
            Department dept
    );

    // Used by breach scheduler
    List<SLA> findByBreachedFalseAndDeadlineBefore(
            LocalDateTime now
    );

    // Used by warning scheduler  ← NEW
    List<SLA> findByBreachedFalseAndDeadlineBetween(
            LocalDateTime from,
            LocalDateTime to
    );
}