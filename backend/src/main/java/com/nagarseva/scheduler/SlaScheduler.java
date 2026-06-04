// scheduler/SlaScheduler.java
package com.nagarseva.scheduler;

import com.nagarseva.entity.SLA;
import com.nagarseva.repository.SlaRepository;
import com.nagarseva.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class SlaScheduler {

    private final SlaRepository slaRepository;
//     private final EmailService emailService;

    // ── Check Breaches every 5 minutes ───────
    @Scheduled(fixedRate = 300000)
    @Transactional
    public void checkBreaches() {

        List<SLA> overdue = slaRepository
                .findByBreachedFalseAndDeadlineBefore(
                        LocalDateTime.now()
                );

        if (overdue.isEmpty()) return;

        log.warn("SLA Scheduler: {} breaches found",
                overdue.size());

        overdue.forEach(sla -> {
            sla.setBreached(true);
            sla.setBreachedAt(LocalDateTime.now());

            String citizenEmail =
                    sla.getComplaint().getCitizen().getEmail();
            String citizenName  =
                    sla.getComplaint().getCitizen().getName();
            Long   complaintId  =
                    sla.getComplaint().getId();
            String deptName     =
                    sla.getComplaint().getDepartment()
                            .getType().getDisplayName();

            // Send breach email to citizen
        //     emailService.sendSlaBreachEmail(
        //             citizenEmail,
        //             citizenName,
        //             complaintId,
        //             deptName
        //     );

            log.warn("SLA Breached: Complaint #{}  Dept: {}",
                    complaintId, deptName);
        });

        slaRepository.saveAll(overdue);
    }

    // ── Warning Email 6hrs before breach ─────
    @Transactional
    @Scheduled(fixedRate = 300000)
    public void checkWarnings() {

        LocalDateTime now      = LocalDateTime.now();
        LocalDateTime sixHours = now.plusHours(6);

        // Find SLAs that expire within 6 hours
        List<SLA> atRisk = slaRepository
                .findByBreachedFalseAndDeadlineBetween(now, sixHours);

        atRisk.forEach(sla -> {
            long hoursLeft = java.time.Duration
                    .between(now, sla.getDeadline())
                    .toHours();

        //     emailService.sendSlaWarningEmail(
        //             sla.getComplaint().getCitizen().getEmail(),
        //             sla.getComplaint().getCitizen().getName(),
        //             sla.getComplaint().getId(),
        //             sla.getComplaint().getDepartment()
        //                     .getType().getDisplayName(),
        //             (int) hoursLeft
        //     );
        });
    }
}