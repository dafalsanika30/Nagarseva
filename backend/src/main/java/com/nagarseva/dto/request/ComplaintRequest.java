// dto/request/ComplaintRequest.java
package com.nagarseva.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ComplaintRequest {

    @NotNull(message = "Department is required")
    private Long departmentId;

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title too long")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 20, message = "Please describe in at least 20 characters")
    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    private String priority = "MEDIUM"; // default
}