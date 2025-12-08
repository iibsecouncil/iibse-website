// -----------------------------------------------------
// IIBSE BACKEND — Complete Server.js (Krishna Final Version)
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
  res.send("IIBSE Backend is Running — Jai Shri Krishna 🚀");
});

// -----------------------------------------------------
// 1️⃣ SCHOOL LOGIN API
// -----------------------------------------------------
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
            school_id: data.id,
            school_name: data.school_name,
            approved: data.approved
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server login error" });
    }
});

// -----------------------------------------------------
// 2️⃣ ADD NOTICE (ADMIN)
// -----------------------------------------------------
app.post("/admin/notices/add", async (req, res) => {
    const { title, message } = req.body;

    try {
        const { error } = await supabase.from("notices").insert([{ title, message }]);

        if (error) return res.status(400).json({ error });

        return res.json({ success: true, message: "Notice added" });
    } catch (err) {
        res.status(500).json({ error: "Notice add failed" });
    }
});

// -----------------------------------------------------
// 3️⃣ GET ALL NOTICES
// -----------------------------------------------------
app.get("/notices", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("notices")
            .select("*")
            .order("id", { ascending: false });

        if (error) return res.status(400).json({ error });

        return res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed loading notices" });
    }
});

// -----------------------------------------------------
// 4️⃣ APPROVE SCHOOL (ADMIN)
// -----------------------------------------------------
app.post("/admin/approve-school", async (req, res) => {
    const { school_id } = req.body;

    try {
        const { error } = await supabase
            .from("schools")
            .update({ approved: true })
            .eq("id", school_id);

        if (error) return res.status(400).json({ error });

        return res.json({ success: true, message: "School approved" });
    } catch (err) {
        res.status(500).json({ error: "Approval error" });
    }
});

// -----------------------------------------------------
// 5️⃣ UPDATE SCHOOL MODULES (ADMIN)
// -----------------------------------------------------
app.post("/admin/set-modules", async (req, res) => {
    const { school_id, modules } = req.body;

    try {
        const { error } = await supabase
            .from("schools")
            .update({ allowed_modules: modules })
            .eq("id", school_id);

        if (error) return res.status(400).json({ error });

        return res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Module update failed" });
    }
});

// -----------------------------------------------------
// 6️⃣ SCHOOL DASHBOARD DATA (NEW)
// -----------------------------------------------------
app.get("/school/dashboard-data", async (req, res) => {
    const school_id = req.query.school_id;

    if (!school_id) {
        return res.status(400).json({ error: "school_id required" });
    }

    try {
        // TOTAL STUDENTS
        const totalStudents = await supabase
            .from("students")
            .select("*", { count: "exact" })
            .eq("school_id", school_id);

        // PENDING STUDENTS
        const pendingStudents = await supabase
            .from("students")
            .select("*", { count: "exact" })
            .eq("school_id", school_id)
            .eq("status", "pending");

        // NOTICES
        const noticeCount = await supabase
            .from("notices")
            .select("*", { count: "exact" });

        // FEES PENDING
        const pendingFees = await supabase
            .from("payments")
            .select("*", { count: "exact" })
            .eq("school_id", school_id)
            .eq("status", "pending");

        return res.json({
            totalStudents: totalStudents.count || 0,
            pendingStudents: pendingStudents.count || 0,
            noticeCount: noticeCount.count || 0,
            pendingFees: (pendingFees.count || 0) * 1000  // example fee logic
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Dashboard data error" });
    }
});

// -----------------------------------------------------
// RUN BACKEND
// -----------------------------------------------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`IIBSE Backend LIVE on PORT ${PORT}`);
});
