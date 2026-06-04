// dto/response/DashboardStatsResponse.java
package com.nagarseva.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsResponse {
    private long   totalComplaints;
    private long   open;
    private long   inProgress;
    private long   resolved;
    private long   rejected;
    private long   slaBreached;
    private long   totalCitizens;
    private double slaComplianceRate;
}