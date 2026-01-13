import express from "express";
import auth from "../middleware/auth.js";
import db from "../db.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const user = await db.query(
    "SELECT id,email FROM users WHERE id=$1",
    [req.user.userId]
  );

  res.json(user.rows[0]);
});

export default router;
