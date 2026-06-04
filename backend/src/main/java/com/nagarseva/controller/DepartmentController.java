// controller/DepartmentController.java
package com.nagarseva.controller;

import com.nagarseva.dto.request.DepartmentUpdateRequest;
import com.nagarseva.dto.response.ApiResponse;
import com.nagarseva.dto.response.ComplaintResponse;
import com.nagarseva.dto.response.DepartmentResponse;
import com.nagarseva.service.AdminService;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final AdminService adminService;



    // GET /api/departments  — public, no token needed
    // Used in register/submit complaint dropdowns
    @GetMapping
    public ResponseEntity<ApiResponse<List<DepartmentResponse>>>
    getAll() {
        return ResponseEntity.ok(
                ApiResponse.ok(adminService.getAllDepartments())
        );
    }

    @PutMapping("/{departmentId}")
    public ResponseEntity<ApiResponse<String>>
    updateDepartment(

            @PathVariable Long departmentId,

            @RequestBody DepartmentUpdateRequest request

    ) {

        adminService.updateDepartment(
                departmentId,
                request
        );

        return ResponseEntity.ok(

                ApiResponse.ok(
                        "Department updated successfully"
                )

        );

    }
}