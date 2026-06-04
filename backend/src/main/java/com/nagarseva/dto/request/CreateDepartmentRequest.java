package com.nagarseva.dto.request;

import com.nagarseva.enums.DepartmentType;
import lombok.Data;

@Data
public class CreateDepartmentRequest {

    private DepartmentType type;

    private String officerName;

    private String contactEmail;

}