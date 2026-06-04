// repository/ComplaintUpdateRepository.java
package com.nagarseva.repository;

import com.nagarseva.entity.ComplaintUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintUpdateRepository
        extends JpaRepository<ComplaintUpdate, Long> {

    // Get full timeline for a complaint
    List<ComplaintUpdate> findByComplaintIdOrderByCreatedAtAsc(
            Long complaintId
    );
}