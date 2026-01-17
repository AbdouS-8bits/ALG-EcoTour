-- Update TourImage table to support videos
-- Run this SQL to add video support columns

-- Add new columns for video support
ALTER TABLE "TourImage" ADD COLUMN IF NOT EXISTS "resourceType" VARCHAR(20) DEFAULT 'image';
ALTER TABLE "TourImage" ADD COLUMN IF NOT EXISTS "duration" DECIMAL(10, 2); -- Video duration in seconds
ALTER TABLE "TourImage" ADD COLUMN IF NOT EXISTS "width" INTEGER;
ALTER TABLE "TourImage" ADD COLUMN IF NOT EXISTS "height" INTEGER;
ALTER TABLE "TourImage" ADD COLUMN IF NOT EXISTS "format" VARCHAR(10); -- jpg, png, mp4, etc.

-- Add check constraint for resource type
ALTER TABLE "TourImage" ADD CONSTRAINT "check_resource_type" 
CHECK ("resourceType" IN ('image', 'video'));

-- Update existing records
UPDATE "TourImage" SET "resourceType" = 'image' WHERE "resourceType" IS NULL;

-- Rename table to TourMedia (optional, for clarity)
-- ALTER TABLE "TourImage" RENAME TO "TourMedia";

-- Verify schema
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'TourImage' 
ORDER BY ordinal_position;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ TourImage table updated to support videos!';
    RAISE NOTICE '   Added columns: resourceType, duration, width, height, format';
END $$;
