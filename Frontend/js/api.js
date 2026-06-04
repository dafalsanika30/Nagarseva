/* =============================================
   NagarSeva — API Service Layer
   All backend calls go through this file
   Load order: api.js → app.js
   ============================================= */
"use strict";

const API_BASE = "http://localhost:8080/api";

// =============================================
// AUTH HELPERS
// =============================================
const Auth = {
  setToken : (t) => localStorage.setItem("ngs_token", t),
  getToken : ()  => localStorage.getItem("ngs_token"),
  setUser  : (u) => localStorage.setItem("ngs_user", JSON.stringify(u)),
  getUser  : ()  => JSON.parse(localStorage.getItem("ngs_user") || "null"),
  clear    : ()  => { localStorage.removeItem("ngs_token"); localStorage.removeItem("ngs_user"); },
  isLoggedIn: () => !!localStorage.getItem("ngs_token"),
  getRole  : ()  => { const u = Auth.getUser(); return u ? u.role : null; }
};

// =============================================
// BASE FETCH — attaches JWT automatically
// =============================================
async function apiFetch(endpoint, options = {}) {
  const token = Auth.getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...options.headers
  };

  let response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  } catch (err) {
    throw new Error("Cannot connect to server. Is Spring Boot running on port 8080?");
  }

  if (response.status === 401) {
    Auth.clear();
    const inPages = window.location.pathname.includes("/pages/");
    window.location.href = inPages ? "login.html" : "pages/login.html";
    return;
  }
  if (response.status === 403) {
    throw new Error("Access denied. You don't have permission.");
  }

  const json = await response.json();
  if (!json.success) throw new Error(json.message || "Something went wrong.");
  return json.data;
}

// =============================================
// API METHODS
// =============================================
const API = {

  // ── AUTH ──────────────────────────────────
  auth: {
    login: (email, password, role) =>
      apiFetch("/auth/login", { method:"POST", body: JSON.stringify({ email, password, role }) }),

    register: (payload) =>
      apiFetch("/auth/register", { method:"POST", body: JSON.stringify(payload) })
  },

  // ── PUBLIC ────────────────────────────────
  getDepartments: () => apiFetch("/departments"),

  trackComplaint: (id) => apiFetch(`/complaints/${id}/track`),

  // ── CITIZEN ───────────────────────────────
  citizen: {
    submitComplaint: async (formData) => {

  const token = Auth.getToken();

  const response =await fetch(`${API_BASE}/complaints`,

      {

        method: "POST",

        headers: {

          ...(token
            ? {
                Authorization:
                  `Bearer ${token}`
              }
            : {})

        },

        body: formData
      }
    );

  const json =
    await response.json();

  if(!json.success){

    throw new Error(
      json.message ||
      "Failed to submit complaint"
    );
  }

  return json.data;
},

    getMyComplaints: (page = 0, size = 10) =>
      apiFetch(`/complaints/my?page=${page}&size=${size}`),

    trackComplaint: (id) =>
    apiFetch(`/complaints/${id}/track`)
  },

  // ── OFFICER ───────────────────────────────
  officer: {
    getDeptComplaints: (filters = {}) => {
      const p = new URLSearchParams();
      if (filters.status)   p.append("status",   filters.status);
      if (filters.priority) p.append("priority", filters.priority);
      p.append("page", filters.page ?? 0);
      p.append("size", filters.size ?? 10);
      return apiFetch(`/complaints/department?${p}`);
    },
    updateStatus: (id, payload) =>
      apiFetch(`/complaints/${id}/status`, { method:"PATCH", body: JSON.stringify(payload) }),
    getComplaintById: (id) =>
  apiFetch(
    `/officer/complaints/${id}`
  ),
  },

  // ── ADMIN ─────────────────────────────────
  admin: {
    getDashboard: () => apiFetch("/admin/dashboard"),

    getComplaints: (filters = {}) => {
      const p = new URLSearchParams();
      if (filters.status)       p.append("status",       filters.status);
      if (filters.priority)     p.append("priority",     filters.priority);
      if (filters.departmentId) p.append("departmentId", filters.departmentId);
      p.append("page", filters.page ?? 0);
      p.append("size", filters.size ?? 10);
      return apiFetch(`/admin/complaints?${p}`);
    },

    getComplaintById:    (id)     => apiFetch(`/admin/complaints/${id}`),
    reassignComplaint:   (id, deptId) => apiFetch(`/admin/complaints/${id}/reassign?departmentId=${deptId}`, { method:"PATCH" }),
    rejectComplaint:     (id, remark) => apiFetch(`/admin/complaints/${id}/reject?remark=${encodeURIComponent(remark)}`, { method:"PATCH" }),
    escalateComplaint:   (id)     => apiFetch(`/admin/complaints/${id}/escalate`, { method:"PATCH" }),

    getDepartments:      ()       => apiFetch("/admin/departments"),
    updateDepartment:    (id, payload) => apiFetch(`/admin/departments/${id}`, { method:"PUT",   body: JSON.stringify(payload) }),
    toggleDepartment:    (id)     => apiFetch(`/admin/departments/${id}/toggle`, { method:"PUT" }),

    getCitizens: (search = "", page = 0, size = 10) => {
      const p = new URLSearchParams({ page, size });
      if (search) p.append("search", search);
      return apiFetch(`/admin/citizens?${p}`);
    },
    toggleCitizen:       (id)     => apiFetch(`/admin/citizens/${id}/toggle`, { method:"PATCH" }),

    getSlaPolicies:      ()       => apiFetch("/admin/sla-policies"),
    updateSlaPolicy:     (type, payload) => apiFetch(`/admin/sla-policies/${type}`, { method:"PUT", body: JSON.stringify(payload) }),
    getSlaBreaches:      ()       => apiFetch("/admin/sla-breaches"),

    getReportByDepartment: ()     => apiFetch("/admin/reports/by-department"),
    getMonthlyTrend:     ()       => apiFetch("/admin/reports/monthly-trend"),
    createDepartment: (data) =>   apiFetch("/admin/departments", {   method: "POST", body: JSON.stringify(data)}

  ),
  }
};

