-- Analytics Tables Migration
-- This creates all tables needed for the analytics dashboard

-- 1. Page Views Table
CREATE TABLE IF NOT EXISTS page_views (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  page_url TEXT NOT NULL,
  page_title VARCHAR(500),
  referrer TEXT,
  duration_seconds INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_page_views_session ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_user ON page_views(user_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views(created_at);

-- 2. User Events Table
CREATE TABLE IF NOT EXISTS user_events (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  event_type VARCHAR(100) NOT NULL,
  event_category VARCHAR(100),
  event_label VARCHAR(255),
  event_value NUMERIC(10, 2),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_events_session ON user_events(session_id);
CREATE INDEX IF NOT EXISTS idx_user_events_type ON user_events(event_type);
CREATE INDEX IF NOT EXISTS idx_user_events_created ON user_events(created_at);

-- 3. User Sessions Table
CREATE TABLE IF NOT EXISTS user_sessions (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  pages_visited INTEGER DEFAULT 0,
  total_duration_seconds INTEGER DEFAULT 0,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  utm_term VARCHAR(255),
  utm_content VARCHAR(255),
  device_type VARCHAR(50),
  browser VARCHAR(100),
  os VARCHAR(100),
  country VARCHAR(100),
  city VARCHAR(100),
  ip_address VARCHAR(45),
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_session ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_started ON user_sessions(started_at);

-- 4. Tour Interests Table
CREATE TABLE IF NOT EXISTS tour_interests (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  tour_id INTEGER REFERENCES eco_tours(id) ON DELETE CASCADE,
  interest_score INTEGER DEFAULT 1,
  interaction_type VARCHAR(50), -- 'view', 'click', 'favorite', 'share'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tour_interests_session ON tour_interests(session_id);
CREATE INDEX IF NOT EXISTS idx_tour_interests_tour ON tour_interests(tour_id);
CREATE INDEX IF NOT EXISTS idx_tour_interests_created ON tour_interests(created_at);

-- 5. Search Queries Table
CREATE TABLE IF NOT EXISTS search_queries (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  search_term VARCHAR(500) NOT NULL,
  results_count INTEGER,
  filters_applied JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_search_queries_session ON search_queries(session_id);
CREATE INDEX IF NOT EXISTS idx_search_queries_term ON search_queries(search_term);
CREATE INDEX IF NOT EXISTS idx_search_queries_created ON search_queries(created_at);

-- 6. Conversion Funnels Table
CREATE TABLE IF NOT EXISTS conversion_funnels (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  step VARCHAR(100) NOT NULL,
  step_order INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_conversion_funnels_session ON conversion_funnels(session_id);
CREATE INDEX IF NOT EXISTS idx_conversion_funnels_step ON conversion_funnels(step);
CREATE INDEX IF NOT EXISTS idx_conversion_funnels_created ON conversion_funnels(created_at);

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_page_views_updated_at
  BEFORE UPDATE ON page_views
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Verification query
SELECT 
  'page_views' as table_name, 
  (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'page_views')) as created
UNION ALL
SELECT 'user_events', (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_events'))
UNION ALL
SELECT 'user_sessions', (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_sessions'))
UNION ALL
SELECT 'tour_interests', (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tour_interests'))
UNION ALL
SELECT 'search_queries', (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'search_queries'))
UNION ALL
SELECT 'conversion_funnels', (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'conversion_funnels'));
