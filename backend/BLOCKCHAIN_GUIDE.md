# RWA Backend - Blockchain Integration Guide

## 🎯 Features Implemented

### 1. **Base Sepolia Deployment**
- ERC1155 smart contract for RWA tokenization
- Hardhat configuration for Base Sepolia testnet
- Automated deployment and verification scripts

### 2. **Real Token Minting**
- Actual on-chain ERC1155 token minting
- Fallback to mock mode if blockchain not configured
- Activity logging for all blockchain transactions

### 3. **Blockchain Activity Feed**
- Real-time transaction tracking
- User-specific activity history
- Public activity feed with pagination
- Transaction lookup by hash
- Activity statistics dashboard

---

## 📋 Setup Instructions

### Step 1: Install Contract Dependencies
```bash
cd backend/contracts
npm install
```

### Step 2: Configure Environment Variables
Add to `backend/.env`:
```env
# Blockchain Configuration
BASE_SEPOLIA_RPC=https://sepolia.base.org
PRIVATE_KEY=your_wallet_private_key_here
BASESCAN_API_KEY=your_basescan_api_key

# Will be set after deployment
RWA_CONTRACT_ADDRESS=
```

### Step 3: Get Test ETH
1. Visit [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
2. Enter your wallet address
3. Receive test ETH for gas fees

### Step 4: Deploy Smart Contract
```bash
cd backend/contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network baseSepolia
```

After deployment, copy the contract address to `.env`:
```env
RWA_CONTRACT_ADDRESS=0x...
```

### Step 5: Run Database Migration
```bash
cd backend
psql -U postgres -d onblock -f migrations/add_blockchain_activity.sql
```

Or manually run the SQL in your database client.

### Step 6: Restart Backend
```bash
npm start
```

---

## 🔌 API Endpoints

### Blockchain Activity Feed

#### Get My Activity
```http
GET /activity/my-activity
Authorization: Bearer <token>
```

Response:
```json
[
  {
    "id": 1,
    "action": "MINT",
    "tx_hash": "0x123...",
    "details": {
      "assetId": 1,
      "fractionCount": 1000,
      "blockNumber": 12345
    },
    "created_at": "2026-01-17T10:00:00Z",
    "user_email": "builder@example.com"
  }
]
```

#### Get Public Activity Feed
```http
GET /activity/feed?limit=20&offset=0
```

#### Get Transaction Details
```http
GET /activity/tx/0x123...
```

#### Get Activity Statistics
```http
GET /activity/stats
```

---

## 🧪 Testing

### Test Real Minting (if blockchain configured)
```bash
curl -X POST http://localhost:4000/assets/1/tokenize \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "total_fractions": 1000,
    "price_per_fraction": 100
  }'
```

### View Activity Feed
```bash
curl http://localhost:4000/activity/feed
```

---

## 🔍 Verification

### Check Contract on BaseScan
After deployment, visit:
```
https://sepolia.basescan.org/address/YOUR_CONTRACT_ADDRESS
```

### Monitor Transactions
All blockchain transactions are logged in the `blockchain_activities` table and accessible via the activity feed API.

---

## 🚀 Production Checklist

- [ ] Deploy contract to Base Mainnet
- [ ] Update RPC URL to mainnet
- [ ] Secure private key (use AWS Secrets Manager / Vault)
- [ ] Set up monitoring for failed transactions
- [ ] Implement retry logic for blockchain calls
- [ ] Add rate limiting to prevent spam
- [ ] Set up webhook notifications for on-chain events

---

## 📝 Notes

- **Mock Mode**: If `PRIVATE_KEY` or `RWA_CONTRACT_ADDRESS` is not set, the system automatically falls back to mock blockchain operations
- **Gas Optimization**: Contract uses OpenZeppelin's optimized ERC1155 implementation
- **Activity Logging**: All blockchain operations (real or mock) are logged to the database for auditing

---

## 🆘 Troubleshooting

### "Blockchain not configured" warning
- Ensure `PRIVATE_KEY` and `RWA_CONTRACT_ADDRESS` are set in `.env`
- Restart the backend server

### Transaction fails
- Check wallet has sufficient ETH for gas
- Verify RPC URL is correct
- Check BaseScan for transaction details

### Contract verification fails
- Wait 30 seconds after deployment
- Ensure `BASESCAN_API_KEY` is correct
- Manually verify at https://sepolia.basescan.org/verifyContract
