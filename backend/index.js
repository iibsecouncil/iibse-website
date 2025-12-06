import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 10000;

// Fix dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// FRONTEND FOLDER PATH (THIS IS CORRECT NOW)
const FRONTEND = path.join(__dirname, "frontend");

// Allow JSON body
app.use(express.json());

// Serve frontend folder
app.use(express.static(FRONTEND));

// DEFAULT ROUTE → OPEN index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(FRONTEND, "index.html"));
});

// Serve ALL HTML pages automatically
app.get("/:page", (req, res) => {
    res.sendFile(path.join(FRONTEND, req.params.page));
});

// Simple API test
app.get("/test", (req, res) => {
    res.send("Backend API Working ✔");
});

// START SERVER
app.listen(PORT, () => {
    console.log(`IIBSE Backend running on PORT ${PORT}`);
});
