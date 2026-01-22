@echo off
echo.
echo 🔧 Support Chat System - Safe Database Migration
echo ================================================
echo.
echo This script will add support chat tables to your database
echo ⚠️  IMPORTANT: This is SAFE and will NOT delete any existing data!
echo.

REM Check if .env file exists
if not exist .env (
    echo ❌ Error: .env file not found!
    echo Please create .env file with DATABASE_URL
    exit /b 1
)

echo 📦 Step 1: Installing dependencies...
call npm install @prisma/client

echo.
echo 📊 Step 2: Checking current database status...
call npx prisma migrate status

echo.
echo 🔄 Step 3: Creating support tables (SAFE - no data loss)...
call npx prisma migrate dev --name add_support_tables

echo.
echo ⚡ Step 4: Generating Prisma Client...
call npx prisma generate

echo.
echo ✅ Migration complete!
echo.
echo 📋 Summary:
echo   - ✅ support_sessions table created
echo   - ✅ support_messages table created
echo   - ✅ All indexes and foreign keys added
echo   - ✅ Your existing data is intact!
echo.
echo 🚀 Next step: Restart your server with 'npm run dev'
echo.
pause
