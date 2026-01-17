# Environment Setup Guide

This guide helps you configure environment variables for ALG EcoTour to run properly in development and production.

## Quick Setup

1. **Copy the template:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Edit `.env.local`** with your actual values
3. **Start the app:** `npm run dev`
4. **Check health:** Visit `http://localhost:3000/api/health`

## Required vs Optional Variables

### 🚨 Critical (App Won't Run Without These)
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - JWT signing secret (min 32 chars)
- `NEXTAUTH_URL` - NextAuth callback URL

### 🌐 Public URLs (Required)
- `NEXT_PUBLIC_SITE_URL` - Base URL for SEO/metadata
- `NEXT_PUBLIC_API_URL` - API base URL (use `/api` for local)

### 🔐 Optional Integrations
App will work without these, but related features will be disabled:

#### Cloudinary (Image Uploads)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY` 
- `CLOUDINARY_API_SECRET`

*If missing: Upload endpoint returns "Upload not configured"*

#### Email (Notifications)
- `EMAIL_HOST` (default: smtp.gmail.com)
- `EMAIL_PORT` (default: 587)
- `EMAIL_USER`
- `EMAIL_PASSWORD`

*If missing: Email functions log warnings and skip sending*

### 🧪 Testing (Optional)
- `E2E_USER_EMAIL`
- `E2E_USER_PASSWORD`
- `E2E_ADMIN_EMAIL`
- `E2E_ADMIN_PASSWORD`

## Configuration Examples

### Development Setup
```bash
# Database (local PostgreSQL)
DATABASE_URL="postgresql://postgres:password@localhost:5432/algecotour"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-jwt-key-min-32-characters"
NEXTAUTH_URL="http://localhost:3000"

# Public URLs
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="/api"

# Optional: Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Optional: Email (Gmail example)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
```

### Production Setup
```bash
# Database (production)
DATABASE_URL="postgresql://user:pass@host:5432/db"

# NextAuth
NEXTAUTH_SECRET="production-secret-key-32-chars-min"
NEXTAUTH_URL="https://yourdomain.com"

# Public URLs
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
NEXT_PUBLIC_API_URL="https://yourdomain.com/api"
```

## Troubleshooting Checklist

### App Won't Start
- [ ] `DATABASE_URL` is valid and database is running
- [ ] `NEXTAUTH_SECRET` is at least 32 characters
- [ ] `NEXTAUTH_URL` matches your current URL

### Upload Not Working
- [ ] All three `CLOUDINARY_*` variables are set
- [ ] Cloudinary account is active
- [ ] API keys have upload permissions

### Email Not Working
- [ ] All four `EMAIL_*` variables are set
- [ ] For Gmail: Use "App Password" not regular password
- [ ] SMTP server is accessible from your environment

### Health Check Results
Visit `/api/health` to see current status:
```json
{
  "ok": true,
  "db": true,
  "auth": true,
  "cloudinary": true,
  "email": false,
  "timestamp": "2024-01-17T10:30:00.000Z"
}
```

## Security Notes

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Use strong secrets** - Generate random strings for `NEXTAUTH_SECRET`
3. **Environment-specific values** - Use different configs for dev/staging/prod
4. **Cloudinary security** - Enable signed uploads in production
5. **Email security** - Use app-specific passwords, not main passwords

## Getting Help

1. Check the health endpoint: `GET /api/health`
2. Review server logs for configuration warnings
3. Verify each section in this troubleshooting checklist
4. Test database connectivity separately if needed

## Demo Mode

For demo purposes without integrations:
1. Set only the critical variables (DATABASE_URL, NEXTAUTH_*, NEXT_PUBLIC_*)
2. The app will run with upload and email features disabled
3. UI will show appropriate "disabled in demo" messages
