/* ============================================================
   IIBSE — SCHOOL PANEL MASTER JS  
   Krishna’s Final Stable Version  
   Handles:
   ✔ School Login
   ✔ Session Check
   ✔ Dashboard Data
   ✔ Student Admission Insert
   ✔ Students Fetch (placeholder)
============================================================ */

// -------------------------------------------
// CONFIG
// -------------------------------------------
const API = "https://iibse-website-1.onrender.com";  // correct backend URL

// -------------------------------------------
// SCHOOL LOGIN (FINAL WORKING VERSION)
// -------------------------------------------
async function loginSchool(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    const res = await fetch(`${API}/schools/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.success) {
        localStorage.setItem("isLogged", "true");
        localStorage.setItem("school_id", data.school.id);
        localStorage.setItem("school_name", data.school.name);

        window.location.href = "school-dashboard.html";
    } else {
        alert("Login Failed: " + data.message);
    }
}

// -------------------------------------------
// SESSION CHECK (Applied on every panel page)
// -------------------------------------------
function checkSchoolSession() {
    const isLogged = localStorage.getItem("isLogged");
    const school_id = localStorage.getItem("school_id");

    if (!isLogged || !school_id) {
        window.location.href = "school-login.html";
    }
}

// Call session check automatically if not login page
if (!window.location.pathname.includes("school-login.html")) {
    checkSchoolSession();
}

// -------------------------------------------
// DASHBOARD DATA FETCH
// -------------------------------------------
async function loadDashboard() {
    const school_id = localStorage.getItem("school_id");

    const res = await fetch(`${BACKEND_URL}/api/school-dashboard?school_id=${school_id}`);
    const data = await res.json();

    if (!data.success) return;

    document.getElementById("totalStudents").innerText = data.total_students;
    document.getElementById("pendingStudents").innerText = data.pending_students;
    document.getElementById("approvedStudents").innerText = data.approved_students;
    document.getElementById("pendingFees").innerText = "₹" + data.pending_fees;
}

// -------------------------------------------
// SUBMIT STUDENT ADMISSION
// -------------------------------------------
async function submitAdmission() {
    const school_id = localStorage.getItem("school_id");

    const payload = {
        school_id: school_id,
        student_name: document.getElementById("studentName").value,
        course_type: document.getElementById("courseType").value,
        class_level: document.getElementById("classLevel").value,
        referral_id: document.getElementById("referralID").value,
        status: "Pending"
    };

    let res = await fetch(`${BACKEND_URL}/api/add-student`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    });

    let data = await res.json();
    alert(data.message);

    if (data.success) {
        document.getElementById("admissionForm").reset();
    }
}

// -------------------------------------------
// FETCH STUDENTS LIST (For school-students page)
// -------------------------------------------
async function loadStudents() {
    const school_id = localStorage.getItem("school_id");

    const res = await fetch(`${BACKEND_URL}/api/get-students?school_id=${school_id}`);
    const data = await res.json();

    if (!data.success) return;

    const table = document.getElementById("studentTable");
    table.innerHTML = "";

    data.students.forEach((s, i) => {
        table.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${s.student_name}</td>
                <td>${s.class_level}</td>
                <td>${s.course_type}</td>
                <td>${s.referral_id || '-'}</td>
                <td>${s.status}</td>
                <td><button onclick="viewStudent('${s.id}')">View</button></td>
            </tr>
        `;
    });
}
