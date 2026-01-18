# 📧 Email Verification & Password Reset System - Setup Guide

## 🎯 What I Created

A complete email verification and password reset system with:
- ✅ Email verification on signup
- ✅ Password reset via email
- ✅ Beautiful email templates
- ✅ Secure token-based system
- ✅ User-friendly UI pages

---

## 📁 Files Created

### Database:
- `prisma/migrations/add_email_verification.sql` - Database migration
- `prisma/schema.prisma` - Updated schema

### Backend:
- `lib/email.ts` - Email sending functions
- `app/api/auth/signup/route.ts` - Updated signup (sends verification)
- `app/api/auth/verify-email/route.ts` - Email verification
- `app/api/auth/forgot-password/route.ts` - Request password reset
- `app/api/auth/reset-password/route.ts` - Reset password

### Frontend:
- `app/auth/verify-email/page.tsx` - Email verification page
- `app/auth/forgot-password/page.tsx` - Forgot password page
- `app/auth/reset-password/page.tsx` - Reset password page

---

## 🚀 Setup Instructions

### Step 1: Install Dependencies

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

### Step 2: Run Database Migration

```bash
# Apply the migration
npx prisma db push

# Or create a migration
npx prisma migrate dev --name add_email_verification

# Regenerate Prisma client
npx prisma generate
```

### Step 3: Configure Email Service

Add to `.env.local`:

```bash
# Email Configuration (Gmail Example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Your website URL
NEXTAUTH_URL=http://localhost:3000
```

### Step 4: Setup Gmail App Password (if using Gmail)

1. Go to Google Account settings
2. Security → 2-Step Verification (enable it)
3. Security → App passwords
4. Generate app password for "Mail"
5. Copy the password to `EMAIL_PASSWORD` in `.env.local`

---

## 🔄 How It Works

### **User Signup Flow:**

```
1. User fills signup form
   ↓
2. Password is hashed
   ↓
3. Verification token generated (random 32-byte string)
   ↓
4. User saved to database (emailVerified = false)
   ↓
5. Verification email sent with token link
   ↓
6. User clicks link in email
   ↓
7. Token verified → emailVerified = true
   ↓
8. Welcome email sent
   ↓
9. User can now login
```

### **Password Reset Flow:**

```
1. User clicks "Forgot Password"
   ↓
2. Enters email address
   ↓
3. Reset token generated (expires in 1 hour)
   ↓
4. Reset email sent with token link
   ↓
5. User clicks link
   ↓
6. Enters new password
   ↓
7. Token verified (not expired?)
   ↓
8. Password updated (hashed)
   ↓
9. Token cleared from database
   ↓
10. User redirected to login
```

---

## 📧 Email Templates

### 1. Verification Email
- **Subject:** 🌿 Verify Your Email - ALG EcoTour
- **Contains:** Verification button/link
- **Expires:** 24 hours
- **Action:** Sets `emailVerified = true`

### 2. Password Reset Email
- **Subject:** 🔒 Reset Your Password - ALG EcoTour
- **Contains:** Reset button/link
- **Expires:** 1 hour
- **Action:** Allows setting new password

### 3. Welcome Email
- **Subject:** 🎉 Welcome to ALG EcoTour!
- **Contains:** Welcome message, 10% discount code
- **Sent:** After email verification
- **Action:** Engages new user

---

## 🔐 Security Features

### Token Generation:
```typescript
// 32-byte random token = 64 hex characters
const token = crypto.randomBytes(32).toString('hex');
```

### Password Hashing:
```typescript
// Bcrypt with 10 rounds
const hashedPassword = await bcrypt.hash(password, 10);
```

### Token Expiration:
```typescript
// Reset tokens expire after 1 hour
const resetExpires = new Date(Date.now() + 3600000);
```

### One-Time Use:
- Tokens are deleted after use
- Prevents reuse attacks

---

## 🎨 User Interface Pages

### Verify Email Page (`/auth/verify-email`)
- Shows loading spinner
- Success: ✅ "Email Verified!"
- Error: ❌ "Verification Failed"
- Auto-redirects to login after 3 seconds

### Forgot Password Page (`/auth/forgot-password`)
- Email input form
- Success message (even if email doesn't exist - security)
- Link back to login

### Reset Password Page (`/auth/reset-password`)
- New password + confirm password
- Validation (min 6 characters)
- Success → redirects to login

---

## 🧪 Testing

### Test Email Verification:

```bash
# 1. Sign up new user
POST /api/auth/signup
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123"
}

# 2. Check email for verification link
# Link format: http://localhost:3000/auth/verify-email?token=abc123...

# 3. Click link or visit URL
GET /auth/verify-email?token=abc123...

# 4. Should see success message
# 5. Try to login - should work now!
```

### Test Password Reset:

```bash
# 1. Go to forgot password page
GET /auth/forgot-password

# 2. Enter email
POST /api/auth/forgot-password
{ "email": "test@example.com" }

# 3. Check email for reset link
# Link format: http://localhost:3000/auth/reset-password?token=def456...

# 4. Click link, enter new password
POST /api/auth/reset-password
{
  "token": "def456...",
  "password": "newpassword123"
}

# 5. Login with new password!
```

---

## 📊 Database Schema Changes

```sql
-- New columns added to users table:
emailVerified BOOLEAN DEFAULT FALSE
verificationToken TEXT
resetPasswordToken TEXT
resetPasswordExpires TIMESTAMP

-- Indexes for performance:
CREATE INDEX idx_verification_token ON users(verificationToken);
CREATE INDEX idx_reset_token ON users(resetPasswordToken);
```

---

## 🔧 Configuration Options

### Change Token Expiration:

```typescript
// In lib/email.ts or API routes

// Verification: 24 hours (default)
// To change, modify signup route

// Reset: 1 hour (default)
const resetExpires = new Date(Date.now() + 3600000); // milliseconds

// Change to 30 minutes:
const resetExpires = new Date(Date.now() + 1800000);

// Change to 2 hours:
const resetExpires = new Date(Date.now() + 7200000);
```

### Customize Email Templates:

Edit `lib/email.ts`:
- Change colors
- Add your logo
- Modify text
- Add more information

---

## 🌐 Email Service Alternatives

### Gmail (Current):
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

### SendGrid:
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your_sendgrid_api_key
```

### Mailgun:
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=postmaster@your-domain.mailgun.org
EMAIL_PASSWORD=your_mailgun_password
```

### Outlook/Hotmail:
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
```

---

## 🐛 Troubleshooting

### "Failed to send email"
- Check EMAIL_USER and EMAIL_PASSWORD in .env.local
- For Gmail: Use App Password, not regular password
- Enable "Less secure app access" (if needed)
- Check firewall/antivirus

### "Invalid token"
- Token may have expired
- Token already used
- Check token in URL is complete

### "Email not received"
- Check spam folder
- Verify email address is correct
- Check email service logs
- Try sending test email with nodemailer

### "Database error"
- Run `npx prisma generate`
- Run `npx prisma db push`
- Restart dev server

---

## 📱 Mobile App Integration

The same APIs work for your Flutter app!

```dart
// In Flutter app
// 1. User signs up
await ApiService.signup(name, email, password);

// 2. Show message: "Check your email to verify"
showDialog(/* verification message */);

// 3. User clicks link in email (opens browser)
// 4. Redirects back to app (optional deep link)
// 5. User can now login in app
```

---

## ✅ Checklist

Before going live:
- [ ] Test signup flow completely
- [ ] Test email verification
- [ ] Test password reset
- [ ] Test token expiration
- [ ] Check email spam score
- [ ] Update email templates with your branding
- [ ] Add unsubscribe link (for marketing emails)
- [ ] Setup custom domain for emails
- [ ] Test on mobile devices
- [ ] Add rate limiting (prevent spam)

---

## 🚀 Next Steps

### Optional Enhancements:

1. **Resend Verification Email:**
```typescript
POST /api/auth/resend-verification
{ "email": "user@example.com" }
```

2. **Email Change Verification:**
- Verify new email before changing
- Prevent account hijacking

3. **Two-Factor Authentication:**
- Add 2FA via email or SMS
- Extra security layer

4. **Login Activity Emails:**
- Notify on new device login
- Security alerts

5. **Email Preferences:**
- Let users choose email types
- Unsubscribe options

---

## 📞 Support

If you have issues:
1. Check console logs (browser & server)
2. Verify .env.local has all variables
3. Test with a real email address
4. Check email service status
5. Review Prisma Studio for database state

---

**Everything is ready to use! Just configure your email service and test! 🎉**
