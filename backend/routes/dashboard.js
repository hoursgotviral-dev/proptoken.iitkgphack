import express from "express";
import auth from "../middleware/auth.js";
import db from "../db.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const equity = await db.query(`
    SELECT COALESCE(SUM(o.balance * a.valuation / af.total_fractions),0) AS equity
    FROM ownerships o
    JOIN tokens t ON t.id=o.token_id
    JOIN assets a ON a.id=t.asset_id
    JOIN asset_fractions af ON af.asset_id=a.id
    WHERE o.user_id=$1
  `, [req.user.userId]);

  const yieldResult = await db.query(`
    SELECT COALESCE(SUM(amount),0) AS monthly
    FROM yield_distributions
    WHERE user_id=$1
  `, [req.user.userId]);

  res.json({
    netEquity: equity.rows[0].equity,
    monthlyYield: yieldResult.rows[0].monthly,
    balance: 150000
  });
});

export default router;
