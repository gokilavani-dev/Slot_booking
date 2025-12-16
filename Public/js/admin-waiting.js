async function loadWaiting() {
  const { bookings } = await api("/admin/waiting");
  const el = document.getElementById("waiting");
  el.innerHTML = "";

  bookings.forEach(b => {
    const row = document.createElement("div");
    row.className = "border rounded p-3 flex items-center justify-between";
    row.innerHTML = `
      <div>
        <div class="font-medium">${b.dealerId?.email || "dealer"}</div>
        <div class="text-sm text-gray-600">${b.date} • ${b.slot} • ₹${b.amount}</div>
      </div>
      <div class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">WAITING</div>
    `;
    el.appendChild(row);
  });
}

loadWaiting().catch(e => alert(e.message));
