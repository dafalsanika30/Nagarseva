// dto/response/DepartmentResponse.java
package com.nagarseva.dto.response;

import com.nagarseva.entity.Department;
import com.nagarseva.enums.DepartmentType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DepartmentResponse {

    private Long    id;
    private String  type;           // WATER_SUPPLY
    private String  displayName;    // Water Supply
    private String  iconClass;      // bi-droplet-fill
    private String  color;          // #0ea5e9
    private String  bgColor;        // #e0f2fe
    private String  officerName;
    private String  contactEmail;
    private boolean active;
    private int     defaultSlaHours;

    // Stats — computed in service
    private long   openComplaints;
    private long   resolvedComplaints;
    private double slaPercentage;

    public static DepartmentResponse from(Department dept,
                                          long open,
                                          long resolved,
                                          double sla) {
        DepartmentType t = dept.getType();
        return DepartmentResponse.builder()
                .id(dept.getId())
                .type(t.name())
                .displayName(t.getDisplayName())
                .iconClass(t.getIconClass())
                .color(t.getColor())
                .bgColor(t.getBgColor())
                .officerName(dept.getOfficerName())
                .contactEmail(dept.getContactEmail())
                .active(dept.isActive())
                .defaultSlaHours(t.getDefaultSlaHours())
                .openComplaints(open)
                .resolvedComplaints(resolved)
                .slaPercentage(sla)
                .build();
    }
}