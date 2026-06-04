package com.nagarseva.service;

import com.nagarseva.dto.response.ComplaintResponse;
import com.nagarseva.entity.Citizen;
import com.nagarseva.entity.Complaint;
import com.nagarseva.repository.CitizenRepository;
import com.nagarseva.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OfficerService {

    private final CitizenRepository citizenRepository;
    private final ComplaintRepository complaintRepository;

    public Page<ComplaintResponse>
    getDepartmentComplaints(
            String email,
            Pageable pageable
    ) {

        // logged-in officer
        Citizen officer =
                citizenRepository
                        .findByEmail(email)
                        .orElseThrow();

        // officer department complaints
        Page<Complaint> complaints =
                complaintRepository
                        .findByDepartmentIdOrderByCreatedAtDesc(
                                officer
                                        .getDepartment()
                                        .getId(),

                                pageable
                        );

        return complaints.map(
                ComplaintResponse::from
        );
    }
}