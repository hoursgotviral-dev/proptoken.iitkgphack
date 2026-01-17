# Blockchain Integration - Quick Start

## ✅ What's Been Implemented

### 1. **Smart Contract (ERC1155)**
- Location: `backend/contracts/RWAToken.sol`
- Features: Mint, Swap, Lock Collateral
- Network: Base Sepolia Testnet

### 2. **Real Blockchain Service**
- Location: `backend/services/blockchain.js`
- Uses ethers.js v6
- Auto-fallback to mock if not configured
- Activity logging for all transactions

### 3. **Activity Feed API**
- Location: `backend/routes/activity.js`
- Endpoints:
  - `GET /activity/my-activity` - User's transactions
  - `GET /activity/feed` - Public feed
  - `GET /activity/tx/:txHash` - Transaction details
  - `GET /activity/stats` - Statistics

### 4. **Updated Routes**
- `assets.js` - Real token minting
- `swap.js` - Real swap transactions
- `collateral.js` - Real collateral locking

---

## 🚀 Quick Deploy (5 Minutes)

### Step 1: Get Test ETH
```bash
# Visit: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
# Enter your wallet address
# Get 0.1 ETH for gas
```

### Step 2: Set Environment Variables
Add to `backend/.env`:
```env
# Your wallet private key (NEVER commit this!)
PRIVATE_KEY=0x...

# Base Sepolia RPC (default works)
BASE_SEPOLIA_RPC=https://sepolia.base.org

# Optional: BaseScan API for verification
BASESCAN_API_KEY=your_key_here
```

### Step 3: Deploy Contract
```bash
cd backend/contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network baseSepolia
```

**Copy the contract address from output!**

### Step 4: Update Backend Config
Add to `backend/.env`:
```env
RWA_CONTRACT_ADDRESS=0x... # from deployment
```

### Step 5: Run Migration
```bash
cd backend
# Run the SQL migration
psql -U postgres -d onblock -f migrations/add_blockchain_activity.sql

# OR manually execute the SQL in your DB client
```

### Step 6: Restart Backend
```bash
npm start
```

You should see:
```
✅ Blockchain service initialized on Base Sepolia
📅 Yield Cron Job Scheduled
🚀 Server running on http://localhost:4000
```

---

## 🧪 Test It

### 1. Register & Login
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"builder@test.com","password":"pass123","role":"BUILDER"}'

# Save the token from response
```

### 2. Create Asset
```bash
curl -X POST http://localhost:4000/assets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Luxury Apartment",
    "description":"2BHK in Mumbai",
    "location":"Mumbai",
    "valuation":5000000
  }'
```

### 3. Tokenize Asset (REAL BLOCKCHAIN!)
```bash
curl -X POST http://localhost:4000/assets/1/tokenize \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "total_fractions":1000,
    "price_per_fraction":5000
  }'
```

**This will:**
- Mint real ERC1155 tokens on Base Sepolia
- Return transaction hash
- Log to blockchain_activities table

### 4. Check Activity Feed
```bash
curl http://localhost:4000/activity/feed
```

### 5. View on BaseScan
```
https://sepolia.basescan.org/tx/YOUR_TX_HASH
```

---

## 📊 Database Schema

The migration adds:
```sql
CREATE TABLE blockchain_activities (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  tx_hash VARCHAR(255) NOT NULL,
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ADD COLUMN wallet_address VARCHAR(42);
```

---

## 🔧 Troubleshooting

### "Blockchain not configured" Warning
✅ **Normal!** System works in mock mode without blockchain config.

To enable real blockchain:
1. Set `PRIVATE_KEY` in `.env`
2. Set `RWA_CONTRACT_ADDRESS` in `.env`
3. Restart server

### Transaction Fails
- Check wallet has ETH: https://sepolia.basescan.org/address/YOUR_ADDRESS
- Verify RPC URL is correct
- Check contract address is valid

### Can't See Transactions
- Wait 10-30 seconds for block confirmation
- Check BaseScan for transaction status
- View activity feed: `GET /activity/feed`

---

## 📝 Next Steps

1. **Add Wallet Connect** - Let users connect MetaMask
2. **Event Listeners** - Listen for on-chain events
3. **Mainnet Deploy** - Deploy to Base Mainnet
4. **Oracle Integration** - Real-time asset pricing
5. **Multi-sig** - Add admin multi-signature for minting

---

## 🎉 You're Done!

Your backend now supports:
- ✅ Real ERC1155 token minting on Base Sepolia
- ✅ Blockchain activity tracking
- ✅ Automatic fallback to mock mode
- ✅ Complete transaction history

Check `BLOCKCHAIN_GUIDE.md` for detailed documentation!
