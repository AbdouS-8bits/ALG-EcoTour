-- Analytics Database Schema
-- Run this SQL to create analytics tables

-- 1. Page Views Tracking
CREATE TABLE IF NOT EXISTS page_views (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    page_url TEXT NOT NULL,
    page_title VARCHAR(500),
    referrer TEXT,
    user_agent TEXT,
    ip_address VARCHAR(45),
    country VARCHAR(100),
    city VARCHAR(100),
    device_type VARCHAR(50), -- mobile, desktop, tablet
    browser VARCHAR(100),
    os VARCHAR(100),
    duration_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. User Events Tracking (clicks, interactions)
CREATE TABLE IF NOT EXISTS user_events (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL, -- click, scroll, form_submit, etc.
    event_category VARCHAR(100), -- button, link, form, etc.
    event_label VARCHAR(255), -- specific button/link name
    event_value TEXT, -- additional data (JSON)
    page_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. User Sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    total_duration_seconds INTEGER DEFAULT 0,
    pages_visited INTEGER DEFAULT 0,
    events_count INTEGER DEFAULT 0,
    device_type VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    ip_address VARCHAR(45),
    country VARCHAR(100),
    city VARCHAR(100),
    utm_source VARCHAR(255), -- marketing campaign source
    utm_medium VARCHAR(255), -- marketing campaign medium
    utm_campaign VARCHAR(255), -- marketing campaign name
    utm_content VARCHAR(255),
    utm_term VARCHAR(255)
);

-- 4. Tour Interest Tracking (for targeted marketing)
CREATE TABLE IF NOT EXISTS tour_interests (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    tour_id INTEGER REFERENCES eco_tours(id) ON DELETE CASCADE,
    interest_type VARCHAR(50) NOT NULL, -- view, click, save, share, etc.
    interest_score INTEGER DEFAULT 1, -- weighted score for interest level
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Search Queries (what users are looking for)
CREATE TABLE IF NOT EXISTS search_queries (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    search_term TEXT NOT NULL,
    filters JSONB, -- store search filters as JSON
    results_count INTEGER DEFAULT 0,
    clicked_result_id INTEGER, -- which tour they clicked
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Email Campaign Tracking
CREATE TABLE IF NOT EXISTS email_campaigns (
    id SERIAL PRIMARY KEY,
    campaign_name VARCHAR(255) NOT NULL,
    campaign_type VARCHAR(100), -- newsletter, promotional, abandoned_cart, etc.
    subject VARCHAR(500),
    content TEXT,
    target_segment JSONB, -- targeting criteria
    sent_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    converted_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP
);

-- 7. Email Engagement
CREATE TABLE IF NOT EXISTS email_engagement (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES email_campaigns(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    converted_at TIMESTAMP,
    conversion_value DECIMAL(10, 2), -- if they booked
    unsubscribed_at TIMESTAMP
);

-- 8. User Preferences (for personalization)
CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255),
    preferred_categories INTEGER[], -- array of category IDs
    preferred_difficulty VARCHAR(50)[],
    price_range_min DECIMAL(10, 2),
    price_range_max DECIMAL(10, 2),
    preferred_locations TEXT[],
    communication_preferences JSONB, -- email, sms preferences
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- 9. Conversion Funnel Tracking
CREATE TABLE IF NOT EXISTS conversion_funnels (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    tour_id INTEGER REFERENCES eco_tours(id) ON DELETE SET NULL,
    step VARCHAR(100) NOT NULL, -- view, details, book, checkout, complete
    step_order INTEGER NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Cookie Consent Tracking (GDPR compliance)
CREATE TABLE IF NOT EXISTS cookie_consents (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    necessary BOOLEAN DEFAULT TRUE,
    analytics BOOLEAN DEFAULT FALSE,
    marketing BOOLEAN DEFAULT FALSE,
    preferences BOOLEAN DEFAULT FALSE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_page_views_session ON page_views(session_id);
CREATE INDEX idx_page_views_user ON page_views(user_id);
CREATE INDEX idx_page_views_created ON page_views(created_at);
CREATE INDEX idx_page_views_url ON page_views(page_url);

CREATE INDEX idx_user_events_session ON user_events(session_id);
CREATE INDEX idx_user_events_user ON user_events(user_id);
CREATE INDEX idx_user_events_type ON user_events(event_type);
CREATE INDEX idx_user_events_created ON user_events(created_at);

CREATE INDEX idx_user_sessions_session ON user_sessions(session_id);
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_started ON user_sessions(started_at);

CREATE INDEX idx_tour_interests_session ON tour_interests(session_id);
CREATE INDEX idx_tour_interests_user ON tour_interests(user_id);
CREATE INDEX idx_tour_interests_tour ON tour_interests(tour_id);
CREATE INDEX idx_tour_interests_created ON tour_interests(created_at);

CREATE INDEX idx_search_queries_session ON search_queries(session_id);
CREATE INDEX idx_search_queries_user ON search_queries(user_id);
CREATE INDEX idx_search_queries_created ON search_queries(created_at);

CREATE INDEX idx_email_engagement_campaign ON email_engagement(campaign_id);
CREATE INDEX idx_email_engagement_user ON email_engagement(user_id);

CREATE INDEX idx_conversion_funnels_session ON conversion_funnels(session_id);
CREATE INDEX idx_conversion_funnels_tour ON conversion_funnels(tour_id);

-- Add comments for documentation
COMMENT ON TABLE page_views IS 'Tracks every page view with detailed user information';
COMMENT ON TABLE user_events IS 'Tracks user interactions like clicks, scrolls, form submissions';
COMMENT ON TABLE user_sessions IS 'Aggregated session data for analytics';
COMMENT ON TABLE tour_interests IS 'Tracks which tours users are interested in for targeted marketing';
COMMENT ON TABLE search_queries IS 'Stores search queries to understand what users are looking for';
COMMENT ON TABLE email_campaigns IS 'Email marketing campaigns';
COMMENT ON TABLE email_engagement IS 'Tracks individual email engagement';
COMMENT ON TABLE user_preferences IS 'User preferences for personalized recommendations';
COMMENT ON TABLE conversion_funnels IS 'Tracks user journey through booking funnel';
COMMENT ON TABLE cookie_consents IS 'GDPR-compliant cookie consent tracking';
