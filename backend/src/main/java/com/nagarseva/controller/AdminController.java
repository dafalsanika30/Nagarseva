// controller/AdminController.java
package com.nagarseva.controller;

import com.nagarseva.dto.request.CreateDepartmentRequest;
import com.nagarseva.dto.request.DepartmentUpdateRequest;
import com.nagarseva.dto.request.SlaPolicyRequest;
import com.nagarseva.dto.response.*;
import com.nagarseva.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>>
    getDashboard() {
        return ResponseEntity.ok(
                ApiResponse.ok(adminService.getDashboardStats())
        );
    }

    @GetMapping("/complaints")
    public ResponseEntity<ApiResponse<Page<ComplaintResponse>>>
    getComplaints(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.ok(
                adminService.getAllComplaints(status, priority,
                        departmentId,
                        PageRequest.of(page, size,
                                Sort.by(Sort.Direction.DESC, "createdAt")))
        ));
    }

    @GetMapping("/complaints/{id}")
    public ResponseEntity<ApiResponse<ComplaintResponse>>
    getComplaint(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.ok(adminService.getComplaintById(id))
        );
    }

    @PatchMapping("/complaints/{id}/reassign")
    public ResponseEntity<ApiResponse<ComplaintResponse>>
    reassign(@PathVariable Long id,
             @RequestParam Long departmentId) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Reassigned",
                adminService.reassignComplaint(id, departmentId)
        ));
    }

    @PatchMapping("/complaints/{id}/reject")
    public ResponseEntity<ApiResponse<ComplaintResponse>>
    reject(@PathVariable Long id,
           @RequestParam String remark) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Rejected",
                adminService.rejectComplaint(id, remark)
        ));
    }

    @PatchMapping("/complaints/{id}/escalate")
    public ResponseEntity<ApiResponse<String>>
    escalate(@PathVariable Long id) {
        adminService.escalateComplaint(id);
        return ResponseEntity.ok(
                ApiResponse.ok("Escalated", null)
        );
    }

    @GetMapping("/departments")
    public ResponseEntity<ApiResponse<List<DepartmentResponse>>>
    getDepartments() {
        return ResponseEntity.ok(
                ApiResponse.ok(adminService.getAllDepartments())
        );
    }

    @PutMapping("/departments/{id}")
    public ResponseEntity<ApiResponse<DepartmentResponse>>
    updateDept(@PathVariable Long id,
               @RequestBody @Valid DepartmentUpdateRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Updated",
                adminService.updateDepartment(id, req)
        ));
    }

    @PatchMapping("/departments/{id}/toggle")
    public ResponseEntity<ApiResponse<DepartmentResponse>>
    toggleDept(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.ok(adminService.toggleDepartment(id))
        );
    }

    @GetMapping("/citizens")
    public ResponseEntity<ApiResponse<Page<CitizenResponse>>>
    getCitizens(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.ok(
                adminService.getAllCitizens(
                        search, PageRequest.of(page, size))
        ));
    }

    @PatchMapping("/citizens/{id}/toggle")
    public ResponseEntity<ApiResponse<String>>
    toggleCitizen(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.ok(adminService.toggleCitizen(id), null)
        );
    }

    @GetMapping("/sla-policies")
    public ResponseEntity<ApiResponse<List<SlaPolicyResponse>>>
    getSlaPolicies() {
        return ResponseEntity.ok(
                ApiResponse.ok(adminService.getAllSlaPolicies())
        );
    }

    @PutMapping("/sla-policies/{departmentType}")
    public ResponseEntity<ApiResponse<SlaPolicyResponse>>
    updateSla(@PathVariable String departmentType,
              @RequestBody @Valid SlaPolicyRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(
                "SLA updated",
                adminService.updateSlaPolicy(departmentType, req)
        ));
    }

    @GetMapping("/sla-breaches")
    public ResponseEntity<ApiResponse<List<ComplaintResponse>>>
    getSlaBreaches() {
        return ResponseEntity.ok(
                ApiResponse.ok(adminService.getSlaBreaches())
        );
    }

    @GetMapping("/reports/by-department")
    public ResponseEntity<ApiResponse<List<DepartmentResponse>>>
    reportByDept() {
        return ResponseEntity.ok(
                ApiResponse.ok(adminService.getAllDepartments())
        );
    }

    @GetMapping("/reports/monthly-trend")
    public ResponseEntity<ApiResponse<List<MonthlyTrendResponse>>>
    monthlyTrend() {
        return ResponseEntity.ok(
                ApiResponse.ok(adminService.getMonthlyTrend())
        );
    }

    @PostMapping("/departments")
    public ResponseEntity<ApiResponse<String>>
    createDepartment(

            @RequestBody
            CreateDepartmentRequest req

    ) {

        adminService.createDepartment(
                req
        );

        return ResponseEntity.ok(

                ApiResponse.ok(
                        "Department created successfully"
                )

        );

    }
}