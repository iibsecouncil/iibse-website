// -----------------------------------------------------
// IIBSE BACKEND — CLEAN & FIXED SERVER.JS
// -----------------------------------------------------

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import adminReadRoutes from "./routes/adminRead.js";

dotenv.config();

const app = express();

// ⚠️ Render auto-assigns PORT
const PORT = process.env.PORT || 5000;

// -----------------------------------------------------
// MIDDLEWARE
// -----------------------------------------------------
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.get("/admin/advisers", (req, res) => {
  res.json({ status: "DIRECT ADMIN ROUTE HIT" });
});


// -----------------------------------------------------
// ADMIN ROUTES (DASHBOARD READ)
// -----------------------------------------------------
app.use("/admin", adminReadRoutes);

// -----------------------------------------------------
// SUPABASE CLIENT
// -----------------------------------------------------
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.supabase_service_role1
);

// -----------------------------------------------------
// BASIC TEST
// -----------------------------------------------------
app.get("/", (req, res) => {
  res.send("IIBSE Backend Running — Jai Shri Krishna 🚀");
});

// -----------------------------------------------------
// SCHOOL AFFILIATION
// -----------------------------------------------------
app.post("/school/apply", async (req, res) => {
  const { data, error } = await supabase
    .from("schools")
    .insert([{ ...req.body, status: "pending" }]);

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
  res.json({ success: true, data });
});

app.get("/admin/pending-schools", async (req, res) => {
  const { data, error } = await supabase
    .from("schools")
    .select("*")
    .eq("status", "pending");

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
  res.json({ success: true, data });
});

app.post("/admin/approve-school", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ success: false, error: "School ID missing" });
  }

  const { error } = await supabase
    .from("schools")
    .update({ status: "approved" })
    .eq("id", id);

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
  res.json({ success: true });
});

// -----------------------------------------------------
// ADVISER
// -----------------------------------------------------
app.post("/adviser/apply", async (req, res) => {
  const { data, error } = await supabase
    .from("advisers")
    .insert([{ ...req.body, status: "pending" }]);

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
  res.json({ success: true, data });
});

app.get("/admin/pending-advisers", async (req, res) => {
  const { data, error } = await supabase
    .from("advisers")
    .select("*")
    .eq("status", "pending");

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
  res.json({ success: true, data });
});

app.post("/admin/approve-adviser", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ success: false, error: "Adviser ID missing" });
  }

  const { error } = await supabase
    .from("advisers")
    .update({ status: "approved" })
    .eq("id", id);

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
  res.json({ success: true });
});

// -----------------------------------------------------
// FEES (ACTIVE)
// -----------------------------------------------------
app.get("/fees/active", async (req, res) => {
  const { data, error } = await supabase
    .from("fee_master")
    .select("*")
    .eq("active", true)
    .order("amount", { ascending: true });

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
  res.json({ success: true, data });
});

// -----------------------------------------------------
// STUDENT SUBMIT PAYMENT
// -----------------------------------------------------
app.post("/student/submit-payment", async (req, res) => {
  const {
    student_id,
    fee_code,
    amount,
    transaction_id,
    transaction_date
  } = req.body || {};

  if (
    !student_id ||
    !fee_code ||
    !amount ||
    !transaction_id ||
    !transaction_date
  ) {
    return res.status(400).json({
      success: false,
      error: "Missing required payment fields"
    });
  }

  const { data, error } = await supabase.from("payments").insert([
    {
      student_id,
      fee_code,
      amount,
      transaction_id,
      submitted_at: transaction_date,
      status: "pending"
    }
  ]);

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  res.json({
    success: true,
    message: "Payment submitted successfully. Verification pending.",
    data
  });
});

// -----------------------------------------------------
// STUDENT PAYMENT STATUS
// -----------------------------------------------------
app.get("/student/payments", async (req, res) => {
  const { student_id } = req.query;

  if (!student_id) {
    return res.status(400).json({
      success: false,
      error: "student_id required"
    });
  }

  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("student_id", student_id)
    .order("submitted_at", { ascending: false });

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  res.json({ success: true, data });
});

// -----------------------------------------------------
// ADMIN PAYMENT VERIFICATION
// -----------------------------------------------------
app.get("/admin/pending-payments", async (req, res) => {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("status", "pending")
    .order("submitted_at", { ascending: false });

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  res.json({ success: true, data });
});

app.post("/admin/verify-payment", async (req, res) => {
  const { payment_id } = req.body;

  if (!payment_id) {
    return res.status(400).json({
      success: false,
      error: "Payment ID missing"
    });
  }

  const { error } = await supabase
    .from("payments")
    .update({
      status: "verified",
      verified_at: new Date()
    })
    .eq("id", payment_id);

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  res.json({ success: true });
});

app.post("/admin/reject-payment", async (req, res) => {
  const { payment_id } = req.body;

  if (!payment_id) {
    return res.status(400).json({
      success: false,
      error: "Payment ID missing"
    });
  }

  const { error } = await supabase
    .from("payments")
    .update({ status: "rejected" })
    .eq("id", payment_id);

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  res.json({ success: true });
});

// -----------------------------------------------------
// START SERVER
// -----------------------------------------------------
app.listen(PORT, () => {
  console.log(`IIBSE Backend LIVE on PORT ${PORT}`);
});
