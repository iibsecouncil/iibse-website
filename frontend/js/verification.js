async function verifyStudent() {
  const studentId = document.getElementById("studentId").value.trim();

  if (!studentId) {
    alert("Please enter a valid Student ID.");
    return;
  }

  const url = "https://iibse-backend.onrender.com/verify";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roll_no: studentId })
    });

    const data = await response.json();
    const resultBox = document.getElementById("result");

    if (!data.success) {
      resultBox.innerHTML = `<p class="error">❌ No record found</p>`;
    } else {
      const s = data.student;
      resultBox.innerHTML = `
        <p class="success">✔ Verified Successfully</p>
        <p><strong>Name:</strong> ${s.student_name}</p>
        <p><strong>Course:</strong> ${s.course}</p>
        <p><strong>Batch:</strong> ${s.batch_year}</p>
        <p><strong>Roll No:</strong> ${s.roll_no}</p>
      `;
    }
  } catch (err) {
    alert("Server error! Try again later.");
  }
}
