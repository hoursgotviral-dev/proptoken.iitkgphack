<<<<<<< HEAD
# 🏠 PropToken - RWA Backend

> Production-grade backend for Real-World Asset tokenization on Base Sepolia

[![Status](https://img.shields.io/badge/status-production--ready-brightgreen)]()
[![Blockchain](https://img.shields.io/badge/blockchain-Base%20Sepolia-blue)]()
[![Node](https://img.shields.io/badge/node-18%2B-green)]()

---

## 🎯 Overview

PropToken backend enables tokenization of real estate assets as ERC1155 tokens on Base Sepolia blockchain. Built for IIT KGP Hackathon 2026.

### Key Features

- 🔐 **JWT Authentication** - Role-based access (CLIENT/BUILDER/ADMIN)
- 🏠 **Asset Management** - Create, verify, and tokenize real estate
- 🪙 **ERC1155 Tokens** - Real blockchain minting on Base Sepolia
- 💱 **Token Trading** - Buy, swap, and lock tokens as collateral
- 💰 **Yield Distribution** - Automated monthly rental income distribution
- 📊 **Activity Feed** - Complete blockchain transaction history
- 🎯 **Mock Mode** - Works without blockchain for development

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/hoursgotviral-dev/proptoken.iitkgphack.git
cd proptoken.iitkgphack/backend

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database credentials

# Initialize database
# Create database: createdb onblock
# Run migrations (schema.sql will auto-apply on first start)

# Start server
npm start
```

Server runs on `http://localhost:3003`

---

## 📚 Documentation

- [Quick Start Guide](QUICK_START.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Blockchain Integration](BLOCKCHAIN_GUIDE.md)
- [Demo Guide](DEMO_GUIDE.md)
- [System Status](SYSTEM_STATUS.md)

---

## 🏗️ Architecture

```
backend/
├── routes/              # API endpoints
├── services/            # Business logic (blockchain)
├── middleware/          # Auth middleware
├── cron/               # Scheduled jobs
├── migrations/         # Database migrations
├── contracts/          # Smart contracts
└── server.js          # Application entry point
```

---

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login

### Assets
- `GET /assets` - List assets
- `POST /assets` - Create asset (BUILDER)
- `POST /assets/:id/tokenize` - Mint tokens
- `POST /assets/:id/buy` - Purchase tokens
- `GET /assets/my-assets` - Builder's assets
- `GET /assets/my-tokens` - Client's tokens

### Trading
- `POST /swap` - Swap tokens
- `POST /collateral/lock` - Lock collateral

### Analytics
- `GET /dashboard` - User metrics
- `GET /activity/feed` - Activity feed
- `GET /activity/my-activity` - User activity
- `GET /activity/stats` - Statistics

---

## 🧪 Testing

```bash
# Quick test
cmd /c test.bat

# Full demo
cmd /c demo.bat

# Verify system
node check_system.js
```

---

## 🔗 Blockchain

### Mock Mode (Default)
Works without blockchain configuration - perfect for development.

### Real Blockchain
1. Get test ETH from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
2. Add to `.env`:
   ```env
   PRIVATE_KEY=0x...
   RWA_CONTRACT_ADDRESS=0x...
   ```
3. Deploy: `cd contracts && npx hardhat run scripts/deploy.js --network baseSepolia`

---

## 📊 Database Schema

- `users` - User accounts
- `wallets` - User balances
- `assets` - Real estate assets
- `asset_fractions` - Tokenization
- `ownerships` - Token ownership
- `blockchain_activities` - Transaction log
- `swaps`, `collaterals`, `yield_distributions`

---

## 🔐 Environment Variables

```env
PORT=3003
DATABASE_URL=postgresql://user:pass@localhost:5432/onblock
JWT_SECRET=your_secret_key

# Optional - for real blockchain
PRIVATE_KEY=0x...
RWA_CONTRACT_ADDRESS=0x...
BASE_SEPOLIA_RPC=https://sepolia.base.org
```

---

## 🎓 Features

- ✅ Multi-role authentication
- ✅ Asset tokenization
- ✅ Blockchain integration (mock + real)
- ✅ Token trading
- ✅ Activity tracking
- ✅ Automated yield distribution
- ✅ Dashboard analytics

---

## 📝 License

MIT License - IIT KGP Hackathon 2026

---

## 🤝 Team

Built by Team PropToken for IIT KGP Hackathon 2026

---

## 🚀 Status

```
🟢 Backend: OPERATIONAL
🟢 Database: CONNECTED
🟢 Blockchain: ACTIVE (Mock Mode)
🟢 All Tests: PASSING
```

**Production Ready** ✅

---

For detailed documentation, see the `/docs` folder or individual `.md` files.
=======
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/11TQrfzcAleo7Zu8jDwjrNazmhIXAXdZp

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
>>>>>>> e8bb3dd492bc52a4fedb26a17b2ecee73c05d1a5
