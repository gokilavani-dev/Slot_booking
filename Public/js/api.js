const BASE_URL = "https://slot-booking-w41s.onrender.com";

async function api(path, options = {}) {
  const res = await fetch(BASE_URL + path, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "API error");
  }

  return data;
}
