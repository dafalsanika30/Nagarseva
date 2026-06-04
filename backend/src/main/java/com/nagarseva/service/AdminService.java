// service/AdminService.java
package com.nagarseva.service;

import com.nagarseva.dto.request.CreateDepartmentRequest;
import com.nagarseva.dto.request.DepartmentUpdateRequest;
import com.nagarseva.dto.request.SlaPolicyRequest;
import com.nagarseva.dto.response.*;
import com.nagarseva.entity.*;
import com.nagarseva.enums.*;
import com.nagarseva.exception.ResourceNotFoundException;
import com.nagarseva.repository.*;
import com.nagarseva.utils.PasswordUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ComplaintRepository       complaintRepository;
    private final DepartmentRepository      departmentRepository;
    private final CitizenRepository         citizenRepository;
    private final SlaRepository             slaRepository;
    private final SlaPolicyRepository       slaPolicyRepository;
    private final ComplaintUpdateRepository complaintUpdateRepository;
    private final PasswordEncoder passwordEncoder;
//     @Autowired
//     private EmailService emailService;

    // ── Dashboard Stats ──────────────────────
    public DashboardStatsResponse getDashboardStats() {
        long total      = complaintRepository.count();
        long open       = complaintRepository
                .countByStatus(ComplaintStatus.OPEN);
        long inProgress = complaintRepository
                .countByStatus(ComplaintStatus.IN_PROGRESS);
        long resolved   = complaintRepository
                .countByStatus(ComplaintStatus.RESOLVED);
        long rejected   = complaintRepository
                .countByStatus(ComplaintStatus.REJECTED);
        long breached   = slaRepository.countByBreachedTrue();
        long citizens   = citizenRepository
                .countByRole(UserRole.CITIZEN);

        double slaRate  = total > 0
                ? Math.round(((double)(total - breached) / total)
                * 1000.0) / 10.0
                : 100.0;

        return DashboardStatsResponse.builder()
                .totalComplaints(total)
                .open(open)
                .inProgress(inProgress)
                .resolved(resolved)
                .rejected(rejected)
                .slaBreached(breached)
                .totalCitizens(citizens)
                .slaComplianceRate(slaRate)
                .build();
    }

    // ── All Complaints (filtered) ────────────
    public Page<ComplaintResponse> getAllComplaints(
            String status, String priority,
            Long departmentId, Pageable pageable) {

        return complaintRepository
                .findByFilters(status, priority, departmentId, pageable)
                .map(ComplaintResponse::from);
    }

    // ── Single Complaint ──────────────────────
    public ComplaintResponse getComplaintById(Long id) {
        return ComplaintResponse.from(
                complaintRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Complaint not found: " + id
                                )
                        )
        );
    }

    // ── Reassign Complaint ───────────────────
    @Transactional
    public ComplaintResponse reassignComplaint(Long complaintId,
                                               Long departmentId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Complaint not found")
                );
        Department dept = departmentRepository.findById(departmentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Department not found")
                );
        complaint.setDepartment(dept);
        return ComplaintResponse.from(
                complaintRepository.save(complaint)
        );
    }

    // ── Reject Complaint ─────────────────────
    @Transactional
    public ComplaintResponse rejectComplaint(Long id, String remark) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Complaint not found")
                );

        ComplaintStatus old = complaint.getStatus();
        complaint.setStatus(ComplaintStatus.REJECTED);
        complaintRepository.save(complaint);

        // save audit log
        ComplaintUpdate log = new ComplaintUpdate();
        log.setComplaint(complaint);
        log.setOldStatus(old);
        log.setNewStatus(ComplaintStatus.REJECTED);
        log.setRemark(remark);
        log.setUpdatedByRole(UserRole.ADMIN);
        complaintUpdateRepository.save(log);

        return ComplaintResponse.from(complaint);
    }

    // ── Escalate ─────────────────────────────
    public void escalateComplaint(Long id) {
        complaintRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Complaint not found")
                );
        // email notification logic goes here
        // (add JavaMailSender if you want actual emails)
    }

    // ── All Departments with Stats ───────────
    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll()
                .stream()
                .map(dept -> {
                    long open = complaintRepository
                            .countByDepartmentAndStatus(
                                    dept, ComplaintStatus.OPEN
                            );
                    long resolved = complaintRepository
                            .countByDepartmentAndStatus(
                                    dept, ComplaintStatus.RESOLVED
                            );
                    long total = complaintRepository
                            .countByDepartment(dept);
                    long breached = slaRepository
                            .countByComplaint_DepartmentAndBreachedTrue(dept);

                    double sla = total > 0
                            ? Math.round(
                            ((double)(total - breached) / total)
                                    * 1000.0) / 10.0
                            : 100.0;

                    return DepartmentResponse.from(
                            dept, open, resolved, sla
                    );
                })
                .collect(Collectors.toList());
    }

    // ── Update Department ────────────────────
    @Transactional
    public DepartmentResponse updateDepartment(
            Long id,
            DepartmentUpdateRequest req
    ) {

        Department dept =
                departmentRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Department not found"
                                )
                        );

        // UPDATE FIELDS

        dept.setOfficerName(
                req.getOfficerName()
        );

        dept.setContactEmail(
                req.getContactEmail()
        );

        dept.setActive(
                req.isActive()
        );

        // SAVE
        return DepartmentResponse.from(

                departmentRepository.save(dept),

                0,
                0,
                0.0

        );

    }

    // ── Toggle Department ────────────────────
    @Transactional
    public DepartmentResponse toggleDepartment(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Department not found")
                );
        dept.setActive(!dept.isActive());
        return DepartmentResponse.from(
                departmentRepository.save(dept), 0, 0, 0.0
        );
    }

    // ── All Citizens ─────────────────────────
    public Page<CitizenResponse> getAllCitizens(
            String search, Pageable pageable) {

        if (search != null && !search.isBlank()) {
            return citizenRepository
                    .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                            search, search, pageable
                    ).map(CitizenResponse::from);
        }
        return citizenRepository
                .findByRole(UserRole.CITIZEN, pageable)
                .map(CitizenResponse::from);
    }

    // ── Toggle Citizen ───────────────────────
    @Transactional
    public String toggleCitizen(Long id) {
        Citizen citizen = citizenRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Citizen not found")
                );
        citizen.setActive(!citizen.isActive());
        citizenRepository.save(citizen);
        return citizen.isActive()
                ? "Citizen activated"
                : "Citizen blocked";
    }

    // ── SLA Policies ─────────────────────────
    public List<SlaPolicyResponse> getAllSlaPolicies() {
        return slaPolicyRepository.findAll()
                .stream()
                .map(SlaPolicyResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public SlaPolicyResponse updateSlaPolicy(
            String deptType, SlaPolicyRequest req) {

        DepartmentType type = DepartmentType
                .valueOf(deptType.toUpperCase());

        SlaPolicy policy = slaPolicyRepository
                .findByDepartmentType(type)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "SLA policy not found: " + deptType
                        )
                );
        policy.setSlaHours(req.getSlaHours());
        policy.setEscalationHours(req.getEscalationHours());
        return SlaPolicyResponse.from(
                slaPolicyRepository.save(policy)
        );
    }

    // ── SLA Breaches ─────────────────────────
    public List<ComplaintResponse> getSlaBreaches() {
        return slaRepository.findByBreachedTrue()
                .stream()
                .map(sla -> ComplaintResponse.from(sla.getComplaint()))
                .collect(Collectors.toList());
    }

    // ── Monthly Trend ─────────────────────────
    public List<MonthlyTrendResponse> getMonthlyTrend() {
        return complaintRepository.getMonthlyTrend();
    }

    @Transactional
    public void createDepartment(
            CreateDepartmentRequest req
    ) {

        // =====================================
        // CREATE DEPARTMENT
        // =====================================
        Department department =
                new Department();

        department.setType(
                req.getType()
        );

        department.setOfficerName(
                req.getOfficerName()
        );

        department.setContactEmail(
                req.getContactEmail()
        );

       department.setActive(true);
departmentRepository.save(department);
}
}