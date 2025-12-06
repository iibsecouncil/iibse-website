import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

// Fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve STATIC FRONTEND FILES
app.use(express.static(path.join(__dirname, "frontend")));

// HOME PAGE
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/index.html"));
});

// TEST API
app.get("/test", (req, res) => {
    res.send("Backend Connected ✔");
});

// STUDENT REGISTRATION API
app.post("/student-register", (req, res) => {
    console.log("Student Data:", req.body);
    res.json({ success: true, message: "Student Registered Successfully!" });
});

// CONTACT FORM API
app.post("/contact-submit", (req, res) => {
    console.log("Contact Form:", req.body);
    res.json({ success: true, message: "Message received!" });
});

// START SERVER
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`IIBSE Backend running on PORT ${PORT}`));
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

// Fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve STATIC FRONTEND FILES
app.use(express.static(path.join(__dirname, "frontend")));

// HOME PAGE
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/index.html"));
});

// TEST API
app.get("/test", (req, res) => {
    res.send("Backend Connected ✔");
});

// STUDENT REGISTRATION API
app.post("/student-register", (req, res) => {
    console.log("Student Data:", req.body);
    res.json({ success: true, message: "Student Registered Successfully!" });
});

// CONTACT FORM API
app.post("/contact-submit", (req, res) => {
    console.log("Contact Form:", req.body);
    res.json({ success: true, message: "Message received!" });
});

// START SERVER
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`IIBSE Backend running on PORT ${PORT}`));
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

// Fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve STATIC FRONTEND FILES
app.use(express.static(path.join(__dirname, "frontend")));

// HOME PAGE
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/index.html"));
});

// TEST API
app.get("/test", (req, res) => {
    res.send("Backend Connected ✔");
});

// STUDENT REGISTRATION API
app.post("/student-register", (req, res) => {
    console.log("Student Data:", req.body);
    res.json({ success: true, message: "Student Registered Successfully!" });
});

// CONTACT FORM API
app.post("/contact-submit", (req, res) => {
    console.log("Contact Form:", req.body);
    res.json({ success: true, message: "Message received!" });
});

// START SERVER
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`IIBSE Backend running on PORT ${PORT}`));
