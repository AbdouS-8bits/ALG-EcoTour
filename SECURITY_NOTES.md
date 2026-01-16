# Security Implementation Notes

This document outlines the security improvements implemented for the ALG EcoTour application following OWASP best practices.

## 🛡️ Security Headers

### Implementation Location: `middleware.ts`

### Headers Added:

1. **X-Frame-Options: DENY**
   - Prevents clickjacking attacks
   - Disallows embedding the site in iframes

2. **X-Content-Type-Options: nosniff**
   - Prevents MIME type sniffing attacks
   - Forces browser to use declared content type

3. **Referrer-Policy: strict-origin-when-cross-origin**
   - Controls referrer information sent to other sites
   - Only sends origin, path, and query for same-origin requests

4. **Permissions-Policy**
   - Restricts access to browser features
   - Disabled: geolocation, microphone, camera, payment, USB, sensors
   - Prevents unauthorized access to sensitive device APIs

5. **Content-Security-Policy (CSP)**
   - Basic CSP configuration for demo purposes
   - Allows scripts from same origin with unsafe-inline/eval for Next.js compatibility
   - Restricts external connections to OpenStreetMap domains only
   - Prevents loading untrusted resources

6. **X-XSS-Protection: 1; mode=block**
   - Enables browser XSS protection
   - Blocks detected XSS attempts

7. **Strict-Transport-Security (HSTS)**
   - Production only: enforces HTTPS for 1 year
   - Includes subdomains and preload directive

## 🚦 Rate Limiting

### Implementation Location: `middleware.ts`

### Configuration:

- **Auth Endpoints**: 5 requests per 15 minutes
  - Applies to `/api/auth/*` and `/api/admin/*`
  - Protects against brute force attacks
  
- **General API**: 100 requests per 15 minutes  
  - Applies to all `/api/*` endpoints
  - Prevents API abuse

### Features:

- **In-memory storage** using Map (suitable for demo)
- **IP-based identification** using x-forwarded-for and x-real-ip headers
- **Automatic cleanup** of expired rate limit records
- **429 responses** with Retry-After headers
- **JSON error responses** with reset time information

## 🔍 Input Validation

### Implementation Location: `lib/validation.ts`

### Validation Schemas:

#### Authentication:
- **Login Schema**: Email + password validation
- **Signup Schema**: Name, email, password, password confirmation
- **Password Requirements**: 8+ chars, uppercase, lowercase, number, special char

#### Tours:
- **Create Schema**: Title (3-200 chars), description (10-2000 chars), location, price, max participants, coordinates, photo URL
- **Update Schema**: Partial validation for PATCH operations

#### Bookings:
- **Create Schema**: Tour ID, guest name/email/phone, participants count
- **Phone Validation**: International format support
- **Participant Limits**: 1-20 participants

#### Users:
- **Update Schema**: Optional name, email, phone validation

### Features:

- **Zod validation** with detailed error messages
- **TypeScript integration** for compile-time safety
- **Sanitization** of input data
- **Consistent error formatting** across all endpoints

## 🛡️ Protected Routes

### Implementation Location: `middleware.ts`

### Admin Protection:
- **UI Routes**: `/admin/*` requires admin role
- **API Routes**: `/api/admin/*` requires admin role
- **Redirect**: Non-admin users redirected to home page

### Authentication Check:
- **JWT token validation** using NextAuth
- **Role-based access control** (admin vs user)
- **Automatic redirect** for unauthorized access

## 📍 Route-Specific Security

### 1. Authentication Routes (`/api/auth/`)

#### Login (`[...nextauth]/route.ts`):
- **Zod validation** for email and password
- **Credential verification** before database lookup
- **Password comparison** using bcrypt
- **Error logging** for failed attempts

#### Signup (`signup/route.ts`):
- **Full input validation** using signup schema
- **Duplicate email checking** before creation
- **Password hashing** with bcrypt (salt rounds: 10)
- **User creation** with default 'user' role

### 2. Booking Routes (`/api/bookings/`)

#### Create Booking (`POST`):
- **Comprehensive validation** using booking schema
- **Tour existence verification** before booking
- **Participant limit checking** against tour capacity
- **Data sanitization** before database insertion

### 3. Admin Tour Routes (`/api/admin/tours/`)

#### Create Tour (`POST`):
- **Tour schema validation** with all required fields
- **Coordinate validation** (latitude: -90 to 90, longitude: -180 to 180)
- **Price validation** (non-negative, reasonable limits)
- **Photo URL validation** if provided

## 🔧 Security Configuration

### Environment Variables:
- `NEXTAUTH_SECRET`: Required for JWT signing
- `DATABASE_URL`: Secure database connection
- Rate limits and CSP configured per environment

### Production Considerations:
1. **Rate Limiting**: Consider Redis or database-backed storage
2. **CSP**: Tighten policy based on actual requirements
3. **Monitoring**: Add logging for security events
4. **HTTPS**: Ensure proper SSL/TLS configuration

## 🚨 Security Monitoring

### Current Implementation:
- **Error logging** for validation failures
- **Rate limit exceeded logging**
- **Authentication failure tracking**

### Recommended Enhancements:
1. **Security headers monitoring** service
2. **Failed login attempt alerts**
3. **API abuse detection**
4. **Regular security audits**

## 📋 Security Checklist

### ✅ Implemented:
- [x] Security headers (X-Frame-Options, CSP, etc.)
- [x] Rate limiting for auth endpoints
- [x] Input validation with Zod
- [x] Admin route protection
- [x] Password strength requirements
- [x] SQL injection prevention (Prisma ORM)
- [x] XSS protection headers
- [x] CSRF protection (NextAuth built-in)

### 🔄 Future Improvements:
- [ ] Database-backed rate limiting
- [ ] Content Security Policy hardening
- [ ] Security monitoring dashboard
- [ ] API key authentication for external access
- [ ] Session timeout configuration
- [ ] Two-factor authentication

## 🧪 Testing Security

### Manual Testing:
1. **Rate Limiting**: Try >5 auth requests in 15 minutes
2. **Input Validation**: Submit invalid data to all endpoints
3. **Admin Access**: Attempt admin routes without admin role
4. **XSS Protection**: Test script injection in forms
5. **Headers**: Verify security headers in browser dev tools

### Automated Testing (Recommended):
1. **OWASP ZAP** for automated security scanning
2. **Burp Suite** for API security testing
3. **Security-focused unit tests** for validation logic

---

**Last Updated**: January 2026  
**Security Level**: OWASP Baseline Implementation  
**Next Review**: Quarterly or after major changes
