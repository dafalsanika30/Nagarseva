function loadComponent(id, file) {
  fetch(file)
    .then(res => res.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;

      // ✅ Run navbar active logic ONLY if navbar is loaded
      if (id === "navbar") {
        setActiveNav();
      }
    });
}

// ✅ Reusable function
function setActiveNav() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  const links = document.querySelectorAll(".nav-link");

  links.forEach(link => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
}