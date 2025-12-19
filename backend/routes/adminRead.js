import express from "express";
import { requireAdmin } from "../utils/auth.js";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

/* ===== ADVISERS ===== */
router.get("/advisers", requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from("advisers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/* ===== SCHOOLS ===== */
router.get("/schools", requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from("schools")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/* ===== PAYMENTS ===== */
router.get("/payments", requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
