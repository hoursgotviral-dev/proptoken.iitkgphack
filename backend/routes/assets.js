import express from "express";
import auth from "../middleware/auth.js";
import db from "../db.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { type, location, valuation } = req.body;

  const asset = await db.query(
    `INSERT INTO assets(owner_id,type,location,valuation,status)
     VALUES($1,$2,$3,$4,'PENDING') RETURNING *`,
    [req.user.userId, type, location, valuation]
  );

  res.json(asset.rows[0]);
});

router.get("/", async (_, res) => {
  const assets = await db.query("SELECT * FROM assets");
  res.json(assets.rows);
});

export default router;
