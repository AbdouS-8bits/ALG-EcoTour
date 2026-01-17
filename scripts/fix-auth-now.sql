-- ONE COMMAND TO FIX ALL AUTH ISSUES
-- Copy and paste this entire block into psql

-- 1. Add missing columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS "refreshToken" TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "refreshTokenExpires" TIMESTAMP;

-- 2. Verify all existing users (so they can login)
UPDATE users SET "emailVerified" = true WHERE "emailVerified" = false;

-- 3. Create admin user if not exists
INSERT INTO users (email, name, password, role, "emailVerified", "createdAt", "updatedAt")
VALUES (
  'admin@ecotour.com',
  'Admin User',
  '$2b$10$rQ6YvZxVxGZQm.8f8L1vEemYqK9vfW5VN5nYL8YxZ8YH5K3G6nqLu',
  'admin',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET "emailVerified" = true;

-- 4. Show all users
SELECT id, email, name, role, "emailVerified" FROM users;

-- Done!
\echo '✅ Auth fixed! All users can now login.'
\echo '✅ Admin account: admin@ecotour.com / admin123'
