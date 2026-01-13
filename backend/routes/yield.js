import express from "express";
import auth from "../middleware/auth.js";
import db from "../db.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const y = await db.query(
    "SELECT * FROM yield_distributions WHERE user_id=$1",
    [req.user.userId]
  );

  res.json(y.rows);
});

export default router;
