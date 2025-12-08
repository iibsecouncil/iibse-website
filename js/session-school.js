// session-school.js  
// Krishna's permanent SaaS-level security

function checkSchoolSession() {
    const isLogged = localStorage.getItem("isLogged");
    const schoolId = localStorage.getItem("school_id");

    if (!isLogged || !schoolId) {
        // Not logged in → redirect
        window.location.href =
