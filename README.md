# 🎯 PropToken - Full Stack RWA Platform

> Complete Real-World Asset tokenization platform with React frontend and Node.js backend

[![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20TypeScript-blue)]()
[![Backend](https://img.shields.io/badge/backend-Node.js%20%2B%20Express-green)]()
[![Blockchain](https://img.shields.io/badge/blockchain-Base%20Sepolia-purple)]()

---

## 🏗️ Project Structure

```
proptoken-iitkgp/
├── frontend/              # React + TypeScript + Vite
│   ├── src/
│   │   ├── api/          # Backend API client
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   └── context/      # React context
│   ├── public/           # Static assets
│   ├── package.json
│   └── vite.config.ts
│
├── backend/              # Node.js + Express
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   ├── middleware/      # Auth middleware
│   ├── cron/           # Scheduled jobs
│   ├── contracts/      # Smart contracts
│   ├── migrations/     # Database migrations
│   ├── server.js       # Main server
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Git

### 1. Clone Repository
```bash
git clone https://github.com/hoursgotviral-dev/proptoken.iitkgphack.git
cd proptoken.iitkgphack
```

### 2. Setup Backend
```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Start backend
npm start
# Backend runs on http://localhost:3003
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install

# Start frontend
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🎯 Features

### Frontend
- ✅ React + TypeScript + Vite
- ✅ Modern UI with Tailwind CSS
- ✅ Role-based dashboards (CLIENT/BUILDER)
- ✅ Real-time activity feed
- ✅ Token portfolio management
- ✅ Wallet integration ready

### Backend
- ✅ RESTful API with Express
- ✅ JWT authentication
- ✅ PostgreSQL database
- ✅ Blockchain integration (Base Sepolia)
- ✅ Activity tracking
- ✅ Automated yield distribution
- ✅ Smart contracts (ERC1155)

---

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login

### Assets
- `GET /assets` - List all assets
- `POST /assets` - Create asset (BUILDER)
- `GET /assets/my-assets` - Builder's assets
- `GET /assets/my-tokens` - Client's tokens
- `POST /assets/:id/tokenize` - Mint tokens
- `POST /assets/:id/buy` - Purchase tokens

### Trading
- `POST /swap` - Swap tokens
- `POST /collateral/lock` - Lock collateral

### Analytics
- `GET /dashboard` - User metrics
- `GET /activity/feed` - Activity feed
- `GET /activity/my-activity` - User activity

---

## 🔧 Configuration

### Backend (.env)
```env
PORT=3003
DATABASE_URL=postgresql://user:pass@localhost:5432/onblock
JWT_SECRET=your_secret_key

# Optional - for real blockchain
PRIVATE_KEY=0x...
RWA_CONTRACT_ADDRESS=0x...
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3003
VITE_APP_NAME=PropToken
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
# Or run demo
cmd /c demo.bat
```

### Frontend Tests
```bash
cd frontend
npm run test
```

---

## 📚 Documentation

- [Backend Documentation](backend/README.md)
- [Frontend Documentation](frontend/README.md)
- [API Documentation](backend/BLOCKCHAIN_GUIDE.md)
- [Deployment Guide](backend/DEPLOYMENT_GUIDE.md)

---

## 🔗 Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express
- PostgreSQL
- JWT
- Ethers.js

### Blockchain
- Solidity
- Hardhat
- OpenZeppelin
- Base Sepolia

---

## 🚀 Deployment

### Backend
```bash
cd backend
# Deploy to your preferred platform
# Heroku, Railway, Render, etc.
```

### Frontend
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel, Netlify, etc.
```

---

## 👥 Team

Built for IIT KGP Hackathon 2026

---

## 📝 License

MIT License

---

## 🎉 Status

```
🟢 Frontend: READY
🟢 Backend: OPERATIONAL
🟢 Database: CONNECTED
🟢 Blockchain: ACTIVE
```

**Full Stack Ready** ✅

---

For detailed setup instructions, see individual README files in `/frontend` and `/backend` folders.
