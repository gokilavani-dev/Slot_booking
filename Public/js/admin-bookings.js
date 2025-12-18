async function loadBookings() {
  const { bookings } = await api("/admin/bookings");
  const el = document.getElementById("bookingList");
  el.innerHTML = "";

  bookings.forEach(b => {
    const row = document.createElement("div");
    row.className = "bg-white p-4 rounded shadow";

    row.innerHTML = `
      <div class="flex justify-between items-center">
        <div>
          <div class="font-semibold">₹${b.amount}</div>
          <div class="text-sm text-gray-600">${b.date}</div>
        </div>
        <span class="text-green-700 font-medium">CONFIRMED</span>
      </div>
    `;

    if (Array.isArray(b.mergedFrom) && b.mergedFrom.length > 0) {
      const merged = document.createElement("div");
      merged.className = "mt-3 text-sm bg-gray-50 p-2 rounded";

      merged.innerHTML = `
        <div class="font-medium mb-1">
          Merged from (${b.mergedFrom.length} orders):
        </div>
        ${b.mergedFrom.map(m => `
          <div class="pl-2">
            • ${m.dealerId?.email || "dealer"} • ₹${m.amount} • ${m.slot}
          </div>
        `).join("")}
      `;

      row.appendChild(merged);
    }

    el.appendChild(row);
  });
}

loadBookings().catch(e => alert(e.message));
