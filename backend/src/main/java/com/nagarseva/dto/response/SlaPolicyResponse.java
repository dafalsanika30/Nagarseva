// dto/response/SlaPolicyResponse.java
package com.nagarseva.dto.response;

import com.nagarseva.entity.SlaPolicy;
import com.nagarseva.enums.DepartmentType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SlaPolicyResponse {

    private Long   id;
    private String departmentType;   // WATER_SUPPLY
    private String displayName;      // Water Supply
    private String iconClass;        // bi-droplet-fill
    private int    slaHours;
    private int    escalationHours;

    public static SlaPolicyResponse from(SlaPolicy p) {
        DepartmentType type = p.getDepartmentType();
        return SlaPolicyResponse.builder()
                .id(p.getId())
                .departmentType(type.name())
                .displayName(type.getDisplayName())
                .iconClass(type.getIconClass())
                .slaHours(p.getSlaHours())
                .escalationHours(p.getEscalationHours())
                .build();
    }
}