// service/ComplaintService.java
package com.nagarseva.service;

import com.nagarseva.dto.request.ComplaintRequest;
import com.nagarseva.dto.request.StatusUpdateRequest;
import com.nagarseva.dto.response.ComplaintResponse;
import com.nagarseva.dto.response.ComplaintTrackResponse;
import com.nagarseva.entity.*;
import com.nagarseva.enums.*;
import com.nagarseva.exception.ResourceNotFoundException;
import com.nagarseva.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository       complaintRepository;
    private final CitizenRepository         citizenRepository;
    private final DepartmentRepository      departmentRepository;
    private final SlaRepository             slaRepository;
    private final SlaPolicyRepository       slaPolicyRepository;
    private final ComplaintUpdateRepository complaintUpdateRepository;
    private final NotificationRepository    notificationRepository;
//     private final EmailService              emailService;

    // ── Submit New Complaint ──────────────────
    @Transactional
    public ComplaintResponse submit(ComplaintRequest req, MultipartFile file,
                                    String citizenEmail) {

        // 1. Get citizen
        Citizen citizen = citizenRepository
                .findByEmail(citizenEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Citizen not found")
                );

        // 2. Get department
        Department department = departmentRepository
                .findById(req.getDepartmentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Department not found")
                );

        // 3. Build complaint
        Complaint complaint = new Complaint();
        complaint.setCitizen(citizen);
        complaint.setDepartment(department);
        complaint.setTitle(req.getTitle());
        complaint.setDescription(req.getDescription());
        complaint.setLocation(req.getLocation());
        complaint.setStatus(ComplaintStatus.OPEN);
        complaint.setPriority(
                Priority.valueOf(req.getPriority().toUpperCase())
        );

        String attachmentUrl = null;

        if(file != null && !file.isEmpty()){

            try{

                String cleanName =
                        file.getOriginalFilename()
                                .replaceAll(
                                        "[^a-zA-Z0-9\\.\\-_]",
                                        "_"
                                );

                String fileName =
                        System.currentTimeMillis()
                                + "_"
                                + cleanName;

                String uploadPath =
                        "F:/MCA/SY-MCAVI/Project/Backend/nagarseva/uploads/";

                File dir =
                        new File(uploadPath);

                if(!dir.exists()){

                    dir.mkdirs();
                }

                Path path =
                        Paths.get(
                                uploadPath,
                                fileName
                        );

                Files.copy(
                        file.getInputStream(),
                        path,
                        StandardCopyOption.REPLACE_EXISTING
                );

                attachmentUrl =
                        "uploads/" + fileName;

                System.out.println(
                        "FILE SAVED AT: "
                                + path.toAbsolutePath()
                );

            }catch(Exception e){

                e.printStackTrace();

                throw new RuntimeException(
                        "File upload failed"
                );
            }
        }


        complaint.setAttachmentUrl(
                attachmentUrl
        );

        Complaint saved =
                complaintRepository.save(
                        complaint
                );


        // 4. Get SLA hours from policy table
        SlaPolicy policy = slaPolicyRepository
                .findByDepartmentType(department.getType())
                .orElseThrow(() ->
                        new ResourceNotFoundException("SLA policy not found")
                );

        // 5. Create SLA record with deadline
        SLA sla = new SLA();
        sla.setComplaint(saved);
        sla.setDeadline(
                LocalDateTime.now().plusHours(policy.getSlaHours())
        );
        sla.setBreached(false);
        slaRepository.save(sla);

        // 6. Save initial audit log
        ComplaintUpdate log = new ComplaintUpdate();
        log.setComplaint(saved);
        log.setNewStatus(ComplaintStatus.OPEN);
        log.setRemark("Complaint submitted by citizen");
        log.setUpdatedByRole(UserRole.CITIZEN);
        log.setUpdatedBy(citizen.getId());
        complaintUpdateRepository.save(log);

        // 7. Save notification record
        Notification notif = new Notification();
        notif.setComplaint(saved);
        notif.setRecipientEmail(citizen.getEmail());
        notif.setMessage("Complaint #GR-" + saved.getId() +
                " submitted successfully");
        notif.setType(NotificationType.ASSIGNMENT);
        notif.setSent(true);
        notif.setSentAt(LocalDateTime.now());
        notificationRepository.save(notif);

        // 8. Send confirmation email
        // emailService.sendComplaintSubmittedEmail(
        //         citizen.getEmail(),
        //         citizen.getName(),
        //         saved.getId(),
        //         saved.getTitle(),
        //         department.getType().getDisplayName(),
        //         sla.getDeadline().toString()
        // );

        return ComplaintResponse.from(saved);
    }

    // ── Citizen's Own Complaints ──────────────
    public Page<ComplaintResponse> getMyComplaints(
            String email, Pageable pageable) {

        return complaintRepository
                .findByCitizenEmailOrderByCreatedAtDesc(email, pageable)
                .map(ComplaintResponse::from);
    }

    // ── Public Track Complaint ────────────────
    public ComplaintTrackResponse track(Long id) {

        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Complaint not found: #GR-" + id
                        )
                );

        List<ComplaintUpdate> updates =
                complaintUpdateRepository
                        .findByComplaintIdOrderByCreatedAtAsc(id);

        return ComplaintTrackResponse.from(complaint, updates);
    }

    // ── Officer Updates Status ────────────────
    @Transactional
    public ComplaintResponse updateStatus(Long id,
                                          StatusUpdateRequest req,
                                          String officerEmail) {

        // 1. Get complaint
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Complaint not found")
                );

        // 2. Get officer (stored as Citizen with OFFICER role)
        Citizen officer = citizenRepository
                .findByEmail(officerEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Officer not found")
                );

        // 3. Save old status for email + audit
        ComplaintStatus oldStatus = complaint.getStatus();
        ComplaintStatus newStatus = ComplaintStatus.valueOf(
                req.getStatus().toUpperCase()
        );

        // 4. Update complaint
        complaint.setStatus(newStatus);
        complaintRepository.save(complaint);

        // 5. Save audit log
        ComplaintUpdate log = new ComplaintUpdate();
        log.setComplaint(complaint);
        log.setOldStatus(oldStatus);
        log.setNewStatus(newStatus);
        log.setRemark(req.getRemark());
        log.setUpdatedBy(officer.getId());
        log.setUpdatedByRole(officer.getRole());
        complaintUpdateRepository.save(log);

        // 6. Mark SLA as closed if resolved/rejected
        if (newStatus == ComplaintStatus.RESOLVED ||
                newStatus == ComplaintStatus.REJECTED) {
            if (complaint.getSla() != null) {
                // No change needed — just stop monitoring
            }
        }

        // 7. Save notification record
        Notification notif = new Notification();
        notif.setComplaint(complaint);
        notif.setRecipientEmail(complaint.getCitizen().getEmail());
        notif.setMessage("Complaint #GR-" + id +
                " status updated to " + newStatus.name());
        notif.setType(NotificationType.STATUS_CHANGE);
        notif.setSent(true);
        notif.setSentAt(LocalDateTime.now());
        notificationRepository.save(notif);

        // 8. Send status update email to citizen
        // emailService.sendStatusUpdateEmail(
        //         complaint.getCitizen().getEmail(),
        //         complaint.getCitizen().getName(),
        //         complaint.getId(),
        //         oldStatus.name(),
        //         newStatus.name(),
        //         req.getRemark()
        // );

        return ComplaintResponse.from(complaint);
    }

    @Transactional(readOnly = true)
    public ComplaintResponse getComplaintById(
            Long id
    ) {

        Complaint complaint =
                complaintRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Complaint not found"
                                )
                        );

        return ComplaintResponse.from(
                complaint
        );
    }
    // ── Department's Complaints ───────────────
    public Page<ComplaintResponse> getDeptComplaints(
            String officerEmail,
            String status,
            String priority,
            Pageable pageable) {

        Citizen officer = citizenRepository
                .findByEmail(officerEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Officer not found")
                );

        // Find which department this officer belongs to
        Department dept = departmentRepository
                .findByOfficerEmail(officer.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No department found for this officer"
                        )
                );

        return complaintRepository
                .findByFilters(status, priority, dept.getId(), pageable)
                .map(ComplaintResponse::from);
    }
}