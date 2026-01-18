import express from 'express';
import { registerEmail, loginEmail, getNonce, verifySignature } from '../controllers/authController.js';

const router = express.Router();

// Hybrid Authentication Routes

// Non-crypto users
router.post('/register', registerEmail);
router.post('/login', loginEmail);

// Crypto users (Wallet-based)
router.get('/nonce', getNonce); // GET /auth/nonce?address=0x...
router.post('/login-wallet', verifySignature);

export default router;
