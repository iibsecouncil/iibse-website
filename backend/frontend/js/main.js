import express from "express";
import cors from "cors";
import path from "path";

const app = express();
app.use(express.json());
app.use(cors());

const __dirname = path.resolve();

// Serve frontend folder (root/frontend)
app.use(express.static(path.join(__dirname, "frontend")));

// Home route -> frontend/index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Student register API
app.post("/student-register", (req, res) => {
  const data = req.body;
  if (!data.full_name || !data.student_id) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }
  res.json({ success: true, message: "Student registered successfully", received: data });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`IIBSE Backend running on PORT ${PORT}`));
