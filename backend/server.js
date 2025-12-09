// -----------------------------------------------------
// IIBSE BACKEND — COMPLETE SERVER.JS (KRISHNA FINAL VERSION)
// -----------------------------------------------------

import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

// ---------------- CONFIG ----------------
const app = express();
app.use(cors());
app.use(express.json());

// Supabase connection
const SUPABASE_URL = "https://phghqudhsmksakzlsygy.supabase.co";
const SUPABASE_SERVICE_ROLE = process.env.supabase_service_role1;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

// ---------------- ROOT TEST ----------------
app.get("/", (req, res) => {
  res.send("IIBSE Backend Running — Jai Shri Krishna 🚀");
});

// -----------------------------------------------------
// 1️⃣ SCHOOL LOGIN API
// -----------------------------------------------------
// SCHOOL LOGIN API
app.post("/school/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase
      .from("schools")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    return res.json({
      success: true,
      school_id: data.id,
      school_name: data.school_name,
      approved: data.approved
    });

  } catch (err) {
    return res.status(500).json({ error: "Login error" });
  }
});

// -----------------------------------------------------
// 2️⃣ ADD NOTICE (ADMIN)
// -----------------------------------------------------
app.post("/admin/notices/add", async (req, res) => {
  const { title, message } = req.body;

  const { error } = await supabase.from("notices").insert([{ title, message }]);

  if (error) return res.status(400).json({ error });

  return res.json({ success: true, message: "Notice Added" });
});

// -----------------------------------------------------
// 3️⃣ GET NOTICES
// -----------------------------------------------------
app.get("/notices", async (req, res) => {
  const { data, error } = await supabase
    .from("notices")
    .select("*")
    .order("id", { ascending: false });

  if (error) return res.status(400).json({ error });

  return res.json(data);
});

// -----------------------------------------------------
// 4️⃣ APPROVE SCHOOL (ADMIN)
// -----------------------------------------------------
app.post("/admin/approve-school", async (req, res) => {
  const { school_id } = req.body;

  const { error } = await supabase
    .from("schools")
    .update({ approved: true })
    .eq("id", school_id);

  if (error) return res.status(400).json({ error });

  return res.json({ success: true });
});

// -----------------------------------------------------
// 5️⃣ UPDATE SCHOOL MODULES (ADMIN)
// -----------------------------------------------------
app.post("/admin/set-modules", async (req, res) => {
  const { school_id, modules } = req.body;

  const { error } = await supabase
    .from("schools")
    .update({ allowed_modules: modules })
    .eq("id", school_id);

  if (error) return res.status(400).json({ error });

  return res.json({ success: true });
});

// -----------------------------------------------------
// 6️⃣ SCHOOL DASHBOARD DATA
// -----------------------------------------------------
app.get("/school/dashboard-data", async (req, res) => {
  const school_id = req.query.school_id;

  try {
    const totalStudents = await supabase
      .from("students")
      .select("*", { count: "exact" })
      .eq("school_id", school_id);

    const pendingStudents = await supabase
      .from("students")
      .select("*", { count: "exact" })
      .eq("school_id", school_id)
      .eq("status", "pending");

    const noticeCount = await supabase
      .from("notices")
      .select("*", { count: "exact" });

    const pendingFees = await supabase
      .from("payments")
      .select("*", { count: "exact" })
      .eq("school_id", school_id)
      .eq("status", "pending");

    return res.json({
      totalStudents: totalStudents.count || 0,
      pendingStudents: pendingStudents.count || 0,
      noticeCount: noticeCount.count || 0,
      pendingFees: (pendingFees.count || 0) * 1000
    });
  } catch (err) {
    return res.status(500).json({ error: "Dashboard error" });
  }
});

// -----------------------------------------------------
// 7️⃣ GET ALLOWED MODULES FOR SCHOOL
// -----------------------------------------------------
app.get("/school/get-modules", async (req, res) => {
  const school_id = req.query.school_id;

  const { data, error } = await supabase
    .from("schools")
    .select("allowed_modules")
    .eq("id", school_id)
    .single();

  if (error) return res.status(400).json({ error });

  res.json({ modules: data.allowed_modules || [] });
});

// -----------------------------------------------------
// 8️⃣ SUBMIT ADMISSION (INSERT STUDENT)
// -----------------------------------------------------
app.post("/school/admission", async (req, res) => {
  const {
    school_id,
    student_name,
    class_course,
    admission_type,
    referral_id,
    status,
    fee_pending
  } = req.body;

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

  if (error) return res.status(400).json({ error });

  res.json({ success: true, message: "Admission stored" });
});

// -----------------------------------------------------
// 9️⃣ GET ALL STUDENTS OF SCHOOL
// -----------------------------------------------------
app.get("/school/students", async (req, res) => {
  const school_id = req.query.school_id;

  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("school_id", school_id)
    .order("id", { ascending: false });

  if (error) return res.status(400).json({ error });

  res.json(data);
});

// -----------------------------------------------------
// START SERVER
// -----------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`IIBSE Backend LIVE on PORT ${PORT}`);
});
