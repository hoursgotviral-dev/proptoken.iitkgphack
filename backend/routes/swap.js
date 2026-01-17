import express from "express";
import db from "../db.js";
import { authenticateToken } from "../middleware/auth.js";
import { swapTokensForStablecoin } from "../services/blockchain.js";

const router = express.Router();

// Swap Token -> Stablecoin (Instant Liquidity)
router.post("/", authenticateToken, async (req, res) => {
  const { asset_id, amount } = req.body;

  try {
    // 1. Verify Ownership
    const ownerRes = await db.query("SELECT * FROM ownerships WHERE user_id = $1 AND asset_id = $2", [req.user.id, asset_id]);
    if (ownerRes.rows.length === 0 || ownerRes.rows[0].balance < amount) {
      return res.status(400).json({ error: "Insufficient token balance" });
    }

    // 2. Get user wallet address
    const userRes = await db.query("SELECT wallet_address FROM users WHERE id = $1", [req.user.id]);
    const walletAddress = userRes.rows[0]?.wallet_address || req.user.email;

    // 3. Blockchain Swap (REAL or Mock)
    const txResult = await swapTokensForStablecoin(walletAddress, asset_id, amount, req.user.id);
    const { stablecoinReceived, txHash } = txResult;

    await db.query("BEGIN");

    // 4. Deduct Token Balance
    await db.query("UPDATE ownerships SET balance = balance - $1 WHERE user_id = $2 AND asset_id = $3", [amount, req.user.id, asset_id]);

    // 5. Credit Stablecoin
    await db.query("UPDATE wallets SET stablecoin_balance = stablecoin_balance + $1 WHERE user_id = $2", [stablecoinReceived, req.user.id]);

    // 6. Record Swap
    await db.query(
      "INSERT INTO swaps (user_id, asset_id, token_amount, stablecoin_received, tx_hash) VALUES ($1, $2, $3, $4, $5)",
      [req.user.id, asset_id, amount, stablecoinReceived, txHash]
    );

    await db.query("COMMIT");

    res.json({ message: "Swap processing", stablecoinReceived, txHash });

  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Swap failed" });
  }
});

export default router;
