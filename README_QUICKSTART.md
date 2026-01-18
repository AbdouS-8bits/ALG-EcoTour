# ALG-EcoTour Quick Start Guide

## 🚀 Project Setup (5 minutes)

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- Flutter SDK (for mobile app)

### 1. Clone & Install
```bash
git clone <repo-url>
cd ALG-EcoTour
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

**Required Environment Variables:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/ecotour_db"
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations (creates schema)
npx prisma migrate dev --name init

# Seed database with sample data (6 tours + admin user)
npm run seed
```

### 4. Start Development
```bash
# Development server
npm run dev
# Web app: http://localhost:3000
# Admin: http://localhost:3000/admin/login
# Admin credentials: admin@ecotour.com / Admin@123
```

### 5. Production Deployment
```bash
# Build for production
npm run build

# Start production server
npm run start
# Production runs on: http://localhost:3000
```

### 6. Mobile App (Optional)
```bash
cd ALG-ecoTour-app
flutter pub get
flutter run  # Requires emulator/device
```

## 📁 Key Files

| File/Directory | Purpose |
|----------------|---------|
| `/app/` | Next.js pages & API routes |
| `/components/` | Reusable UI components |
| `/prisma/` | Database schema & migrations |
| `/ALG-ecoTour-app/` | Flutter mobile app |
| `/public/images/` | Static assets |

## 🔧 Exact Commands Reference

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database with sample data
```

### Database Commands
```bash
npx prisma generate  # Generate Prisma client
npx prisma migrate dev --name <migration-name>  # Run migrations
npx prisma studio     # Open database GUI
npx prisma migrate reset  # Reset database (destructive)
```

### Production Commands
```bash
# Full production setup
npm install
cp .env.example .env.local  # Update with production values
npx prisma generate
npx prisma migrate deploy
npm run build
npm run seed
npm run start
```

## 🚨 Common Errors & Fixes

### Error: "Database connection failed"
**Fix:** 
- Ensure PostgreSQL is running: `sudo systemctl status postgresql`
- Check DATABASE_URL in `.env.local`
- Verify database exists: `createdb ecotour_db`

### Error: "Prisma client not generated"
**Fix:** 
```bash
npx prisma generate
```

### Error: "NEXTAUTH_SECRET too short"
**Fix:** 
- Use at least 32 characters in `.env.local`
- Generate with: `openssl rand -base64 32`

### Error: "Port 3000 already in use"
**Fix:** 
```bash
# Kill process on port 3000
sudo lsof -ti:3000 | xargs kill -9
# Or use different port
PORT=3001 npm run dev
```

### Error: "Migration failed"
**Fix:** 
```bash
# Reset and retry
npx prisma migrate reset
npm run seed
```

### Error: "Build fails with TypeScript errors"
**Fix:** 
```bash
# Check specific errors
npm run build
# Fix lint issues
npm run lint --fix
```

### Error: "Images not loading"
**Fix:** 
- Check internet connection (using Unsplash URLs)
- Verify photoURL field in database
- Add local images to `/public/images/`

### Error: "Admin login not working"
**Fix:** 
- Seed database: `npm run seed`
- Use credentials: `admin@ecotour.com` / `Admin@123`
- Check NextAuth configuration

## 📱 Features Status

| Feature | Status | Test Command |
|---------|--------|--------------|
| Web App | ✅ Working | `npm run dev` |
| Database | ✅ Working | `npx prisma studio` |
| Maps | ✅ Working | Visit `/ecoTour` |
| Auth | ✅ Working | Visit `/admin/login` |
| Build | ✅ Working | `npm run build` |
| Mobile App | 🔄 Basic | `cd ALG-ecoTour-app && flutter run` |

## 🎯 Quick Verification

After setup, verify these URLs work:
- [ ] http://localhost:3000 (Home page)
- [ ] http://localhost:3000/ecoTour (Tours listing)
- [ ] http://localhost:3000/admin/login (Admin login)
- [ ] http://localhost:3000/admin/dashboard (Dashboard after login)

## 🆘 Support

1. Check this guide first
2. Review `SECURITY_NOTES.md` for security setup
3. Check existing Issues in repo
4. Contact project maintainers

---

**Last Updated:** $(date)  
**Version:** 0.1.0  
**Status:** ✅ Production Ready
