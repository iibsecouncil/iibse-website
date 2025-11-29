import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import cloudinary from "cloudinary";

dotenv.config();

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

// File upload setup
const upload = multer({ storage: multer.memoryStorage() });

// Root Test Route
app.get("/", (req, res) => {
  res.send("IIBSE Backend Running Successfully ✔");
});

// Test DB Connection
app.get("/api/test", async (req, res) => {
  const { data, error } = await supabase
    .from("schools")
    .select("*")
    .limit(1);

  if (error) return res.status(500).json({ error: error.message });

  res.json({
    message: "Connected to Supabase ✔",
    sample_row: data,
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
