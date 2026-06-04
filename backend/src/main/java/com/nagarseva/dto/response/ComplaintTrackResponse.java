// dto/response/ComplaintTrackResponse.java
// Used for public tracking — no auth needed

package com.nagarseva.dto.response;

import com.nagarseva.entity.Complaint;
import com.nagarseva.entity.ComplaintUpdate;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class ComplaintTrackResponse {

    private Long id;

    private String title;

    private String description;

    private String status;

    private String attachmentUrl;

    private String citizenName;

    private String priority;

    private String location;

    private String departmentName;

    private String departmentIcon;

    private String departmentColor;

    private String createdAt;

    private String slaDeadline;

    private boolean slaBreached;

    private List<ComplaintUpdateResponse> timeline;

    public static ComplaintTrackResponse from(

            Complaint c,

            List<ComplaintUpdate> updates

    ) {

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

        return ComplaintTrackResponse.builder()

                .id(c.getId())

                .title(
                        c.getTitle()
                )

                .description(
                        c.getDescription()
                )

                .status(
                        c.getStatus().name()
                )

                .attachmentUrl(
                        c.getAttachmentUrl()
                )

                .priority(
                        c.getPriority().name()
                )

                .location(
                        c.getLocation()
                )

                .departmentName(
                        c.getDepartment()
                                .getType()
                                .getDisplayName()
                )

                .departmentIcon(
                        c.getDepartment()
                                .getType()
                                .getIconClass()
                )

                .departmentColor(
                        c.getDepartment()
                                .getType()
                                .getColor()
                )

                .createdAt(
                        c.getCreatedAt()
                                .toString()
                )

                .citizenName(

                        c.getCitizen() != null

                                ? c.getCitizen().getName()

                                : "Unknown Citizen"
                )

                .slaDeadline(
                        deadline
                )

                .slaBreached(
                        breached
                )

                .timeline(

                        updates.stream()

                                .map(
                                        ComplaintUpdateResponse::from
                                )

                                .collect(
                                        Collectors.toList()
                                )
                )

                .build();
    }
}