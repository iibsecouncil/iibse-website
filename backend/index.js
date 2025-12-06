import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 CORRECT PATH — backend/frontend
const FRONTEND_PATH = path.join(__dirname, "frontend");

// Serve frontend folder
app.use(express.static(FRONTEND_PATH));

// Default route → serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(FRONTEND_PATH, "index.html"));
});

app.listen(PORT, () => {
    console.log(`IIBSE Backend running on PORT ${PORT}`);
});
