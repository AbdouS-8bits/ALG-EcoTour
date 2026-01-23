-- Tour Routes Database Schema
-- This creates tables for managing tour routes, waypoints, and path variations

-- 1. Routes table (different route options for a tour)
CREATE TABLE IF NOT EXISTS tour_routes (
  id SERIAL PRIMARY KEY,
  tour_id INTEGER REFERENCES eco_tours(id) ON DELETE CASCADE,
  route_name VARCHAR(255) NOT NULL,
  route_type VARCHAR(50), -- 'direct', 'scenic', 'cultural', 'foodie'
  description TEXT,
  total_distance_km DECIMAL(10, 2),
  estimated_duration_hours DECIMAL(5, 2),
  difficulty VARCHAR(50), -- 'easy', 'moderate', 'challenging'
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Waypoints table (points of interest along routes)
CREATE TABLE IF NOT EXISTS tour_waypoints (
  id SERIAL PRIMARY KEY,
  waypoint_code VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'PT01', 'PT02'
  name VARCHAR(255) NOT NULL,
  waypoint_type VARCHAR(50) NOT NULL, -- 'start', 'end', 'rest', 'attraction', 'service', 'belvedere', 'info'
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  commune VARCHAR(100),
  description TEXT,
  visit_duration_minutes INTEGER DEFAULT 0,
  amenities JSONB, -- {bathroom: true, food: true, parking: true, etc}
  photos JSONB, -- Array of photo URLs
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Route waypoints junction (connects routes to waypoints in order)
CREATE TABLE IF NOT EXISTS route_waypoints (
  id SERIAL PRIMARY KEY,
  route_id INTEGER REFERENCES tour_routes(id) ON DELETE CASCADE,
  waypoint_id INTEGER REFERENCES tour_waypoints(id) ON DELETE CASCADE,
  waypoint_order INTEGER NOT NULL, -- Order in the route (1, 2, 3...)
  is_optional BOOLEAN DEFAULT false,
  distance_from_previous_km DECIMAL(10, 2),
  estimated_time_minutes INTEGER,
  notes TEXT,
  UNIQUE(route_id, waypoint_order)
);

-- 4. Road segments table (actual paths between waypoints)
CREATE TABLE IF NOT EXISTS road_segments (
  id SERIAL PRIMARY KEY,
  segment_code VARCHAR(50) UNIQUE, -- e.g., 'R43_SEG1'
  name VARCHAR(255) NOT NULL,
  road_type VARCHAR(50), -- 'national', 'local', 'trail', 'natural'
  from_waypoint_id INTEGER REFERENCES tour_waypoints(id),
  to_waypoint_id INTEGER REFERENCES tour_waypoints(id),
  length_km DECIMAL(10, 2),
  road_status VARCHAR(50), -- 'good', 'medium', 'poor', 'natural'
  importance VARCHAR(50), -- 'high', 'medium', 'low'
  path_coordinates JSONB, -- Array of [lat, lng] for drawing the path
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tour route templates (pre-defined route combinations)
CREATE TABLE IF NOT EXISTS route_templates (
  id SERIAL PRIMARY KEY,
  tour_id INTEGER REFERENCES eco_tours(id) ON DELETE CASCADE,
  template_name VARCHAR(255) NOT NULL,
  template_type VARCHAR(50), -- 'quick', 'standard', 'complete', 'custom'
  description TEXT,
  waypoint_sequence JSONB, -- Array of waypoint IDs in order
  estimated_duration_hours DECIMAL(5, 2),
  difficulty VARCHAR(50),
  recommended_for VARCHAR(255), -- 'families', 'adventure', 'photography', etc
  price_modifier DECIMAL(5, 2) DEFAULT 0, -- Additional cost for this route
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tour_routes_tour_id ON tour_routes(tour_id);
CREATE INDEX IF NOT EXISTS idx_route_waypoints_route_id ON route_waypoints(route_id);
CREATE INDEX IF NOT EXISTS idx_route_waypoints_waypoint_id ON route_waypoints(waypoint_id);
CREATE INDEX IF NOT EXISTS idx_waypoints_type ON tour_waypoints(waypoint_type);
CREATE INDEX IF NOT EXISTS idx_road_segments_waypoints ON road_segments(from_waypoint_id, to_waypoint_id);

-- Update triggers
CREATE OR REPLACE FUNCTION update_tour_routes_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tour_routes_updated_at
  BEFORE UPDATE ON tour_routes
  FOR EACH ROW
  EXECUTE FUNCTION update_tour_routes_timestamp();

CREATE TRIGGER update_tour_waypoints_updated_at
  BEFORE UPDATE ON tour_waypoints
  FOR EACH ROW
  EXECUTE FUNCTION update_tour_routes_timestamp();
