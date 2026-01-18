import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Wallet from '../models/Wallet.js';

const router = express.Router();

// Get Wallet Balance & Details
router.get('/', authenticateToken, async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ user: req.user.id });
        if (!wallet) {
            // Fallback: This might happen if user was created but wallet init failed (rare)
            return res.status(404).json({ error: "Wallet not found for this user" });
        }
        res.json(wallet);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Deposit (Mock for Testing)
router.post('/deposit', authenticateToken, async (req, res) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });

    try {
        let wallet = await Wallet.findOne({ user: req.user.id });
        if (!wallet) return res.status(404).json({ error: "Wallet not found" });

        wallet.stablecoinBalance += Number(amount);

        // Add history
        wallet.txHistory = wallet.txHistory || [];
        wallet.txHistory.push({
            type: 'DEPOSIT',
            amount: Number(amount),
            date: new Date()
        });

        await wallet.save();

        res.json({ message: "Deposit successful", balance: wallet.stablecoinBalance });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
