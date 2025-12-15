// -----------------------------------------------------
// IIBSE BACKEND — SERVER.JS (FINAL PRODUCTION VERSION)
// -----------------------------------------------------

import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

// ---------------- CONFIG ----------------
const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Supabase connection
const SUPABASE_URL =
  process.env.SUPABASE_URL || "https://phghqudhsmksakzlsygy.supabase.co";
const SUPABASE_SERVICE_ROLE = process.env.supabase_service_role1;

if (!SUPABASE_SERVICE_ROLE) {
  console.error("ERROR: 'supabase_service_role1' environment variable missing!");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

// ---------------- ROOT TEST ----------------
app.get("/", (req, res) => {
  res.send("IIBSE Backend Running — Jai Shri Krishna 🚀");
});

// -----------------------------------------------------
// 🔹 ACTIVE FEES (FIXED & REQUIRED)
// -----------------------------------------------------
app.get("/fees/active", async (req, res) => {
  const { data, error } = await supabase
    .from("fee_master")
    .select("*")
    .eq("active", true)
    .order("amount", { ascending: true });

  if (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }

  res.json({
    success: true,
    data
  });
});

// -----------------------------------------------------
// 1️⃣ SCHOOL LOGIN
// -----------------------------------------------------
app.post("/school/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: "Missing credentials" });

  const { data, error } = await supabase
    .from("schools")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();

  if (error || !data)
    return res.status(401).json({ error: "Invalid email or password" });

  res.json({
    success: true,
    school_id: data.id,
    school_name: data.name,
    approved: data.approved || false
  });
});

// -----------------------------------------------------
// 2️⃣ ADD NOTICE (ADMIN)
// -----------------------------------------------------
app.post("/admin/notices/add", async (req, res) => {
  const { title, message } = req.body || {};
  if (!title || !message)
    return res.status(400).json({ error: "Missing title or message" });

  const { error } = await supabase.from("notices").insert([{ title, message }]);
  if (error) return res.status(400).json({ error: error.message });

  res.json({ success: true, message: "Notice Added" });
});

// -----------------------------------------------------
// 3️⃣ GET NOTICES
// -----------------------------------------------------
app.get("/notices", async (req, res) => {
  const { data, error } = await supabase
    .from("notices")
    .select("*")
    .order("id", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data || []);
});

// -----------------------------------------------------
// 4️⃣ SCHOOL DASHBOARD DATA
// -----------------------------------------------------
app.get("/school/dashboard-data", async (req, res) => {
  const school_id = req.query.school_id;
  if (!school_id)
    return res.status(400).json({ error: "Missing school_id" });

  const total = await supabase
    .from("students")
    .select("id", { count: "exact" })
    .eq("school_id", school_id);

  const pending = await supabase
    .from("students")
    .select("id", { count: "exact" })
    .eq("school_id", school_id)
    .eq("status", "pending");

  const notices = await supabase
    .from("notices")
    .select("id", { count: "exact" });

  const feePending = await supabase
    .from("payments")
    .select("id", { count: "exact" })
    .eq("school_id", school_id)
    .eq("status", "pending");

  res.json({
    totalStudents: total.count || 0,
    pendingStudents: pending.count || 0,
    noticeCount: notices.count || 0,
    pendingFeesAmount: (feePending.count || 0) * 1000
  });
});

// -----------------------------------------------------
// 5️⃣ GET ALLOWED MODULES
// -----------------------------------------------------
app.get("/school/get-modules", async (req, res) => {
  const school_id = req.query.school_id;
  if (!school_id)
    return res.status(400).json({ error: "Missing school_id" });

  const { data, error } = await supabase
    .from("schools")
    .select("modules_allowed")
    .eq("id", school_id)
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json({ modules: data?.modules_allowed || [] });
});

// -----------------------------------------------------
// 6️⃣ SUBMIT ADMISSION
// -----------------------------------------------------
app.post("/school/admission", async (req, res) => {
  const {
    school_id,
    student_name,
    class_course,
    admission_type,
    referral_id,
    status = "pending",
    fee_pending = 0
  } = req.body || {};

  if (!school_id || !student_name)
    return res.status(400).json({ error: "Missing required data" });

  const { error } = await supabase.from("students").insert([
    {
      school_id,
      student_name,
      class_course,
      admission_type,
      referral_id,
      status,
      fee_pending
    }
  ]);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true, message: "Admission stored" });
});

// -----------------------------------------------------
// 7️⃣ GET ALL STUDENTS
// -----------------------------------------------------
app.get("/school/students", async (req, res) => {
  const school_id = req.query.school_id;
  if (!school_id)
    return res.status(400).json({ error: "Missing school_id" });

  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("school_id", school_id)
    .order("id", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data || []);
});

// -----------------------------------------------------
// 8️⃣ GET SCHOOL PROFILE
// -----------------------------------------------------
app.get("/school/details", async (req, res) => {
  const school_id = req.query.school_id;
  if (!school_id)
    return res.status(400).json({ error: "school_id required" });

  const { data, error } = await supabase
    .from("schools")
    .select("*")
    .eq("id", school_id)
    .single();

  if (error) return res.status(400).json({ error: "School not found" });
  res.json({ success: true, school: data });
});

// -----------------------------------------------------
// 9️⃣ UPDATE SCHOOL PROFILE
// -----------------------------------------------------
app.post("/school/update-profile", async (req, res) => {
  const {
    school_id,
    principal_name,
    phone,
    address,
    website,
    logo_url
  } = req.body || {};

  if (!school_id)
    return res.status(400).json({ error: "school_id required" });

  const { error } = await supabase
    .from("schools")
    .update({ principal_name, phone, address, website, logo_url })
    .eq("id", school_id);

  if (error) return res.status(400).json({ error: "Update failed" });
  res.json({ success: true, message: "Profile updated" });
});

// =====================================================
// 🔐 ADMIN VERIFICATION
// =====================================================

// 🔹 PENDING SCHOOLS
app.get("/admin/pending-schools", async (req, res) => {
  const { data, error } = await supabase
    .from("schools")
    .select("*")
    .eq("approved", false)
    .order("created_at", { ascending: false });

  if (error) return res.json({ success: false, message: error.message });
  res.json({ success: true, data });
});

// 🔹 APPROVE SCHOOL
app.post("/admin/approve-school", async (req, res) => {
  const { school_id } = req.body || {};
  if (!school_id)
    return res.status(400).json({ error: "school_id required" });

  const { error } = await supabase
    .from("schools")
    .update({ approved: true })
    .eq("id", school_id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true, message: "School approved successfully" });
});

// 🔹 PENDING ADVISERS
app.get("/admin/pending-advisers", async (req, res) => {
  const { data, error } = await supabase
    .from("referrals")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) return res.json({ success: false, message: error.message });
  res.json({ success: true, data });
});

// 🔹 APPROVE ADVISER
app.post("/admin/approve-adviser", async (req, res) => {
  const { adviser_id } = req.body || {};
  if (!adviser_id)
    return res.status(400).json({ error: "adviser_id required" });

  const { error } = await supabase
    .from("referrals")
    .update({ status: "active" })
    .eq("id", adviser_id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true, message: "Adviser approved successfully" });
});

// -----------------------------------------------------
// START SERVER (RENDER SAFE)
// -----------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`IIBSE Backend LIVE on PORT ${PORT}`);
});
