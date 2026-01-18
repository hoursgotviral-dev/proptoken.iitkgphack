import { getQuote, getSwapCallData } from '../services/oneInchService.js';
import User from '../models/User.js';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';

// Chain ID for Base is 8453
const CHAIN_ID = 8453;

export const getSwapQuote = async (req, res) => {
    try {
        const { src, dst, amount } = req.query;
        if (!src || !dst || !amount) return res.status(400).json({ error: "Missing params" });

        // Mock response if API Key is missing for demo purposes
        if (!process.env.ONEINCH_API_KEY) {
            return res.json({
                toAmount: amount * 1.5, // Mock rate
                estimatedGas: 500000
            });
        }

        const quote = await getQuote(CHAIN_ID, src, dst, amount);
        res.json(quote);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const executeSwap = async (req, res) => {
    try {
        const { src, dst, amount, slippage } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Fallback if no API Key (Simulation)
        if (!process.env.ONEINCH_API_KEY) {
            if (user.walletType === 'external') {
                return res.json({ type: 'external', tx: { to: dst, data: '0xmock', value: '0' } });
            } else {
                return res.json({ type: 'embedded', txHash: '0xmockhash', message: "Swap Simulated" });
            }
        }

        // 1. Get Calldata from 1inch
        const swapData = await getSwapCallData(CHAIN_ID, src, dst, amount, user.walletAddress, slippage || 1);

        if (user.walletType === 'external') {
            // Type 1: External Wallet (Return data for Frontend to sign)
            return res.json({
                type: 'external',
                tx: swapData.tx
            });
        } else {
            // Type 2: Embedded Wallet (Server signs & sends)

            if (!user.encryptedPrivateKey) {
                return res.status(400).json({ error: "No private key found for embedded wallet" });
            }

            // In production: Decrypt the key here!
            const privateKey = user.encryptedPrivateKey;
            const account = privateKeyToAccount(privateKey);

            const client = createWalletClient({
                account,
                chain: base,
                transport: http()
            });

            // Execute transaction
            const txHash = await client.sendTransaction({
                to: swapData.tx.to,
                data: swapData.tx.data,
                value: BigInt(swapData.tx.value),
            });

            return res.json({
                type: 'embedded',
                txHash,
                message: "Swap executed successfully via Embedded Wallet"
            });
        }

    } catch (err) {
        console.error("Swap Error:", err);
        res.status(500).json({ error: err.message });
    }
};
