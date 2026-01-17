# ALG-EcoTour Deployment Runbook

**Date**: January 15, 2026  
**Purpose**: Complete deployment guide for ALG-EcoTour web application  
**System**: ALG-EcoTour Web Application  
**Status**: ✅ **PRODUCTION READY**

---

## 📋 **Table of Contents**

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Database Setup](#database-setup)
4. [Database Migration](#database-migration)
5. [Database Seeding](#database-seeding)
6. [Application Build](#application-build)
7. [Hosting Options](#hosting-options)
8. [Deployment Steps](#deployment-steps)
9. [Post-Deployment](#post-deployment)
10. [Troubleshooting](#troubleshooting)

---

## 🚀 **Prerequisites**

### **Required Software**
- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **PostgreSQL**: Version 13.x or higher
- **Git**: Version 2.x or higher

### **Required Accounts**
- **Database**: PostgreSQL hosting account
- **Hosting**: Vercel, Render, or similar platform
- **Image Hosting**: Cloudinary account (for image uploads)
- **Domain**: Custom domain (optional)

### **System Requirements**
- **RAM**: Minimum 2GB (4GB recommended)
- **Storage**: Minimum 10GB (20GB recommended)
- **CPU**: 2 cores (4 cores recommended)

---

## 🔧 **Environment Variables**

### **Required Environment Variables**

| Variable | Description | Example | Required |
|-----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@host:5432/dbname` | ✅ |
| `NEXTAUTH_SECRET` | JWT secret key (32+ chars) | `super-secret-key-change-in-production` | ✅ |
| `NEXTAUTH_URL` | Application base URL | `https://yourdomain.com` | ✅ |
| `NODE_ENV` | Environment mode | `production` | ✅ |

### **Optional Environment Variables**

| Variable | Description | Example | Required |
|-----------|-------------|---------|----------|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud-name` | ⚠️ |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `1234567890` | ⚠️ |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abc123def456` | ⚠️ |
| `NEXT_PUBLIC_SITE_URL` | Public site URL | `https://yourdomain.com` | ⚠️ |

### **Environment File Setup**

Create `.env.local` in project root:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/alg_ecotour"

# NextAuth.js Configuration
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production-min-32-chars"
NEXTAUTH_URL="https://yourdomain.com"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# App Configuration
NODE_ENV="production"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

---

## 🗄️ **Database Setup**

### **PostgreSQL Configuration**

#### **Local Development**
```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb alg_ecotour
sudo -u postgres createuser --interactive alg_ecotour_user
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE alg_ecotour TO alg_ecotour_user;"
sudo -u postgres psql -c "ALTER USER alg_ecotour_user CREATEDB;"
```

#### **Production Database Services**

**PostgreSQL on Vercel**
```bash
# Add to package.json
{
  "scripts": {
    "db:setup": "npx prisma db push"
  }
}
```

**PostgreSQL on Render**
```bash
# Create database through Render dashboard
# Note connection string from Render dashboard
```

**AWS RDS**
```bash
# Create RDS instance through AWS console
# Configure security groups to allow application access
```

### **Database Connection Testing**

```bash
# Test database connection
npx prisma db pull
npx prisma generate
npx prisma db push
```

---

## 🔄 **Database Migration**

### **Migration Files Location**
- **Schema**: `prisma/schema.prisma`
- **Migrations**: `prisma/migrations/`
- **Seed File**: `prisma/seed.ts`

### **Migration Commands**

#### **Initial Setup**
```bash
# Generate Prisma client
npx prisma generate

# Create initial migration
npx prisma migrate dev --name init

# Apply migration to database
npx prisma db push
```

#### **Production Migration**
```bash
# Generate migration from schema
npx prisma migrate dev --name production_setup

# Deploy migration to production
npx prisma migrate deploy

# Verify database schema
npx prisma db pull
```

### **Migration Best Practices**

```bash
# Always backup before migration
pg_dump alg_ecotour > backup.sql

# Test migrations locally first
npx prisma migrate dev

# Use transaction for complex migrations
npx prisma migrate dev --name complex_changes --create-only
```

---

## 🌱 **Database Seeding**

### **Seed Script Overview**

The seed script creates:
- **Admin User**: Default admin account
- **Sample Tours**: 6 pre-configured eco tours
- **Sample Data**: Realistic Algerian tour data

### **Seeding Commands**

#### **Development Seeding**
```bash
# Run seed script
npm run seed

# Alternative method
npx prisma db seed
```

#### **Production Seeding**
```bash
# Seed production database
NODE_ENV=production npm run seed

# Seed with custom data
npx prisma db seed --preview-feature
```

### **Seed Data Overview**

**Default Admin Account**
- **Email**: `admin@ecotour.com`
- **Password**: `Admin@123` (change in production)
- **Role**: `admin`

**Sample Tours Created**
1. **Sahara Desert Adventure** - عين صالح، تمنراست
2. **Hoggar Mountains Trek** - تيزي وزو، باتنة
3. **Ghardaia Oasis Tour** - غرداية
4. **Annaba Coastal Trip** - عنابة
5. **Tassili n'Ajjer Visit** - دران، الطاسيلي
6. **Timimoun Rock Art** - تيميمون

### **Customizing Seed Data**

```typescript
// Edit prisma/seed.ts
const tours = [
  {
    title: 'Your Custom Tour',
    description: 'Tour description',
    location: 'Location',
    latitude: 36.7538,
    longitude: 3.0588,
    price: 15000.00,
    maxParticipants: 20,
    photoURL: 'https://your-image-url.jpg'
  }
  // Add more tours...
];
```

---

## 🔨 **Application Build**

### **Build Commands**

#### **Development Build**
```bash
# Development build with hot reload
npm run dev

# Build for development
npm run build
```

#### **Production Build**
```bash
# Production build
npm run build

# Build with analysis
npm run build --analyze

# Build for specific platform
npm run build --platform=linux
```

### **Build Optimization**

#### **Next.js Optimization**
```typescript
// next.config.ts optimizations
const nextConfig: NextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
    unoptimized: false,
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // ... more headers
        ],
      },
    ];
  },
};
```

#### **Bundle Analysis**
```bash
# Analyze bundle size
npm run build --analyze

# Check bundle composition
npx @next/bundle-analyzer

# Optimize images
npx next-optimise-images
```

---

## 🌐 **Hosting Options**

### **Vercel (Recommended)**

#### **Advantages**
- ✅ Seamless Next.js integration
- ✅ Automatic deployments
- ✅ Global CDN
- ✅ SSL certificates
- ✅ Edge functions
- ✅ Analytics

#### **Deployment Steps**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy application
vercel --prod

# Set environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add CLOUDINARY_CLOUD_NAME
```

#### **Vercel Configuration**
Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "NODE_ENV": "production"
  },
  "build": {
    "env": {
      "NEXTAUTH_SECRET": "@nextauth_secret",
      "DATABASE_URL": "@database_url"
    }
  }
}
```

### **Render**

#### **Advantages**
- ✅ PostgreSQL included
- ✅ SSL certificates
- ✅ Auto-deploys
- ✅ Preview environments
- ✅ Databases as a service

#### **Deployment Steps**
```bash
# Connect repository to Render
# Create PostgreSQL service
# Create Web Service
# Configure environment variables
# Deploy
```

#### **Render Configuration**
Create `render.yaml`:
```yaml
services:
  - type: web
    name: alg-ecotour
    env: web
    plan: free
    buildCommand: npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: NEXTAUTH_SECRET
        generateValue: true
      - key: DATABASE_URL
        fromDatabase:
          name: alg-ecotour-db
          property: connectionString
```

### **AWS Amplify**

#### **Advantages**
- ✅ AWS integration
- ✅ GraphQL/REST APIs
- ✅ Authentication
- ✅ Hosting
- ✅ Functions

#### **Deployment Steps**
```bash
# Install AWS Amplify CLI
npm install -g @aws-amplify/cli

# Initialize Amplify
amplify init

# Add hosting
amplify add hosting

# Configure environment
amplify env add

# Deploy
amplify publish
```

### **DigitalOcean**

#### **Advantages**
- ✅ Full control
- ✅ Competitive pricing
- ✅ Global CDN
- ✅ SSL certificates
- ✅ Databases

#### **Deployment Steps**
```bash
# Create Droplet
# Install Node.js
# Clone repository
# Install dependencies
# Build application
# Configure PM2
# Setup Nginx
# Deploy
```

---

## 🚀 **Deployment Steps**

### **Pre-Deployment Checklist**

#### **Code Quality**
- [ ] All tests passing
- [ ] No console errors
- [ ] Build successful
- [ ] Environment variables set
- [ ] Database migrations applied
- [ ] SSL certificates configured

#### **Security**
- [ ] Environment variables secured
- [ ] Database credentials protected
- [ ] API keys not exposed
- [ ] HTTPS enabled
- [ ] Security headers configured

### **Step-by-Step Deployment**

#### **1. Repository Setup**
```bash
# Clone repository
git clone <repository-url>
cd ALG-EcoTour

# Switch to production branch
git checkout main

# Install dependencies
npm install
```

#### **2. Environment Configuration**
```bash
# Create production environment file
cp .env.example .env.local

# Edit environment variables
nano .env.local

# Verify configuration
cat .env.local
```

#### **3. Database Setup**
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Verify database connection
npx prisma db pull
```

#### **4. Application Build**
```bash
# Build application
npm run build

# Verify build output
ls -la .next

# Test build locally
npm start
```

#### **5. Deployment**
```bash
# Deploy to Vercel
vercel --prod

# Or deploy to other platform
# Follow platform-specific instructions
```

#### **6. Post-Deployment**
```bash
# Verify deployment
curl -I https://yourdomain.com

# Test database connection
curl https://yourdomain.com/api/tours

# Test authentication
# Visit admin login page
```

---

## ✅ **Post-Deployment**

### **Verification Checklist**

#### **Application Health**
- [ ] Application loads successfully
- [ ] All pages render correctly
- [ ] Navigation works properly
- [ ] Forms submit correctly
- [ ] Database queries work

#### **Functionality Testing**
- [ ] User authentication works
- [ ] Admin dashboard accessible
- [ ] Tour CRUD operations
- [ ] Booking system functional
- [ ] Image uploads working
- [ ] Map functionality works

#### **Performance**
- [ ] Page load times < 3 seconds
- [ ] Core Web Vitals passing
- [ ] Images optimized
- [ ] Database queries efficient
- [ ] No console errors

#### **Security**
- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] Environment variables secured
- [ ] Authentication working
- [ ] Rate limiting active
- [ ] Input validation working

### **Monitoring Setup**

#### **Application Monitoring**
```bash
# Add error tracking
npm install @sentry/nextjs

# Add performance monitoring
npm install @vercel/analytics

# Configure monitoring
# Add to next.config.ts
```

#### **Database Monitoring**
```bash
# Enable query logging
# Monitor slow queries
# Set up alerts
# Backup regularly
```

#### **Log Management**
```bash
# Configure application logs
# Set up log rotation
# Monitor error rates
# Create alerting system
```

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Build Failures**
```bash
# Clear build cache
rm -rf .next
npm run build

# Check Node.js version
node --version

# Update dependencies
npm update
```

#### **Database Connection Issues**
```bash
# Test database connection
npx prisma db pull

# Check environment variables
printenv | grep DATABASE

# Reset database schema
npx prisma migrate reset
```

#### **Authentication Issues**
```bash
# Check NEXTAUTH_SECRET
echo $NEXTAUTH_SECRET

# Verify NEXTAUTH_URL
echo $NEXTAUTH_URL

# Clear session storage
# Clear browser cookies
```

#### **Image Upload Issues**
```bash
# Check Cloudinary configuration
echo $CLOUDINARY_CLOUD_NAME

# Test image upload
curl -X POST https://api.cloudinary.com/v1_1/auto/upload

# Check API key permissions
```

### **Error Resolution**

#### **Build Errors**
```bash
# Check TypeScript errors
npm run lint

# Fix import issues
npm install missing-package

# Resolve dependency conflicts
npm install --force
```

#### **Runtime Errors**
```bash
# Check application logs
vercel logs

# Check database logs
heroku logs --tail

# Debug locally
npm run dev
```

#### **Performance Issues**
```bash
# Analyze bundle size
npm run build --analyze

# Optimize images
npx next-optimise-images

# Check Core Web Vitals
npx lighthouse
```

---

## 📞 **Support & Resources**

### **Documentation**
- **Next.js Documentation**: https://nextjs.org/docs
- **Prisma Documentation**: https://www.prisma.io/docs
- **NextAuth.js Documentation**: https://next-auth.js.org
- **Vercel Documentation**: https://vercel.com/docs

### **Community Support**
- **GitHub Issues**: https://github.com/your-repo/issues
- **Discord Community**: https://discord.gg/nextjs
- **Stack Overflow**: https://stackoverflow.com/questions/tagged/nextjs

### **Professional Support**
- **Next.js Consulting**: https://vercel.com/consulting
- **Prisma Support**: https://www.prisma.io/support
- **Cloudinary Support**: https://cloudinary.com/support

---

## 📊 **Deployment Metrics**

### **Performance Targets**
- **Build Time**: < 3 minutes
- **Page Load**: < 3 seconds
- **Time to Interactive**: < 1.5 seconds
- **First Contentful Paint**: < 1.5 seconds
- **Largest Contentful Paint**: < 2.5 seconds

### **Uptime Targets**
- **Availability**: 99.9%
- **Response Time**: < 200ms
- **Error Rate**: < 1%
- **Database Uptime**: 99.9%

### **Security Metrics**
- **SSL Certificate**: Valid and up-to-date
- **Security Headers**: All headers configured
- **Vulnerability Scan**: No critical issues
- **Authentication**: Properly secured

---

**Last Updated**: January 15, 2026  
**Version**: 1.0  
**System**: ALG-EcoTour Deployment Runbook  
**Status**: ✅ **PRODUCTION READY**

This runbook provides comprehensive guidance for deploying the ALG-EcoTour application to production. Follow these steps carefully to ensure a successful deployment with proper security, performance, and monitoring.
