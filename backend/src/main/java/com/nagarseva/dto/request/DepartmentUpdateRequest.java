// dto/request/DepartmentUpdateRequest.java
package com.nagarseva.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class DepartmentUpdateRequest {


    @NotBlank(message = "Officer name is required")
    private String officerName;

    @Email(message = "Enter valid email")
    @NotBlank(message = "Email is required")
    private String contactEmail;

    private boolean active = true;
}