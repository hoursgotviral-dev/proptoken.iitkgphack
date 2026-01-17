# 🎬 DEMO GUIDE - PropToken RWA Backend

## 🎯 Demo Overview

This demo showcases the complete RWA tokenization flow from asset creation to trading.

---

## 📋 Demo Flow (13 Steps)

### **STEP 1: Register BUILDER** 👷
- Creates a BUILDER account
- Email: `demo.builder@proptoken.com`
- Role: BUILDER (can create assets)

### **STEP 2: BUILDER Login** 🔐
- Authenticates BUILDER
- Receives JWT token
- Token valid for 24 hours

### **STEP 3: Create Real Estate Asset** 🏠
- BUILDER creates luxury property
- Asset: "Luxury Penthouse Mumbai"
- Valuation: Rs. 5,00,00,000

### **STEP 4: Tokenize Asset** 🪙
- **BLOCKCHAIN MINTING!**
- Creates 1,000 tokens
- Price: Rs. 50,000 per token
- Generates transaction hash

### **STEP 5: Register CLIENT** 👤
- Creates investor account
- Email: `demo.client@proptoken.com`
- Role: CLIENT (can buy tokens)

### **STEP 6: CLIENT Login** 🔐
- Authenticates CLIENT
- Receives separate JWT token
- Different permissions than BUILDER

### **STEP 7: Deposit Funds** 💰
- CLIENT deposits Rs. 10,00,000
- Mock deposit for demo
- Ready to invest

### **STEP 8: Buy Tokens** 🛒
- CLIENT purchases 10 tokens
- Cost: Rs. 5,00,000
- Now owns fractional real estate!

### **STEP 9: View My Tokens** 📊
- **NEW FEATURE!**
- CLIENT views owned tokens
- Shows investment value
- Portfolio display

### **STEP 10: Swap Tokens** 💱
- CLIENT swaps 5 tokens
- Receives stablecoin
- Instant liquidity!

### **STEP 11: Lock Collateral** 🔒
- CLIENT locks 3 tokens
- Can use for payments
- Blockchain transaction

### **STEP 12: Activity Feed** 📝
- **NEW FEATURE!**
- Shows all blockchain transactions
- Transaction hashes
- Complete audit trail

### **STEP 13: Dashboard** 📈
- CLIENT's portfolio metrics
- Wallet balance
- Token equity
- Net worth

---

## 🎯 What This Demonstrates

### ✅ **Multi-User System**
- Different roles (BUILDER/CLIENT)
- Separate authentication
- Role-based permissions

### ✅ **Asset Tokenization**
- Real estate → Digital tokens
- Fractional ownership
- Blockchain integration

### ✅ **Trading Features**
- Buy tokens
- Swap for liquidity
- Lock as collateral

### ✅ **Transparency**
- Activity feed
- Transaction history
- Portfolio tracking

### ✅ **Fintech Experience**
- Wallet management
- Dashboard metrics
- Real-time updates

---

## 🚀 Running the Demo

### Quick Run
```bash
cmd /c demo.bat
```

### Manual Steps
1. Open terminal in backend folder
2. Run: `demo.bat`
3. Press any key to advance through steps
4. Watch the magic happen! ✨

---

## 📊 Demo Results

After completion, you'll have:
- ✅ 2 users created (BUILDER + CLIENT)
- ✅ 1 asset created and tokenized
- ✅ Tokens purchased
- ✅ Tokens swapped
- ✅ Collateral locked
- ✅ Multiple blockchain transactions
- ✅ Complete activity history

---

## 🎓 For Presentations

### Key Points to Highlight:

1. **"Real-World Asset Tokenization"**
   - Show asset creation
   - Explain fractional ownership

2. **"Blockchain Integration"**
   - Point out transaction hashes
   - Mention Base Sepolia ready

3. **"Instant Liquidity"**
   - Demonstrate token swapping
   - No need to sell entire asset

4. **"Collateralization"**
   - Use tokens for payments
   - Unlock asset value

5. **"Complete Transparency"**
   - Show activity feed
   - All transactions logged

6. **"Production Ready"**
   - Mock mode for demo
   - Real blockchain ready

---

## 💡 Demo Tips

### Before Demo:
- ✅ Ensure server is running (`npm start`)
- ✅ Database is connected
- ✅ Port 3003 is available

### During Demo:
- 📖 Read the descriptions
- ⏸️ Pause between steps
- 💬 Explain what's happening
- 🎯 Highlight key features

### After Demo:
- 📊 Show activity feed
- 📈 Display dashboard
- 🎉 Emphasize completeness

---

## 🔧 Troubleshooting

### "Server not responding"
```bash
# Check server status
curl http://localhost:3003
```

### "User already exists"
- Normal! Demo can run multiple times
- Users persist in database
- Still works fine

### "Purchase failed"
- Check wallet has funds
- Verify asset is tokenized
- Check token availability

---

## 📝 Demo Script (What to Say)

**Opening:**
> "I'm going to demonstrate our RWA tokenization platform that brings real estate to the blockchain."

**Step 1-2:**
> "First, a property developer (BUILDER) registers and logs in."

**Step 3-4:**
> "They create a luxury property worth 5 crores and tokenize it into 1,000 fractions. This happens on the blockchain!"

**Step 5-6:**
> "Now an investor (CLIENT) registers and logs in."

**Step 7-8:**
> "They deposit funds and purchase 10 tokens for 5 lakhs. They now own fractional real estate!"

**Step 9:**
> "They can view their token portfolio anytime."

**Step 10:**
> "Need liquidity? Swap tokens instantly for stablecoin without selling the entire asset."

**Step 11:**
> "Or use tokens as collateral for payments."

**Step 12:**
> "Everything is transparent - all blockchain transactions are logged in the activity feed."

**Step 13:**
> "The dashboard shows complete portfolio metrics."

**Closing:**
> "This is a production-ready backend with real blockchain integration, ready to deploy to Base Sepolia!"

---

## ✅ Success Criteria

Demo is successful if you show:
- ✅ Multi-role authentication
- ✅ Asset creation & tokenization
- ✅ Blockchain transactions
- ✅ Token trading
- ✅ Activity tracking
- ✅ Portfolio management

---

## 🎉 Demo Complete!

Your backend demonstrates:
- Complete RWA tokenization flow
- Blockchain integration
- Multi-user system
- Trading features
- Transparency & tracking
- Production-ready code

**Perfect for hackathon presentations!** 🚀
