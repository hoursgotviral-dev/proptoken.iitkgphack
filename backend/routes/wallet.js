import express from "express";
import db from "../db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get Wallet Balance
router.get("/", authenticateToken, async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM wallets WHERE user_id = $1", [req.user.id]);
        if (result.rows.length === 0) {
            // Should exist if registered, but handling just in case
            return res.json({ stablecoin_balance: 0 });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Deposit (Mock)
router.post("/deposit", authenticateToken, async (req, res) => {
    const { amount } = req.body;
    try {
        await db.query("UPDATE wallets SET stablecoin_balance = stablecoin_balance + $1 WHERE user_id = $2", [amount, req.user.id]);
        res.json({ message: "Deposit successful" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
