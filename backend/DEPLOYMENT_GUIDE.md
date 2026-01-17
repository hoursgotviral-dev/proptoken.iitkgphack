# 🚀 Base Sepolia Deployment Guide

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:
- [ ] MetaMask or similar wallet installed
- [ ] Test ETH on Base Sepolia (from faucet)
- [ ] Private key exported from wallet
- [ ] BaseScan API key (optional, for verification)

---

## Step 1: Get Test ETH

### Option A: Coinbase Faucet (Recommended)
1. Visit: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
2. Connect your wallet
3. Request 0.1 ETH (free)
4. Wait 1-2 minutes for confirmation

### Option B: Alternative Faucets
- https://www.alchemy.com/faucets/base-sepolia
- https://faucet.quicknode.com/base/sepolia

---

## Step 2: Export Your Private Key

### From MetaMask:
1. Open MetaMask
2. Click three dots → Account Details
3. Click "Show Private Key"
4. Enter password
5. Copy the private key (starts with 0x)

⚠️ **NEVER share or commit this key!**

---

## Step 3: Configure Environment

Open `backend/.env` and add:

```env
# Blockchain Configuration
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
BASE_SEPOLIA_RPC=https://sepolia.base.org
BASESCAN_API_KEY=YOUR_API_KEY_HERE

# Will be filled after deployment
RWA_CONTRACT_ADDRESS=
```

### Get BaseScan API Key (Optional):
1. Visit: https://basescan.org/register
2. Create account
3. Go to API Keys → Create New Key
4. Copy and paste above

---

## Step 4: Install Contract Dependencies

```bash
cd backend/contracts
npm install
```

This installs:
- Hardhat
- OpenZeppelin contracts
- Ethers.js
- Hardhat toolbox

---

## Step 5: Compile Smart Contract

```bash
npx hardhat compile
```

Expected output:
```
Compiled 1 Solidity file successfully
```

---

## Step 6: Deploy to Base Sepolia

```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

Expected output:
```
Deploying RWAToken to Base Sepolia...
✅ RWAToken deployed to: 0x1234...5678
🔗 View on BaseScan: https://sepolia.basescan.org/address/0x1234...5678
📄 Deployment info saved to deployment.json
⏳ Waiting 30 seconds before verification...
✅ Contract verified on BaseScan
```

**IMPORTANT**: Copy the contract address!

---

## Step 7: Update Backend Configuration

Add the contract address to `backend/.env`:

```env
RWA_CONTRACT_ADDRESS=0x1234...5678
```

---

## Step 8: Restart Backend

```bash
cd ..
npm start
```

You should see:
```
✅ Blockchain service initialized on Base Sepolia
📅 Yield Cron Job Scheduled
🚀 Server running on http://localhost:4000
```

---

## Step 9: Test Real Blockchain Minting

### Register & Login
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"builder@test.com","password":"pass123","role":"BUILDER"}'

curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"builder@test.com","password":"pass123"}'
```

Save the token from response.

### Create Asset
```bash
curl -X POST http://localhost:4000/assets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Luxury Apartment Mumbai",
    "description":"3BHK Premium",
    "location":"Mumbai",
    "valuation":5000000
  }'
```

### Tokenize (REAL BLOCKCHAIN!)
```bash
curl -X POST http://localhost:4000/assets/1/tokenize \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "total_fractions":1000,
    "price_per_fraction":5000
  }'
```

This will:
- ✅ Mint real ERC1155 tokens on Base Sepolia
- ✅ Return actual transaction hash
- ✅ Log to blockchain_activities table

---

## Step 10: Verify on BaseScan

1. Copy the `txHash` from response
2. Visit: `https://sepolia.basescan.org/tx/YOUR_TX_HASH`
3. See your transaction on-chain! 🎉

---

## 🎯 What You'll See on BaseScan

- **Transaction Hash**: Unique identifier
- **Block Number**: Confirmation block
- **From**: Your wallet address
- **To**: RWAToken contract address
- **Status**: Success ✅
- **Gas Used**: ~150,000 gas
- **Function**: mintAsset(address,uint256,string)

---

## 📊 Check Activity Feed

```bash
curl http://localhost:4000/activity/feed
```

You'll see:
```json
{
  "activities": [
    {
      "id": 1,
      "action": "MINT",
      "tx_hash": "0xabc...123",
      "details": {
        "assetId": 1,
        "fractionCount": 1000,
        "blockNumber": 12345,
        "gasUsed": "150000"
      },
      "created_at": "2026-01-17T10:45:00Z"
    }
  ]
}
```

---

## 🔧 Troubleshooting

### "Insufficient funds for gas"
- Get more test ETH from faucet
- Check balance: https://sepolia.basescan.org/address/YOUR_ADDRESS

### "Invalid private key"
- Ensure it starts with 0x
- No spaces or quotes in .env file
- Use the private key, not public address

### "Contract deployment failed"
- Check RPC URL is correct
- Verify you have test ETH
- Try again (network might be congested)

### "Transaction reverted"
- Check contract is deployed
- Verify RWA_CONTRACT_ADDRESS is set
- Ensure wallet has ETH for gas

---

## 🎉 Success Checklist

- [ ] Contract deployed to Base Sepolia
- [ ] Contract verified on BaseScan
- [ ] Backend configured with contract address
- [ ] Server restarted
- [ ] Test minting successful
- [ ] Transaction visible on BaseScan
- [ ] Activity feed showing blockchain events

---

## 🚀 Next Steps

1. **Test All Features**
   - Token swapping
   - Collateral locking
   - Multiple users

2. **Monitor Gas Usage**
   - Check transaction costs
   - Optimize if needed

3. **Prepare for Mainnet**
   - Get real ETH
   - Deploy to Base Mainnet
   - Update RPC URL

---

## 📝 Important Notes

- **Test Network**: This is Base Sepolia (testnet)
- **Free**: All transactions use test ETH (no real money)
- **Public**: Anyone can view transactions on BaseScan
- **Reversible**: Can redeploy anytime

---

## 🆘 Need Help?

Check these files:
- `QUICK_START.md` - Quick reference
- `BLOCKCHAIN_GUIDE.md` - Detailed docs
- `TEST_RESULTS.md` - Verification report

---

**Ready to deploy? Follow the steps above! 🚀**
