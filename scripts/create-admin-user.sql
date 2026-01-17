-- Quick Admin User Setup
-- Run this SQL in your database to create test accounts

-- 1. Create Admin User
-- Email: admin@ecotour.com
-- Password: admin123
INSERT INTO users (email, name, password, role, "emailVerified", "createdAt", "updatedAt")
VALUES (
  'admin@ecotour.com',
  'Admin User',
  '$2b$10$rQ6YvZxVxGZQm.8f8L1vEemYqK9vfW5VN5nYL8YxZ8YH5K3G6nqLu',
  'admin',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- 2. Create Test User
-- Email: test@ecotour.com
-- Password: test123
INSERT INTO users (email, name, password, role, "emailVerified", "createdAt", "updatedAt")
VALUES (
  'test@ecotour.com',
  'Test User',
  '$2b$10$YvqHYYkYvwYC3yq.xr0rPu.1L4Qz1Lf7y5Z9W8YxZ8YH5K3G6nqLu',
  'user',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- 3. Verify users created
SELECT id, email, name, role, "emailVerified" FROM users WHERE email IN ('admin@ecotour.com', 'test@ecotour.com');

-- You should see:
-- | id | email                | name       | role  | emailVerified |
-- |----|---------------------|------------|-------|---------------|
-- | 1  | admin@ecotour.com   | Admin User | admin | [timestamp]   |
-- | 2  | test@ecotour.com    | Test User  | user  | [timestamp]   |
