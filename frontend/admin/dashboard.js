// 🔗 Your Backend URL
const API_BASE = "https://iibse-backend.onrender.com";

// ================================
// LOGIN PROTECTION
// ================================
const admin_id = localStorage.getItem("admin_id");
if (!admin_id) {
    window.location.href = "../admin-login.html";
}

// ================================
// LOAD DASHBOARD STATS
// ================================
async function loadStats() {
    try {
        const totalSchools = await fetch(`${API_BASE}/api/stats/total-schools`);
        const totalStudents = await fetch(`${API_BASE}/api/stats/total-students`);
        const pending = await fetch(`${API_BASE}/api/stats/pending-schools`);
        const approved = await fetch(`${API_BASE}/api/stats/approved-schools`);

        const schoolsData = await totalSchools.json();
        const studentsData = await totalStudents.json();
        const pendingData = await pending.json();
        const approvedData = await approved.json();

        document.getElementById("totalSchools").innerText = schoolsData.count;
        document.getElementById("totalStudents").innerText = studentsData.count;
        document.getElementById("pendingCount").innerText = pendingData.count;
        document.getElementById("approvedCount").innerText = approvedData.count;

    } catch (err) {
        console.error("Stats Load Error:", err);
    }
}

// ================================
// LOAD PENDING SCHOOLS TABLE
// ================================
async function loadPendingSchools() {
    const tableBody = document.getElementById("school-table");

    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Loading...</td></tr>`;

    try {
        const res = await fetch(`${API_BASE}/api/schools/pending`);
        const data = await res.json();

        tableBody.innerHTML = "";

        if (!data.length) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No Pending Schools</td></tr>`;
            return;
        }

        data.forEach(school => {
            tableBody.innerHTML += `
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
        console.error("Pending Load Error:", err);
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Server Error</td></tr>`;
    }
}

// ================================
// APPROVE SCHOOL
// ================================
async function approveSchool(id) {
    try {
        await fetch(`${API_BASE}/api/schools/approve/${id}`, { method: "POST" });
        alert("✔ School Approved");
        loadStats();
        loadPendingSchools();
    } catch (err) {
        alert("❌ Error Approving");
    }
}

// ================================
// REJECT SCHOOL
// ================================
async function rejectSchool(id) {
    try {
        await fetch(`${API_BASE}/api/schools/reject/${id}`, { method: "POST" });
        alert("❌ School Rejected");
        loadStats();
        loadPendingSchools();
    } catch (err) {
        alert("❌ Error Rejecting");
    }
}

// ================================
// LOGOUT FUNCTION
// ================================
function logout() {
    localStorage.clear();
    window.location.href = "../admin-login.html";
}

// ================================
// INITIAL LOAD
// ================================
loadStats();
loadPendingSchools();
