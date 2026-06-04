// repository/DepartmentRepository.java
package com.nagarseva.repository;

import com.nagarseva.entity.Department;
import com.nagarseva.enums.DepartmentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface DepartmentRepository
        extends JpaRepository<Department, Long> {

    Optional<Department> findByType(DepartmentType type);

    // Find department by officer's email
    // Used when officer logs in
    @Query("SELECT d FROM Department d " +
            "WHERE d.contactEmail = :email")
    Optional<Department> findByOfficerEmail(
            @Param("email") String email
    );
}