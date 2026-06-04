// entity/SlaPolicy.java
package com.nagarseva.entity;

import com.nagarseva.enums.DepartmentType;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "sla_policies")
@Data
public class SlaPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private DepartmentType departmentType;

    @Column(nullable = false)
    private int slaHours;

    @Column(nullable = false)
    private int escalationHours;
}