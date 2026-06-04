// dto/response/ComplaintUpdateResponse.java
package com.nagarseva.dto.response;

import com.nagarseva.entity.ComplaintUpdate;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ComplaintUpdateResponse {

    private Long   id;
    private String oldStatus;
    private String newStatus;
    private String remark;
    private String updatedByRole;
    private String createdAt;

    public static ComplaintUpdateResponse from(ComplaintUpdate u) {
        return ComplaintUpdateResponse.builder()
                .id(u.getId())
                .oldStatus(u.getOldStatus() != null
                        ? u.getOldStatus().name() : null)
                .newStatus(u.getNewStatus() != null
                        ? u.getNewStatus().name() : null)
                .remark(u.getRemark())
                .updatedByRole(u.getUpdatedByRole().name())
                .createdAt(u.getCreatedAt().toString())
                .build();
    }
}