
// ===============================
//  SIMPLE FORM HANDLING SCRIPT
// ===============================

// ------- AFFILIATION FORM -------
const affiliationForm = document.getElementById("affiliationForm");

if (affiliationForm) {
    affiliationForm.addEventListener("submit", function (e) {
        e.preventDefault();

        alert("Thank you! Your Institution Affiliation Application has been submitted successfully.");

        // Reset form
        affiliationForm.reset();
    });
}



// ------- ADVISER REGISTRATION FORM -------
const adviserForm = document.getElementById("adviserForm");

if (adviserForm) {
    adviserForm.addEventListener("submit", function (e) {
        e.preventDefault();

        alert("Thank you! Your Adviser Registration Form has been submitted successfully.");

        // Reset form
        adviserForm.reset();
    });
}

