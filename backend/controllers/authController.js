import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts';
import { verifyMessage } from 'viem';
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';


export const registerEmail = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password) return res.status(400).json({ error: "Email and password required" });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "User already exists" });

        // Generate Embedded Wallet (Simulated Custodial)
        // NOTE: In production, encrypt this key using a KMS or use Thirdweb Auth
        const privateKey = generatePrivateKey();
        const account = privateKeyToAccount(privateKey);
        const walletAddress = account.address;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
            walletAddress,
            walletType: 'embedded',
            encryptedPrivateKey: privateKey,
            role: role || 'CLIENT'
        });

        await newUser.save();

        // Initialize Wallet Document
        await new Wallet({ user: newUser._id, address: walletAddress }).save();

        const token = jwt.sign({ id: newUser._id, walletAddress }, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            token,
            user: {
                id: newUser._id,
                email,
                walletAddress,
                type: 'embedded',
                privateKey // Returning only once for demo interaction
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

export const loginEmail = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !user.password) return res.status(400).json({ error: "Invalid credentials" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, walletAddress: user.walletAddress }, JWT_SECRET, { expiresIn: '24h' });

        res.json({ token, user: { id: user._id, email, walletAddress: user.walletAddress, type: 'embedded' } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- External Wallet Flow ---

export const getNonce = async (req, res) => {
    try {
        const { address } = req.query;
        if (!address) return res.status(400).json({ error: "Address required" });

        let user = await User.findOne({ walletAddress: address.toLowerCase() });

        if (!user) {
            // Create skeleton user for external wallet
            user = new User({
                walletAddress: address,
                walletType: 'external'
            });
            await user.save();
            await new Wallet({ user: user._id, address }).save();
        }

        // Update nonce
        user.nonce = Math.floor(Math.random() * 1000000).toString();
        await user.save();

        res.json({ nonce: user.nonce });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const verifySignature = async (req, res) => {
    try {
        const { address, signature } = req.body;

        const user = await User.findOne({ walletAddress: address.toLowerCase() });
        if (!user) return res.status(400).json({ error: "User not found" });

        // Verify
        const valid = await verifyMessage({
            address: address,
            message: `Sign this message to login to PropToken: ${user.nonce}`,
            signature
        });

        if (!valid) return res.status(401).json({ error: "Invalid signature" });

        const token = jwt.sign({ id: user._id, walletAddress: user.walletAddress }, JWT_SECRET, { expiresIn: '24h' });

        res.json({ token, user: { id: user._id, walletAddress: user.walletAddress, type: 'external' } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
