import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// SUPABASE
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);

// CLOUDINARY
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload preset
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: { folder: "iibse" }
});
const upload = multer({ storage });

// Test API
app.get("/", (req, res) => {
  res.json({ status: "IIBSE Backend Running Successfully!" });
});

// Start server
app.listen(process.env.PORT || 3000, () =>
  console.log("Server running on port 3000")
);
