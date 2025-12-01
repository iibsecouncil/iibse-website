// backend/index.js
// Full backend server for IIBSE (copy-paste this file to replace your existing backend/index.js)

// ------------------------------
// Imports & Setup
// ------------------------------
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import cloudinary from "cloudinary";

// Load environment variables from .env
dotenv.config();

// App Setup
const app = express();
app.use(cors());
app.use(express.json());

// Supabase Client (service role used for server-side operations)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

// Cloudinary Config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Setup (for file uploads)
const upload = multer({ storage: multer.memoryStorage() });

// ------------------------------
// ROOT / Health / Status
// ------------------------------
app.get("/", (req, res) => {
  res.send("IIBSE Backend Running Successfully ✔");
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "IIBSE Backend Working",
    uptime: process.uptime()
  });
});

app.get("/status", (req, res) => {
  res.json({
    running: true,
    service: "IIBSE Backend",
    timestamp: new Date().toISOString()
  });
});

// ------------------------------
// TEST DATABASE CONNECTION
// ------------------------------
app.get("/api/test", async (req, res) => {
  try {
    const { data, error } = await supabase.from("schools").select("*").limit(1);
    if (error) return res.status(500).json({ error: error.message });
    res.json({
      message: "Connected to Supabase ✔",
      sample_row: data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------------------
// 1️⃣ SCHOOL REGISTRATION API
// ------------------------------------------
app.post("/api/schools/register", async (req, res) => {
  try {
    const { school_name, registration_no, principal_name, email, phone, address, city, state, pincode } = req.body;

    const { data, error } = await supabase
      .from("schools")
      .insert([
        {
          school_name,
          registration_no,
          principal_name,
          email,
          phone,
          address,
          city,
          state,
          pincode,
          affiliation_status: "Pending",
        },
      ])
      .select();

    if (error) return res.status(400).json({ error: error.message });

    res.json({
      message: "School Registered Successfully ✔",
      school: data[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------------------
// 2️⃣ STUDENT RECORD CREATION API
// ------------------------------------------
app.post("/api/students/add", async (req, res) => {
  try {
    const {
      full_name,
      father_name,
      mother_name,
      dob,
      gender,
      school_id,
      class: className,
      student_id,
      roll_no,
      year_of_passing
    } = req.body;

    // NOTE: ensure school_id is correct type in your DB (UUID vs integer).
    const { data, error } = await supabase
      .from("students")
      .insert([
        {
          full_name,
          father_name,
          mother_name,
          dob,
          gender,
          school_id,
          class: className,
          student_id,
          roll_no,
          year_of_passing,
        },
      ])
      .select();

    if (error) return res.status(400).json({ error: error.message });

    res.json({
      message: "Student Record Added Successfully ✔",
      student: data[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------------------
// 3️⃣ FILE UPLOAD API (PDF / IMAGE) -> Cloudinary
// ------------------------------------------
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file provided" });

    // upload_stream returns a writable stream - wrap in Promise
    const uploadStream = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(file.buffer);
      });

    const result = await uploadStream();

    res.json({
      message: "File Uploaded Successfully ✔",
      url: result.secure_url,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------------------
// 4️⃣ ADMIN LOGIN API
//    - simple username/password check against admin_users table
//    - NOTE: This example uses plaintext matching. For production, use hashed passwords.
// ------------------------------------------
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ success: false, error: "Username and password required." });
    }

    // Query admin_users table for matching user
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("username", username)
      .eq("password", password) // if you store hashed passwords, replace with hash compare
      .single();

    if (error || !data) {
      return res.status(401).json({ success: false, error: "Invalid Username or Password" });
    }

    // Success -> return admin id (or token in future)
    res.json({
      success: true,
      message: "Login successful",
      admin_id: data.id,
      username: data.username
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------------------------------
// OPTIONAL: Get list of pending schools (for admin dashboard)
// ------------------------------------------
app.get("/api/admin/pending-schools", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("schools")
      .select("*")
      .eq("affiliation_status", "Pending")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    res.json({ pending: data || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------------------
// OPTIONAL: Approve school (admin action)
// ------------------------------------------
app.post("/api/admin/schools/approve", async (req, res) => {
  try {
    const { school_id, admin_id } = req.body;
    if (!school_id) return res.status(400).json({ error: "school_id required" });

    const { data, error } = await supabase
      .from("schools")
      .update({ affiliation_status: "Approved", approved_by: admin_id, approved_at: new Date().toISOString() })
      .eq("id", school_id)
      .select();

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: "School approved", school: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------------------
// START SERVER
// ------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
