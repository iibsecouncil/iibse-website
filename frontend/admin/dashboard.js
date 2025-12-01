const backend = "https://iibse-backend.onrender.com";

// -------------------------
// Check Login Token
// -------------------------
const token = localStorage.getItem("adminToken");
if (!token) window.location.href = "../admin-login.html";

// ----------------------------
// Load Pending Schools
// ----------------------------
async function loadPending() {
    const table = document.getElementById("school-table");
    table.innerHTML = "<tr><td colspan='6'>Loading...</td></tr>";

    try {
        const res = await fetch(`${backend}/api/schools/pending`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await res.json();

        if (!res.ok) {
            table.innerHTML = "<tr><td colspan='6'>Failed to load</td></tr>";
            return;
        }

        if (!data || data.length === 0) {
            table.innerHTML = "<tr><td colspan='6'>No Pending Schools</td></tr>";
            return;
        }

        table.innerHTML = "";

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

    } catch (err) {
        table.innerHTML = "<tr><td colspan='6'>Server Error</td></tr>";
    }
}

// Load pending data on page open
loadPending();

// ----------------------------
// Approve School
// ----------------------------
async function approveSchool(id) {
    try {
        const res = await fetch(`${backend}/api/schools/approve/${id}`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
            console.error("Approve failed");
        }

        loadPending();
    } catch (err) {
        console.error("Network error (approve):", err);
    }
}

// ----------------------------
// Reject School
// ----------------------------
async function rejectSchool(id) {
    try {
        const res = await fetch(`${backend}/api/schools/reject/${id}`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
            console.error("Reject failed");
        }

        loadPending();
    } catch (err) {
        console.error("Network error (reject):", err);
    }
}

// ----------------------------
// Logout
// ----------------------------
function logout() {
    localStorage.removeItem("adminToken");
    window.location.href = "../admin-login.html";
}
