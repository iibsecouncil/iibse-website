import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import cloudinary from "cloudinary";

// Load Env
dotenv.config();

// App Setup
const app = express();
app.use(cors());
app.use(express.json());

// Supabase Client
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

// Multer Setup
const upload = multer({ storage: multer.memoryStorage() });

// ------------------------------
// ROOT CHECK
// ------------------------------
app.get("/", (req, res) => {
  res.send("IIBSE Backend Running Successfully ✔");
});

// ------------------------------
// TEST DATABASE CONNECTION
// ------------------------------
app.get("/api/test", async (req, res) => {
  const { data, error } = await supabase.from("schools").select("*").limit(1);

  if (error)
    return res.status(500).json({ error: error.message });

  res.json({
    message: "Connected to Supabase ✔",
    sample_row: data,
  });
});

// ------------------------------------------
// 1️⃣ SCHOOL REGISTRATION API
// ------------------------------------------
app.post("/api/schools/register", async (req, res) => {
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
});

// ------------------------------------------
// 2️⃣ STUDENT RECORD CREATION API
// ------------------------------------------
app.post("/api/students/add", async (req, res) => {
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
});

// ------------------------------------------
// 3️⃣ FILE UPLOAD API (PDF / IMAGE)
// ------------------------------------------
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const uploadResult = await cloudinary.v2.uploader.upload_stream(
      { resource_type: "auto" },
      async (error, result) => {
        if (error) return res.status(500).json({ error: error.message });

        res.json({
          message: "File Uploaded Successfully ✔",
          url: result.secure_url,
        });
      }
    );

    uploadResult.end(file.buffer);

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

