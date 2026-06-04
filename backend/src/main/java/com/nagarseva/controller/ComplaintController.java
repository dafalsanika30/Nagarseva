// controller/ComplaintController.java
package com.nagarseva.controller;

import com.nagarseva.dto.request.ComplaintRequest;
import com.nagarseva.dto.request.StatusUpdateRequest;
import com.nagarseva.dto.response.*;
import com.nagarseva.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    // ── POST /api/complaints ──────────────────
    // Citizen submits a new complaint
//    @PostMapping
//    @PreAuthorize("hasRole('CITIZEN')")
//    public ResponseEntity<ApiResponse<ComplaintResponse>> submit(
//            @RequestBody @Valid ComplaintRequest req,
//            @AuthenticationPrincipal UserDetails user) {
//
//        complaintService.submit(
//                req,
//                file,
//                email
//        );
//
//        return ResponseEntity
//                .status(HttpStatus.CREATED)
//                .body(ApiResponse.ok(
//                        "Complaint submitted successfully", response
//                ));
//    }

    // ── GET /api/complaints/my ────────────────
    // Citizen sees own complaints
    @GetMapping("/my")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<ApiResponse<Page<ComplaintResponse>>>
    myComplaints(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(ApiResponse.ok(
                complaintService.getMyComplaints(
                        user.getUsername(),
                        PageRequest.of(page, size,
                                Sort.by(Sort.Direction.DESC, "createdAt"))
                )
        ));
    }


    @PostMapping(
            consumes =
                    MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<
            ApiResponse<ComplaintResponse>
            > submit(

            @RequestPart("data")
            @Valid
            ComplaintRequest req,

            @RequestPart(
                    value = "file",
                    required = false
            )
            MultipartFile file,

            @AuthenticationPrincipal
            UserDetails user

    ){

        ComplaintResponse response =
                complaintService.submit(

                        req,
                        file,
                        user.getUsername()

                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(

                        ApiResponse.ok(
                                "Complaint submitted successfully",
                                response
                        )
                );
    }
    //    @PostMapping(
//            consumes =
//                    MediaType.MULTIPART_FORM_DATA_VALUE
//    )
//    public ResponseEntity<?> createComplaint(
//
//            @RequestParam String title,
//
//            @RequestParam String description,
//
//            @RequestParam String location,
//
//            @RequestParam Long departmentId,
//
//            @RequestParam(required = false)
//            MultipartFile file
//
//    ){
//
//        try{
//
//            Complaint complaint =
//                    complaintService.createComplaint(
//                            title,
//                            description,
//                            location,
//                            departmentId,
//                            file
//                    );
//
//            return ResponseEntity.ok(
//                    complaint
//            );
//
//        }catch(Exception e){
//
//            return ResponseEntity
//                    .badRequest()
//                    .body(e.getMessage());
//        }
//    }
    // ── GET /api/complaints/{id}/track ────────
    // Public — no login needed
    // Citizen can track by complaint ID
    @GetMapping("/{id}/track")
    public ResponseEntity<ApiResponse<ComplaintTrackResponse>>
    track(@PathVariable Long id) {

        return ResponseEntity.ok(
                ApiResponse.ok(complaintService.track(id))
        );
    }

    // ── PATCH /api/complaints/{id}/status ─────
    // Officer or Admin updates complaint status
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('OFFICER', 'ADMIN')")
    public ResponseEntity<ApiResponse<ComplaintResponse>>
    updateStatus(
            @PathVariable Long id,
            @RequestBody @Valid StatusUpdateRequest req,
            @AuthenticationPrincipal UserDetails user) {

        return ResponseEntity.ok(ApiResponse.ok(
                "Status updated successfully",
                complaintService.updateStatus(
                        id, req, user.getUsername()
                )
        ));
    }

    // ── GET /api/complaints/department ────────
    // Officer sees complaints for their department
    @GetMapping("/department")
    @PreAuthorize("hasAnyRole('OFFICER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Page<ComplaintResponse>>>
    deptComplaints(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(ApiResponse.ok(
                complaintService.getDeptComplaints(
                        user.getUsername(), status, priority,
                        PageRequest.of(page, size,
                                Sort.by(Sort.Direction.DESC, "createdAt"))
                )
        ));
    }
}