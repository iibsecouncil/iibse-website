import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import pkg from "@supabase/supabase-js";
const { createClient } = pkg;
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// =============================
// SUPABASE CONFIG
// =============================
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

// =============================
// CLOUDINARY CONFIG
// =============================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// =============================
// FILE UPLOAD API
// =============================
app.post("/upload", async (req, res) => {
  try {
    if (!req.files || !req.files.file)
      return res.status(400).json({ error: "No file uploaded" });

    const file = req.files.file;

    const uploadResponse = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
          folder: "iibse"
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      file.data.pipe(stream);
    });

    // Save upload info to Supabase
    await supabase.from("uploads").insert([{
      owner_type: req.body.owner_type,
      owner_id: req.body.owner_id,
      file_url: uploadResponse.secure_url,
      file_type: file.mimetype
    }]);

    res.json({ url: uploadResponse.secure_url });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// =============================
// CREATE SCHOOL
// =============================
app.post("/school/register", async (req, res) => {
  const { school_name, email, phone } = req.body;
  const { data, error } = await supabase
    .from("schools")
    .insert([{ school_name, email, phone }]);
  res.json({ data, error });
});

// =============================
// CREATE STUDENT
// =============================
app.post("/student/register", async (req, res) => {
  const { full_name, school_id, class: student_class } = req.body;
  const { data, error } = await supabase
    .from("students")
    .insert([{ full_name, school_id, class: student_class }]);
  res.json({ data, error });
});

// =============================
// VERIFY STUDENT
// =============================
app.get("/verify/:student_id", async (req, res) => {
  const student_id = req.params.student_id;
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("student_id", student_id)
    .single();
  res.json({ data, error });
});

// =============================
// SERVER START
// =============================
app.listen(process.env.PORT, () => console.log(`IIBSE Backend Running on Port ${process.env.PORT}`));
