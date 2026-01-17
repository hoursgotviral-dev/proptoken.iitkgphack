import express from "express";
import db from "../db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get User Dashboard Metrics
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get Wallet Balance
    const walletRes = await db.query("SELECT stablecoin_balance FROM wallets WHERE user_id = $1", [userId]);
    const walletBalance = walletRes.rows[0]?.stablecoin_balance || 0;

    // 2. Calculate Net Equity (Stablecoin + Token Value)
    // Fetches all owned tokens and their current valuation (from assets table)
    const equityRes = await db.query(`
            SELECT o.balance, af.price_per_fraction 
            FROM ownerships o
            JOIN asset_fractions af ON o.asset_id = af.asset_id
            WHERE o.user_id = $1
        `, [userId]);

    let tokenEquity = 0;
    equityRes.rows.forEach(row => {
      tokenEquity += row.balance * row.price_per_fraction;
    });

    const netEquity = parseFloat(walletBalance) + tokenEquity;

    // 3. Total Yield Earned
    const yieldRes = await db.query("SELECT SUM(amount) as total FROM yield_distributions WHERE user_id = $1", [userId]);
    const totalYield = yieldRes.rows[0]?.total || 0;

    res.json({
      walletBalance: parseFloat(walletBalance),
      netEquity,
      tokenEquity,
      totalYield: parseFloat(totalYield)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
