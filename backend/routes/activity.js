import express from "express";
import db from "../db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * Get blockchain activity feed for authenticated user
 */
router.get("/my-activity", authenticateToken, async (req, res) => {
    try {
        const result = await db.query(`
      SELECT 
        ba.id,
        ba.action,
        ba.tx_hash,
        ba.details,
        ba.created_at,
        u.email as user_email
      FROM blockchain_activities ba
      JOIN users u ON ba.user_id = u.id
      WHERE ba.user_id = $1
      ORDER BY ba.created_at DESC
      LIMIT 50
    `, [req.user.id]);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * Get all blockchain activity (Admin/Public feed)
 */
router.get("/feed", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;

        const result = await db.query(`
      SELECT 
        ba.id,
        ba.action,
        ba.tx_hash,
        ba.details,
        ba.created_at,
        u.email as user_email,
        u.wallet_address
      FROM blockchain_activities ba
      JOIN users u ON ba.user_id = u.id
      ORDER BY ba.created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

        res.json({
            activities: result.rows,
            limit,
            offset
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * Get activity by transaction hash
 */
router.get("/tx/:txHash", async (req, res) => {
    try {
        const { txHash } = req.params;

        const result = await db.query(`
      SELECT 
        ba.*,
        u.email as user_email,
        u.wallet_address
      FROM blockchain_activities ba
      JOIN users u ON ba.user_id = u.id
      WHERE ba.tx_hash = $1
    `, [txHash]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * Get activity statistics
 */
router.get("/stats", async (req, res) => {
    try {
        const stats = await db.query(`
      SELECT 
        action,
        COUNT(*) as count,
        MAX(created_at) as last_activity
      FROM blockchain_activities
      GROUP BY action
    `);

        const totalTx = await db.query(`
      SELECT COUNT(*) as total FROM blockchain_activities
    `);

        res.json({
            byAction: stats.rows,
            totalTransactions: parseInt(totalTx.rows[0].total)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
