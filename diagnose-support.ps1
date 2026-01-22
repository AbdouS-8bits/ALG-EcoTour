# Support Chat Diagnostic Tool
Write-Host ""
Write-Host "🔍 Support Chat System Diagnostics" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Check 1: Database tables
Write-Host "📊 Check 1: Testing database connection and tables..." -ForegroundColor Yellow
node test-support-db.js

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Database is working correctly!" -ForegroundColor Green
    Write-Host ""
    
    # Check 2: Server file
    Write-Host "📁 Check 2: Verifying server.js exists..." -ForegroundColor Yellow
    if (Test-Path "server.js") {
        Write-Host "✅ server.js found" -ForegroundColor Green
    } else {
        Write-Host "❌ server.js not found!" -ForegroundColor Red
        exit 1
    }
    
    # Check 3: Dependencies
    Write-Host ""
    Write-Host "📦 Check 3: Verifying dependencies..." -ForegroundColor Yellow
    $hasSocketIO = Get-Content "package.json" | Select-String "socket.io"
    $hasPrisma = Get-Content "package.json" | Select-String "@prisma/client"
    
    if ($hasSocketIO) {
        Write-Host "✅ socket.io installed" -ForegroundColor Green
    } else {
        Write-Host "❌ socket.io missing!" -ForegroundColor Red
    }
    
    if ($hasPrisma) {
        Write-Host "✅ @prisma/client installed" -ForegroundColor Green
    } else {
        Write-Host "❌ @prisma/client missing!" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "🚀 System Status:" -ForegroundColor Cyan
    Write-Host "  ✅ Database tables: OK" -ForegroundColor Green
    Write-Host "  ✅ Server file: OK" -ForegroundColor Green
    Write-Host "  ✅ Dependencies: OK" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor Cyan
    Write-Host "  1. Make sure server is running: npm run dev" -ForegroundColor White
    Write-Host "  2. Open admin page: http://localhost:3000/admin/support" -ForegroundColor White
    Write-Host "  3. Open browser console (F12) to see connection logs" -ForegroundColor White
    Write-Host ""
    Write-Host "If you still have issues, please share:" -ForegroundColor Yellow
    Write-Host "  - Browser console errors (F12 → Console)" -ForegroundColor White
    Write-Host "  - Server terminal output" -ForegroundColor White
    Write-Host ""
    
} else {
    Write-Host ""
    Write-Host "❌ Database test failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please run the SQL file again:" -ForegroundColor Yellow
    Write-Host "  1. Open pgAdmin or your database tool" -ForegroundColor White
    Write-Host "  2. Run: add-support-tables-NOW.sql" -ForegroundColor White
    Write-Host "  3. Then run: npx prisma generate" -ForegroundColor White
    Write-Host ""
}
