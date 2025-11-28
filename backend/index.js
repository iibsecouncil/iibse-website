import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import cloudinary from "cloudinary";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// SUPABASE CLIENT
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);

// CLOUDINARY CONFIG
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// File upload setup
const upload = multer({ storage: multer.memoryStorage() });

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("IIBSE Backend Running Successfully ✔");
});

// START SERVER
app.listen(process.env.PORT || 3000, () =>
  console.log("Server running on port 3000")
);
