async function submitAffiliation(event) {
  event.preventDefault();

  const institute_name = document.getElementById("institute_name").value;
  const owner_name = document.getElementById("owner_name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;
  const district = document.getElementById("district").value;

  const url = "https://iibse-backend.onrender.com/affiliation";

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      institute_name,
      owner_name,
      phone,
      email,
      address,
      district,
      document_url: "N/A"
    })
  });

  const data = await response.json();

  const resultBox = document.getElementById("affiliationResult");

  if (data.success) {
    resultBox.innerHTML = `<p class="success">✔ Affiliation submitted successfully!</p>`;
  } else {
    resultBox.innerHTML = `<p class="error">❌ Failed to submit.</p>`;
  }
}

