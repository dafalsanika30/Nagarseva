// entity/ComplaintUpdate.java
package com.nagarseva.entity;

import com.nagarseva.enums.ComplaintStatus;
import com.nagarseva.enums.UserRole;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaint_updates")
@Data
public class ComplaintUpdate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaint complaint;

    private Long updatedBy;         // citizen/officer/admin id

    @Enumerated(EnumType.STRING)
    private UserRole updatedByRole;

    @Enumerated(EnumType.STRING)
    private ComplaintStatus oldStatus;

    @Enumerated(EnumType.STRING)
    private ComplaintStatus newStatus;

    @Column(columnDefinition = "TEXT")
    private String remark;

    @CreationTimestamp
    private LocalDateTime createdAt;
}