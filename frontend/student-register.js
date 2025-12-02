const API_BASE = "https://iibse-backend.onrender.com";

document.getElementById("studentForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const body = {
        full_name: document.getElementById("full_name").value,
        father_name: document.getElementById("father_name").value,
        mother_name: document.getElementById("mother_name").value,
        dob: document.getElementById("dob").value,
        gender: document.getElementById("gender").value,
        school_id: document.getElementById("school_id").value,
        class: document.getElementById("class_name").value,
        student_id: document.getElementById("student_id").value,
        roll_no: document.getElementById("roll_no").value,
        year_of_passing: document.getElementById("year_of_passing").value,
    };

    const msg = document.getElementById("responseMsg");
    msg.innerHTML = "Submitting...";

    try {
        const res = await fetch(`${API_BASE}/api/students/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (data.error) {
            msg.style.color = "red";
            msg.innerHTML = "❌ " + data.error;
        } else {
            msg.style.color = "green";
            msg.innerHTML = "✅ Student Registered Successfully!";
            document.getElementById("studentForm").reset();
        }

    } catch(err) {
        msg.style.color = "red";
        msg.innerHTML = "❌ Server Error";
    }
});

