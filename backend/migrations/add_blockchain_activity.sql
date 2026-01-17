-- Add blockchain activity tracking table
-- Drop if exists to avoid conflicts
DROP TABLE IF EXISTS blockchain_activities CASCADE;

CREATE TABLE blockchain_activities (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  action VARCHAR(50) NOT NULL,
  tx_hash VARCHAR(255) NOT NULL,
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_blockchain_activities_user ON blockchain_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_activities_created ON blockchain_activities(created_at DESC);

-- Add wallet_address to users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'wallet_address'
    ) THEN
        ALTER TABLE users ADD COLUMN wallet_address VARCHAR(42);
    END IF;
END $$;
