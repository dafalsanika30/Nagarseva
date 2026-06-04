/* =============================================
   NagarSeva — app.js
   Shared logic for all pages
   Requires: api.js loaded before this file
   ============================================= */
"use strict";
let allComplaints = [];


// =============================================
// SIDEBAR TOGGLE
// =============================================
function initSidebar() {
  const toggleBtn = document.getElementById("sidebarToggle");
  const sidebar   = document.getElementById("sidebar");
  const overlay   = document.getElementById("sidebarOverlay");
  if (!sidebar) return;
  const open  = () => { sidebar.classList.add("open");    overlay?.classList.add("show");    document.body.style.overflow = "hidden"; };
  const close = () => { sidebar.classList.remove("open"); overlay?.classList.remove("show"); document.body.style.overflow = ""; };
  toggleBtn?.addEventListener("click", open);
  overlay?.addEventListener("click", close);
  document.querySelectorAll(".sidebar-nav .nav-link").forEach(l =>
    l.addEventListener("click", () => { if (window.innerWidth < 992) close(); })
  );
}

// =============================================
// TAB SWITCHING
// =============================================
function initTabs() {
  document.querySelectorAll(".sidebar-nav .nav-link[data-tab]").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      switchTab(this.dataset.tab, this);
    });
  });
}

function switchTab(tabId, clickedLink) {
  document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".sidebar-nav .nav-link").forEach(l => l.classList.remove("active"));
  document.getElementById(tabId)?.classList.add("active");
  clickedLink?.classList.add("active");
  const titleEl = document.getElementById("topbarTitle");
  if (titleEl && clickedLink) {
    titleEl.textContent = clickedLink.textContent.trim().replace(/^[\s\S]{0,3}/, "").trim();
  }
  animateBars();
}

// =============================================
// TOAST
// =============================================
function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const colors = { success:"#16a34a", error:"#dc2626", warning:"#d97706", info:"#0284c7" };
  const icons  = { success:"✅", error:"❌", warning:"⚠️", info:"ℹ️" };
  const div = document.createElement("div");
  div.className = "toast-custom";
  div.style.borderLeftColor = colors[type] || colors.success;
  div.innerHTML = `<span style="margin-right:.5rem">${icons[type]||"✅"}</span>${message}`;
  container.appendChild(div);
  setTimeout(() => {
    div.style.opacity = "0"; div.style.transform = "translateX(100%)";
    div.style.transition = "all .3s";
    setTimeout(() => div.remove(), 300);
  }, 3500);
}

// =============================================
// HELPERS
// =============================================
function setText(id, val) { const el = document.getElementById(id); if (el) el.innerHTML = val; }

function formatDate(str) {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
}

function timeAgo(str) {
  if (!str) return "";
  const diff = Date.now() - new Date(str).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return m + "m ago";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "hr ago";
  return Math.floor(h / 24) + "d ago";
}

function getStatusBadge(status) {
  const map = {
    OPEN:        '<span class="status-badge badge-open">🔴 Open</span>',
    IN_PROGRESS: '<span class="status-badge badge-progress">🟡 In Progress</span>',
    RESOLVED:    '<span class="status-badge badge-resolved">✅ Resolved</span>',
    REJECTED:    '<span class="status-badge badge-rejected">Rejected</span>'
  };
  return map[status] || status;
}

function getPriorityBadge(priority) {
  const map = {
    HIGH:   '<span class="status-badge badge-high">High</span>',
    MEDIUM: '<span class="status-badge badge-medium">Medium</span>',
    LOW:    '<span class="status-badge badge-low">Low</span>'
  };
  return map[priority] || priority;
}

function statusIcon(s) {
  return { OPEN:"🔴", IN_PROGRESS:"🟡", RESOLVED:"🟢", REJECTED:"⚫" }[s] || "⚪";
}

function slaColor(pct) { return pct >= 95 ? "#16a34a" : pct >= 85 ? "#d97706" : "#dc2626"; }
function slaBadgeClass(pct) { return pct >= 95 ? "badge-resolved" : pct >= 85 ? "badge-progress" : "badge-open"; }
function slaLabel(pct) { return pct >= 95 ? "Good" : pct >= 85 ? "Average" : "Poor"; }

function debounce(fn, delay) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

function initNavActive() {
  const path = window.location.pathname.split("/").pop();
  document.querySelectorAll(".navbar-nav .nav-link").forEach(link => {
    const href = link.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) link.classList.add("active");
  });
}

function animateBars() {
  document.querySelectorAll(".dp-bar-fill[data-width]").forEach(bar => {
    bar.style.width = "0%";
    setTimeout(() => { bar.style.transition = "width 1.2s ease"; bar.style.width = bar.dataset.width; }, 200);
  });
}

function animateCounters() {
  document.querySelectorAll(".counter-anim").forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = current.toLocaleString() + (el.dataset.suffix || "");
    }, 20);
  });
}

function markField(input, valid, msg) {
  if (!input) return;
  input.classList.remove("is-valid", "is-invalid");
  input.parentElement.querySelector(".invalid-feedback, .valid-feedback")?.remove();
  if (valid) { input.classList.add("is-valid"); }
  else {
    input.classList.add("is-invalid");
    const fb = document.createElement("div");
    fb.className = "invalid-feedback";
    fb.textContent = msg;
    input.parentElement.appendChild(fb);
  }
}

function validateEmail(e)    { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function validatePhone(p)    { return /^[\d\s\+\-]{10,15}$/.test(p); }
function validatePassword(p) { return p.length >= 8; }


// =============================================
// LOGIN — POST /api/auth/login
// =============================================


// =============================================
// REGISTER — POST /api/auth/register
// =============================================
function initRegister() {
  
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const fields = {
      name    : { el: document.getElementById("regName"),     fn: v => v.trim().length >= 3,  msg: "Min 3 characters." },
      mobile  : { el: document.getElementById("regMobile"),   fn: validatePhone,              msg: "Enter valid 10-digit mobile." },
      email   : { el: document.getElementById("regEmail"),    fn: validateEmail,              msg: "Enter valid email." },
      address : { el: document.getElementById("regAddress"),  fn: v => v.trim().length >= 5,  msg: "Enter your address." },
      password: { el: document.getElementById("regPassword"), fn: validatePassword,           msg: "Min 8 characters." }
    };
    let valid = true;
    Object.values(fields).forEach(f => {
      if (!f.fn(f.el.value)) { markField(f.el, false, f.msg); valid = false; }
      else markField(f.el, true, "");
    });
    const pw  = document.getElementById("regPassword").value;
    const cpw = document.getElementById("regConfirm");
    if (pw !== cpw.value) { markField(cpw, false, "Passwords do not match."); valid = false; }
    else if (cpw.value) markField(cpw, true, "");

    const terms = document.getElementById("termsCheck");
    if (!terms?.checked) { showToast("Please agree to Terms & Conditions.", "warning"); valid = false; }
    if (!valid) return;

    const btn = form.querySelector("[type=submit]");
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Creating Account…';

    try {
      await API.auth.register({
        name    : document.getElementById("regName").value.trim(),
        email   : document.getElementById("regEmail").value.trim(),
        mobile  : document.getElementById("regMobile").value.trim().replace(/\s+/g,""),
        password: document.getElementById("regPassword").value,
        address : document.getElementById("regAddress").value.trim()
      });
      showToast("Account created! A welcome email has been sent. Please login.", "success");
      setTimeout(() => { window.location.href = "login.html"; }, 300);
    } catch (err) {
      showToast(err.message, "error");
      btn.disabled = false;
      btn.innerHTML = 'Create Account <i class="bi bi-arrow-right ms-1"></i>';
    }
  });
}

// =============================================
// CITIZEN DASHBOARD
// =============================================
function initCitizenDashboard() {

  // CHECK PAGE
  if (
    !document.getElementById("tab-overview")
    ||
    !document.querySelector('[data-tab="tab-submit"]')
  ) return;

  // AUTH CHECK
  if (!requireAuth(["CITIZEN"])) return;

  // USER DATA
  const user = Auth.getUser();

  if (user) {

    // INITIALS
    const initials =
      user.name
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .slice(0,2);

    // NAME
    document
      .querySelectorAll(".citizen-name")
      .forEach(el => {
        el.textContent = user.name;
      });

    // AVATAR
    document
      .querySelectorAll(".citizen-avatar")
      .forEach(el => {
        el.textContent = initials;
      });

    // GREETING
    const greet =
      document.getElementById(
        "citizenGreeting"
      );

    if (greet) {

      const hr =
        new Date().getHours();

      const greeting =
        hr < 12
          ? "Good morning"
          : hr < 17
            ? "Good afternoon"
            : "Good evening";

      greet.textContent =
        `${greeting}, ${user.name.split(" ")[0]}! 👋`;

    }

  }

  // =====================================
  // TAB SWITCH EVENTS
  // =====================================
  document
    .querySelectorAll(
      ".sidebar-nav .nav-link[data-tab]"
    )
    .forEach(link => {

      link.addEventListener(
        "click",
        async function () {

          const tab =
            this.dataset.tab;

          // OVERVIEW
          if (tab === "tab-overview") {

            await loadCitizenOverview();

          }

          // HISTORY
          if (tab === "tab-history") {

            await loadCitizenHistory();

          }

          // SUBMIT COMPLAINT
          if (tab === "tab-submit") {

            await loadDeptDropdown();

          }

          // PROFILE
          if (tab === "tab-profile") {

            loadCitizenProfile();

          }

          // TRACK
          if (tab === "tab-track") {

            initTracker();

          }

        }
      );

    });

  // =====================================
  // INITIAL LOADS
  // =====================================

  loadCitizenOverview();

  loadCitizenProfile();

  initTracker();

}

async function loadCitizenOverview() {
  try {
    const result = await API.citizen.getMyComplaints(0, 50);
    const complaints = result.content || [];
    const counts = { OPEN:0, IN_PROGRESS:0, RESOLVED:0, REJECTED:0 };
    complaints.forEach(c => counts[c.status] = (counts[c.status]||0)+1);
    setText("kpiOpen",       counts.OPEN);
    setText("kpiInProgress", counts.IN_PROGRESS);
    setText("kpiResolved",   counts.RESOLVED);
    setText("kpiRejected",   counts.REJECTED);

    const tbody = document.getElementById("recentComplaintsBody");
    if (tbody) {
      tbody.innerHTML = complaints.length ? complaints.slice(0,5).map(c => `
        <tr>
          <td><strong>#GR-${c.id}</strong></td>
          <td>${c.title}</td>
          <td>
            <i class="bi ${c.departmentIcon}" style="color:${c.departmentColor}"></i>
            ${c.departmentName}
          </td>
          <td>${getStatusBadge(c.status)}</td>
          <td>${getPriorityBadge(c.priority)}</td>
          <td>${formatDate(c.createdAt)}</td>
          <td><button class="btn btn-sm btn-outline-secondary" onclick="trackFromOverview(${c.id})">Track</button></td>
        </tr>`).join("")
      : `<tr><td colspan="7" class="text-center text-muted py-4">No complaints yet. <a href="#" onclick="document.querySelector('[data-tab=tab-submit]').click()">File one →</a></td></tr>`;
    }
  } catch(err) { showToast(err.message, "error"); }
}

function trackFromOverview(id) {
  const trackLink = document.querySelector('[data-tab="tab-track"]');
  if (trackLink) trackLink.click();
  document.getElementById("trackInput").value = id;
  setTimeout(() => doTrack(id), 200);
}

async function loadDeptDropdown() {
  try {
    const depts = await API.getDepartments();
    const sel   = document.getElementById("deptSelect");
    if (!sel) return;
    sel.innerHTML = '<option value="">— Select Department —</option>' +
      depts.map(d => `<option value="${d.id}">${d.displayName}</option>`).join("");
  } catch(err) { console.error("Could not load departments:", err.message); }
}

async function loadCitizenHistory() {
  try {
    const result = await API.citizen.getMyComplaints(0, 100);
    const complaints = result.content || [];
    const tbody = document.getElementById("historyTableBody");
    if (!tbody) return;
    tbody.innerHTML = complaints.length ? complaints.map(c => `
      <tr>
        <td>#GR-${c.id}</td>
        <td>${c.title}</td>
        <td><i class="bi ${c.departmentIcon}" style="color:${c.departmentColor}"></i> ${c.departmentName}</td>
        <td>${getStatusBadge(c.status)}</td>
        <td>${getPriorityBadge(c.priority)}</td>
        <td>${formatDate(c.createdAt)}</td>
        <td>${c.status === "RESOLVED" ? formatDate(c.updatedAt) : "—"}</td>
      </tr>`).join("")
    : `<tr><td colspan="7" class="text-center text-muted py-4">No complaint history found.</td></tr>`;
  } catch(err) { showToast(err.message, "error"); }
}

function loadCitizenProfile() {
  const user = Auth.getUser();
  if (!user) return;
  const nameEl  = document.getElementById("profileName");
  const emailEl = document.getElementById("profileEmail");
  if (nameEl)  nameEl.value  = user.name  || "";
  if (emailEl) emailEl.value = user.email || "";
}

// Submit Complaint — POST /api/complaints
function initSubmitComplaint() {
  const form = document.getElementById("complaintForm");

  const uploadZone =
  document.getElementById(
    "uploadZone"
  );

const fileInput =
  document.getElementById(
    "complaintAttachment"
  );

const preview =
  document.getElementById(
    "uploadPreview"
  );

const previewImage =
  document.getElementById(
    "previewImage"
  );

const previewFileName =
  document.getElementById(
    "previewFileName"
  );

// OPEN FILE PICKER
if(uploadZone && fileInput){

  uploadZone.addEventListener(
    "click",
    () => {

      fileInput.click();

    }
  );

  // FILE SELECTED
  fileInput.addEventListener(
    "change",
    () => {

      const file =
        fileInput.files[0];

      if(!file) return;

      preview.style.display =
        "block";

      previewFileName.textContent =
        file.name;

      // IMAGE PREVIEW
      if(
        file.type.startsWith(
          "image/"
        )
      ){

        const reader =
          new FileReader();

        reader.onload = e => {

          previewImage.src =
            e.target.result;

          previewImage.style.display =
            "block";
        };

        reader.readAsDataURL(
          file
        );

      }else{

        previewImage.style.display =
          "none";
      }

    }
  );
}
  if (!form) return;

  loadDeptDropdown();

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const deptId   = document.getElementById("deptSelect")?.value;
    const title    = document.getElementById("complaintTitle");
    const desc     = document.getElementById("complaintDesc");
    const loc      = document.getElementById("complaintLocation");
    const priority = document.getElementById("prioritySelect")?.value || "MEDIUM";
    let valid = true;

    if (!deptId) { showToast("Please select a department.", "warning"); valid = false; }
    if (!title?.value.trim()) { markField(title, false, "Title required."); valid = false; }
    else markField(title, true, "");
    if ((desc?.value.trim().length || 0) < 20) { markField(desc, false, "Min 20 characters."); valid = false; }
    else markField(desc, true, "");
    if (!loc?.value.trim()) { markField(loc, false, "Location required."); valid = false; }
    else markField(loc, true, "");
    if (!valid) return;

    const btn = form.querySelector("[type=submit]");
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting…';

    try {
      const formData =
  new FormData();

const complaintData = {

  departmentId:
    parseInt(deptId),

  title:
    title.value.trim(),

  description:
    desc.value.trim(),

  location:
    loc.value.trim(),

  priority:
    priority.toUpperCase()
};

// JSON PART
formData.append(

  "data",

  new Blob(
    [
      JSON.stringify(
        complaintData
      )
    ],
    {
      type:
        "application/json"
    }
  )
);

// FILE PART
const file =
  document.getElementById(
    "complaintAttachment"
  )?.files[0];

if(file){

  formData.append(
    "file",
    file
  );
}

// API CALL
const complaint =
  await API.citizen
    .submitComplaint(
      formData
    );
      showToast(`✅ Complaint #GR-${complaint.id} submitted! Confirmation email sent.`, "success");
      form.reset();
      form.querySelectorAll(".is-valid").forEach(el => el.classList.remove("is-valid"));
      await loadCitizenOverview();
    } catch(err) {
      showToast(err.message, "error");
    } finally {
      btn.disabled = false;
      btn.innerHTML = 'Submit Complaint <i class="bi bi-arrow-right ms-1"></i>';
    }
  });
}

// Track Complaint — GET /api/complaints/{id}/track
// async function initTracker(){

//   const btn =
//     document.getElementById(
//       "trackSearchBtn"
//     );

//   const input =
//     document.getElementById(
//       "trackInput"
//     );

//   if(!btn || !input) return;

//   btn.onclick = async () => {

//     try{

//       const id =
//         input.value
//           .replace("#GR-","")
//           .trim();

//       if(!id){

//         showToast(
//           "Enter complaint ID",
//           "warning"
//         );

//         return;
//       }

//       const data =
//         await API.citizen
//           .trackComplaint(id);

//       renderTracker(data);

//     }catch(err){

//       showToast(
//         err.message,
//         "error"
//       );

//     }

//   };

// }

// function renderTracker(c){

//   const card =
//     document.getElementById(
//       "trackerResult"
//     );

//   if(!card) return;

//   card.style.display = "block";

//   // HEADER
//   setText(
//     "trackComplaintId",
//     `#GR-${c.id}`
//   );

//   setText(
//     "trackComplaintTitle",
//     `${c.title} — ${c.location}`
//   );

//   setText(
//   "trackDepartment",
//   c.priority || "—"
// );

// setText(
//   "trackPriority",
//   c.departmentName || c.departmentType || "—"
// );

//   // STATUS BADGE
//   document.getElementById(
//     "trackStatusBadge"
//   ).innerHTML =
//     getStatusBadge(c.status);

//   // RESET TIMELINE
//   [
//     "tlAssigned",
//     "tlProgress",
//     "tlResolution",
//     "tlClosed"
//   ].forEach(id => {

//     const el =
//       document.getElementById(id);

//     if(el){

//       el.classList.remove(
//         "done",
//         "tl-active"
//       );

//       el.classList.add(
//         "pending"
//       );

//     }

//   });

//   // DATES
//   setText(
//     "tlSubmittedDate",
//     formatDate(c.createdAt)
//   );

//   setText(
//     "tlAssignedDate",
//     formatDate(c.createdAt)
//   );

//   // OPEN
//   if(c.status === "OPEN"){

//     const assigned =
//       document.getElementById(
//         "tlAssigned"
//       );

//     if(assigned){

//       assigned.classList.remove(
//         "pending"
//       );

//       assigned.classList.add(
//         "done"
//       );

//     }

//   }

//   // IN PROGRESS
//   if(c.status === "IN_PROGRESS"){

//     const assigned =
//       document.getElementById(
//         "tlAssigned"
//       );

//     if(assigned){

//       assigned.classList.remove(
//         "pending"
//       );

//       assigned.classList.add(
//         "done"
//       );

//     }

//     const progress =
//       document.getElementById(
//         "tlProgress"
//       );

//     if(progress){

//       progress.classList.remove(
//         "pending"
//       );

//       progress.classList.add(
//         "tl-active"
//       );

//     }

//     setText(
//       "tlProgressDate",
//       formatDate(c.updatedAt)
//     );

//   }

//   // RESOLVED
//   if(c.status === "RESOLVED"){

//     [
//       "tlAssigned",
//       "tlProgress",
//       "tlResolution"
//     ].forEach(id => {

//       const el =
//         document.getElementById(id);

//       if(el){

//         el.classList.remove(
//           "pending"
//         );

//         el.classList.add(
//           "done"
//         );

//       }

//     });

//     setText(
//       "tlResolutionDate",
//       formatDate(c.updatedAt)
//     );

//     const closed =
//       document.getElementById(
//         "tlClosed"
//       );

//     if(closed){

//       closed.classList.remove(
//         "pending"
//       );

//       closed.classList.add(
//         "tl-active"
//       );

//     }

//   }

// }

async function initTracker(){

  const btn =
    document.getElementById(
      "trackSearchBtn"
    );

  const input =
    document.getElementById(
      "trackInput"
    );

  if(!btn || !input) return;

  btn.onclick = async () => {

    try{

      const id =
        input.value
          .replace("#GR-","")
          .trim();

      if(!id){

        showToast(
          "Enter complaint ID",
          "warning"
        );

        return;
      }

      const c =
        await API.citizen
          .trackComplaint(id);

      renderTracker(c);

    }catch(err){

      showToast(
        err.message,
        "error"
      );

    }

  };

}

function renderTracker(c){

  const box =
    document.getElementById(
      "trackerResult"
    );

    console.log("Tracking complaint:", c);

  if(!box) return;

  box.style.display = "block";

  // HEADER
  setText(
    "trackComplaintId",
    `#GR-${c.id}`
  );

  setText(
    "trackComplaintTitle",
    `${c.title} — ${c.location}`
  );

  document.getElementById(
    "trackStatusBadge"
  ).innerHTML =
    getStatusBadge(c.status);

  // INFO
  setText(
    "trackDepartment",
    c.departmentName ||
    c.departmentType ||
    "—"
  );

  setText(
    "trackPriority",
    c.priority || "—"
  );

  setText(
    "trackDeadline",
    c.slaDeadline
      ? formatDate(c.slaDeadline)
      : "—"
  );

  setText(
    "trackCreatedAt",
    formatDate(c.createdAt)
  );

  // RESET
  [
    "timelineAssigned",
    "timelineProgress",
    "timelineResolved",
    "timelineClosed"
  ].forEach(id => {

    const el =
      document.getElementById(id);

    if(el){

      el.classList.remove(
        "completed",
        "active"
      );

    }

  });

  // OPEN
  if(c.status === "OPEN"){

    document
      .getElementById(
        "timelineAssigned"
      )
      ?.classList.add(
        "completed"
      );

  }

  // IN PROGRESS
  if(c.status === "IN_PROGRESS"){

    document
      .getElementById(
        "timelineAssigned"
      )
      ?.classList.add(
        "completed"
      );

    document
      .getElementById(
        "timelineProgress"
      )
      ?.classList.add(
        "active"
      );

  }

  // RESOLVED
  if(c.status === "RESOLVED"){

    document
      .getElementById(
        "timelineAssigned"
      )
      ?.classList.add(
        "completed"
      );

    document
      .getElementById(
        "timelineProgress"
      )
      ?.classList.add(
        "completed"
      );

    document
      .getElementById(
        "timelineResolved"
      )
      ?.classList.add(
        "completed"
      );

    document
      .getElementById(
        "timelineClosed"
      )
      ?.classList.add(
        "active"
      );

  }

}

// =============================================
// OFFICER DASHBOARD
// =============================================
function initOfficerDashboard() {
  // Only run on dept dashboard page
  if (!document.querySelector('[data-tab="tab-update"]')) return;
  if (!requireAuth(["OFFICER"])) return;

  const user = Auth.getUser();
  
  if (user) {
    const initials = user.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2);
    document.querySelectorAll(".officer-name").forEach(el => el.textContent = user.name);
    document.querySelectorAll(".officer-avatar").forEach(el => el.textContent = initials);
  }

  document.querySelectorAll(".sidebar-nav .nav-link[data-tab]").forEach(link => {
    link.addEventListener("click", async function () {
      const tab = this.dataset.tab;
      if (tab === "tab-overview")   await loadOfficerOverview();
      if (tab === "tab-complaints") await loadOfficerComplaints();
      if (tab === "tab-sla")        await loadOfficerSla();
      if (tab === "tab-history")    await loadOfficerHistory();
    });
  });


  document.getElementById("updateStatusBtn")?.addEventListener("click", submitStatusUpdate);
  document.getElementById("loadComplaintBtn")?.addEventListener("click", loadComplaintForUpdate);

  loadOfficerOverview();
}

async function loadOfficerOverview() {
  try {
    const result = await API.officer.getDeptComplaints({ size: 50 });
    const complaints = result.content || [];
    loadOfficerAnalytics(complaints);
    loadOfficerProfilePerformance(complaints);
    const counts = { OPEN:0, IN_PROGRESS:0, RESOLVED:0, REJECTED:0 };
    complaints.forEach(c => counts[c.status] = (counts[c.status]||0)+1);
    setText("officerKpiOpen",       counts.OPEN);
    setText("officerKpiInProgress", counts.IN_PROGRESS);
    setText("officerKpiResolved",   counts.RESOLVED);
    setText("officerKpiBreached",   complaints.filter(c => c.slaBreached).length);

    const urgent = complaints
      .filter(c => c.status === "OPEN" || c.status === "IN_PROGRESS")
      .sort((a,b) => (b.priority === "HIGH" ? 1 : 0) - (a.priority === "HIGH" ? 1 : 0))
      .slice(0,5);

    const tbody = document.getElementById("urgentTableBody");
    if (tbody) {
      tbody.innerHTML = urgent.length ? urgent.map(c => `
        <tr>
          <td><strong>#GR-${c.id}</strong></td>
          <td>${c.title}</td>
          <td>${c.citizenName}</td>
          <td>${getPriorityBadge(c.priority)}</td>
          <td>${getStatusBadge(c.status)}</td>
          <td>${c.slaBreached ? '<span class="sla-countdown breach">⏱ BREACHED</span>' : '<span class="sla-countdown ok">⏱ On Track</span>'}</td>
          <td><button class="btn btn-xs btn-outline-primary" onclick="openUpdateTab(${c.id})">Update</button></td>
        </tr>`).join("")
      : `<tr><td colspan="7" class="text-center text-muted py-3">No urgent complaints 🎉</td></tr>`;
    }
  } catch(err) { showToast(err.message, "error"); }
}
function formatDateTime(dateString) {

  if (!dateString) return "-";

  const date =
    new Date(dateString);

  return date.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  );
}

function loadOfficerAnalytics(complaints) {

  // =====================================
  // TODAY ACTIVITY
  // =====================================

  const activityFeed =
    document.getElementById(
      "officerActivityFeed"
    );

  if (activityFeed) {

    const latest =
      [...complaints]
        .sort((a, b) =>
          new Date(b.updatedAt) -
          new Date(a.updatedAt)
        )
        .slice(0, 5);

    activityFeed.innerHTML =
      latest.length
        ? latest.map(c => {

            let icon =
              "bi-clock-history";

            let bg =
              "bg-warning-subtle";

            let color =
              "text-warning";

            let title =
              "Complaint Updated";

            if (
              c.status === "RESOLVED"
            ) {

              icon =
                "bi-check-circle-fill";

              bg =
                "bg-success-subtle";

              color =
                "text-success";

              title =
                "Complaint Resolved";
            }

            if (c.slaBreached) {

              icon =
                "bi-exclamation-triangle-fill";

              bg =
                "bg-danger-subtle";

              color =
                "text-danger";

              title =
                "SLA Warning";
            }

            return `

              <div class="activity-item mb-3">

                <div class="
                  activity-icon
                  ${bg}
                  ${color}
                ">

                  <i class="
                    bi ${icon}
                  "></i>

                </div>

                <div class="
                  activity-content
                ">

                  <h6>

                    ${title}

                  </h6>

                  <p>

                    #GR-${c.id}

                    ·

                    ${c.title}

                  </p>

                  <small>

                    ${formatDateTime(
                      c.updatedAt
                    )}

                  </small>

                </div>

              </div>

            `;
          }).join("")
        : `
          <div class="
            text-center
            text-muted
            py-4
          ">
            No recent activity
          </div>
        `;
  }

  // =====================================
  // MONTHLY SLA
  // =====================================

  const resolved =
    complaints.filter(
      c => c.status === "RESOLVED"
    );

  const slaMet =
    resolved.filter(
      c => !c.slaBreached
    );

  const slaPercent =
    resolved.length
      ? Math.round(
          (slaMet.length /
            resolved.length) * 100
        )
      : 0;

  setText(
    "monthlySlaRate",
    `${slaPercent}%`
  );

  const slaBar =
    document.getElementById(
      "monthlySlaBar"
    );

  if (slaBar) {
    slaBar.style.width =
      `${slaPercent}%`;
  }

  setText(
    "monthlySlaStatus",

    slaPercent >= 95
      ? "Excellent"
      : slaPercent >= 80
        ? "Good"
        : "Needs Improvement"
  );

  // =====================================
  // AVG RESOLUTION TIME
  // =====================================

  let totalHours = 0;

  resolved.forEach(c => {

    if (
      c.createdAt &&
      c.updatedAt
    ) {

      const created =
        new Date(c.createdAt);

      const updated =
        new Date(c.updatedAt);

      const diff =
        (updated - created) /
        (1000 * 60 * 60);

      totalHours += diff;
    }
  });

  const avgHours =
    resolved.length
      ? Math.round(
          totalHours /
          resolved.length
        )
      : 0;

  setText(
    "avgResolutionTime",
    `${avgHours}hrs`
  );

  setText(
    "resolutionStatus",

    avgHours <= 48
      ? "Within SLA"
      : "Above SLA"
  );

  // =====================================
  // CITIZEN SATISFACTION
  // =====================================

  let rating = 3.0;

  if (slaPercent >= 95) {
    rating = 4.9;
  }
  else if (slaPercent >= 85) {
    rating = 4.5;
  }
  else if (slaPercent >= 70) {
    rating = 4.0;
  }

  setText(
    "citizenRating",
    `${rating}/5`
  );

  const stars =
    document.getElementById(
      "citizenStars"
    );

  if (stars) {

    stars.innerHTML = "";

    const fullStars =
      Math.floor(rating);

    for (
      let i = 0;
      i < fullStars;
      i++
    ) {

      stars.innerHTML += `
        <i class="
          bi bi-star-fill
        "></i>
      `;
    }
  }

  setText(
    "ratingCount",
    `${resolved.length} reviews`
  );
}
function loadOfficerProfilePerformance(
  complaints
) {

  if (!complaints) return;

  // =========================
  // RESOLVED
  // =========================

  const resolved =
    complaints.filter(
      c => c.status === "RESOLVED"
    );

  setText(
    "profileResolvedCount",
    resolved.length
  );

  // =========================
  // SLA RATE
  // =========================

  const slaMet =
    resolved.filter(
      c => !c.slaBreached
    );

  const slaRate =
    resolved.length
      ? Math.round(
          (slaMet.length /
            resolved.length) * 100
        )
      : 0;

  setText(
    "profileSlaRate",
    `${slaRate}%`
  );

  // =========================
  // AVG TIME
  // =========================

  let totalHours = 0;

  resolved.forEach(c => {

    if (
      c.createdAt &&
      c.updatedAt
    ) {

      const created =
        new Date(c.createdAt);

      const updated =
        new Date(c.updatedAt);

      totalHours +=
        (updated - created) /
        (1000 * 60 * 60);
    }
  });

  const avgHours =
    resolved.length
      ? Math.round(
          totalHours /
          resolved.length
        )
      : 0;

  setText(
    "profileAvgTime",
    `${avgHours}hr`
  );

  // =========================
  // RATING
  // =========================

  let rating = 3.5;

  if (slaRate >= 95) {
    rating = 4.9;
  }
  else if (slaRate >= 85) {
    rating = 4.5;
  }
  else if (slaRate >= 70) {
    rating = 4.0;
  }

  setText(
    "profileRating",
    `${rating}★`
  );

  // =========================
  // EFFICIENCY BAR
  // =========================

  const efficiency =
    Math.min(
      100,
      Math.round(
        (slaRate + rating * 20) / 2
      )
    );

  setText(
    "profileEfficiencyText",
    `${efficiency}%`
  );

  const bar =
    document.getElementById(
      "profileEfficiencyBar"
    );

  if (bar) {
    bar.style.width =
      `${efficiency}%`;
  }
}

async function loadOfficerComplaints(page = 0) {
  try {
    const status   = document.getElementById("deptFilterStatus")?.value   || "";
    const priority = document.getElementById("deptFilterPriority")?.value || "";
    const result   = await API.officer.getDeptComplaints({ status, priority, page, size:10 });
    const complaints = result.content || [];

    const tbody = document.getElementById("deptComplaintsBody");
    if (!tbody) return;
    tbody.innerHTML = complaints.length ? complaints.map(c => `
      <tr>
        <td><strong>#GR-${c.id}</strong></td>
        <td>${c.title}</td>
        <td>${c.citizenName}</td>
        <td>${c.location}</td>
        <td>${getPriorityBadge(c.priority)}</td>
        <td>${getStatusBadge(c.status)}</td>
        <td>${formatDate(c.createdAt)}</td>
        <td>${c.slaBreached ? '<span class="sla-countdown breach">Breached</span>' : '<span class="sla-countdown ok">On Track</span>'}</td>
        <td class="d-flex gap-2">

  <button
    class="btn btn-xs btn-outline-primary"
    onclick="viewComplaint(${c.id})">

    View

  </button>

  ${
    c.status !== "RESOLVED"
    ? `
      <button
        class="btn btn-xs btn-success"
        onclick="openUpdateTab(${c.id})">

        Update

      </button>
    `
    : ""
  }

</td>
      </tr>`).join("")
    : `<tr><td colspan="9" class="text-center text-muted py-4">No complaints found.</td></tr>`;
  } catch(err) { showToast(err.message, "error"); }
}

async function loadOfficerSla() {

  try {

    const result =
      await API.officer.getDeptComplaints({
        size: 100
      });

    const complaints =
      result.content || [];

    // =========================
    // COUNTS
    // =========================
    const breached =
      complaints.filter(c =>
        c.slaBreached &&
        c.status !== "RESOLVED"
      );

    const active =
      complaints.filter(c =>
        !c.slaBreached &&
        (
          c.status === "OPEN" ||
          c.status === "IN_PROGRESS"
        )
      );

    const resolved =
      complaints.filter(c =>
        c.status === "RESOLVED"
      );

    // =========================
    // KPI VALUES
    // =========================
    const total =
      complaints.length || 1;

    const slaRate =
      Math.round(
        ((total - breached.length) / total) * 100
      );

    setText(
      "slaRateValue",
      `${slaRate}%`
    );

    setText(
      "slaBreachedCount",
      breached.length
    );

    setText(
      "slaRiskCount",
      active.length
    );

    setText(
      "slaTrackCount",
      resolved.length
    );

    // =========================
    // CONTAINER
    // =========================
    const container =
      document.getElementById(
        "slaMonitorContainer"
      );

    if (!container) return;

    let html = "";

    // =========================
    // BREACHED
    // =========================
    if (breached.length) {

      html += `

        <h5 class="fw-bold mb-3 text-danger">
          🔴 Breached Complaints
        </h5>

      `;

      html += breached.map(c => `

        <div class="sla-monitor-item breach mb-3">

          <div>

            <strong>
              #GR-${c.id}
            </strong>

            ·

            ${c.title}

            <br>

            <small class="text-muted">

              <i class="bi bi-person me-1"></i>

              ${c.citizenName || "-"}

            </small>

          </div>

          <div class="
            d-flex
            align-items-center
            gap-2
          ">

            <span class="
              sla-countdown
              breach
            ">
              ⏱ BREACHED
            </span>

            <button
              class="
                btn
                btn-sm
                btn-danger
              "

              onclick="
                openUpdateTab(${c.id})
              "
            >

              Update

            </button>

          </div>

        </div>

      `).join("");
    }

    // =========================
    // ACTIVE
    // =========================
    if (active.length) {

      html += `

        <h5 class="
          fw-bold
          mb-3
          mt-4
          text-warning
        ">

          🟡 Active Complaints

        </h5>

      `;

      html += active.map(c => `

        <div class="
          sla-monitor-item
          warning
          mb-2
        ">

          <div>

            <strong>
              #GR-${c.id}
            </strong>

            ·

            ${c.title}

            <br>

            <small class="text-muted">

              <i class="bi bi-person me-1"></i>

              ${c.citizenName || "-"}

            </small>

          </div>

          <div class="
            d-flex
            align-items-center
            gap-2
          ">

            <span class="
              sla-countdown
              warning
            ">

              ⏱ In Progress

            </span>

            <button
              class="
                btn
                btn-sm
                btn-outline-warning
              "

              onclick="
                openUpdateTab(${c.id})
              "
            >

              Update

            </button>

          </div>

        </div>

      `).join("");
    }

    // =========================
    // EMPTY STATE
    // =========================
    if (!html) {

      html = `

        <div class="
          table-card
          text-center
          py-5
        ">

          <div style="
            font-size:3rem
          ">
            ✅
          </div>

          <h5 class="mt-3 fw-bold">

            No SLA Alerts

          </h5>

          <p class="
            text-muted
            mb-0
          ">

            All complaints are currently under SLA limits.

          </p>

        </div>

      `;
    }

    container.innerHTML = html;

  } catch(err) {

    console.error(err);

    showToast(
      err.message,
      "error"
    );

  }

}

async function loadOfficerHistory() {
  try {
    const result = await API.officer.getDeptComplaints({ status:"RESOLVED", size:50 });
    const complaints = result.content || [];
    const tbody = document.getElementById("historyTableBody");
    if (!tbody) return;
    tbody.innerHTML = complaints.length ? complaints.map(c => `
      <tr>
        <td>#GR-${c.id}</td>
        <td>${c.title}</td>
        <td>${c.citizenName}</td>
        <td>${c.location}</td>
        <td>${getPriorityBadge(c.priority)}</td>
        <td>${formatDate(c.updatedAt)}</td>
        <td>⭐⭐⭐⭐</td>
      </tr>`).join("")
    : `<tr><td colspan="7" class="text-center text-muted py-4">No resolved complaints yet.</td></tr>`;
  } catch(err) { showToast(err.message, "error"); }
}

function openUpdateTab(id) {
  const link = document.querySelector('[data-tab="tab-update"]');
  if (link) link.click();
  setTimeout(() => {
    const inp = document.getElementById("updateSearchInput");
    if (inp) { inp.value = id; loadComplaintForUpdate(); }
  }, 150);
}

async function loadComplaintForUpdate() {
  const val     = document.getElementById("updateSearchInput")?.value.trim();
  const cleanId = String(val).replace(/[^0-9]/g,"");
  if (!cleanId) { showToast("Enter a Complaint ID.", "warning"); return; }
  try {
    const c = await API.trackComplaint(cleanId);
    console.log("Loaded complaint for update:", c);
    setText("updateComplaintId",  `#GR-${c.id}`);
    setText(
  "updateComplaintIdLabel",
  `#GR-${c.id}`
);
    setText("updateComplaintTitle",    c.title);
    setText("updateComplaintCitizen",  c.citizenName || "—");
    setText("updateComplaintLocation", c.location);
    setText("updateComplaintFiledDate", c.createdAt ? formatDate(c.createdAt) : "—");
    setText("updateComplaintStatus",   getStatusBadge(c.status));
    setText("updateComplaintDeadline", c.slaDeadline ? formatDate(c.slaDeadline) : "—");
    const sec = document.getElementById("updateFormSection");
    if (sec) sec.style.display = "";
  } catch(err) { showToast("Complaint not found.", "error"); }
}

async function submitStatusUpdate() {
  const idLabel = document.getElementById("updateComplaintIdLabel")?.textContent;
  const id      = idLabel?.replace(/[^0-9]/g,"");
  const status  = document.getElementById("updateStatus")?.value;
  const remark  = document.getElementById("updateRemark")?.value.trim();
  if (!id)     { showToast("Load a complaint first.", "warning"); return; }
  if (!status) { showToast("Select a status.", "warning"); return; }
  if (!remark) { showToast("Remark is required.", "warning"); return; }

  const btn = document.getElementById("updateStatusBtn");
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Updating…';
  try {
    await API.officer.updateStatus(id, { status, remark });
    showToast(`Complaint #GR-${id} updated to "${status}". Citizen notified via email! 📧`, "success");
    document.getElementById("updateRemark").value = "";
    await loadOfficerOverview();
  } catch(err) { showToast(err.message, "error"); }
  finally {
    btn.disabled = false;
    btn.innerHTML = 'Update & Notify Citizen <i class="bi bi-send ms-1"></i>';
  }
}

// =============================================
// PROFILE SAVE
// =============================================
function initProfileUpdate() {
  const btn = document.getElementById("profileSaveBtn");
  if (!btn) return;
  btn.addEventListener("click", function () {
    this.disabled = true;
    this.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving…';
    setTimeout(() => {
      showToast("Profile updated successfully!", "success");
      this.disabled = false;
      this.innerHTML = "Save Changes";
    }, 800);
  });
}
// =============================================
// AUTH GUARD
// =============================================
function requireAuth(roles = []) {

  // =====================================
  // GET TOKEN + USER
  // =====================================
  const token =
    Auth.getToken();

  const user =
    Auth.getUser();

    console.log("========== AUTH CHECK ==========");

console.log(
  "Current Page:",
  window.location.pathname
);

console.log(
  "Token:",
  token
);

console.log(
  "User:",
  user
);

console.log(
  "Allowed Roles:",
  roles
);

console.log("================================");

  // =====================================
  // NOT LOGGED IN
  // =====================================
  if (!token || !user) {

    // Avoid redirect loop
    if (
      !window.location.pathname.includes(
        "login.html"
      )
    ) {

      window.location.replace(
        "login.html"
      );
    }

    return false;
  }

  // =====================================
  // ROLE CHECK
  // =====================================
  const userRole =
    (user.role || "")
      .toUpperCase();

  const allowed =
  !roles.length ||
  roles.some(r =>
    userRole.includes(
      r.toUpperCase()
    )
  );

  if (
    roles.length &&
    !allowed
  ) {

    Auth.clear();

    window.location.replace(
      "login.html"
    );

    return false;
  }

  return true;
}
// =============================================
// ADMIN DASHBOARD
// =============================================
function initAdminDashboard() {

  
   if (
      !window.location.pathname.includes("admin-dashboard")
   ) return;

   if (!requireAuth(["ADMIN"])) return;



  loadAdminDashboard();
  loadAdminComplaints();
  initComplaintActions();
  loadAdminDepartments();
  initDepartmentActions();
  loadAdminCitizens();
  loadSlaPolicies();
  loadSlaBreaches();
  loadReportsAnalytics();
  loadAnalyticsKPIs();
}




// =============================================
// ADMIN DASHBOARD
// =============================================
async function loadAdminDashboard() {

  try {

    // =============================================
    // FETCH DATA
    // =============================================
    const dashboard =
      await API.admin.getDashboard();

    const complaintsResponse =
      await API.admin.getComplaints({
        page: 0,
        size: 100
      });

    const departments =
      await API.admin.getDepartments();

    const complaints =
      complaintsResponse.content ||
      complaintsResponse ||
      [];

    // =============================================
    // KPI CARDS
    // =============================================
    setText(
      "kpiTotal",
      dashboard.totalComplaints || 0
    );

    setText(
      "kpiOpen",
      dashboard.open || 0
    );

    setText(
      "kpiResolved",
      dashboard.resolved || 0
    );

    setText(
      "kpiBreached",
      dashboard.slaBreached || 0
    );

    // =============================================
    // DEPARTMENT PERFORMANCE
    // =============================================
    const perfContainer =
      document.getElementById(
        "deptPerfBars"
      );

    if (perfContainer) {

      if (!departments.length) {

        perfContainer.innerHTML = `
          <div class="text-center text-muted py-4">
            No departments found.
          </div>
        `;

      } else {

        perfContainer.innerHTML =
          departments.map(dept => {

            const deptComplaints =
              complaints.filter(
                c =>
                  c.departmentName ===
                  dept.displayName
              );

            const total =
              deptComplaints.length;

            const resolved =
              deptComplaints.filter(
                c =>
                  c.status ===
                  "RESOLVED"
              ).length;

            const percentage =
              total > 0
                ? Math.round(
                    (resolved / total) * 100
                  )
                : 100;

            return `

              <div class="mb-3">

                <div class="
                  d-flex
                  justify-content-between
                  mb-1
                ">

                  <strong>
                    ${dept.displayName}
                  </strong>

                  <span>
                    ${percentage}%
                  </span>

                </div>

                <div
                  class="progress"
                  style="height:10px"
                >

                  <div
                    class="progress-bar"

                    style="
                      width:${percentage}%;
                      background:
                        ${dept.color || '#4f46e5'};
                    "
                  >
                  </div>

                </div>

              </div>

            `;

          }).join("");
      }
    }

    // =============================================
    // LIVE ACTIVITY FEED
    // =============================================
    const feed =
      document.getElementById(
        "activityFeed"
      );

    if (feed) {

      const latest =
        [...complaints]

        .sort(
          (a, b) =>
            new Date(b.createdAt)
            -
            new Date(a.createdAt)
        )

        .slice(0, 5);

      if (!latest.length) {

        feed.innerHTML = `
          <div class="text-center text-muted py-4">
            No recent activity.
          </div>
        `;

      } else {

        feed.innerHTML =
          latest.map(c => `

            <div class="
              border-bottom
              py-3
            ">

              <div class="fw-semibold">

                Complaint
                #GR-${c.id}

              </div>

              <div class="small">

                ${c.status}

                •

                ${c.departmentName || "-"}

              </div>

              <small class="text-muted">

                ${formatDate(
                  c.createdAt
                )}

              </small>

            </div>

          `).join("");
      }
    }

    // =============================================
    // SLA ALERTS
    // =============================================
    const slaContainer =
      document.getElementById(
        "slaAlertsContainer"
      );

    if (slaContainer) {

      const breaches =
        complaints.filter(
          c => c.slaBreached
        );

      if (!breaches.length) {

        slaContainer.innerHTML = `
          <div class="
            text-center
            text-success
            py-4
          ">
            No SLA breaches 🎉
          </div>
        `;

      } else {

        slaContainer.innerHTML =
          breaches.map(c => `

            <div class="
              alert
              alert-danger
              mb-2
            ">

              <strong>
                #GR-${c.id}
              </strong>

              ${c.title || "Complaint"}

            </div>

          `).join("");
      }
    }

    // =============================================
    // COMPLAINTS BY DEPARTMENT CHART
    // =============================================
    const chart =
      document.getElementById(
        "deptChartBars"
      );

    if (chart) {

      const chartData =
        departments.map(dept => {

          const total =
            complaints.filter(
              c =>
                c.departmentName ===
                dept.displayName
            ).length;

          return {

            name:
              dept.displayName,

            total,

            color:
              dept.color || "#4f46e5"
          };
        });

      const max =
        Math.max(
          ...chartData.map(
            d => d.total
          ),
          1
        );

      chart.innerHTML = `

        <div class="
          d-flex
          align-items-end
          justify-content-around
          gap-3
        "
        style="
          min-height:260px;
          width:max-content;
          min-width:100%;
        ">

          ${chartData.map(d => `

            <div
              class="
                text-center
                d-flex
                flex-column
                align-items-center
              "

              style="
                flex:1;
                min-width:80px;
              "
            >

              <div
                style="
                  width:40px;

                  height:
                    ${Math.max(
                      (d.total / max) * 220,
                      20
                    )}px;

                  background:
                    ${d.color};

                  border-radius:
                    12px 12px 0 0;

                  transition:0.3s;
                "
              >
              </div>

              <div
                class="small mt-2"

                style="
                  word-break:break-word;
                  max-width:80px;
                "
              >

                ${d.name}

              </div>

            </div>

          `).join("")}

        </div>

      `;
    }

  } catch(err) {

    console.error(err);

    showToast(
      err.message,
      "error"
    );
  }
}
// =============================================
// ADMIN COMPLAINTS
// =============================================
async function loadAdminComplaints() {

  try {

    // =============================================
    // LOAD ONLY ONCE
    // =============================================
    const response =
      await API.admin.getComplaints();

    console.log(response);

    allComplaints =
      response.content ||
      response ||
      [];

    // =============================================
    // RENDER TABLE
    // =============================================
    renderComplaintsTable(
      allComplaints
    );

  } catch(err) {

    console.error(err);

    showToast(
      err.message,
      "error"
    );

  }

}

function renderComplaintsTable(
  complaints
) {

  const tbody =
    document.getElementById(
      "complaintsTableBody"
    );

  if (!tbody) return;

  // =============================================
  // EMPTY STATE
  // =============================================
  if (!complaints.length) {

    tbody.innerHTML = `
      <tr>

        <td
          colspan="10"
          class="
            text-center
            text-muted
            py-4
          "
        >

          No complaints found.

        </td>

      </tr>
    `;

    return;
  }

  // =============================================
  // TABLE
  // =============================================
  tbody.innerHTML =
    complaints.map(c => `

      <tr>

        <td>

          <input
            type="checkbox"
            class="form-check-input"
          >

        </td>

        <td>

          #GR-${c.id}

        </td>

        <td>

          ${c.citizenName || "-"}

        </td>

        <td>

          ${c.category || "-"}

        </td>

        <td>

          ${c.departmentName || "-"}

        </td>

        <td>

          ${getPriorityBadge(
            c.priority
          )}

        </td>

        <td>

          ${getStatusBadge(
            c.status
          )}

        </td>

        <td>

          ${formatDate(
            c.createdAt
          )}

        </td>

        <td>

          ${
            c.slaBreached

              ? `
                <span class="
                  badge
                  bg-danger
                ">
                  Breached
                </span>
              `

              : `
                <span class="
                  badge
                  bg-success
                ">
                  On Track
                </span>
              `
          }

        </td>

        <td>

          <button

            class="
              btn
              btn-sm
              btn-outline-primary
            "

            onclick="
              openComplaintModal(
                ${c.id}
              )
            "

          >

            View

          </button>

        </td>

      </tr>

    `).join("");

  // =============================================
  // TOTAL COUNT
  // =============================================
  setText(

    "complaintsTotalCount",

    `${complaints.length}
     complaints found`

  );

}

function applyComplaintFilters() {

  const department =
    document.getElementById(
      "filterDept"
    )?.value || "";

  const status =
    document.getElementById(
      "filterStatus"
    )?.value || "";

  const priority =
    document.getElementById(
      "filterPriority"
    )?.value || "";

  const search =
    document.getElementById(
      "filterSearch"
    )?.value
      ?.toLowerCase() || "";

  // =============================================
  // COPY ARRAY
  // =============================================
  let filtered =
    [...allComplaints];

  // =============================================
  // DEPARTMENT
  // =============================================
  if (department) {

    filtered =
      filtered.filter(c =>

        c.departmentName === department

      );

  }

  // =============================================
  // STATUS
  // =============================================
  if (status) {

    filtered =
      filtered.filter(c =>

        c.status === status.toUpperCase()

      );

  }

  // =============================================
  // PRIORITY
  // =============================================
  if (priority) {

    filtered =
      filtered.filter(c =>

        c.priority === priority.toUpperCase()

      );

  }

  // =============================================
  // SEARCH
  // =============================================
  if (search) {

    filtered =
      filtered.filter(c =>

        c.citizenName
          ?.toLowerCase()
          .includes(search)

      );

  }

  // =============================================
  // RE-RENDER TABLE
  // =============================================
  renderComplaintsTable(
    filtered
  );

}

document
  .getElementById("applyFiltersBtn")
  ?.addEventListener("click", () => {

    applyComplaintFilters();

  });
// =============================================
// FILTER BUTTON
// =============================================
async function viewComplaint(id) {
console.log("viewComplaint running");
  try {

    const c =
      await API.officer
      .getComplaintById(id);

    console.log("Viewing complaint:", c);
    

    // =========
    // ================
    // SET MODAL DATA
    // =========================

    setText(
      "modalCitizenName",
      c.citizenName || "—"
    );

    setText(
      "modalComplaintTitle",
      c.title || "—"
    );

    setText(
      "modalComplaintPriority",
      c.priority || "—"
    );

    setText(
      "modalComplaintStatus",
      c.status || "—"
    );

    setText(
      "modalComplaintFiled",
      formatDate(c.createdAt)
    );

    setText(
      "modalComplaintDeadline",

      c.slaDeadline
        ? formatDate(c.slaDeadline)
        : "—"
    );

    setText(
      "modalComplaintDescription",
      c.description || "—"
    );

    setText(
      "modalComplaintLocation",
      c.location || "—"
    );

    // =========================
    // ATTACHMENT VIEW
    // =========================

    const attachmentSection =
      document.getElementById(
        "modalAttachmentSection"
      );

    const attachmentImage =
      document.getElementById(
        "modalAttachmentImage"
      );

    const attachmentPdf =
      document.getElementById(
        "modalAttachmentPdf"
      );

    if(c.attachmentUrl){

      attachmentSection.style.display =
        "block";

      const fullUrl =
        `http://localhost:8080/${c.attachmentUrl}`;

      // IMAGE
      if(

        c.attachmentUrl.endsWith(".png") ||
        c.attachmentUrl.endsWith(".jpg") ||
        c.attachmentUrl.endsWith(".jpeg")

      ){

        attachmentImage.style.display =
          "block";

        attachmentPdf.style.display =
          "none";

        attachmentImage.src =
          fullUrl;
      }

      // PDF
      else if(

        c.attachmentUrl.endsWith(".pdf")

      ){

        attachmentPdf.style.display =
          "inline-flex";

        attachmentImage.style.display =
          "none";

        attachmentPdf.href =
          fullUrl;
      }

    }else{

      attachmentSection.style.display =
        "none";
    }

    // =========================
    // OPEN MODAL
    // =========================

    const modal =
      new bootstrap.Modal(

        document.getElementById(
          "viewModal"
        )

      );

    modal.show();

  } catch(err) {

    console.error(err);

    showToast(
      err.message,
      "error"
    );
  }
}

// =====================================
// OPEN EDIT DEPARTMENT MODAL
// =====================================
function openEditDepartmentModal(dept) {

  // =====================================
  // SET VALUES
  // =====================================

  window.currentDepartmentId = dept.id;
  document.getElementById(
    "editDeptName"
  ).value =
    dept.displayName || "";

  document.getElementById(
    "editDeptOfficer"
  ).value =
    dept.officerName || "";

  document.getElementById(
    "editDeptEmail"
  ).value =
    dept.contactEmail || "";

  document.getElementById(
    "editDeptStatus"
  ).value =
    dept.active
      ? "Active"
      : "Inactive";

  // =====================================
  // OPEN MODAL
  // =====================================
  const modal =
    new bootstrap.Modal(
      document.getElementById(
        "editDeptModal"
      )
    );

  modal.show();

}

async function openComplaintModal(id) {

  window.currentComplaintId = id;
  try {

    loadReassignDepartments();

    const data =
      await API.admin
      .getComplaintById(id);

    // =====================================
    // SET DATA
    // =====================================

    setText(
      "modalComplaintId",
      `#GR-${data.id}`
    );

    setText(
      "modalCitizenName",
      data.citizenName || "-"
    );

    setText(
      "modalDepartment",
      data.departmentName || "-"
    );

    setText(
      "modalPriority",
      data.priority || "-"
    );

    setText(
      "modalStatus",
      data.status || "-"
    );

    setText(
      "modalCreatedAt",
      formatDate(data.createdAt)
    );

    setText(
      "modalSla",

      data.slaBreached
        ? "Breached"
        : "On Track"
    );

    setText(
      "modalDescription",
      data.description || "-"
    );

    setText(
      "modalLocation",
      data.location || "-"
    );

    // =====================================
    // OPEN MODAL
    // =====================================

    const modal =
      new bootstrap.Modal(
        document.getElementById(
          "complaintModal"
        )
      );

    modal.show();

  } catch(err) {

    console.error(err);

    showToast(
      err.message,
      "error"
    );
  }
}
  

// =============================================
// ADMIN DEPARTMENTS
// =============================================
async function loadAdminDepartments() {
  try {
    const response =
      await API.admin.getDepartments();
    console.log(response);
    const departments =
      response.data || response || [];
    console.log(departments);
    const container =
      document.getElementById("deptCardsContainer");
    if (!container) return;
    if (!departments.length) {
      container.innerHTML = `
        <div class="text-center text-muted py-5">
          No departments found.
        </div>
      `;
      return;
    }
    container.innerHTML = departments.map(dept => `
      <div class="col-lg-4 col-md-6">
        <div class="department-card p-3">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <h5 class="fw-bold mb-1">
                ${dept.displayName ||
                  dept.type.replaceAll("_", " ")}
              </h5>
              <div class="text-muted small mb-2">
                Officer:
                ${dept.officerName || "-"}
                <br>
                ${dept.contactEmail || "-"}
              </div>
              <span class="
                badge
                ${dept.active
                  ? 'bg-success'
                  : 'bg-danger'}
              ">
                ${dept.active
                  ? 'Active'
                  : 'Inactive'}
              </span>
              <button
                class="btn btn-sm btn-outline-primary mt-3"
                onclick='openEditDepartmentModal(${JSON.stringify(dept)})'
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      
    `).join("");
} catch(err) {
  console.error(err);
  showToast(err.message, "error");
}

} // ✅ CLOSE loadAdminDepartments


// =============================================
// DEPARTMENT ACTIONS
// =============================================
function initDepartmentActions() {

// =====================================
// CREATE DEPARTMENT
// =====================================
document
  .getElementById("saveDeptBtn")
  ?.addEventListener("click", async () => {

    const type =
      document.getElementById(
        "newDeptName"
      ).value;

    const officerName =
      document.getElementById(
        "newDeptOfficer"
      ).value;

    const contactEmail =
      document.getElementById(
        "newDeptEmail"
      ).value;

    // =====================================
    // VALIDATION
    // =====================================
    if (
      !type ||
      !officerName ||
      !contactEmail
    ) {

      showToast(
        "Please fill all fields",
        "error"
      );

      return;
    }

    try {

      // =====================================
      // API CALL
      // =====================================
      await API.admin.createDepartment({

        type:
          type
            .trim()
            .replaceAll(" ", "_")
            .toUpperCase(),

        officerName,

        contactEmail

      });

      // =====================================
      // SUCCESS
      // =====================================
      showToast(
        "Department created successfully",
        "success"
      );

      // =====================================
      // CLOSE MODAL
      // =====================================
      bootstrap.Modal
        .getInstance(
          document.getElementById(
            "addDeptModal"
          )
        )
        .hide();

      // =====================================
      // RESET FORM
      // =====================================
      document
        .getElementById(
          "addDeptForm"
        )
        .reset();

      // =====================================
      // RELOAD DEPARTMENTS
      // =====================================
      loadAdminDepartments();

    } catch(err) {

      console.error(err);

      showToast(
        err.message,
        "error"
      );

    }

  });

  // =====================================
  // UPDATE DEPARTMENT
  // =====================================
  // =====================================
// UPDATE DEPARTMENT
// =====================================
document
  .getElementById("updateDeptBtn")
  ?.addEventListener("click", async () => {

    const name =
      document.getElementById(
        "editDeptName"
      ).value;

    const officer =
      document.getElementById(
        "editDeptOfficer"
      ).value;

    const email =
      document.getElementById(
        "editDeptEmail"
      ).value;

    const status =
      document.getElementById(
        "editDeptStatus"
      ).value;

    try {

      // =====================================
      // API CALL
      // =====================================
      await API.admin.updateDepartment(

        window.currentDepartmentId,

        {
          type:
            name
              .trim()
              .replaceAll(" ", "_")
              .toUpperCase(),

          officerName: officer,

          contactEmail: email,

          active: status === "Active"
        }

      );

      // =====================================
      // SUCCESS
      // =====================================
      showToast(
        "Department updated successfully",
        "success"
      );

      // =====================================
      // CLOSE MODAL
      // =====================================
      bootstrap.Modal
        .getInstance(
          document.getElementById(
            "editDeptModal"
          )
        )
        .hide();

      // =====================================
      // RELOAD DEPARTMENTS
      // =====================================
      loadAdminDepartments();

    } catch(err) {

      console.error(err);

      showToast(
        err.message,
        "error"
      );

    }

  });
}

// =====================================
// LOAD REASSIGN DEPARTMENTS
// =====================================
async function loadReassignDepartments() {

  try {

    const response =
      await API.admin.getDepartments();

    const departments =
      response.data || response || [];

    const select =
      document.getElementById(
        "reassignDepartment"
      );

    if (!select) return;

    select.innerHTML =
      departments.map(dept => `

        <option value="${dept.id}">

          ${dept.displayName ||
            dept.type.replaceAll("_", " ")}

        </option>

      `).join("");

  } catch(err) {

    console.error(err);

  }

}

// =====================================
// COMPLAINT ACTIONS
// =====================================
function initComplaintActions() {

  // =====================================
  // REASSIGN
  // =====================================
  document
    .getElementById("reassignBtn")
    ?.addEventListener("click", async () => {

      const departmentId =
        document.getElementById(
          "reassignDepartment"
        ).value;

      try {

        await API.admin.reassignComplaint(

          window.currentComplaintId,

          departmentId

        );

        showToast(
          "Complaint reassigned successfully",
          "success"
        );

        bootstrap.Modal
          .getInstance(
            document.getElementById(
              "complaintModal"
            )
          )
          .hide();

        loadAdminComplaints();

      } catch(err) {

        console.error(err);

        showToast(
          err.message,
          "error"
        );

      }

    });
    // =====================================
// ESCALATE COMPLAINT
// =====================================
document
  .getElementById("escalateBtn")
  ?.addEventListener("click", async () => {

    try {

      await API.admin.escalateComplaint(

        window.currentComplaintId

      );

      showToast(
        "Complaint escalated successfully",
        "success"
      );

      bootstrap.Modal
        .getInstance(
          document.getElementById(
            "complaintModal"
          )
        )
        .hide();

      loadAdminComplaints();

    } catch(err) {

      console.error(err);

      showToast(
        err.message,
        "error"
      );

    }

  });
  // =====================================
// REJECT COMPLAINT
// =====================================
document
  .getElementById("rejectBtn")
  ?.addEventListener("click", async () => {

    const reason =
      prompt("Enter rejection reason");

    if (!reason) return;

    try {

      await API.admin.rejectComplaint(

        window.currentComplaintId,

        reason

      );

      showToast(
        "Complaint rejected successfully",
        "success"
      );

      bootstrap.Modal
        .getInstance(
          document.getElementById(
            "complaintModal"
          )
        )
        .hide();

      loadAdminComplaints();

    } catch(err) {

      console.error(err);

      showToast(
        err.message,
        "error"
      );

    }

  });
}
// =============================================
// ADMIN CITIZENS
// =============================================
async function loadAdminCitizens(page = 0) {
  try {
    const search =
      document.getElementById("citizenSearchInput")?.value || "";
    const result =
      await API.admin.getCitizens(search, page, 10);
    const citizens =
      result.content || result.data || [];
    // =============================================
    // TOTAL COUNT
    // =============================================
    setText(
      "citizensCount",
      `${result.totalElements || citizens.length} registered citizens`
    );
    // =============================================
    // TABLE BODY
    // =============================================
    const tbody =
      document.getElementById("citizensTableBody");
    if (!tbody) return;
    if (!citizens.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8"
              class="text-center text-muted py-4">
            No citizens found.
          </td>
        </tr>
      `;
      return;
    }
    tbody.innerHTML = citizens.map((c, index) => `
      <tr>
        <td>
          ${index + 1}
        </td>
        <td>
          <div class="fw-semibold">
            ${c.name}
          </div>
        </td>
        <td>
          ${c.email}
        </td>
        <td>
          ${c.mobile}
        </td>
        <td>
          ${c.address || "-"}
        </td>
        <td>
          ${c.complaintsCount || 0}
        </td>
        <td>
          ${formatDate(c.createdAt)}
        </td>
        <td>
          <span class="
            badge
            ${c.active
              ? 'bg-success'
              : 'bg-danger'}
          ">
            ${c.active ? 'Active' : 'Blocked'}
          </span>
        </td>
      </tr>
    `).join("");
  } catch(err) {
    console.error(err);
    showToast(err.message, "error");
  }
}

// =============================================
// SLA POLICIES
// =============================================
async function loadSlaPolicies() {
  try {
    const response =
      await API.admin.getSlaPolicies();
    const policies =
      response.data || response || [];
    const container =
      document.getElementById("slaPolicyList");
    if (!container) return;
    if (!policies.length) {
      container.innerHTML = `
        <div class="text-center text-muted py-5">
          No SLA policies found.
        </div>
      `;
      return;
    }
    container.innerHTML = policies.map(policy => `
      <div class="table-card mb-3">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h5 class="fw-bold mb-1">
              ${policy.departmentType}
            </h5>
            <div class="small text-muted">
              Priority:
              ${policy.escalationHours}
            </div>
          </div>
          <div class="text-end">
            <div class="fw-bold text-primary">
              ${policy.slaHours} Hours
            </div>
            
          </div>
        </div>
      </div>
    `).join("");
  } catch(err) {
    console.error(err);
    showToast(err.message, "error");
  }
}

// =============================================
// SLA BREACHES
// =============================================
async function loadSlaBreaches() {
  try {
    const response =
      await API.admin.getSlaBreaches();
    const breaches =
      response.data || response || [];
    setText("breachCount", `${breaches.length} Active`);
    const tbody =
      document.getElementById("slaBreachesTableBody");
    if (!tbody) return;
    if (!breaches.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7"
              class="text-center text-success py-4">
            No SLA breaches 🎉
          </td>
        </tr>
      `;
      return;
    }
    tbody.innerHTML = breaches.map(b => `
      <tr>
        <td>
          #GR-${b.id}
        </td>
        <td>
          ${b.departmentName}
        </td>
        <td>
          ${b.citizenName}
        </td>
        <td>
          ${formatDate(b.slaDeadline)}
        </td>
        <td class="text-danger fw-bold">

      ${b.slaBreached ? "Breached" : "On Track"}

    </td>

          ${getPriorityBadge(b.priority)}
        </td>
        <td>
          <button
            class="btn btn-sm btn-outline-primary">
            View
          </button>
        </td>
      </tr>
    `).join("");
  } catch(err) {
    console.error(err);
    showToast(err.message, "error");
  }
}
// =============================================
// REPORTS & ANALYTICS
// =============================================
async function loadReportsAnalytics() {

  try {

    // =============================================
    // FETCH DATA
    // =============================================
    const deptResponse =
      await API.admin.getReportByDepartment();

    const trendResponse =
      await API.admin.getMonthlyTrend();

    console.log("Dept Response",deptResponse);
    console.log(trendResponse);
    
    const deptReports =
    deptResponse.data ||
    deptResponse ||
    [];
    
    console.log(deptReports);
    const monthlyTrend =
      trendResponse.data ||
      trendResponse ||
      [];

    // =============================================
    // DEPARTMENT SUMMARY TABLE
    // =============================================
    const tbody =
      document.getElementById(
        "reportDeptTableBody"
      );

    if (!tbody) return;

    if (!deptReports.length) {

      tbody.innerHTML = `
        <tr>
          <td colspan="5"
              class="text-center text-muted py-4">

            No report data found.

          </td>
        </tr>
      `;

    } else {

      tbody.innerHTML =
        deptReports.map(r => `

          <tr>

            <td>

              ${r.displayName}

            </td>

            <td>

              ${r.openComplaints + r.resolvedComplaints || 0}

            </td>

            <td class="text-success fw-bold">

              ${r.resolvedComplaints || 0}

            </td>

            <td class="text-warning fw-bold">

              ${r.openComplaints || 0}

            </td>

            <td>

              <span class="
                badge
                ${(r.slaPercentage  || 0) >= 90
                  ? 'bg-success'
                  : (r.slaPercentage || 0) >= 70
                  ? 'bg-warning'
                  : 'bg-danger'}
              ">

                ${r.slaPercentage || 0}%

              </span>

            </td>

          </tr>

        `).join("");
    }

    // =============================================
    // MONTHLY TREND CHART
    // =============================================
    const chartContainer =
      document.getElementById(
        "trendChartBars"
      );

    if (!chartContainer) return;

    if (!monthlyTrend.length) {

      chartContainer.innerHTML = `
        <div class="text-center text-muted py-5">
          No trend data available.
        </div>
      `;

    } else {

      const max = Math.max(
        ...monthlyTrend.map(
          m => m.total || m.count || 0
        )
      );

      chartContainer.innerHTML = `

        <div class="
          d-flex
          align-items-end
          gap-3
          h-100
          px-2
        ">

          ${monthlyTrend.map(m => {

            const value =
              m.total || m.count || 0;

            return `

              <div class="
                flex-fill
                text-center
              ">

                <div class="
                  small
                  fw-bold
                  mb-2
                ">

                  ${value}

                </div>

                <div
                  style="
                    height:${
                      max
                      ? (value / max) * 220
                      : 0
                    }px;

                    background:
                      linear-gradient(
                        180deg,
                        #4f46e5,
                        #7c3aed
                      );

                    border-radius:
                      12px 12px 0 0;

                    min-height:12px;
                  ">
                </div>

                <div class="
                  small
                  mt-2
                ">

                  ${m.month || "-"}

                </div>

              </div>

            `;

          }).join("")}

        </div>

      `;
    }

  } catch(err) {

    console.error(err);

    showToast(
      err.message,
      "error"
    );

  }
}


async function loadAnalyticsKPIs(){

  try{

    const response =
      await API.admin
        .getComplaints();

    const complaints =
  response.content ||
  response.data?.content ||
  [];

    console.log("All complaints:", complaints);

    if(!complaints.length) return;

    // TOTAL
    const total =
      complaints.length;

    console.log("Total complaints:", total);

    // RESOLVED
    const resolved =
      complaints.filter(c =>
        c.status === "RESOLVED"
      ).length;

    // BREACHED
    const breached =
      complaints.filter(c =>
        c.slaBreached
      ).length;

    // SLA %
    const sla =
      Math.round(
        ((total - breached) / total)
        * 100
      );

    // AVG RESOLUTION
    const resolvedComplaints =
      complaints.filter(c =>
        c.status === "RESOLVED"
        &&
        c.createdAt
        &&
        c.updatedAt
      );

    let avgHours = 0;

    if(resolvedComplaints.length){

      const totalHours =
        resolvedComplaints.reduce(
          (sum,c) => {

            const start =
              new Date(c.createdAt);

            const end =
              new Date(c.updatedAt);

            return sum +
              ((end - start)
              / 36e5);

          },
          0
        );

      avgHours =
        (
          totalHours /
          resolvedComplaints.length
        ).toFixed(1);

    }

    // MOCK RATING
    const rating = 4.8;

    // MOCK MOM
    const efficiency = 12;

    // SET UI
    setText(
      "analyticsSla",
      `${sla}%`
    );

    console.log("SLA Compliance:", sla);  

    setText(
      "analyticsAvgResolution",
      `${avgHours}hr`
    );

    console.log("Average Resolution Time (hrs):", avgHours);

    setText(
      "analyticsRating",
      `${rating}★`
    );
    console.log("Citizen Satisfaction Rating:", rating);

    setText(
      "analyticsEfficiency",
      `+${efficiency}%`
    );

    console.log("Month-over-Month Efficiency:", efficiency);

  }catch(err){

    console.error(err);

  }

}
// =============================================
// LOGOUT
// =============================================
// =============================================
// LOGOUT
// =============================================
function initLogout() {

  document
    .querySelectorAll(".sidebar-logout")
    .forEach(btn => {

      btn.addEventListener("click", function(e) {

        e.preventDefault();

        Auth.clear();

        window.location.replace(
          "login.html"
        );

      });

    });
}




// =============================================
// INIT ALL
// =============================================
document.addEventListener("DOMContentLoaded", () => {
  initSidebar();
  initTabs();
  initNavActive();
  initRegister();
  initAdminDashboard();
  initCitizenDashboard();
  initOfficerDashboard();
  initSubmitComplaint();
  initTracker();
  initProfileUpdate();
  initLogout();
  animateBars();
  animateCounters();
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
  


});
