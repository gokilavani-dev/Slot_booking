requireLogin();

document.addEventListener("DOMContentLoaded", () => {
  // if you store values in localStorage already, keep it
});

async function confirmBooking() {
  const date = localStorage.getItem("date");
  const slot = localStorage.getItem("slot");
  const amount = Number(localStorage.getItem("amount"));

  const res = await api("/dealer/book", {
    method: "POST",
    body: JSON.stringify({ date, slot, amount })
  });

  localStorage.setItem("bookingStatus", res.booking.status);
  window.location.href = "/success.html";
}
