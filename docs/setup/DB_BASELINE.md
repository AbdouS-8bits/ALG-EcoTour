# Database Baseline Setup Guide

This guide explains how to establish a Prisma migration baseline when your database already exists but the local `prisma/migrations` directory is missing or out of sync.

## Problem Scenario

You have:
- ✅ A working database with existing schema and data
- ✅ Applied migrations in the database
- ❌ Missing or empty `prisma/migrations` directory locally
- ❌ `prisma migrate dev` showing drift and asking for reset

## Solution Overview

Create a baseline migration that matches the current database state without losing data.

## Exact Commands Used

### 1. Verify Current State
```bash
# Check if migrations directory exists (should be missing/empty)
ls -la prisma/migrations/

# Check migration status (will show drift)
npx prisma migrate status
```

### 2. Pull Current Database Schema
```bash
# Introspect database to ensure schema.prisma matches actual DB
npx prisma db pull
```

### 3. Generate Updated Prisma Client
```bash
# Generate client with updated schema
npx prisma generate
```

### 4. Create Baseline Migration Structure
```bash
# Create migrations directory
mkdir -p prisma/migrations

# Create baseline migration folder (use current timestamp)
TIMESTAMP=$(date +%Y%m%d%H%M%S)
mkdir -p prisma/migrations/${TIMESTAMP}_baseline
```

### 5. Create Baseline Migration Files

Create `prisma/migrations/${TIMESTAMP}_baseline/README.md`:
```markdown
-- Baseline Migration
-- 
-- This migration establishes a baseline for the existing database schema.
-- The database was already populated with this schema before this migration was created.
-- 
-- Tables included in this baseline:
-- - users (with indexes on email, resetPasswordToken, verificationToken)
-- - eco_tours (with foreign key to categories)
-- - categories (with unique index on name)
-- - bookings (with foreign keys to users and eco_tours)
-- - reviews (with foreign keys to users and eco_tours)
-- - tour_images (with foreign key to eco_tours)
-- - admin_audit_logs (with foreign key to users)
--
-- This migration is marked as applied since the schema already exists in the database.
-- No changes will be made when this migration is applied.
```

Create `prisma/migrations/${TIMESTAMP}_baseline/migration.sql`:
```sql
-- Baseline Migration SQL
-- 
-- This file represents the current state of the database schema.
-- Since this is a baseline migration for an existing database,
-- this SQL is for documentation purposes only.
-- The actual schema already exists in the database.

-- [Full SQL schema with all tables, indexes, and constraints]
-- (See the actual file for complete schema)
```

### 6. Handle Missing Historical Migrations

If `prisma migrate status` shows missing migrations that exist in the database:

```bash
# Create placeholder directories for each missing migration
mkdir -p prisma/migrations/20251127064323_init
mkdir -p prisma/migrations/20251214101241_add_photo_url
mkdir -p prisma/migrations/20260106123655_init
mkdir -p prisma/migrations/20260106132205_add_reviews_and_images
mkdir -p prisma/migrations/20260106204913_sync_with_db
```

For each missing migration, create:
- `README.md` with explanation that it's already applied
- `migration.sql` with `SELECT 1;` (placeholder)

### 7. Mark Migrations as Applied
```bash
# Mark baseline as applied
npx prisma migrate resolve --applied ${TIMESTAMP}_baseline

# Mark historical migrations as applied (will show "already applied" if they exist)
npx prisma migrate resolve --applied 20251127064323_init
npx prisma migrate resolve --applied 20251214101241_add_photo_url
npx prisma migrate resolve --applied 20260106123655_init
npx prisma migrate resolve --applied 20260106132205_add_reviews_and_images
npx prisma migrate resolve --applied 20260106204913_sync_with_db
```

### 8. Verify Everything is Clean
```bash
# Should show "Database schema is up to date!"
npx prisma migrate status

# Should succeed without issues
npx prisma generate

# Test database connection
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$queryRaw\`SELECT 1\`.then(() => {
  console.log('✅ DB connection successful');
  process.exit(0);
}).catch(err => {
  console.error('❌ DB connection failed:', err.message);
  process.exit(1);
});
"
```

### 9. Test Application Health
```bash
# Test health endpoint
curl -s http://localhost:3000/api/health | jq .

# Should show:
# {
#   "ok": true,
#   "db": true,
#   "auth": true,
#   ...
# }
```

## Key Points

### ✅ What This Preserves
- All existing data in the database
- All current database schema and constraints
- Application functionality during the process

### ❌ What This Avoids
- `prisma migrate reset` (which would delete all data)
- Manual database schema changes
- Downtime or data loss

### 🔧 How It Works
1. **Schema Sync**: `prisma db pull` ensures local `schema.prisma` matches actual database
2. **Baseline Creation**: Creates a migration that documents the current state
3. **Migration Resolution**: Marks all migrations as "already applied" since they exist in the database
4. **Clean State**: Prisma now sees local and database states as consistent

## Troubleshooting

### If Health Check Still Shows DB: false
1. Restart the development server to pick up new Prisma client
2. Check environment variables in `.env.local`
3. Verify database is running and accessible
4. Check `/api/health` endpoint for detailed error messages

### If Migration Status Still Shows Issues
```bash
# Double-check all migrations are marked as applied
npx prisma migrate status

# If needed, re-run resolve commands
npx prisma migrate resolve --applied <migration_name>
```

### If Schema.prisma Has Conflicts
```bash
# Re-pull schema from database
npx prisma db pull

# Regenerate client
npx prisma generate
```

## Success Indicators

- ✅ `npx prisma migrate status` shows "Database schema is up to date!"
- ✅ `npx prisma generate` succeeds without warnings
- ✅ Direct DB connection test succeeds
- ✅ `/api/health` shows `"db": true`
- ✅ Application can query the database normally

## Future Development

After baseline is established:
- New migrations can be created normally with `prisma migrate dev`
- All standard Prisma workflows will work as expected
- No data loss occurred during the process
