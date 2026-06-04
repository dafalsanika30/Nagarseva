// dto/request/SlaPolicyRequest.java
package com.nagarseva.dto.request;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class SlaPolicyRequest {

    @Min(value = 1, message = "SLA hours must be at least 1")
    private int slaHours;

    @Min(value = 1, message = "Escalation hours must be at least 1")
    private int escalationHours;
}