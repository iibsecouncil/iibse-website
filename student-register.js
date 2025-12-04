// 🌟 Replace with your Render backend URL
const API_BASE_URL = "https://YOUR-BACKEND-URL.onrender.com";  
// Example: const API_BASE_URL = "https://iibse-backend.onrender.com";

document.getElementById("studentForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    // Collect form data
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

    // Show user that submission started
    const msg = document.getElementById("responseMsg");
    msg.innerHTML = "Submitting, please wait...";
    msg.style.color = "blue";

    try {
        const response = await fetch(`${API_BASE_URL}/api/student-register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            msg.innerHTML = "Student Registered Successfully ✔";
            msg.style.color = "green";

            // Clear form after success
            document.getElementById("studentForm").reset();
        } else {
            msg.innerHTML = "Error: " + (result.message || "Server error");
            msg.style.color = "red";
        }

    } catch (err) {
        msg.innerHTML = "Network Error: Unable to connect to server ❌";
        msg.style.color = "red";
        console.error("Error submitting form:", err);
    }
});
