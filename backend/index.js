import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

// SUPABASE CONNECTION
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ------------------ ROUTES ------------------ //

// 1) TEST ROUTE
app.get("/", (req, res) => {
  res.send("IIBSE Backend is running ✔️");
});

// 2) VERIFY STUDENT
app.post("/verify", async (req, res) => {
  const { roll_no } = req.body;

  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("roll_no", roll_no)
    .single();

  // Log
  await supabase.from("verification_logs").insert({
    roll_no,
    status: data ? "found" : "not_found",
    ip_address: req.ip,
  });

  if (error || !data) {
    return res.status(404).json({ success: false, message: "No record found" });
  }

  return res.json({ success: true, student: data });
});

// 3) AFFILIATION FORM SUBMIT
app.post("/affiliation", async (req, res) => {
  const { institute_name, owner_name, phone, email, address, district, document_url } = req.body;

  const { data, error } = await supabase.from("affiliation_requests").insert([
    {
      institute_name,
      owner_name,
      phone,
      email,
      address,
      district,
      document_url,
    },
  ]);

  if (error) {
    return res.status(400).json({ success: false, message: "Error", error });
  }

  return res.json({ success: true, message: "Affiliation submitted" });
});

// ------------------ START SERVER ------------------ //
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`IIBSE Backend running on port ${port}`));
