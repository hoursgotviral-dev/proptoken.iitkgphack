import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getSwapQuote, executeSwap } from '../controllers/swapController.js';

const router = express.Router();

router.get('/quote', authenticateToken, getSwapQuote);
router.post('/execute', authenticateToken, executeSwap);

export default router;
