# User Settings Implementation

**Date**: January 15, 2026  
**Purpose**: Documentation for user settings management functionality  
**System**: ALG-EcoTour Web Application  
**Status**: ✅ **IMPLEMENTED**

---

## 📋 **Overview**

This document explains the complete user settings implementation that allows authenticated users to manage their preferences including language selection, email notifications, and dark mode toggle, with proper validation, persistence, and user feedback.

---

## 🎯 **Features Implemented**

### **✅ Require Login**
- **Server-Side Authentication**: Uses `getServerSession()` for secure authentication
- **Automatic Redirect**: Unauthenticated users redirected to `/auth/login`
- **Session Validation**: Proper NextAuth session handling
- **User Isolation**: Users can only access their own settings

### **✅ Language Preference (AR/FR)**
- **Multi-Language Support**: Arabic (AR), French (FR), and English (EN)
- **Visual Selection**: Flag icons with language names
- **Immediate Feedback**: Visual indication of selected language
- **Persistence**: Language preference saved to database

### **✅ Email Notifications Toggle**
- **Toggle Switch**: iOS-style toggle for email notifications
- **Descriptive Labels**: Clear explanation of notification types
- **Default State**: Enabled by default for new users
- **Real-Time Updates**: Immediate visual feedback

### **✅ Dark Mode Toggle (if theme exists)**
- **Theme Toggle**: Switch between light and dark themes
- **Immediate Application**: Theme applies instantly without page reload
- **Persistence**: Dark mode preference saved to database
- **System Integration**: Uses CSS classes for theme switching

### **✅ Persist to DB in UserSettings Model**
- **Dedicated Model**: Separate `UserSettings` table for preferences
- **Relationship**: One-to-one relationship with User model
- **Default Values**: Sensible defaults for new users
- **Data Integrity**: Proper foreign key constraints

---

## 🏗️ **Architecture**

### **Component Structure**

```
app/settings/
├── page.tsx                    # Server component with auth guard
├── SettingsClient.tsx          # Client component with settings logic
└── (API Integration)

app/api/user/settings/
└── route.ts                    # GET/POST endpoints for settings

lib/
├── settings.ts                 # User settings helper functions
└── user.ts                     # User profile helper functions

components/bookings/
└── Toast.tsx                   # Toast notification system

prisma/
└── schema.prisma               # Updated UserSettings model
```

### **Data Flow**

1. **Server Component**: Authenticates user and fetches settings data
2. **Client Component**: Displays settings with real-time updates
3. **Setting Changes**: Local state updated immediately
4. **API Call**: PATCH request to `/api/user/settings`
5. **Server Validation**: Zod schema validation and database update
6. **Response Handling**: Success/error feedback via toast notifications
7. **UI Update**: Settings saved and confirmed

---

## 🔧 **Database Schema**

### **UserSettings Model**

```prisma
model UserSettings {
  id                  Int      @id @default(autoincrement())
  userId              Int      @unique
  user                User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  language            String   @default("ar") // "ar", "fr", "en"
  emailNotifications  Boolean  @default(true)
  darkMode            Boolean  @default(false)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@map("user_settings")
}
```

### **Updated User Model**

```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  name      String?
  phone     String?
  password  String    // Store hashed passwords in production
  role      String    @default("user") // "admin" or "user"
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  // Relations
  adminAuditLogs AdminAuditLogs[]
  userSettings UserSettings?

  @@map("users")
}
```

### **Migration Applied**

```sql
-- Created user_settings table
CREATE TABLE "user_settings" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL UNIQUE,
  "language" TEXT NOT NULL DEFAULT 'ar',
  "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
  "darkMode" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "user_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Created index for userId
CREATE UNIQUE INDEX "user_settings_userId_key" ON "user_settings" ("userId");
```

---

## 🔐 **API Implementation**

### **GET /api/user/settings**

**Endpoint**: `GET /api/user/settings`

**Authentication**: Required (NextAuth session)

**Response**:
```json
{
  "id": 1,
  "userId": 1,
  "language": "ar",
  "emailNotifications": true,
  "darkMode": false,
  "createdAt": "2026-01-15T10:00:00.000Z",
  "updatedAt": "2026-01-15T12:00:00.000Z"
}
```

### **PATCH /api/user/settings**

**Endpoint**: `PATCH /api/user/settings`

**Authentication**: Required (NextAuth session)

**Request Body**:
```json
{
  "language": "ar",
  "emailNotifications": true,
  "darkMode": false
}
```

**Validation Schema**:
```typescript
const updateSettingsSchema = z.object({
  language: z.enum(['ar', 'fr', 'en']).optional(),
  emailNotifications: z.boolean().optional(),
  darkMode: z.boolean().optional(),
});
```

**Response**:
```json
{
  "id": 1,
  "userId": 1,
  "language": "ar",
  "emailNotifications": true,
  "darkMode": false,
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
      "code": "invalid_enum_value",
      "message": "Invalid enum value"
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

### **Language Selection**

**Features**:
- **Visual Cards**: Language options with flag icons
- **Selection Indicator**: Green border and checkmark for selected language
- **Responsive Layout**: Grid layout that adapts to screen size
- **Hover Effects**: Interactive hover states for better UX

**Languages Supported**:
- **العربية (AR)**: 🇩🇿 Arabic with Algerian flag
- **Français (FR)**: 🇫🇷 French with French flag
- **English (EN)**: 🇬🇧 English with British flag

### **Notification Settings**

**Features**:
- **Toggle Switch**: iOS-style toggle for email notifications
- **Descriptive Labels**: Clear explanation of what notifications include
- **Visual Feedback**: Smooth transitions and color changes
- **Accessibility**: Proper ARIA labels and keyboard support

### **Dark Mode Toggle**

**Features**:
- **Theme Switch**: Toggle between light and dark themes
- **Icon Changes**: Sun/Moon icons based on current theme
- **Immediate Application**: Theme applies without page reload
- **Persistence**: Theme preference saved to database

### **Settings Summary**

**Features**:
- **Current Settings Display**: Shows active settings in a summary card
- **Real-Time Updates**: Summary updates as settings change
- **Visual Organization**: Clean layout with proper spacing
- **Color Coding**: Blue theme for summary section

---

## 🔐 **Security & Validation**

### **Authentication**
- **Server-Side**: `getServerSession()` validation
- **Session Check**: Ensures user is logged in
- **Unauthorized Access**: 401 response for unauthenticated requests

### **Input Validation**
- **Client-Side**: Real-time validation feedback
- **Server-Side**: Zod schema validation
- **Enum Validation**: Strict validation for language options
- **Type Safety**: TypeScript interfaces for all data

### **Data Protection**
- **User Isolation**: Users can only modify their own settings
- **Database Constraints**: Foreign key constraints ensure data integrity
- **Secure Updates**: Atomic database operations
- **Error Handling**: Secure error messages

---

## 📱 **User Experience**

### **Settings Management Flow**

1. **Access**: User navigates to `/settings`
2. **Authentication**: Server validates session
3. **Data Load**: Settings data fetched from database
4. **Display**: Settings populated with current values
5. **Modification**: User changes preferences
6. **Validation**: Real-time validation feedback
7. **Submission**: Settings data sent to API
8. **Processing**: Server validates and updates database
9. **Feedback**: Success/error toast notification
10. **UI Update**: Settings updated immediately

### **Dark Mode Implementation**

**CSS Classes**:
```css
/* Light mode (default) */
body {
  background-color: #f9fafb;
  color: #111827;
}

/* Dark mode */
.dark body {
  background-color: #111827;
  color: #f9fafb;
}

.dark .bg-white {
  background-color: #1f2937;
}

.dark .text-gray-900 {
  color: #f9fafb;
}
```

**JavaScript Toggle**:
```typescript
const handleDarkModeToggle = () => {
  const newDarkMode = !darkMode;
  setDarkMode(newDarkMode);
  
  if (newDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};
```

### **Error Handling**

- **Validation Errors**: Inline error messages with visual indicators
- **Network Errors**: Toast notifications with retry suggestions
- **Server Errors**: Generic error message with support contact
- **Session Errors**: Automatic redirect to login page

### **Accessibility**

- **Keyboard Navigation**: Full keyboard support for all settings
- **Screen Reader**: Proper ARIA labels and roles
- **Focus Management**: Logical tab order and focus indicators
- **Color Contrast**: WCAG AA compliant colors in both themes
- **Toggle Switches**: Accessible toggle components

---

## 🧪 **Testing Scenarios**

### **Happy Path**
1. User logs in and navigates to settings
2. Settings load with current data
3. User changes language, notifications, and theme
4. All validations pass
5. Settings update successfully
6. Success toast appears
7. UI reflects changes immediately

### **Error Scenarios**
1. **Unauthenticated Access**: Redirected to login
2. **Invalid Language**: Validation error with helpful message
3. **Network Error**: Toast notification with retry option
4. **Server Error**: Generic error with support info
5. **Session Expire**: Graceful handling of expired sessions

### **Edge Cases**
1. **First-Time User**: Default settings created automatically
2. **Missing Settings**: Settings created with defaults on first access
3. **Rapid Changes**: Multiple rapid setting changes
4. **Theme Conflicts**: Proper CSS class management
5. **Browser Storage**: Settings persisted in database, not localStorage

---

## 📊 **Performance Considerations**

### **Optimizations**
- **Server-Side Data**: Initial settings fetched on server
- **Local State**: Efficient state management with immediate updates
- **Optimistic Updates**: UI updates before API confirmation
- **Error Recovery**: Automatic rollback on failures

### **Database Efficiency**
- **Indexed Queries**: User ID primary key with unique constraint
- **Atomic Updates**: Single transaction updates
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Minimal data fetching with upsert

### **Theme Performance**
- **CSS Transitions**: Smooth theme switching animations
- **Class Management**: Efficient DOM class manipulation
- **No Page Reload**: Theme changes without full page refresh
- **Browser Compatibility**: Cross-browser theme support

---

## 🔮 **Future Enhancements**

### **Advanced Settings**
- **Time Zone**: User timezone preference
- **Currency**: Currency display preference
- **Date Format**: Date and time format preferences
- **Font Size**: Text size accessibility options
- **High Contrast**: Enhanced contrast mode

### **Notification Types**
- **SMS Notifications**: Text message notifications
- **Push Notifications**: Browser push notifications
- **In-App Notifications**: Real-time in-app alerts
- **Digest Emails**: Weekly/monthly summary emails
- **Marketing Emails**: Promotional email preferences

### **UI Improvements**
- **Settings Groups**: Organized settings categories
- **Search Settings**: Quick settings search functionality
- **Reset Options**: Reset to defaults functionality
- **Import/Export**: Settings import and export
- **Preview Mode**: Live preview of setting changes

### **Analytics**
- **Settings Usage**: Track which settings are most used
- **User Preferences**: Analyze user preference patterns
- **Theme Statistics**: Dark vs light mode usage
- **Language Distribution**: Language preference analytics

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
  const validation = updateSettingsSchema.safeParse(body);
  
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: validation.error.issues },
      { status: 400 }
    );
  }

  const updatedSettings = await updateUserSettingsByEmail(session.user.email, validation.data);
  return NextResponse.json(updatedSettings);
}
```

### **Dark Mode Toggle**
```typescript
const handleDarkModeToggle = () => {
  const newDarkMode = !darkMode;
  setDarkMode(newDarkMode);
  handleSettingChange('darkMode', newDarkMode);
  
  // Apply dark mode immediately
  if (newDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};
```

### **Database Helper**
```typescript
export async function updateUserSettings(userId: number, data: UpdateSettingsData): Promise<UserSettings> {
  const settings = await prisma.userSettings.upsert({
    where: { userId },
    update: { ...data },
    create: {
      userId,
      language: data.language || 'ar',
      emailNotifications: data.emailNotifications ?? true,
      darkMode: data.darkMode ?? false,
    },
  });

  return settings;
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

### **Theme Support**
Ensure your CSS framework supports dark mode classes. For Tailwind CSS:
```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ... other config
}
```

### **Build Verification**
```bash
# Test build
npm run build

# Verify API routes
curl -X GET http://localhost:3000/api/user/settings

# Test settings update
curl -X PATCH http://localhost:3000/api/user/settings \
  -H "Content-Type: application/json" \
  -d '{"language": "fr", "emailNotifications": false, "darkMode": true}'
```

---

**Last Updated**: January 15, 2026  
**Version**: 1.0  
**System**: ALG-EcoTour User Settings Management  
**Status**: ✅ **PRODUCTION READY**

The user settings implementation provides a secure, user-friendly, and robust system for users to manage their preferences with proper validation, persistence, and comprehensive error handling. The dark mode toggle provides immediate visual feedback, while language preferences enhance the international user experience.
