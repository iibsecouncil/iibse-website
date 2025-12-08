import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

// ----- SUPER SECURE -----
const SUPABASE_URL = "https://phghqudhsmksakzlsygy.supabase.co";
const SERVICE_ROLE = process.env.SERVICE_ROLE_KEY;

const db = createClient(SUPABASE_URL, SERVICE_ROLE);

// ---------------------------
// 1) ADD NOTICE
// ---------------------------
app.post("/admin/addNotice", async (req, res) => {
  const { title, message } = req.body;

  const { error } = await db.from("notices").insert({ title, message });

  if (error) return res.status(400).json({ error });

  res.json({ success: true });
});

// ---------------------------
// 2) APPROVE SCHOOL
// ---------------------------
app.post("/admin/approveSchool", async (req, res) => {
  const { id } = req.body;

  const { error } = await db
    .from("schools")
    .update({ status: "approved" })
    .eq("id", id);

  if (error) return res.status(400).json({ error });

  res.json({ success: true });
});

// ---------------------------
// 3) SET MODULES
// ---------------------------
app.post("/admin/setModules", async (req, res) => {
  const { id, modules } = req.body;

  const { error } = await db
    .from("schools")
    .update({ approved_modules: modules })
    .eq("id", id);

  if (error) return res.status(400).json({ error });

  res.json({ success: true });
});

app.get("/", (req, res) => {
  res.send("IIBSE Backend Running...");
});

app.listen(3000, () => console.log("SERVER LIVE on PORT 3000"));
