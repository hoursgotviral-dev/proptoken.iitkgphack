import express from "express";
import db from "../db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get My Yield History (Client)
router.get("/my-history", authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`
        SELECT y.amount, y.distributed_at, a.name as asset_name 
        FROM yield_distributions y
        JOIN rental_income r ON y.rental_income_id = r.id
        JOIN assets a ON r.asset_id = a.id
        WHERE y.user_id = $1
        ORDER BY y.distributed_at DESC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Rental Income (Admin/Builder - Simplified for manual triggering)
router.post("/add-income", authenticateToken, async (req, res) => {
  // In a real app, strict checks on who can add income
  const { asset_id, amount, period_start, period_end } = req.body;

  try {
    await db.query(
      "INSERT INTO rental_income (asset_id, amount, period_start, period_end) VALUES ($1, $2, $3, $4)",
      [asset_id, amount, period_start, period_end]
    );
    res.status(201).json({ message: "Rental income recorded" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
