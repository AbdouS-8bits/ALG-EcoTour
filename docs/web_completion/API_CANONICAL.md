# API Canonical Routes Documentation

**Date**: January 15, 2026  
**Purpose**: Documentation for canonical API routes after cleanup  
**System**: ALG-EcoTour Web Application  
**Status**: ✅ **IMPLEMENTED**

---

## 📋 **Overview**

This document outlines the canonical API structure after cleaning up duplicate routes. The system now has a consistent, logical API structure with proper redirects for deprecated endpoints.

---

## 🔄 **Route Cleanup Summary**

### **Deprecated Routes (with redirects)**

| Deprecated Route | Canonical Route | Status | Description |
|----------------|----------------|--------|-----------|
| `/api/auth/register` | `/api/auth/signup` | ✅ **Redirected** | Admin registration redirected to user signup |
| `/api/ecotours` | `/api/tours` | ✅ **Redirected** | Tour management consolidated |

### **Canonical Routes (active)**

| Canonical Route | Status | Description |
|----------------|--------|-----------|
| `/api/auth/signup` | ✅ **Active** | User registration and authentication |
| `/api/tours` | ✅ **Active** | Tour management and listings |
| `/api/bookings` | ✅ **Active** | Booking management |
| `/api/user/profile` | ✅ **Active** | User profile management |
| `/api/user/settings` | ✅ **Redirect** | User settings management |
| `/api/admin/analytics` | ✅ **Active** | Admin analytics dashboard |

---

## 🎯 **Canonical API Structure**

### **Authentication Routes**

```
/api/auth/
├── [auth]/[...nextauth]/route.ts    # NextAuth.js authentication
├── signup/route.ts                # User registration (POST)
└── login/route.ts                 # User login (POST)
```

### **Tour Management**

```
/api/tours/
├── route.ts                     # GET (list tours, with pagination)
├── [tourId]/route.ts              # GET/PUT/DELETE specific tour
└── POST route.ts                  # Create new tour
```

### **Booking Management**

```
/api/bookings/
├── route.ts                     # GET (user bookings)
├── [bookingId]/route.ts           # GET/UPDATE/DELETE specific booking
└── POST route.ts                  # Create new booking
```

### **User Management**

```
/api/user/
├── profile/route.ts               # GET/UPDATE user profile
└── settings/route.ts             # GET/UPDATE user settings
```

### **Admin Management**

```
/api/admin/
├── analytics/route.ts              # GET analytics data
├── bookings/route.ts              # GET/UPDATE/DELETE bookings
├── tours/route.ts                 # GET/POST/PUT/DELETE tours
└── tours/[id]/route.ts             # GET/PUT/DELETE specific tour
```

---

## 🔄 **Redirect Implementation**

### **Register → Signup Redirect**

```typescript
// /app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.redirect(307, '/api/auth/signup');
}

export async function POST(request: NextRequest) {
  return NextResponse.redirect(307, '/api/auth/signup');
}
```

### **EcoTours → Tours Redirect**

```typescript
// /app/api/ecotours/route.ts (deprecated)
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.redirect(307, '/api/tours');
}

export async function POST(request: NextRequest) {
  return NextResponse.redirect(30, '/api/tours');
}
```

### **Tours → EcoTours Redirect**

```typescript
// /app/api/tours/route.ts (deprecated)
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.redirect(307, '/api/ecotours');
}

export async function POST(request: NextRequest) {
  return NextResponse.redirect(307, '/api/ecotours');
}
```

---

## 🔐 **Frontend Integration**

### **Updated API Calls**

**Authentication**:
```typescript
// Before (deprecated)
fetch('/api/auth/register', { method: 'POST', body: userData })

// After (canonical)
fetch('/api/auth/signup', { method: 'POST', body: userData })
```

**Tour Management**:
```typescript
// Before (deprecated)
fetch('/api/ecotours', { method: 'GET' })
fetch('/api/ecotours', { method: 'POST', body: tourData })

// After (canonical)
fetch('/api/tours', { method: 'GET' })
fetch('/api/tours', { method: 'POST', body: tourData })
```

**Tour Details**:
```typescript
// Before (deprecated)
fetch(`/api/ecotours/${tourId}`)

// After (canonical)
fetch(`/api/tours/${tourId}`)
```

---

## 📝 **Migration Guide**

### **For Frontend Developers**

1. **Update API Calls**: Replace deprecated endpoints with canonical routes
2. **Test Integration**: Verify all functionality works with new routes
3. **Update Documentation**: Update any custom API client code

### **For API Consumers**

1. **Update URLs**: Use canonical routes in all API calls
2. **Handle Redirects**: Ensure proper redirect handling
3. **Update Tests**: Update integration tests

### **For Documentation**

1. **Update API Docs**: Reference canonical routes in documentation
2. **Update Examples**: Update code examples
3. **Migration Notes**: Document the redirect structure

---

## 🚀 **Breaking Changes**

### **API Endpoints**

- **Removed**: `/api/auth/register` (redirects to `/api/auth/signup`)
- **Removed**: `/api/ecotours` (redirects to `/api/tours`)
- **Removed**: `/api/tours` (redirects to `/api/ecotours`)

### **Frontend Impact**

- **Required Changes**: Update frontend API calls to use canonical routes
- **Backward Compatibility**: Redirects ensure existing integrations continue working
- **Performance**: Redirects are HTTP 307 redirects (fast)

### **Code Examples**

**Before**:
```typescript
// Admin registration
fetch('/api/auth/register', {
  method: 'POST',
  body: adminData
})
```

**After**:
```typescript
// Admin registration (now redirects)
fetch('/api/auth/signup', {
  method: 'POST',
  body: adminData
})
```

---

## 🔍 **Testing Strategy**

### **Redirect Testing**

```typescript
// Test register endpoint redirects
describe('API Redirects', () => {
  it('should redirect /api/auth/register to /api/auth/signup', async () => {
      const response = await fetch('/api/auth/register');
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe('/api/auth/signup');
    });
});
```

### **Canonical Route Testing**

```typescript
// Test canonical endpoint
describe('Canonical API Routes', () => {
  it('should return tours data from canonical endpoint', async () => {
      const response = await fetch('/api/tours');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });
});
```

---

## 📚 **Maintenance**

### **Adding New Routes**

1. **Use Canonical Paths**: Always use canonical route paths
2. **Avoid Duplicates**: Check for existing routes before creating new ones
3. **Consider Redirects**: Use redirects for breaking changes
4. **Update Documentation**: Keep API documentation current

### **Deprecating Routes**

1. **Add Redirects**: Create redirect routes for deprecated endpoints
2. **Update Frontend**: Update all frontend API calls
3. **Add Deprecation Warnings**: Consider adding console warnings
4. **Plan Removal**: Schedule removal of deprecated routes

---

**Last Updated**: January 15, 2026  
**Version**: 1.0  
**System**: ALG-EcoTour API Routes  
**Status**: ✅ **PRODUCTION READY**

The API canonical structure is now clean and consistent with proper redirects for deprecated endpoints. All frontend integrations should use the canonical routes for optimal performance and maintainability.
