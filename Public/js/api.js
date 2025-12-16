const BASE_URL = window.location.origin; 
// Render same domain: https://slot-booking-w41s.onrender.com

async function api(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(BASE_URL + path, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "API error");
  return data;
}
