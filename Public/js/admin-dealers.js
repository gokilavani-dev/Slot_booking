async function loadDealers() {
  const { dealers } = await api("/admin/dealers");
  const list = document.getElementById("list");
  list.innerHTML = "";

  dealers.forEach(d => {
    const row = document.createElement("div");
    row.className = "flex flex-col md:flex-row md:items-center gap-2 border rounded p-3";

    row.innerHTML = `
      <div class="flex-1">
        <div class="font-medium">${d.email}</div>
        <div class="text-xs text-gray-500">${new Date(d.createdAt).toLocaleString()}</div>
      </div>
      <input class="border p-2 rounded" placeholder="new email (optional)" id="email_${d._id}">
      <input class="border p-2 rounded" placeholder="new password (optional)" id="pass_${d._id}">
      <button class="bg-blue-600 text-white rounded p-2" data-act="edit" data-id="${d._id}">Edit</button>
      <button class="bg-red-600 text-white rounded p-2" data-act="del" data-id="${d._id}">Delete</button>
    `;

    list.appendChild(row);
  });

  list.onclick = async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = btn.dataset.id;
    const act = btn.dataset.act;

    if (act === "del") {
      if (!confirm("Delete dealer?")) return;
      await api(`/admin/dealers/${id}`, { method: "DELETE" });
      await loadDealers();
    }

    if (act === "edit") {
      const email = document.getElementById(`email_${id}`).value;
      const password = document.getElementById(`pass_${id}`).value;

      await api(`/admin/dealers/${id}`, {
        method: "PUT",
        body: JSON.stringify({ email: email || undefined, password: password || undefined })
      });
      alert("Updated");
      await loadDealers();
    }
  };
}

document.getElementById("createBtn").addEventListener("click", async () => {
  const email = document.getElementById("d_email").value;
  const password = document.getElementById("d_pass").value;
  await api("/admin/dealers", { method: "POST", body: JSON.stringify({ email, password }) });
  document.getElementById("d_email").value = "";
  document.getElementById("d_pass").value = "";
  await loadDealers();
});

loadDealers().catch(e => alert(e.message));
