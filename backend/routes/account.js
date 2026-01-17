import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import db from "../db.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  const user = await db.query(
    "SELECT id,email,role FROM users WHERE id=$1",
    [req.user.id]
  );

  if (user.rows.length === 0) return res.status(404).json({ error: "User not found" });

  res.json(user.rows[0]);
});

export default router;
