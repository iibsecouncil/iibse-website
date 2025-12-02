const API_BASE = "https://iibse-backend.onrender.com";

// Check login
const admin_id = localStorage.getItem("admin_id");
if (!admin_id) {
    window.location.href = "../admin-login.html";
}

// Load Pending Schools
async function loadPendingSchools() {
    const table = document.getElementById("school-table");
    table.innerHTML = "<tr><td colspan='6'>Loading...</td></tr>";

    const res = await fetch(`${API_BASE}/api/schools/pending`);
    const data = await res.json();

    table.innerHTML = "";

    if (data.length === 0) {
        table.innerHTML = "<tr><td colspan='6' style='text-align:center;'>No Pending Schools</td></tr>";
        return;
    }

    data.forEach(school => {
        table.innerHTML += `
            <tr>
                <td>${school.school_name}</td>
                <td>${school.registration_no}</td>
                <td>${school.principal_name}</td>
                <td>${school.phone}</td>
                <td>${school.affiliation_status}</td>
                <td>
                    <button class="approve" onclick="approveSchool('${school.id}')">Approve</button>
                    <button class="reject" onclick="rejectSchool('${school.id}')">Reject</button>
                </td>
            </tr>
        `;
    });
}

// Approve
async function approveSchool(id) {
    await fetch(`${API_BASE}/api/schools/approve/${id}`, { method: "POST" });
    alert("✔ Approved");
    loadPendingSchools();
}

// Reject
async function rejectSchool(id) {
    await fetch(`${API_BASE}/api/schools/reject/${id}`, { method: "POST" });
    alert("❌ Rejected");
    loadPendingSchools();
}

// Logout
function logout() {
    localStorage.clear();
    window.location.href = "../admin-login.html";
}

loadPendingSchools();
