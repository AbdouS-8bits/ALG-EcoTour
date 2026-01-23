-- Create cookie_consents table for tracking user cookie preferences
-- Run this file in your PostgreSQL database

CREATE TABLE IF NOT EXISTS cookie_consents (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  necessary BOOLEAN DEFAULT true,
  analytics BOOLEAN DEFAULT false,
  marketing BOOLEAN DEFAULT false,
  preferences BOOLEAN DEFAULT false,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cookie_consents_session_id ON cookie_consents(session_id);
CREATE INDEX IF NOT EXISTS idx_cookie_consents_created_at ON cookie_consents(created_at);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_cookie_consents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function on updates
CREATE TRIGGER trigger_update_cookie_consents_updated_at
  BEFORE UPDATE ON cookie_consents
  FOR EACH ROW
  EXECUTE FUNCTION update_cookie_consents_updated_at();

-- Verify table was created
SELECT 'cookie_consents table created successfully!' as status;
