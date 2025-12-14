// ===============================
//  IIBSE FORM HANDLING SCRIPT
// ===============================


// ------- SCHOOL AFFILIATION FORM -------
const affiliationForm = document.getElementById("affiliationForm");

if (affiliationForm) {
  affiliationForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
      name: affiliationForm.querySelector("[name='name']")?.value.trim(),
      email: affiliationForm.querySelector("[name='email']")?.value.trim(),
      password: affiliationForm.querySelector("[name='password']")?.value.trim(),
      type: affiliationForm.querySelector("[name='type']")?.value || "school"
    };

    if (!data.name || !data.email || !data.password) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const res = await fetch("/api/apply-school", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (result.success) {
        alert(result.message || "School affiliation application submitted successfully.");
        affiliationForm.reset();
      } else {
        alert(result.message || "Submission failed. Please try again.");
      }

    } catch (err) {
      console.error("Affiliation form error:", err);
      alert("Server error. Please try again later.");
    }
  });
}



// ------- ADVISER REGISTRATION FORM -------
const adviserForm = document.getElementById("adviserForm");

if (adviserForm) {
  adviserForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
      full_name: adviserForm.querySelector("[name='fullname']").value.trim(),
      mobile: adviserForm.querySelector("

