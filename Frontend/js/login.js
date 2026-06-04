"use strict";

let selectedRole = "citizen";

// =====================================
// LOGIN INITIALIZATION
// =====================================
function initLogin() {

// Role tabs
const tabs = document.querySelectorAll(".role-tab");

tabs.forEach(tab => {

tab.addEventListener("click", () => {

  tabs.forEach(t =>
    t.classList.remove("active")
  );

  tab.classList.add("active");

  selectedRole = tab.dataset.role;

});

});

// Login form
const form =
document.getElementById("loginForm");

form.addEventListener(
"submit",
async (e) => {

  e.preventDefault();

  const email =
    document
      .getElementById("loginEmail")
      .value
      .trim();

  const password =
    document
      .getElementById("loginPassword")
      .value;

  const btn =
    form.querySelector(
      "button[type='submit']"
    );

  try {

    btn.disabled = true;

    btn.innerHTML =
      'Signing In...';

    const data =
      await API.auth.login(
        email,
        password,
        selectedRole.toUpperCase()
      );

    Auth.setToken(
      data.token
    );

    Auth.setUser(
      data
    );

    if (typeof showToast === "function") {

      showToast(
        "Login successful!",
        "success"
      );

    }

    const redirects = {

      ADMIN:
        "admin-dashboard.html",

      OFFICER:
        "department-dashboard.html",

      CITIZEN:
        "citizen-dashboard.html"

    };

    setTimeout(() => {

      window.location.replace(
        redirects[data.role]
        ||
        "citizen-dashboard.html"
      );

    }, 1000);

  } catch(err) {

    console.error(err);

    if (typeof showToast === "function") {

      showToast(
        err.message,
        "error"
      );

    } else {

      alert(
        err.message
      );

    }

    btn.disabled = false;

    btn.innerHTML =
      'Sign In <i class="bi bi-arrow-right ms-1"></i>';

  }

}

);

}

// =====================================
// START LOGIN
// =====================================
document.addEventListener(
"DOMContentLoaded",
initLogin
);