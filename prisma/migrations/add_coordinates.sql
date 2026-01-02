-- Add latitude and longitude columns to eco_tours table
ALTER TABLE eco_tours 
ADD COLUMN latitude DOUBLE PRECISION,
ADD COLUMN longitude DOUBLE PRECISION;
