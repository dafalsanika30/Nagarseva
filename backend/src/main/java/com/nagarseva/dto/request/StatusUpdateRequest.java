// dto/request/StatusUpdateRequest.java
package com.nagarseva.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StatusUpdateRequest {

    @NotBlank(message = "Status is required")
    private String status;    // IN_PROGRESS, RESOLVED, REJECTED

    @NotBlank(message = "Remark is required")
    private String remark;
}