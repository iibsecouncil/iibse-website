const backendURL = "https://iibse-backend.onrender.com";  // your backend URL

// Load Dashboard Data
async function loadDashboard() {
    try {
        // 1️⃣ Fetch Total Schools
        const schoolRes = await fetch(`${backendURL}/api/schools/count`);
        const schoolData = await schoolRes.json();
        document.getElementById("totalSchools").innerText = schoolData.count;

        // 2️⃣ Fetch Total Students
        const studentRes = await fetch(`${backendURL}/api/students/count`);
        const studentData = await studentRes.json();
        document.getElementById("totalStudents").innerText = studentData.count;

        // 3️⃣ Load Pending Schools
        const pendingRes = await fetch(`${backendURL}/api/schools/pending`);
        const pendingSchools = await pendingRes.json();

        let rows = "";

        pendingSchools.forEach(school => {
            rows += `
                <tr>
                    <td>${school.school_name}</td>
                    <td>${school.registration_no}</td>
                    <td>${school.principal_name}</td>
                    <td>${school.phone}</td>
                    <td>${school.affiliation_status}</td>
                    <td>
                        <button onclick="approve('${school.id}')">Approve</button>
                        <button onclick="reject('${school.id}')">Reject</button>
                    </td>
                </tr>
            `;
        });

        document.getElementById("schoolTable").innerHTML = rows;

    } catch (err) {
        console.error(err);
        alert("Error loading dashboard");
    }
}

// Approve School
async function approve(id) {
    await fetch(`${backendURL}/api/schools/approve/${id}`, { method: "POST" });
    alert("School Approved ✔");
    loadDashboard();
}

// Reject School
async function reject(id) {
    await fetch(`${backendURL}/api/schools/reject/${id}`, { method: "POST" });
    alert("School Rejected ❌");
    loadDashboard();
}

// Logout
function logout() {
    window.location.href = "/frontend/admin-login.html";
}

loadDashboard();

