let waiting = [];

async function loadVehicles() {
  const { vehicles } = await api("/admin/vehicles");
  const sel = document.getElementById("vehicle");
  sel.innerHTML = "";
  vehicles.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v._id;
    opt.textContent = v.name;
    sel.appendChild(opt);
  });
}

async function loadWaiting() {
  const res = await api("/admin/waiting");
  waiting = res.waiting;   // ✅ FIX

  const list = document.getElementById("list");
  list.innerHTML = "";

  if (!Array.isArray(waiting) || waiting.length === 0) {
    list.innerHTML = "<div class='text-gray-500'>No waiting bookings</div>";
    return;
  }

  waiting.forEach(b => {
    const row = document.createElement("label");
    row.className = "border rounded p-3 flex items-center justify-between cursor-pointer";
    row.innerHTML = `
      <div>
        <div class="font-medium">${b.dealerId?.email || "dealer"}</div>
        <div class="text-sm text-gray-600">${b.date} • ${b.slot} • ₹${b.amount}</div>
      </div>
      <input type="checkbox" value="${b._id}" class="w-5 h-5">
    `;
    list.appendChild(row);
  });
}
