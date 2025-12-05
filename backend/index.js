// ⭐ FINAL IIBSE STUDENT REGISTRATION SCRIPT
// Backend URL (Locked & Correct)
const API_BASE_URL = "https://iibse-backend.onrender.com";

// Listen for form submit
document.getElementById("studentForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const msg = document.getElementById("responseMsg");
    msg.innerHTML = "Submitting... Please wait.";
    msg.style.color = "blue";

    // Collect all inputs
    const data = {
        full_name: document.getElementById("full_name").value,
        father_name: document.getElementById("father_name").value,
        mother_name: document.getElementById("mother_name").value,
        dob: document.getElementById("dob").value,
        gender: document.getElementById("gender").value,
        school_id: document.getElementById("school_id").value,
        class_name: document.getElementById("class_name").value,
        student_id: document.getElementById("student_id").value,
        roll_no: document.getElementById("roll_no").value,
        year_of_passing: document.getElementById("year_of_passing").value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/student-register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            msg.innerHTML = "✅ Student Registered Successfully!";
            msg.style.color = "green";
            document.getElementById("studentForm").reset();
        } else {
            msg.innerHTML = "❌ Error: " + (result.message || "Registration failed");
            msg.style.color = "red";
        }

    } catch (error) {
        console.error(error);
        msg.innerHTML = "❌ Network Error: Backend not reachable";
        msg.style.color = "red";
    }
});
