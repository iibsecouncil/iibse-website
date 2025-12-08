// session-school.js — Krishna Security System

function checkSchoolSession() {
    const isLogged = localStorage.getItem("isLogged");
    const schoolId = localStorage.getItem("school_id");

    if (!isLogged || !schoolId) {
        window.location.href = "school-login.html";
    }
}

function logoutSchool() {
    localStorage.clear();
    window.location.href = "school-login.html";
}
