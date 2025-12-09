// -----------------------------------------------------
// IIBSE BACKEND — SERVER.JS (KRISHNA FINAL VERSION)
// -----------------------------------------------------
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

// ---------------- CONFIG ----------------
const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Supabase connection - NOTE: set env var name exactly: supabase_service_role1
const SUPABASE_URL = process.env.SUPABASE_URL || "https://phghqudhsmksakzlsygy.supabase.co";
const SUPABASE_SERVICE_ROLE = process.env.supabase_service_role1;

if (!SUPABASE_SERVICE_ROLE) {
  console.error("ERROR: Environment variable 'supabase_service_role1' is not set!");
  // do not crash the process; logs will show the issue
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

// ---------------- ROOT TEST ----------------
app.get("/", (req, res) => {
  res.send("IIBSE Backend Running — Jai Shri Krishna 🚀");
});

// -----------------------------------------------------
// 1️⃣ SCHOOL LOGIN API
// -----------------------------------------------------
app.post("/school/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) return res.status(400).json({ error: "Missing credentials" });

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
      approved: data.approved || false
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Login error" });
  }
});

// -----------------------------------------------------
// 2️⃣ ADD NOTICE (ADMIN)
// -----------------------------------------------------
app.post("/admin/notices/add", async (req, res) => {
  const { title, message } = req.body || {};
  if (!title || !message) return res.status(400).json({ error: "Missing title or message" });

  try {
    const { error } = await supabase.from("notices").insert([{ title, message }]);
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ success: true, message: "Notice Added" });
  } catch (err) {
    console.error("Add notice error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------------------------------
// 3️⃣ GET NOTICES
// -----------------------------------------------------
app.get("/notices", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .order("id", { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    return res.json(data || []);
  } catch (err) {
    console.error("Get notices error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------------------------------
// 4️⃣ APPROVE SCHOOL (ADMIN)
// -----------------------------------------------------
app.post("/admin/approve-school", async (req, res) => {
  const { school_id } = req.body || {};
  if (!school_id) return res.status(400).json({ error: "Missing school_id" });

  try {
    const { error } = await supabase
      .from("schools")
      .update({ approved: true })
      .eq("id", school_id);

    if (error) return res.status(400).json({ error: error.message });
    return res.json({ success: true });
  } catch (err) {
    console.error("Approve school error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------------------------------
// 5️⃣ UPDATE SCHOOL MODULES (ADMIN)
// body: { school_id, modules } (modules = array or JSON string)
// -----------------------------------------------------
app.post("/admin/set-modules", async (req, res) => {
  let { school_id, modules } = req.body || {};
  if (!school_id) return res.status(400).json({ error: "Missing school_id" });

  // allow modules sent as JSON string from some clients
  if (typeof modules === "string") {
    try { modules = JSON.parse(modules); } catch (e) { /* ignore parse error */ }
  }

  try {
    const { error } = await supabase
      .from("schools")
      .update({ allowed_modules: modules })
      .eq("id", school_id);

    if (error) return res.status(400).json({ error: error.message });
    return res.json({ success: true });
  } catch (err) {
    console.error("Set modules error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------------------------------
// 6️⃣ SCHOOL DASHBOARD DATA
// GET /school/dashboard-data?school_id=...
// -----------------------------------------------------
app.get("/school/dashboard-data", async (req, res) => {
  const school_id = req.query.school_id;
  if (!school_id) return res.status(400).json({ error: "Missing school_id" });

  try {
    const totalStudents = await supabase
      .from("students")
      .select("id", { count: "exact" })
      .eq("school_id", school_id);

    const pendingStudents = await supabase
      .from("students")
      .select("id", { count: "exact" })
      .eq("school_id", school_id)
      .eq("status", "pending");

    const noticeCount = await supabase
      .from("notices")
      .select("id", { count: "exact" });

    const pendingFees = await supabase
      .from("payments")
      .select("id", { count: "exact" })
      .eq("school_id", school_id)
      .eq("status", "pending");

    return res.json({
      totalStudents: totalStudents.count || 0,
      pendingStudents: pendingStudents.count || 0,
      noticeCount: noticeCount.count || 0,
      // if you have real amounts, change this; for now keep count * placeholder
      pendingFeesAmount: (pendingFees.count || 0) * 1000
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return res.status(500).json({ error: "Dashboard error" });
  }
});

// -----------------------------------------------------
// 7️⃣ GET ALLOWED MODULES FOR SCHOOL
// GET /school/get-modules?school_id=...
// -----------------------------------------------------
app.get("/school/get-modules", async (req, res) => {
  const school_id = req.query.school_id;
  if (!school_id) return res.status(400).json({ error: "Missing school_id" });

  try {
    const { data, error } = await supabase
      .from("schools")
      .select("allowed_modules")
      .eq("id", school_id)
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json({ modules: data?.allowed_modules || [] });
  } catch (err) {
    console.error("Get modules error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------------------------------
// 8️⃣ SUBMIT ADMISSION (INSERT STUDENT)
// POST /school/admission
// body: { school_id, student_name, class_course, admission_type, referral_id, status, fee_pending }
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

  if (!school_id || !student_name) return res.status(400).json({ error: "Missing data" });

  try {
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
  } catch (err) {
    console.error("Admission error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------------------------------
// 9️⃣ GET ALL STUDENTS OF SCHOOL
// GET /school/students?school_id=...
// -----------------------------------------------------
app.get("/school/students", async (req, res) => {
  const school_id = req.query.school_id;
  if (!school_id) return res.status(400).json({ error: "Missing school_id" });

  try {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("school_id", school_id)
      .order("id", { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    console.error("Get students error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------------------------------
// START SERVER
// -----------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`IIBSE Backend LIVE on PORT ${PORT}`);
});
