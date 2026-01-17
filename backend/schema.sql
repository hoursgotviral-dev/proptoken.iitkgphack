-- Users & Auth
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) CHECK (role IN ('CLIENT', 'BUILDER', 'ADMIN')) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wallets (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  stablecoin_balance DECIMAL(20, 2) DEFAULT 0.00
);

-- Assets & Tokenization
CREATE TABLE IF NOT EXISTS assets (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  valuation DECIMAL(20, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VERIFIED', 'Active', 'Rejected')), -- 'Active' implies tokenized
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS asset_fractions (
  asset_id INTEGER PRIMARY KEY REFERENCES assets(id) ON DELETE CASCADE,
  total_fractions INTEGER NOT NULL,
  price_per_fraction DECIMAL(20, 2) NOT NULL,
  available_fractions INTEGER NOT NULL
);

-- Tokens & Ownership
-- Conceptually, 'tokens' could be 1:1 with assets or asset_fractions. 
-- For simplicity, we track ownership directly linked to asset_id or a 'token_id' which maps to asset.
-- Let's treat asset_id as the token identifier for this 1155-style model.

CREATE TABLE IF NOT EXISTS ownerships (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  asset_id INTEGER REFERENCES assets(id),
  balance INTEGER DEFAULT 0,
  UNIQUE(user_id, asset_id)
);

-- Rental Yields
CREATE TABLE IF NOT EXISTS rental_income (
  id SERIAL PRIMARY KEY,
  asset_id INTEGER REFERENCES assets(id),
  amount DECIMAL(20, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'DISTRIBUTED')),
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS yield_distributions (
  id SERIAL PRIMARY KEY,
  rental_income_id INTEGER REFERENCES rental_income(id),
  user_id INTEGER REFERENCES users(id),
  amount DECIMAL(20, 2) NOT NULL,
  distributed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Financial Actions
CREATE TABLE IF NOT EXISTS swaps (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  asset_id INTEGER REFERENCES assets(id),
  token_amount INTEGER NOT NULL,
  stablecoin_received DECIMAL(20, 2) NOT NULL,
  tx_hash VARCHAR(255), -- Mock blockchain hash
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS collaterals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  asset_id INTEGER REFERENCES assets(id),
  locked_token_amount INTEGER NOT NULL,
  collateral_value DECIMAL(20, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'LOCKED' CHECK (status IN ('LOCKED', 'RELEASED', 'LIQUIDATED')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount DECIMAL(20, 2) NOT NULL,
  collateral_id INTEGER REFERENCES collaterals(id),
  status VARCHAR(50) DEFAULT 'COMPLETED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
