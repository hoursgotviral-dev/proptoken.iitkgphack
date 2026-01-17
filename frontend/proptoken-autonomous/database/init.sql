-- Portable SQL Schema for Proptoken Autonomous

CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY,
    status VARCHAR(50) NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS oracle_results (
    submission_id UUID REFERENCES submissions(id),
    provider VARCHAR(50) NOT NULL,
    result JSONB NOT NULL,
    score NUMERIC(5, 4),
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (submission_id, provider)
);

CREATE TABLE IF NOT EXISTS asset_registry (
    asset_id UUID PRIMARY KEY,
    owner_did VARCHAR(100) NOT NULL,
    consensus_score JSONB NOT NULL,
    on_chain_tx_hash VARCHAR(66),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Legal entities (SPVs, REITs, Trusts)
CREATE TABLE IF NOT EXISTS legal_entities (
  id UUID PRIMARY KEY,
  asset_id UUID REFERENCES submissions(id),
  entity_type VARCHAR(50) NOT NULL,
  jurisdiction VARCHAR(100) NOT NULL,
  legal_name VARCHAR(255) NOT NULL,
  tax_id VARCHAR(50),
  incorporation_date DATE NOT NULL,
  registered_address TEXT NOT NULL,
  directors JSONB NOT NULL,
  bank_account JSONB,
  status VARCHAR(50) NOT NULL,
  documents JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Asset transfers
CREATE TABLE IF NOT EXISTS asset_transfers (
  id UUID PRIMARY KEY,
  entity_id UUID REFERENCES legal_entities(id),
  asset_id UUID REFERENCES submissions(id),
  transfer_type VARCHAR(50) NOT NULL,
  transfer_date DATE NOT NULL,
  deed_url TEXT NOT NULL,
  notarization_id VARCHAR(100),
  registry_confirmation VARCHAR(100),
  custody_receipt VARCHAR(100),
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Claim rights
CREATE TABLE IF NOT EXISTS claim_rights (
  id UUID PRIMARY KEY,
  entity_id UUID REFERENCES legal_entities(id),
  claim_class VARCHAR(100) NOT NULL,
  income_rights JSONB NOT NULL,
  redemption_rights JSONB NOT NULL,
  voting_rights JSONB NOT NULL,
  priority INTEGER NOT NULL,
  loss_absorption DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cap table
CREATE TABLE IF NOT EXISTS cap_table (
  id UUID PRIMARY KEY,
  entity_id UUID REFERENCES legal_entities(id),
  claim_class VARCHAR(100) NOT NULL,
  units_authorized BIGINT NOT NULL,
  units_issued BIGINT DEFAULT 0,
  units_outstanding BIGINT DEFAULT 0,
  unit_price DECIMAL NOT NULL,
  total_value DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Holdings
CREATE TABLE IF NOT EXISTS holdings (
  id UUID PRIMARY KEY,
  entity_id UUID REFERENCES legal_entities(id),
  claim_class VARCHAR(100) NOT NULL,
  holder VARCHAR(255) NOT NULL,
  units BIGINT NOT NULL,
  acquisition_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Legal documents
CREATE TABLE IF NOT EXISTS legal_documents (
  id UUID PRIMARY KEY,
  entity_id UUID REFERENCES legal_entities(id),
  type VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  hash VARCHAR(66) NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  signed BOOLEAN DEFAULT FALSE,
  signature_envelope_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Workflow state
CREATE TABLE IF NOT EXISTS workflow_state (
  workflow_id VARCHAR(100) PRIMARY KEY,
  state JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
