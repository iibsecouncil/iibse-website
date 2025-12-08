// ----------------------------------------
// IIBSE ADMIN JS (BASIC PANEL)
// ----------------------------------------

const SUPABASE_URL = "https://phghqudhsmksakzlsygy.supabase.co";
const SUPABASE_KEY = "YOUR_ANON_KEY_HERE";

const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// -----------------------------
// Add Notice Function
// -----------------------------
async function addNotice() {
  let t = document.getElementById("title").value.trim();
  let m = document.getElementById("message").value.trim();
  let msg = document.getElementById("msg");

  if (!t || !m) {
    msg.innerText = "Fill both fields!";
    return;
  }

  let { error } = await db.from("notices").insert({
    title: t,
    message: m
  });

  msg.innerText = error ? "Error!" : "Notice Added!";
}

// -----------------------------
// Approve School Function
// -----------------------------
async function approveSchool(id) {
  await db.from("schools").update({ status: "approved" }).eq("id", id);
  loadSchools();
}

// -----------------------------
// Load Pending Schools
// -----------------------------
async function loadSchools() {
  let table = document.getElementById("schoolTable");

  let { data } = await db.from("schools").select("*");

  let html = "";
  data.forEach(s => {
    html += `
      <tr>
        <td>${s.name}</td>
        <td>${s.email}</td>
        <td>${s.status}</td>
        <td><button onclick="approveSchool(${s.id})">Approve</button></td>
      </tr>
    `;
  });

  table.innerHTML = html;
}

// -----------------------------
// Set Modules for school
// -----------------------------
async function setModules() {
  let id = document.getElementById("sid").value.trim();
  let mods = document.getElementById("mods").value.trim();
  let msg = document.getElementById("msg");

  let arr = mods.split(",").map(x => x.trim());

  let { error } = await db.from("schools")
    .update({ approved_modules: arr })
    .eq("id", id);

  msg.innerText = error ? "Failed!" : "Modules Updated!";
}
