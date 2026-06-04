// repository/ComplaintRepository.java
package com.nagarseva.repository;

import com.nagarseva.dto.response.MonthlyTrendResponse;
import com.nagarseva.entity.Complaint;
import com.nagarseva.entity.Department;
import com.nagarseva.enums.ComplaintStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ComplaintRepository
        extends JpaRepository<Complaint, Long> {

    // Count by status
    long countByStatus(ComplaintStatus status);

    // Count by department
    long countByDepartment(Department department);

    // Count by dept + status
    long countByDepartmentAndStatus(
            Department dept, ComplaintStatus status
    );

    // Citizen's own complaints
    Page<Complaint> findByCitizenEmailOrderByCreatedAtDesc(
            String email, Pageable pageable
    );

    // Department officer's complaints
    Page<Complaint> findByDepartmentIdOrderByCreatedAtDesc(
            Long departmentId, Pageable pageable
    );

    // Admin filter query
    @Query("""
        SELECT c FROM Complaint c
        WHERE (:status     IS NULL
               OR CAST(c.status   AS string) = :status)
        AND   (:priority   IS NULL
               OR CAST(c.priority AS string) = :priority)
        AND   (:deptId     IS NULL
               OR c.department.id = :deptId)
        ORDER BY c.createdAt DESC
        """)
    Page<Complaint> findByFilters(
            @Param("status")   String status,
            @Param("priority") String priority,
            @Param("deptId")   Long   departmentId,
            Pageable pageable
    );

    // Monthly trend — last 6 months
    @Query(value = """
            SELECT
                DATE_FORMAT(created_at, '%b %Y') AS month,
                COUNT(*) AS total,
                SUM(status = 'RESOLVED') AS resolved,
                SUM(status = 'OPEN') AS openCount
            FROM complaints
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY DATE_FORMAT(created_at, '%b %Y')
            ORDER BY MIN(created_at) ASC;
        """, nativeQuery = true)
    List<MonthlyTrendResponse> getMonthlyTrend();
}