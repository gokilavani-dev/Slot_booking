function requireLogin() {
  const token = localStorage.getItem("token");
  if (!token) window.location.href = "/login.html";
}

function requireAdmin() {
  requireLogin();
  const role = localStorage.getItem("role");
  if (role !== "ADMIN") window.location.href = "/amount.html";
}

function logout() {
  localStorage.clear();
  window.location.href = "/login.html";
}
