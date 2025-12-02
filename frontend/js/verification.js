async function verifyStudent() {
  const studentId = document.getElementById("studentId").value.trim();

  if (!studentId) {
    alert("Please enter a valid Student ID.");
    return;
  }

  const url = `https://iibse-backend.onrender.com/api/students/verify/${studentId}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const resultBox = document.getElementById("result");

    if (data.error) {
      resultBox.innerHTML = `<p class="error">❌ ${data.error}</p>`;
    } else {
      resultBox.innerHTML = `
        <p class="success">✔ Verified Successfully</p>
        <p><strong>Name:</strong> ${data.full_name}</p>
        <p><strong>Father:</strong> ${data.father_name}</p>
        <p><strong>School ID:</strong> ${data.school_id}</p>
        <p><strong>Class:</strong> ${data.class}</p>
        <p><strong>Passing Year:</strong> ${data.year_of_passing}</p>
      `;
    }
  } catch (err) {
    alert("Server error! Try again later.");
  }
}

