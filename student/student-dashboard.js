const API_BASE = "https://iibse-website-1.onrender.com";

const STUDENT_ID = "demo-student-uuid"; // later login se aayega

async function submitPayment() {
  const txnId = document.getElementById("txnId").value.trim();
  const txnDate = document.getElementById("txnDate").value;

  if (!txnId || !txnDate) {
    alert("Transaction ID and Date are required.");
    return;
  }

  const res = await fetch(API_BASE + "/student/submit-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      student_id: STUDENT_ID,
      transaction_id: txnId,
      transaction_date: txnDate
    })
  });

  const json = await res.json();

  if (json.success) {
    document.getElementById("paymentForm").style.display = "none";
    document.getElementById("statusMsg").innerText =
      "⏳ Payment submitted successfully. Verification pending from Accounts Department.";
  } else {
    alert("Failed to submit payment. Try again.");
  }
}
