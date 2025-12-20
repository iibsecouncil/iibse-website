// -----------------------------------------------------
// IIBSE BACKEND — PHASE 1 (FINAL STABLE VERSION)
// -----------------------------------------------------

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// -----------------------------------------------------
// MIDDLEWARE
// -----------------------------------------------------
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// -----------------------------------------------------
// SUPABASE CLIENT (SERVICE ROLE)
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
// ADMIN — READ ADVISERS
// -----------------------------------------------------
app.get("/admin/advisers", async (req, res) => {
  const { data, error } = await supabase
    .from("advisers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// -----------------------------------------------------
// ADMIN — APPROVE / REJECT ADVISER
// -----------------------------------------------------
app.post("/admin/approve-adviser", async (req, res) => {
  const { id } = req.body;

  const { error } = await supabase
    .from("advisers")
    .update({ status: "approved" })
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

app.post("/admin/reject-adviser", async (req, res) => {
  const { id } = req.body;

  const { error } = await supabase
    .from("advisers")
    .update({ status: "rejected" })
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// -----------------------------------------------------
// ADMIN — READ SCHOOLS
// -----------------------------------------------------
app.get("/admin/schools", async (req, res) => {
  const { data, error } = await supabase
    .from("schools")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// -----------------------------------------------------
// ADMIN — READ PAYMENTS
// -----------------------------------------------------
app.get("/admin/payments", async (req, res) => {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// -----------------------------------------------------
// ADMIN — VERIFY / REJECT PAYMENT
// -----------------------------------------------------
app.post("/admin/verify-payment", async (req, res) => {
  const { payment_id } = req.body;

  const { error } = await supabase
    .from("payments")
    .update({ status: "verified", verified_at: new Date() })
    .eq("id", payment_id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

app.post("/admin/reject-payment", async (req, res) => {
  const { payment_id } = req.body;

  const { error } = await supabase
    .from("payments")
    .update({ status: "rejected" })
    .eq("id", payment_id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// -----------------------------------------------------
// SCHOOL AFFILIATION — APPLY
// -----------------------------------------------------
app.post("/school/apply", async (req, res) => {
  const { data, error } = await supabase
    .from("schools")
    .insert([{ ...req.body, status: "pending" }]);

  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true, data });
});

// -----------------------------------------------------
// ADVISER — APPLY
// -----------------------------------------------------
app.post("/adviser/apply", async (req, res) => {
  const { data, error } = await supabase
    .from("advisers")
    .insert([{ ...req.body, status: "pending" }]);

  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true, data });
});

// -----------------------------------------------------
// FEES — ACTIVE
// -----------------------------------------------------
app.get("/fees/active", async (req, res) => {
  const { data, error } = await supabase
    .from("fee_master")
    .select("*")
    .eq("active", true)
    .order("amount", { ascending: true });

  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true, data });
});

// -----------------------------------------------------
// STUDENT — SUBMIT PAYMENT
// -----------------------------------------------------
app.post("/student/submit-payment", async (req, res) => {
  const {
    student_id,
    fee_code,
    amount,
    transaction_id,
    transaction_date
  } = req.body || {};

  if (!student_id || !fee_code || !amount || !transaction_id || !transaction_date) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  const { data, error } = await supabase.from("payments").insert([{
    student_id,
    fee_code,
    amount,
    transaction_id,
    submitted_at: transaction_date,
    status: "pending"
  }]);

  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true, data });
});

// -----------------------------------------------------
// START SERVER
// -----------------------------------------------------
app.listen(PORT, () => {
  console.log(`IIBSE Backend LIVE on PORT ${PORT}`);
});
