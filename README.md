# PropToken - Autonomous RWA Tokenization Platform

A comprehensive Real-World Asset (RWA) tokenization platform featuring autonomous verification, legal automation, compliant security tokens, and secondary market trading.

## 🏗️ Architecture Overview

This platform consists of 5 major layers:

### 1. **Frontend (React + Vite)**
- Asset submission interface
- Investor dashboard (portfolio, holdings)
- Issuer dashboard (token management, NAV updates)
- Secondary market trading (order book, limit orders)
- DeFi hub (lending, borrowing, collateral)
- Oracle evidence vault (satellite imagery, registries)

### 2. **Autonomous Backend (NestJS)**
- Multi-oracle verification system
- Agent-Based Modeling (ABM) for fraud detection
- Consensus engine for eligibility scoring
- Legal workflow orchestration
- **NEW**: GraphQL API for market data

### 3. **Smart Contracts (Foundry/Solidity)**
- `AssetRegistry.sol` - Immutable asset fingerprints
- `RWASecurityToken.sol` - ERC-3643 compliant security tokens
- `AsyncRedemptionController.sol` - ERC-7540 redemption logic
- `TokenFactory.sol` - Automated token deployment

### 4. **Oracle Network (Go)**
- Satellite imagery verification (OpenStreetMap/Yandex)
- Computer vision analysis (mocked for free tier)
- Corporate registry validation (MCA)
- Merkle proof generation & ECDSA signing
- On-chain attestation publishing

### 5. **The Graph Subgraph**
- Token transfer indexing
- NAV update tracking
- Holder balance management
- Trade history aggregation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Go 1.21+
- Foundry (for smart contracts)

### Installation

```bash
# 1. Install dependencies
npm install
cd proptoken-autonomous/backend && npm install --legacy-peer-deps
cd ../../oracle-network && go mod download
cd ../subgraph && npm install

# 2. Start all services (see STARTUP.md for details)
# Terminal 1: Frontend
npm run dev

# Terminal 2: Autonomous Backend
cd proptoken-autonomous/backend && npm start

# Terminal 3: Oracle Network
cd oracle-network && go run cmd/oracle/main.go

# Terminal 4: Local Blockchain (optional)
anvil --port 8545
```

## 📋 Key Features

### ✅ Fully Implemented (Steps 1-5)
- **Step 1**: Legacy backend with wallet management
- **Step 2**: Autonomous verification pipeline
  - Oracle Truth Layer (satellite, vision, registry)
  - ABM-based fraud detection
  - Consensus scoring
  - Legal workflow automation
- **Step 3**: On-chain tokenization
  - Asset registry with cryptographic proofs
  - ERC-3643 security tokens
  - Async redemption (ERC-7540)
  - Foundry test suite
- **Step 4**: Oracle & Verification Layer
  - Go-based oracle network
  - Free-tier data sources (mocked APIs)
  - Merkle tree generation
  - Blockchain integration
- **Step 5**: Application & Market Layer
  - Investor & issuer dashboards
  - Secondary market trading (order book)
  - DeFi integrations (lending, borrowing)
  - GraphQL API backend
  - The Graph subgraph

### 🔄 Pending
- **Step 6**: Integration & Deployment
  - Production deployment
  - Real KYC/payment integrations
  - WebSocket real-time updates

## 🗂️ Project Structure

```
proptoken2/
├── pages/                    # Frontend pages
│   ├── InvestorDashboard.tsx # Portfolio & holdings
│   ├── IssuerDashboard.tsx   # Token management
│   ├── TokenDetail.tsx       # NAV charts & details
│   ├── TradingPage.tsx       # Order book & trading
│   └── DeFiPage.tsx          # Lending & borrowing
├── components/               # React components
├── src/                     # Legacy backend (Express)
├── proptoken-autonomous/
│   ├── backend/             # NestJS autonomous verification
│   │   └── src/market/      # GraphQL API
│   └── contracts/           # Foundry smart contracts
├── oracle-network/          # Go oracle service
│   ├── cmd/                 # Main entry point
│   ├── internal/            # Core logic
│   └── pkg/                 # Shared types
├── subgraph/                # The Graph indexing
│   ├── schema.graphql       # Entity definitions
│   ├── subgraph.yaml        # Deployment config
│   └── src/mapping.ts       # Event handlers
├── valid_assets.json        # Real Gurugram asset data
└── STARTUP.md              # Detailed startup guide
```

## 🔐 Security & Compliance

- **ERC-3643**: Identity-based transfers with KYC/AML compliance
- **Role-Based Access Control**: Admin, Minter, Compliance, Oracle roles
- **Merkle Proofs**: Cryptographic verification of off-chain data
- **ECDSA Signatures**: Oracle attestations signed with private keys
- **Order Book Compliance**: KYC checks before trade execution

## 🌍 Real-World Data

The platform uses **real coordinates** for 5 major commercial properties in Gurugram:
- DLF Cyber Hub
- One Horizon Center
- Ambience Mall
- Worldmark Gurugram
- Candor TechSpace

Satellite imagery is fetched from Yandex Static Maps API.

## 🧪 Testing

### Smart Contracts
```bash
cd proptoken-autonomous/contracts
forge test
```

### Oracle Network
```bash
cd oracle-network
go test ./...
```

### GraphQL API
Navigate to `http://localhost:3001/graphql` for GraphQL Playground

## 📊 Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, TypeScript, Chart.js |
| Backend | NestJS, Express, GraphQL, Apollo |
| Smart Contracts | Solidity 0.8.20, Foundry |
| Oracle | Go 1.21+, go-ethereum |
| Indexing | The Graph Protocol |
| Blockchain | Base/Arbitrum (L2), Anvil (local) |
| Data Sources | OpenStreetMap, Yandex Maps |

## 💰 Cost Structure

**Zero-cost implementation** using:
- Free satellite imagery (OpenStreetMap, Yandex)
- Mocked computer vision (simulated scores)
- Mocked registry APIs
- Local blockchain (Anvil)
- Mock lending/borrowing protocols

For production, estimated costs: ~$220/month for real API integrations.

## 🎯 User Journeys

### Investor Journey
1. Sign up & complete KYC (mocked)
2. Browse available tokens at `/fractional`
3. View token details with NAV chart at `/tokens/:address`
4. Buy tokens at current NAV (primary market)
5. Trade on secondary market at `/market/:address`
6. Lend tokens for yield at `/defi`
7. Monitor portfolio at `/investor`

### Issuer Journey
1. Submit asset for verification at `/autonomous/submit`
2. Wait for oracle verification
3. Review consensus score
4. Deploy token via `TokenFactory`
5. Manage token at `/issuer`
6. Update NAV periodically
7. Monitor investor activity

## 📝 API Endpoints

### GraphQL (Port 3001)
```graphql
query {
  tokens {
    address
    name
    symbol
    navPerToken
    holders
    apy
  }
  
  orderBook(tokenAddress: "0x5FbDB...") {
    bids { price amount }
    asks { price amount }
  }
  
  recentTrades(tokenAddress: "0x5FbDB...") {
    price
    amount
    timestamp
  }
}
```

### REST (Port 3001)
- `POST /submission/submit` - Submit asset for verification
- `GET /submission/:id` - Get submission status
- `GET /oracle/verify/:id` - Trigger oracle verification
- `GET /consensus/:id` - Get consensus score

## 📝 License

MIT

## 🤝 Contributing

This is a demonstration project showcasing the full stack of RWA tokenization. For production use:
1. Replace mocked integrations with real APIs
2. Deploy subgraph to The Graph hosted service
3. Integrate real KYC provider (Onfido/Persona)
4. Add payment processing (Stripe/Circle)
5. Implement WebSocket for real-time updates
6. Deploy to production blockchain (Base/Arbitrum)

---

**Built with ❤️ for the future of Real-World Asset tokenization**

## 🔗 Quick Links

- [Startup Guide](./STARTUP.md)
- [Smart Contracts](./proptoken-autonomous/contracts/)
- [Oracle Network](./oracle-network/)
- [Subgraph](./subgraph/)
- [GraphQL API](http://localhost:3001/graphql)
