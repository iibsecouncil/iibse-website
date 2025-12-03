async function submitAffiliation() {
    const data = {
        institute_name: document.getElementById("school_name").value.trim(),
        owner_name: document.getElementById("principal_name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim(),
        district: document.getElementById("city").value.trim(),
        document_url: "N/A"
    };

    if (!data.institute_name || !data.owner_name || !data.email || !data.phone || !data.address || !data.district) {
        document.getElementById("response").innerHTML =
        `<p style="color:red">❌ All fields are required.</p>`;
        return;
    }

    try {
        const res = await fetch("https://iibse-backend.onrender.com/affiliation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await res.json();

        if (result.success) {
            document.getElementById("response").innerHTML =
            `<p style='color:green'>✔ Application Submitted Successfully!</p>`;
        } else {
            document.getElementById("response").innerHTML =
            `<p style='color:red'>❌ Submission failed.</p>`;
        }
    } catch (err) {
        document.getElementById("response").innerHTML =
        `<p style='color:red'>❌ Server Error. Try again.</p>`;
    }
}

