import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend static files from backend/frontend
const FRONTEND = path.join(__dirname, "frontend");
app.use(express.static(FRONTEND));

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(FRONTEND, "index.html"));
});

// Generic pages (optional)
app.get("/:page", (req, res) => {
  const page = req.params.page;
  const file = path.join(FRONTEND, page);
  res.sendFile(file);
});

// Test
app.get("/test", (req, res) => {
  res.send("Backend Connected ✔");
});

// Student register
app.post("/student-register", (req, res) => {
  console.log("Student Register:", req.body);
  // TODO: save to DB / send email — currently mock success
  return res.json({ success: true, message: "Student Registered Successfully!" });
});

// Contact form
app.post("/contact-submit", (req, res) => {
  console.log("Contact Submit:", req.body);
  return res.json({ success: true, message: "Message received. We'll contact you soon." });
});

// Affiliation form
app.post("/affiliation-submit", (req, res) => {
  console.log("Affiliation Request:", req.body);
  return res.json({ success: true, message: "Affiliation request submitted. We'll review it." });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`IIBSE Backend running on PORT ${PORT}`));
