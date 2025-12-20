import express from "express";

const router = express.Router();

router.get("/advisers", (req, res) => {
  res.json({ status: "ADMIN ROUTE LIVE" });
});

export default router;

