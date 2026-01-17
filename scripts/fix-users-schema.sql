-- Fix Users Table Schema for Authentication
-- Run this SQL to add missing columns and fix data types

-- 1. Add missing columns for refresh tokens
ALTER TABLE users ADD COLUMN IF NOT EXISTS "refreshToken" TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "refreshTokenExpires" TIMESTAMP;

-- 2. Change emailVerified from boolean to timestamp (if needed for NextAuth compatibility)
-- First, create a new column
ALTER TABLE users ADD COLUMN IF NOT EXISTS "emailVerifiedAt" TIMESTAMP;

-- Copy data: if emailVerified is true, set timestamp to now
UPDATE users SET "emailVerifiedAt" = NOW() WHERE "emailVerified" = true;

-- Optional: Drop old boolean column (uncomment if you want to remove it)
-- ALTER TABLE users DROP COLUMN "emailVerified";
-- ALTER TABLE users RENAME COLUMN "emailVerifiedAt" TO "emailVerified";

-- 3. Update existing users to have verified emails (for testing)
UPDATE users SET "emailVerified" = true WHERE "emailVerified" = false;

-- 4. Verify schema
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Users table updated successfully!';
    RAISE NOTICE 'Added columns: refreshToken, refreshTokenExpires';
    RAISE NOTICE 'All users set to emailVerified = true for testing';
END $$;
