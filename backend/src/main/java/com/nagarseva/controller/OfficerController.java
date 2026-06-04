package com.nagarseva.controller;

import com.nagarseva.dto.response.ApiResponse;
import com.nagarseva.dto.response.ComplaintResponse;
import com.nagarseva.service.OfficerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.nagarseva.service.ComplaintService;

@RestController
@RequestMapping("/api/officer")
@RequiredArgsConstructor
public class OfficerController {

    private final OfficerService officerService;

    private final ComplaintService complaintService;

    @GetMapping("/complaints")
    public ResponseEntity<ApiResponse<Page<ComplaintResponse>>>
    getDepartmentComplaints(

            Authentication authentication,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size

    ) {

        return ResponseEntity.ok(

                ApiResponse.ok(

                        officerService
                                .getDepartmentComplaints(
                                        authentication.getName(),
                                        PageRequest.of(page, size)
                                )

                )

        );

    }

    @GetMapping("/complaints/{id}")
    public ResponseEntity<ApiResponse<ComplaintResponse>>
    getComplaintById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(

                ApiResponse.ok(

                        complaintService
                                .getComplaintById(id)

                )

        );
    }
}