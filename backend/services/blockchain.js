import { ethers } from 'ethers';
import dotenv from 'dotenv';
import db from '../db.js';

dotenv.config();

// Base Sepolia Configuration
const BASE_SEPOLIA_RPC = process.env.BASE_SEPOLIA_RPC || "https://sepolia.base.org";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.RWA_CONTRACT_ADDRESS;

// ERC1155 ABI (minimal for our needs)
const RWA_TOKEN_ABI = [
    "function mintAsset(address to, uint256 totalFractions, string memory metadataURI) public returns (uint256)",
    "function swapTokens(uint256 tokenId, uint256 amount) public",
    "function lockCollateral(uint256 tokenId, uint256 amount) public",
    "function balanceOf(address account, uint256 id) public view returns (uint256)",
    "function uri(uint256 tokenId) public view returns (string memory)",
    "event AssetTokenized(uint256 indexed tokenId, uint256 totalFractions, address indexed owner)",
    "event TokensSwapped(address indexed user, uint256 indexed tokenId, uint256 amount)",
    "event CollateralLocked(address indexed user, uint256 indexed tokenId, uint256 amount)"
];

let provider;
let wallet;
let contract;

// Initialize blockchain connection
function initBlockchain() {
    if (!PRIVATE_KEY || !CONTRACT_ADDRESS) {
        console.warn("⚠️ Blockchain not configured. Using mock mode.");
        return false;
    }

    try {
        provider = new ethers.JsonRpcProvider(BASE_SEPOLIA_RPC);
        wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        contract = new ethers.Contract(CONTRACT_ADDRESS, RWA_TOKEN_ABI, wallet);
        console.log("✅ Blockchain service initialized on Base Sepolia");
        return true;
    } catch (err) {
        console.error("❌ Blockchain initialization failed:", err.message);
        return false;
    }
}

const isBlockchainEnabled = initBlockchain();

/**
 * Log blockchain activity to database
 */
async function logActivity(userId, action, txHash, details) {
    try {
        await db.query(
            `INSERT INTO blockchain_activities (user_id, action, tx_hash, details, created_at) 
       VALUES ($1, $2, $3, $4, NOW())`,
            [userId, action, txHash, JSON.stringify(details)]
        );
    } catch (err) {
        console.error("Failed to log blockchain activity:", err);
    }
}

/**
 * Mint new asset tokens (Real ERC1155 minting)
 */
export const mintToken = async (assetId, fractionCount, ownerAddress, userId) => {
    if (!isBlockchainEnabled) {
        // Fallback to mock
        const mockTxHash = `0x${require('crypto').randomBytes(32).toString('hex')}`;
        await logActivity(userId, 'MINT_MOCK', mockTxHash, { assetId, fractionCount });
        return { txHash: mockTxHash, tokenId: assetId };
    }

    try {
        console.log(`🔨 Minting ${fractionCount} tokens for asset ${assetId}...`);

        const metadataURI = `https://api.proptoken.com/metadata/${assetId}.json`;
        const tx = await contract.mintAsset(ownerAddress, fractionCount, metadataURI);

        console.log(`⏳ Transaction sent: ${tx.hash}`);
        const receipt = await tx.wait();

        console.log(`✅ Tokens minted! Block: ${receipt.blockNumber}`);

        // Log to database
        await logActivity(userId, 'MINT', tx.hash, {
            assetId,
            fractionCount,
            blockNumber: receipt.blockNumber,
            gasUsed: receipt.gasUsed.toString()
        });

        return {
            txHash: tx.hash,
            tokenId: assetId,
            blockNumber: receipt.blockNumber
        };
    } catch (err) {
        console.error("Minting failed:", err);
        throw new Error(`Blockchain minting failed: ${err.message}`);
    }
};

/**
 * Swap tokens for stablecoin
 */
export const swapTokensForStablecoin = async (userAddress, tokenId, amount, userId) => {
    if (!isBlockchainEnabled) {
        const mockTxHash = `0x${require('crypto').randomBytes(32).toString('hex')}`;
        const mockRate = 50;
        await logActivity(userId, 'SWAP_MOCK', mockTxHash, { tokenId, amount });
        return { txHash: mockTxHash, stablecoinReceived: amount * mockRate };
    }

    try {
        console.log(`💱 Swapping ${amount} tokens of ID ${tokenId}...`);

        const tx = await contract.swapTokens(tokenId, amount);
        const receipt = await tx.wait();

        // Mock exchange rate for demo (in production, use oracle)
        const mockRate = 50;
        const stablecoinReceived = amount * mockRate;

        await logActivity(userId, 'SWAP', tx.hash, {
            tokenId,
            amount,
            stablecoinReceived,
            blockNumber: receipt.blockNumber
        });

        return {
            txHash: tx.hash,
            stablecoinReceived,
            blockNumber: receipt.blockNumber
        };
    } catch (err) {
        console.error("Swap failed:", err);
        throw new Error(`Blockchain swap failed: ${err.message}`);
    }
};

/**
 * Lock collateral on-chain
 */
export const lockCollateralOnChain = async (userAddress, tokenId, amount, userId) => {
    if (!isBlockchainEnabled) {
        const mockTxHash = `0x${require('crypto').randomBytes(32).toString('hex')}`;
        await logActivity(userId, 'LOCK_MOCK', mockTxHash, { tokenId, amount });
        return { txHash: mockTxHash, status: 'LOCKED' };
    }

    try {
        console.log(`🔒 Locking ${amount} tokens as collateral...`);

        const tx = await contract.lockCollateral(tokenId, amount);
        const receipt = await tx.wait();

        await logActivity(userId, 'LOCK_COLLATERAL', tx.hash, {
            tokenId,
            amount,
            blockNumber: receipt.blockNumber
        });

        return {
            txHash: tx.hash,
            status: 'LOCKED',
            blockNumber: receipt.blockNumber
        };
    } catch (err) {
        console.error("Collateral lock failed:", err);
        throw new Error(`Blockchain lock failed: ${err.message}`);
    }
};

/**
 * Get blockchain balance
 */
export const getTokenBalance = async (userAddress, tokenId) => {
    if (!isBlockchainEnabled) {
        return 0;
    }

    try {
        const balance = await contract.balanceOf(userAddress, tokenId);
        return Number(balance);
    } catch (err) {
        console.error("Balance check failed:", err);
        return 0;
    }
};

export default {
    mintToken,
    swapTokensForStablecoin,
    lockCollateralOnChain,
    getTokenBalance,
    isBlockchainEnabled
};
