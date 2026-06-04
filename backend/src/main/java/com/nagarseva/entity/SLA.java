// entity/SLA.java
package com.nagarseva.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "sla")
@Data
public class SLA {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaint complaint;

    @Column(nullable = false)
    private LocalDateTime deadline;

    private boolean breached = false;

    private LocalDateTime breachedAt;

    @CreationTimestamp
    private LocalDateTime createdAt;
}