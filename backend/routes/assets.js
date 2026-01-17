import express from "express";
import db from "../db.js";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import { mintToken } from "../services/blockchain.js";

const router = express.Router();

// Get all verified/active assets (Public/investors)
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM assets WHERE status IN ('VERIFIED', 'Active')");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get My Assets (Builder)
router.get("/my-assets", authenticateToken, authorizeRole(['BUILDER']), async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM assets WHERE owner_id = $1", [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get My Tokens/Ownerships (Client) - NEW!
router.get("/my-tokens", authenticateToken, authorizeRole(['CLIENT']), async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        o.id as ownership_id,
        o.balance as tokens_owned,
        a.id as asset_id,
        a.name,
        a.description,
        a.location,
        a.valuation,
        a.status,
        af.price_per_fraction,
        af.total_fractions,
        (o.balance * af.price_per_fraction) as investment_value
      FROM ownerships o
      JOIN assets a ON o.asset_id = a.id
      JOIN asset_fractions af ON a.id = af.asset_id
      WHERE o.user_id = $1 AND o.balance > 0
      ORDER BY o.id DESC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Asset (Builder)
router.post("/", authenticateToken, authorizeRole(['BUILDER']), async (req, res) => {
  const { name, description, location, valuation } = req.body;

  if (!name || !valuation) return res.status(400).json({ error: "Missing fields" });

  try {
    const result = await db.query(
      "INSERT INTO assets (owner_id, name, description, location, valuation) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [req.user.id, name, description, location, valuation]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Tokenize Asset (Admin or automated post-verification)
// Simulating an admin endpoint or self-service for demo
router.post("/:id/tokenize", authenticateToken, authorizeRole(['ADMIN', 'BUILDER']), async (req, res) => {
  const { id } = req.params; // assetId
  const { total_fractions, price_per_fraction } = req.body;

  try {
    // 1. Check ownership & status
    const assetRes = await db.query("SELECT * FROM assets WHERE id = $1", [id]);
    if (assetRes.rows.length === 0) return res.status(404).json({ error: "Asset not found" });
    const asset = assetRes.rows[0];

    if (asset.owner_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (asset.status === 'Active') return res.status(400).json({ error: "Already tokenized" });

    // 2. Create fractions record
    await db.query(
      "INSERT INTO asset_fractions (asset_id, total_fractions, price_per_fraction, available_fractions) VALUES ($1, $2, $3, $4)",
      [id, total_fractions, price_per_fraction, total_fractions]
    );

    // 3. Mint on blockchain (REAL or Mock based on configuration)
    // Get user wallet address
    const userRes = await db.query("SELECT wallet_address FROM users WHERE id = $1", [req.user.id]);
    const walletAddress = userRes.rows[0]?.wallet_address || req.user.email; // Fallback to email if no wallet

    const blockchainRes = await mintToken(id, total_fractions, walletAddress, req.user.id);

    // 4. Update asset status
    await db.query("UPDATE assets SET status = 'Active' WHERE id = $1", [id]);

    res.json({
      message: "Asset tokenized",
      txHash: blockchainRes.txHash,
      blockNumber: blockchainRes.blockNumber,
      tokenId: blockchainRes.tokenId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Buy Identity/Token (Client)
router.post("/:id/buy", authenticateToken, authorizeRole(['CLIENT']), async (req, res) => {
  const { id } = req.params; // assetId
  const { fractions } = req.body;

  // Transaction logic needed here
  // Verify balance -> Deduct Stablecoin -> Add Tokens -> Update Fractions
  // For MVP, simplified:

  try {
    const fractionRes = await db.query("SELECT * FROM asset_fractions WHERE asset_id = $1", [id]);
    if (fractionRes.rows.length === 0) return res.status(404).json({ error: "Asset not tokenized" });

    const fractionData = fractionRes.rows[0];
    const cost = fractionData.price_per_fraction * fractions;

    if (fractionData.available_fractions < fractions) {
      return res.status(400).json({ error: "Not enough fractions available" });
    }

    // Check wallet
    const walletRes = await db.query("SELECT * FROM wallets WHERE user_id = $1", [req.user.id]);
    const wallet = walletRes.rows[0];

    if (parseFloat(wallet.stablecoin_balance) < cost) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // EXECUTE TRADE
    await db.query("BEGIN");

    // 1. Deduct Balance
    await db.query("UPDATE wallets SET stablecoin_balance = stablecoin_balance - $1 WHERE user_id = $2", [cost, req.user.id]);

    // 2. Update Fractions
    await db.query("UPDATE asset_fractions SET available_fractions = available_fractions - $1 WHERE asset_id = $2", [fractions, id]);

    // 3. Give Ownership
    const ownerCheck = await db.query("SELECT * FROM ownerships WHERE user_id = $1 AND asset_id = $2", [req.user.id, id]);

    if (ownerCheck.rows.length > 0) {
      await db.query("UPDATE ownerships SET balance = balance + $1 WHERE user_id = $2 AND asset_id = $3", [fractions, req.user.id, id]);
    } else {
      await db.query("INSERT INTO ownerships (user_id, asset_id, balance) VALUES ($1, $2, $3)", [req.user.id, id, fractions]);
    }

    await db.query("COMMIT");

    res.json({ message: "Purchase successful" });

  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
