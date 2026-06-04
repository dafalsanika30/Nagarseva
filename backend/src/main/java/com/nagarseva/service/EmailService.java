// service/EmailService.java
package com.nagarseva.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

// @Service
@RequiredArgsConstructor
@Slf4j

public class EmailService {

    private final JavaMailSender mailSender;

    // ── Send any email (internal method) ─────
    // @Async means email sends in background
    // Your API responds instantly, email sends separately
    @Async
    public void sendEmail(String toEmail,
                          String subject,
                          String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("nagarseva.pmc@gmail.com");  // your Gmail
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);   // true = HTML email

            mailSender.send(message);
            log.info("Email sent to: {}", toEmail);

        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}",
                    toEmail, e.getMessage());
        }
    }

    // ── 1. Welcome Email after Registration ──
    @Async
    public void sendWelcomeEmail(String toEmail, String name) {
        String subject = "Welcome to NagarSeva — Pune Municipal Corporation";
        String body = """
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
              <div style="background:#1a4f3a;padding:30px;text-align:center">
                <h1 style="color:#fff;margin:0">🏛️ NagarSeva</h1>
                <p style="color:rgba(255,255,255,0.8);margin:5px 0 0">
                  Pune Municipal Corporation
                </p>
              </div>
              <div style="padding:30px;background:#f9f9f9">
                <h2 style="color:#1a4f3a">Welcome, %s! 👋</h2>
                <p>Your NagarSeva account has been created successfully.</p>
                <p>You can now:</p>
                <ul>
                  <li>Submit civic complaints online</li>
                  <li>Track complaint status in real-time</li>
                  <li>Receive updates via email</li>
                </ul>
                <div style="text-align:center;margin:30px 0">
                  <a href="http://127.0.0.1:5500/login.html"
                     style="background:#1a4f3a;color:#fff;
                            padding:12px 30px;border-radius:25px;
                            text-decoration:none;font-weight:bold">
                    Login to NagarSeva →
                  </a>
                </div>
              </div>
              <div style="background:#1a4f3a;padding:15px;text-align:center">
                <p style="color:rgba(255,255,255,0.6);font-size:12px;margin:0">
                  © 2026 Pune Municipal Corporation | 1800-233-0000
                </p>
              </div>
            </div>
            """.formatted(name);

        sendEmail(toEmail, subject, body);
    }

    // ── 2. Complaint Submitted Confirmation ──
    @Async
    public void sendComplaintSubmittedEmail(String toEmail,
                                            String name,
                                            Long complaintId,
                                            String category,
                                            String department,
                                            String slaDeadline) {
        String subject = "Complaint #GR-" + complaintId +
                " Submitted — NagarSeva";
        String body = """
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
              <div style="background:#1a4f3a;padding:30px;text-align:center">
                <h1 style="color:#fff;margin:0">🏛️ NagarSeva</h1>
              </div>
              <div style="padding:30px;background:#f9f9f9">
                <h2 style="color:#1a4f3a">Complaint Submitted ✅</h2>
                <p>Dear <strong>%s</strong>,</p>
                <p>Your complaint has been received and assigned.</p>

                <div style="background:#fff;border-radius:10px;
                            padding:20px;border-left:4px solid #1a4f3a">
                  <table style="width:100%%">
                    <tr>
                      <td style="color:#666;padding:5px 0">Complaint ID</td>
                      <td style="font-weight:bold">#GR-%d</td>
                    </tr>
                    <tr>
                      <td style="color:#666;padding:5px 0">Category</td>
                      <td>%s</td>
                    </tr>
                    <tr>
                      <td style="color:#666;padding:5px 0">Department</td>
                      <td>%s</td>
                    </tr>
                    <tr>
                      <td style="color:#666;padding:5px 0">Status</td>
                      <td><span style="background:#fee2e2;color:#dc2626;
                                       padding:3px 10px;border-radius:20px;
                                       font-size:13px">OPEN</span></td>
                    </tr>
                    <tr>
                      <td style="color:#666;padding:5px 0">SLA Deadline</td>
                      <td style="color:#d97706;font-weight:bold">%s</td>
                    </tr>
                  </table>
                </div>

                <p style="margin-top:20px">
                  You will receive updates when the status changes.
                </p>
              </div>
              <div style="background:#1a4f3a;padding:15px;text-align:center">
                <p style="color:rgba(255,255,255,0.6);font-size:12px;margin:0">
                  © 2026 Pune Municipal Corporation
                </p>
              </div>
            </div>
            """.formatted(name, complaintId, category,
                department, slaDeadline);

        sendEmail(toEmail, subject, body);
    }

    // ── 3. Status Update Email ────────────────
    @Async
    public void sendStatusUpdateEmail(String toEmail,
                                      String name,
                                      Long complaintId,
                                      String oldStatus,
                                      String newStatus,
                                      String remark) {
        // Pick color based on new status
        String color = switch (newStatus) {
            case "IN_PROGRESS" -> "#d97706";
            case "RESOLVED"    -> "#16a34a";
            case "REJECTED"    -> "#dc2626";
            default            -> "#1a4f3a";
        };

        String emoji = switch (newStatus) {
            case "IN_PROGRESS" -> "🟡";
            case "RESOLVED"    -> "✅";
            case "REJECTED"    -> "❌";
            default            -> "🔵";
        };

        String subject = emoji + " Complaint #GR-" + complaintId +
                " — Status Updated to " + newStatus;

        String body = """
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
              <div style="background:#1a4f3a;padding:30px;text-align:center">
                <h1 style="color:#fff;margin:0">🏛️ NagarSeva</h1>
              </div>
              <div style="padding:30px;background:#f9f9f9">
                <h2 style="color:#1a4f3a">Complaint Status Updated %s</h2>
                <p>Dear <strong>%s</strong>,</p>
                <p>Your complaint <strong>#GR-%d</strong> status has changed.</p>

                <div style="background:#fff;border-radius:10px;
                            padding:20px;border-left:4px solid %s">
                  <table style="width:100%%">
                    <tr>
                      <td style="color:#666;padding:5px 0">Previous Status</td>
                      <td>%s</td>
                    </tr>
                    <tr>
                      <td style="color:#666;padding:5px 0">New Status</td>
                      <td>
                        <span style="background:%s;color:#fff;
                                     padding:3px 10px;border-radius:20px;
                                     font-size:13px">
                          %s
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style="color:#666;padding:5px 0;
                                 vertical-align:top">Remark</td>
                      <td>%s</td>
                    </tr>
                  </table>
                </div>
              </div>
              <div style="background:#1a4f3a;padding:15px;text-align:center">
                <p style="color:rgba(255,255,255,0.6);font-size:12px;margin:0">
                  © 2026 Pune Municipal Corporation
                </p>
              </div>
            </div>
            """.formatted(emoji, name, complaintId, color,
                oldStatus, color, newStatus, remark);

        sendEmail(toEmail, subject, body);
    }

    // ── 4. SLA Breach Alert ───────────────────
    @Async
    public void sendSlaBreachEmail(String toEmail,
                                   String name,
                                   Long complaintId,
                                   String department) {
        String subject = "⚠️ SLA Breached — Complaint #GR-" + complaintId;
        String body = """
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
              <div style="background:#dc2626;padding:30px;text-align:center">
                <h1 style="color:#fff;margin:0">⚠️ SLA Breach Alert</h1>
                <p style="color:rgba(255,255,255,0.8)">NagarSeva — PMC</p>
              </div>
              <div style="padding:30px;background:#fff5f5">
                <h2 style="color:#dc2626">Resolution Deadline Missed</h2>
                <p>Dear <strong>%s</strong>,</p>
                <p>
                  We sincerely apologize. Your complaint
                  <strong>#GR-%d</strong> assigned to
                  <strong>%s</strong> has exceeded the
                  resolution deadline.
                </p>
                <p>
                  This has been <strong>escalated</strong> to
                  the senior officer for immediate action.
                </p>
                <p>You will receive an update shortly.</p>
              </div>
              <div style="background:#1a4f3a;padding:15px;text-align:center">
                <p style="color:rgba(255,255,255,0.6);font-size:12px;margin:0">
                  Helpline: 1800-233-0000 | © 2026 PMC
                </p>
              </div>
            </div>
            """.formatted(name, complaintId, department);

        sendEmail(toEmail, subject, body);
    }

    // ── 5. SLA Warning (2hrs before breach) ──
    @Async
    public void sendSlaWarningEmail(String toEmail,
                                    String name,
                                    Long complaintId,
                                    String department,
                                    int hoursLeft) {
        String subject = "⏱️ SLA Warning — Complaint #GR-" +
                complaintId + " (" + hoursLeft + "hrs left)";
        String body = """
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
              <div style="background:#d97706;padding:30px;text-align:center">
                <h1 style="color:#fff;margin:0">⏱️ SLA Warning</h1>
                <p style="color:rgba(255,255,255,0.8)">NagarSeva — PMC</p>
              </div>
              <div style="padding:30px;background:#fffbeb">
                <h2 style="color:#d97706">
                  %d Hours Remaining to Resolve
                </h2>
                <p>Dear <strong>%s</strong>,</p>
                <p>
                  Your complaint <strong>#GR-%d</strong>
                  with <strong>%s</strong> is approaching
                  its SLA deadline.
                </p>
                <p>
                  The department has been notified to resolve
                  this urgently.
                </p>
              </div>
              <div style="background:#1a4f3a;padding:15px;text-align:center">
                <p style="color:rgba(255,255,255,0.6);font-size:12px;margin:0">
                  © 2026 Pune Municipal Corporation
                </p>
              </div>
            </div>
            """.formatted(hoursLeft, name, complaintId, department);

        sendEmail(toEmail, subject, body);
    }

    public void sendOfficerCredentials(

            String to,

            String password,

            String department

    ) {

        String subject =
                "NagarSeva Officer Account";

        String body = """

            Welcome to NagarSeva.

            Department:
            %s

            Email:
            %s

            Temporary Password:
            %s

            Please login and change your password.

            """.formatted(

                department,

                to,

                password

        );

        sendEmail(
                to,
                subject,
                body
        );

    }
}