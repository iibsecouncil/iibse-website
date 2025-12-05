// BACKEND SERVER FOR IIBSE (Clean & Correct)

import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Test route
app.get("/", (req, res) => {
    res.json({ message: "IIBSE Backend is running" });
});

// Student Register API (dummy handler until you create DB)
app.post("/student-register", (req, res) => {
    const data = req.body;

    if (!data.full_name || !data.student_id) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields",
        });
    }

    // TEMP RESPONSE — replace with database logic later
    res.json({
        success: true,
        message: "Student registered successfully",
        received: data
    });
});

// Run server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`IIBSE Backend running on PORT ${PORT}`));
