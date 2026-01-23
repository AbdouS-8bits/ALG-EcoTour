-- Email Campaigns Table
CREATE TABLE IF NOT EXISTS email_campaigns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  template VARCHAR(100) NOT NULL,
  segment VARCHAR(100) NOT NULL,
  target_count INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'draft', -- draft, scheduled, sending, sent, failed
  scheduled_for TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  sent_at TIMESTAMP,
  created_by INTEGER
);

-- Email Campaign Recipients (for tracking)
CREATE TABLE IF NOT EXISTS email_campaign_recipients (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER NOT NULL REFERENCES email_campaigns(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, sent, opened, clicked, converted, bounced, failed
  sent_at TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  converted_at TIMESTAMP,
  error TEXT,
  UNIQUE(campaign_id, user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_segment ON email_campaigns(segment);
CREATE INDEX IF NOT EXISTS idx_email_campaign_recipients_campaign ON email_campaign_recipients(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_campaign_recipients_user ON email_campaign_recipients(user_id);
CREATE INDEX IF NOT EXISTS idx_email_campaign_recipients_status ON email_campaign_recipients(status);

-- Comments
COMMENT ON TABLE email_campaigns IS 'Stores email marketing campaigns';
COMMENT ON TABLE email_campaign_recipients IS 'Tracks email delivery and engagement per user';
