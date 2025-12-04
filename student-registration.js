// ⭐ Backend URL — Render Web Service
const API_BASE_URL = "https://iibse-backend.onrender.com";

// ⭐ Handle Form Submit
document.getElementById("studentForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const msg = document.getElementById("responseMsg");
    msg.innerHTML = "Submitting, please wait...";
    msg.style.color = "blue";

    // ⭐ Collect Form Data
    const data = {
        full_name: document.getElementById("full_name").value.trim(),
        father_name: document.getElementById("father_name").value.trim(),
        mother_name: document.getElementById("mother_name").value.trim(),
        dob: document.getElementById("dob").value,
        gender: document.getElementById("gender").value,
        school_id: document.getElementById("school_id").value.trim(),
        class_name: document.getElementById("class_name").value.trim(),
        student_id: document.getElementById("student_id").value.trim(),
        roll_no: document.getElementById("roll_no").value.trim(),
        year_of_passing: document.getElementById("year_of_passing").value.trim()
    };

    // ⭐ Validate empty fields
    for (let key in data) {
        if (!data[key]) {
            msg.innerHTML = `⚠ Missing field: ${key.replace("_", " ")}`;
            msg.style.color = "red";
            return;
        }
    }

    // ⭐ Send data to backend
    try {
        const response = await fetch(`${API_BASE_URL}/api/student-register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            msg.innerHTML = "✅ Student Registered Successfully!";
            msg.style.color = "green";
            document.getElementById("studentForm").reset();
        } else {
            msg.innerHTML = "❌ Error: " + (result.message || "Unable to register");
            msg.style.color = "red";
        }

    } catch (err) {
        msg.innerHTML = "❌ Network Error: Backend not reachable";
        msg.style.color = "red";
        console.error(err);
    }
});
