# Environment Variables Template
# Copy this file to .env.local and fill in your actual values

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/algecotour"

# NextAuth Configuration
NEXTAUTH_SECRET="your-super-secret-jwt-key-min-32-characters"
NEXTAUTH_URL="http://localhost:3000"

# Public URLs (Client-side accessible)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="/api"

# Cloudinary Configuration (Optional - for image uploads)
# If not set, upload functionality will be disabled
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email Configuration (Optional - for email notifications)
# If not set, email functionality will be disabled
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"

# E2E Testing Configuration (Optional)
E2E_USER_EMAIL="test@example.com"
E2E_USER_PASSWORD="password123"
E2E_ADMIN_EMAIL="admin@example.com"
E2E_ADMIN_PASSWORD="admin123"

# Environment
NODE_ENV="development"
