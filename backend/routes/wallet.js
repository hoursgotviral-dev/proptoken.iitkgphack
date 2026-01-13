import express from "express";
import auth from "../middleware/auth.js";
import db from "../db.js";

const router = express.Router();

router.post("/connect", auth, async (req, res) => {
  const { address, chain_id } = req.body;

  await db.query(
    `INSERT INTO wallets(user_id,address,chain_id)
     VALUES($1,$2,$3)
     ON CONFLICT (user_id,chain_id) DO UPDATE SET address=$2`,
    [req.user.userId, address, chain_id]
  );

  res.json({ success: true });
});

export default router;
