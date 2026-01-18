# User Profile Implementation

**Date**: January 15, 2026  
**Purpose**: Documentation for user profile management functionality  
**System**: ALG-EcoTour Web Application  
**Status**: ✅ **IMPLEMENTED**

---

## 📋 **Overview**

This document explains the complete user profile implementation that allows authenticated users to view and edit their personal information including name and phone number, with proper validation, error handling, and user feedback.

---

## 🎯 **Features Implemented**

### **✅ Require Login**
- **Server-Side Authentication**: Uses `getServerSession()` for secure authentication
- **Automatic Redirect**: Unauthenticated users redirected to `/auth/login`
- **Session Validation**: Proper NextAuth session handling
- **User Isolation**: Users can only access their own profile

### **✅ Show User Info: Name, Email, Phone**
- **Profile Header**: User avatar with initials, name, and email
- **Account Information**: Member since date and account type
- **Contact Details**: Editable name and phone fields
- **Read-Only Email**: Email field displayed but not editable
- **Last Updated**: Shows when profile was last modified

### **✅ Allow Editing Name + Phone**
- **Real-Time Validation**: Client-side validation with error messages
- **Phone Format**: International phone number format support
- **Character Limits**: Name limited to 100 characters
- **Optional Fields**: Phone number is optional
- **Instant Feedback**: Error messages appear/disappear as user types

### **✅ Create/Update DB Fields with Prisma**
- **Phone Field**: Added `phone` field to User model
- **Database Migration**: Applied schema changes to PostgreSQL
- **Type Safety**: Updated TypeScript interfaces
- **Data Validation**: Server-side validation with Zod schemas

---

## 🏗️ **Architecture**

### **Component Structure**

```
app/profile/
├── page.tsx                    # Server component with auth guard
├── ProfileClient.tsx          # Client component with form logic
└── (API Integration)

app/api/user/profile/
└── route.ts                    # GET/POST endpoints for profile

lib/
└── user.ts                     # User profile helper functions

components/bookings/
└── Toast.tsx                   # Toast notification system

prisma/
└── schema.prisma               # Updated User model with phone field
```

### **Data Flow**

1. **Server Component**: Authenticates user and fetches profile data
2. **Client Component**: Displays form with real-time validation
3. **Form Submission**: PATCH request to `/api/user/profile`
4. **Server Validation**: Zod schema validation and database update
5. **Response Handling**: Success/error feedback via toast notifications
6. **UI Update**: Local state updated with new profile data

---

## 🔧 **Database Schema**

### **Updated User Model**

```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  name      String?
  phone     String?   // NEW: Optional phone field
  password  String    // Store hashed passwords in production
  role      String    @default("user") // "admin" or "user"
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  // Relations
  adminAuditLogs AdminAuditLog[]

  @@map("users")
}
```

### **Migration Applied**

```sql
-- Added phone field to users table
ALTER TABLE "users" ADD COLUMN "phone" TEXT;
```

---

## 🔐 **API Implementation**

### **GET /api/user/profile**

**Endpoint**: `GET /api/user/profile`

**Authentication**: Required (NextAuth session)

**Response**:
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+213 555 123 456",
  "role": "user",
  "createdAt": "2026-01-15T10:00:00.000Z",
  "updatedAt": "2026-01-15T12:00:00.000Z"
}
```

### **PATCH /api/user/profile**

**Endpoint**: `PATCH /api/user/profile`

**Authentication**: Required (NextAuth session)

**Request Body**:
```json
{
  "name": "John Doe",
  "phone": "+213 555 123 456"
}
```

**Validation Schema**:
```typescript
const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters').optional(),
  phone: z.string().regex(/^[+]?[\d\s\-\(\)]+$/, 'Invalid phone number format').optional().or(z.literal('')),
});
```

**Response**:
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+213 555 123 456",
  "role": "user",
  "createdAt": "2026-01-15T10:00:00.000Z",
  "updatedAt": "2026-01-15T12:30:00.000Z"
}
```

**Error Responses**:
```json
// Authentication required
{
  "error": "Authentication required"
}

// Invalid input
{
  "error": "Invalid input",
  "details": [
    {
      "code": "too_small",
      "message": "Name is required"
    }
  ]
}

// User not found
{
  "error": "User not found"
}
```

---

## 🎨 **UI Components**

### **Profile Header**

**Features**:
- **Avatar**: Dynamic avatar with user initials
- **User Info**: Name, email, and member since date
- **Camera Icon**: Placeholder for future avatar upload
- **Responsive**: Mobile-friendly layout

### **Profile Form**

**Fields**:
- **Name**: Required field with character limit
- **Email**: Read-only field with disabled styling
- **Phone**: Optional field with format validation

**Validation**:
- **Real-time**: Errors appear as user types
- **Visual**: Red borders and error icons
- **Helpful**: Clear error messages and examples
- **Accessibility**: Proper labels and ARIA attributes

### **Account Information Section**

**Details Displayed**:
- **Account Type**: User role (user/admin)
- **Member Since**: Registration date
- **Last Updated**: Profile modification date

---

## 🔐 **Security & Validation**

### **Authentication**
- **Server-Side**: `getServerSession()` validation
- **Session Check**: Ensures user is logged in
- **Unauthorized Access**: 401 response for unauthenticated requests

### **Input Validation**
- **Client-Side**: Real-time validation feedback
- **Server-Side**: Zod schema validation
- **Sanitization**: Proper input sanitization
- **Type Safety**: TypeScript interfaces for all data

### **Data Protection**
- **User Isolation**: Users can only modify their own profile
- **Email Protection**: Email field is read-only
- **Secure Updates**: Atomic database operations
- **Error Handling**: Secure error messages

---

## 📱 **User Experience**

### **Profile Management Flow**

1. **Access**: User navigates to `/profile`
2. **Authentication**: Server validates session
3. **Data Load**: Profile data fetched from database
4. **Display**: Form populated with current data
5. **Editing**: User modifies name and/or phone
6. **Validation**: Real-time validation feedback
7. **Submission**: Form data sent to API
8. **Processing**: Server validates and updates database
9. **Feedback**: Success/error toast notification
10. **UI Update**: Form updated with new data

### **Error Handling**

- **Validation Errors**: Inline error messages with visual indicators
- **Network Errors**: Toast notifications with retry suggestions
- **Server Errors**: Generic error message with support contact
- **Session Errors**: Automatic redirect to login page

### **Accessibility**

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels and roles
- **Focus Management**: Logical tab order and focus indicators
- **Color Contrast**: WCAG AA compliant colors
- **Error Announcements**: Screen reader compatible error messages

---

## 🧪 **Testing Scenarios**

### **Happy Path**
1. User logs in and navigates to profile
2. Profile loads with current data
3. User updates name and/or phone
4. Form validation passes
5. Profile updates successfully
6. Success toast appears
7. UI reflects changes immediately

### **Error Scenarios**
1. **Unauthenticated Access**: Redirected to login
2. **Invalid Name**: Validation error with helpful message
3. **Invalid Phone**: Format validation error
4. **Network Error**: Toast notification with retry option
5. **Server Error**: Generic error with support info

### **Edge Cases**
1. **Empty Name**: Required field validation
2. **Long Name**: Character limit validation
3. **Special Characters**: Phone format validation
4. **Session Exire**: Graceful handling of expired sessions
5. **Concurrent Updates**: Last update wins strategy

---

## 📊 **Performance Considerations**

### **Optimizations**
- **Server-Side Data**: Initial data fetched on server
- **Local State**: Efficient state management
- **Validation**: Client-side validation reduces API calls
- **Error Recovery**: Automatic retry mechanisms

### **Database Efficiency**
- **Indexed Queries**: Email-based primary key
- **Atomic Updates**: Single transaction updates
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Minimal data fetching

---

## 🔮 **Future Enhancements**

### **Advanced Features**
- **Avatar Upload**: Profile picture management
- **Email Change**: Email verification process
- **Password Change**: Secure password update flow
- **Two-Factor Auth**: Enhanced security options
- **Profile Completion**: Progress tracking for profile completeness

### **UI Improvements**
- **Dark Mode**: Support for dark theme
- **Internationalization**: Multi-language support
- **Mobile App**: Native mobile profile management
- **Social Links**: Social media profile integration

### **Analytics**
- **Profile Views**: Track profile visit statistics
- **Update Frequency**: Monitor profile update patterns
- **User Engagement**: Profile completion metrics
- **Conversion Tracking**: Profile-to-booking correlation

---

## 📝 **Code Examples**

### **API Route Implementation**
```typescript
export async function PATCH(request: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const body = await request.json();
  const validation = updateProfileSchema.safeParse(body);
  
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: validation.error.issues },
      { status: 400 }
    );
  }

  const updatedProfile = await updateUserProfile(session.user.email, validation.data);
  return NextResponse.json(updatedProfile);
}
```

### **Client-Side Validation**
```typescript
const validateForm = () => {
  const newErrors: Record<string, string> = {};

  if (!formData.name.trim()) {
    newErrors.name = 'Name is required';
  } else if (formData.name.length > 100) {
    newErrors.name = 'Name must be less than 100 characters';
  }

  if (formData.phone && !/^[+]?[\d\s\-\(\)]+$/.test(formData.phone)) {
    newErrors.phone = 'Invalid phone number format';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### **Database Helper**
```typescript
export async function updateUserProfile(email: string, data: UpdateProfileData): Promise<UserProfile> {
  const user = await prisma.user.update({
    where: { email },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.phone !== undefined && { phone: data.phone }),
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}
```

---

## 🚀 **Deployment Notes**

### **Database Migration**
```bash
# Apply schema changes
npx prisma db push

# Generate updated client
npx prisma generate

# Verify migration
npx prisma db pull
```

### **Environment Variables**
No additional environment variables required. Uses existing NextAuth configuration.

### **Build Verification**
```bash
# Test build
npm run build

# Verify API routes
curl -X GET http://localhost:3000/api/user/profile

# Test profile update
curl -X PATCH http://localhost:3000/api/user/profile \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "phone": "+1234567890"}'
```

---

**Last Updated**: January 15, 2026  
**Version**: 1.0  
**System**: ALG-EcoTour User Profile Management  
**Status**: ✅ **PRODUCTION READY**

The user profile implementation provides a secure, user-friendly, and robust system for users to manage their personal information with proper validation, authentication, and comprehensive error handling.
