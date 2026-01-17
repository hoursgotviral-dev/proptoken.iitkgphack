import express from "express";
import db from "../db.js";
import { authenticateToken } from "../middleware/auth.js";
import { lockCollateralOnChain } from "../services/blockchain.js";

const router = express.Router();

// Lock Tokens as Collateral
router.post("/lock", authenticateToken, async (req, res) => {
  const { asset_id, amount } = req.body;

  // Mock valuation: 1 token = $100 value for collateral
  const MOCK_VALUATION = 100;

  try {
    // 1. Check Ownership
    const ownerRes = await db.query("SELECT * FROM ownerships WHERE user_id = $1 AND asset_id = $2", [req.user.id, asset_id]);
    if (ownerRes.rows.length === 0 || ownerRes.rows[0].balance < amount) {
      return res.status(400).json({ error: "Insufficient tokens" });
    }

    // 2. Get user wallet address
    const userRes = await db.query("SELECT wallet_address FROM users WHERE id = $1", [req.user.id]);
    const walletAddress = userRes.rows[0]?.wallet_address || req.user.email;

    // 3. Call Blockchain (REAL or Mock)
    const txResult = await lockCollateralOnChain(walletAddress, asset_id, amount, req.user.id);

    await db.query("BEGIN");

    // 4. Deduct from Available (Simulating lock by removing from balance, or moving to a 'locked' field)
    // For simplicity, we deduct from main balance and add to collaterals table
    await db.query("UPDATE ownerships SET balance = balance - $1 WHERE user_id = $2 AND asset_id = $3", [amount, req.user.id, asset_id]);

    // 5. Store Collateral Record
    const collateralValue = amount * MOCK_VALUATION;
    await db.query(
      "INSERT INTO collaterals (user_id, asset_id, locked_token_amount, collateral_value, status) VALUES ($1, $2, $3, $4, $5)",
      [req.user.id, asset_id, amount, collateralValue, 'LOCKED']
    );

    await db.query("COMMIT");

    res.json({ message: "Collateral locked", collateralValue, txHash: txResult.txHash });

  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Collateral lock failed" });
  }
});

// Pay with Collateral (Mock)
router.post("/pay", authenticateToken, async (req, res) => {
  // Logic to use the locked collateral credit to pay for something
  res.json({ message: "Payment functionality mocked" });
});

export default router;
