// entity/Department.java
package com.nagarseva.entity;

import com.nagarseva.enums.DepartmentType;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "departments")
@Data
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private DepartmentType type;

    @Column(nullable = false)
    private String officerName;

    @Column(nullable = false)
    private String contactEmail;

    private boolean active = true;
}