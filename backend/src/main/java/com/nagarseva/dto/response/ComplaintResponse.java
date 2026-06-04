// dto/response/ComplaintResponse.java

package com.nagarseva.dto.response;

import com.nagarseva.entity.Complaint;
import com.nagarseva.enums.DepartmentType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ComplaintResponse {

    private Long id;

    private String title;

    private String description;

    private String location;

    private String status;

    private String priority;

    private String attachmentUrl;

    private String createdAt;

    private String updatedAt;

    // Citizen info
    private Long citizenId;

    private String citizenName;

    private String citizenEmail;

    private String citizenMobile;

    // Department info
    private Long departmentId;

    private String departmentName;

    private String departmentIcon;

    private String departmentColor;

    private String departmentBg;

    // SLA info
    private String slaDeadline;

    private boolean slaBreached;

    // Timeline / audit log
    private java.util.List<ComplaintUpdateResponse> updates;

    // Convert entity → DTO
    public static ComplaintResponse from(
            Complaint c
    ) {

        DepartmentType type =
                c.getDepartment()
                        .getType();

        String deadline = null;

        boolean breached = false;

        if (c.getSla() != null) {

            deadline =
                    c.getSla()
                            .getDeadline()
                            .toString();

            breached =
                    c.getSla()
                            .isBreached();
        }

        return ComplaintResponse.builder()

                .id(
                        c.getId()
                )

                .title(
                        c.getTitle()
                )

                .description(
                        c.getDescription()
                )

                .location(
                        c.getLocation()
                )

                .status(
                        c.getStatus().name()
                )

                .priority(
                        c.getPriority().name()
                )

                .attachmentUrl(
                        c.getAttachmentUrl()
                )

                .createdAt(
                        c.getCreatedAt().toString()
                )

                .updatedAt(
                        c.getUpdatedAt().toString()
                )

                // Citizen
                .citizenId(
                        c.getCitizen().getId()
                )

                .citizenName(
                        c.getCitizen().getName()
                )

                .citizenEmail(
                        c.getCitizen().getEmail()
                )

                .citizenMobile(
                        c.getCitizen().getMobile()
                )

                // Department
                .departmentId(
                        c.getDepartment().getId()
                )

                .departmentName(
                        type.getDisplayName()
                )

                .departmentIcon(
                        type.getIconClass()
                )

                .departmentColor(
                        type.getColor()
                )

                .departmentBg(
                        type.getBgColor()
                )

                // SLA
                .slaDeadline(
                        deadline
                )

                .slaBreached(
                        breached
                )

                .build();
    }
}