import express from "express";
import cors from "cors";
import path from "path";

const app = express();
app.use(express.json());
app.use(cors());

// Resolve current directory
const __dirname = path.resolve();

// ⭐ Serve Frontend Folder
app.use(express.static(path.join(__dirname, "frontend")));

// Default route → serve frontend index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// ⭐ Student Register API
app.post("/student-register", (req, res) => {
    const data = req.body;

    if (!data.full_name || !data.student_id) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields",
        });
    }

    res.json({
        success: true,
        message: "Student registered successfully",
        received: data
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`IIBSE Backend running on PORT ${PORT}`));
