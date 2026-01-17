# 🚀 Complete API Documentation - Algeria EcoTour

## Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

---

## 📚 Table of Contents

1. [Authentication APIs](#authentication-apis)
2. [Tours APIs](#tours-apis)
3. [Bookings APIs](#bookings-apis)
4. [User Profile APIs](#user-profile-apis)
5. [Admin APIs](#admin-apis)
6. [Analytics APIs](#analytics-apis)
7. [Search & Filter APIs](#search--filter-apis)

---

## 🔐 Authentication APIs

### 1. Sign Up
**POST** `/api/auth/signup`

```json
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response (201):
{
  "message": "Account created! Please check your email to verify.",
  "email": "john@example.com"
}
```

### 2. Sign In
**POST** `/api/auth/signin`

```json
Request:
{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

### 3. Verify Email
**GET** `/api/auth/verify-email?token=abc123`

```json
Response (200):
{
  "message": "Email verified successfully!",
  "success": true
}
```

### 4. Forgot Password
**POST** `/api/auth/forgot-password`

```json
Request:
{
  "email": "john@example.com"
}

Response (200):
{
  "message": "If account exists, reset link has been sent."
}
```

### 5. Reset Password
**POST** `/api/auth/reset-password`

```json
Request:
{
  "token": "reset_token_here",
  "password": "newpassword123"
}

Response (200):
{
  "message": "Password reset successfully!",
  "success": true
}
```

### 6. Get Current User
**GET** `/api/auth/me`
*Requires Authentication*

```json
Response (200):
{
  "id": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "role": "user",
  "emailVerified": true,
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

---

## 🗺️ Tours APIs

### 1. Get All Tours
**GET** `/api/tours`

Query Parameters:
- `page` (default: 1)
- `limit` (default: 10)
- `location` (filter by location)
- `minPrice` (minimum price)
- `maxPrice` (maximum price)
- `sortBy` (price, createdAt, title)
- `order` (asc, desc)

```json
Response (200):
{
  "tours": [
    {
      "id": 1,
      "title": "Sahara Desert Adventure",
      "description": "Experience the magic...",
      "location": "Tamanrasset",
      "latitude": 22.7850,
      "longitude": 5.5281,
      "price": 25000,
      "maxParticipants": 12,
      "photoURL": "https://...",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### 2. Get Single Tour
**GET** `/api/tours/[tourId]`

```json
Response (200):
{
  "id": 1,
  "title": "Sahara Desert Adventure",
  "description": "Experience the magic...",
  "location": "Tamanrasset",
  "latitude": 22.7850,
  "longitude": 5.5281,
  "price": 25000,
  "maxParticipants": 12,
  "photoURL": "https://...",
  "bookingsCount": 5,
  "availableSpots": 7,
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### 3. Search Tours
**GET** `/api/tours/search?q=sahara`

```json
Response (200):
{
  "results": [
    {
      "id": 1,
      "title": "Sahara Desert Adventure",
      "location": "Tamanrasset",
      "price": 25000,
      "photoURL": "https://..."
    }
  ],
  "count": 1
}
```

### 4. Get Featured Tours
**GET** `/api/tours/featured`

```json
Response (200):
{
  "tours": [
    {
      "id": 1,
      "title": "Sahara Desert Adventure",
      "bookingsCount": 47,
      "rating": 4.8
    }
  ]
}
```

---

## 📅 Bookings APIs

### 1. Create Booking
**POST** `/api/bookings`
*Optional Authentication*

```json
Request:
{
  "tourId": 1,
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "+213 XXX XXX XXX",
  "participants": 2
}

Response (201):
{
  "id": 1,
  "tourId": 1,
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "participants": 2,
  "status": "pending",
  "totalPrice": 50000,
  "createdAt": "2025-01-10T00:00:00.000Z"
}
```

### 2. Get User Bookings
**GET** `/api/bookings/my-bookings`
*Requires Authentication*

```json
Response (200):
{
  "bookings": [
    {
      "id": 1,
      "tour": {
        "id": 1,
        "title": "Sahara Desert Adventure",
        "photoURL": "https://..."
      },
      "participants": 2,
      "status": "confirmed",
      "totalPrice": 50000,
      "createdAt": "2025-01-10T00:00:00.000Z"
    }
  ]
}
```

### 3. Get Single Booking
**GET** `/api/bookings/[bookingId]`
*Requires Authentication*

```json
Response (200):
{
  "id": 1,
  "tour": {
    "id": 1,
    "title": "Sahara Desert Adventure",
    "location": "Tamanrasset"
  },
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "+213 XXX XXX XXX",
  "participants": 2,
  "status": "confirmed",
  "totalPrice": 50000,
  "createdAt": "2025-01-10T00:00:00.000Z"
}
```

### 4. Cancel Booking
**PATCH** `/api/bookings/[bookingId]/cancel`
*Requires Authentication*

```json
Response (200):
{
  "message": "Booking cancelled successfully",
  "booking": {
    "id": 1,
    "status": "cancelled"
  }
}
```

---

## 👤 User Profile APIs

### 1. Get Profile
**GET** `/api/user/profile`
*Requires Authentication*

```json
Response (200):
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "emailVerified": true,
  "bookingsCount": 5,
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### 2. Update Profile
**PATCH** `/api/user/profile`
*Requires Authentication*

```json
Request:
{
  "name": "John Smith",
  "phone": "+213 XXX XXX XXX"
}

Response (200):
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "name": "John Smith",
    "email": "john@example.com"
  }
}
```

### 3. Change Password
**POST** `/api/user/change-password`
*Requires Authentication*

```json
Request:
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}

Response (200):
{
  "message": "Password changed successfully"
}
```

### 4. Delete Account
**DELETE** `/api/user/account`
*Requires Authentication*

```json
Response (200):
{
  "message": "Account deleted successfully"
}
```

---

## 👨‍💼 Admin APIs

### 1. Create Tour
**POST** `/api/admin/tours`
*Requires Admin*

```json
Request:
{
  "title": "New Tour",
  "description": "Amazing experience...",
  "location": "Algiers",
  "latitude": 36.7538,
  "longitude": 3.0588,
  "price": 15000,
  "maxParticipants": 20,
  "photoURL": "https://..."
}

Response (201):
{
  "id": 10,
  "title": "New Tour",
  "status": "created"
}
```

### 2. Update Tour
**PATCH** `/api/admin/tours/[tourId]`
*Requires Admin*

```json
Request:
{
  "price": 18000,
  "maxParticipants": 25
}

Response (200):
{
  "message": "Tour updated successfully",
  "tour": {
    "id": 1,
    "price": 18000
  }
}
```

### 3. Delete Tour
**DELETE** `/api/admin/tours/[tourId]`
*Requires Admin*

```json
Response (200):
{
  "message": "Tour deleted successfully"
}
```

### 4. Get All Bookings
**GET** `/api/admin/bookings`
*Requires Admin*

Query Parameters:
- `status` (pending, confirmed, cancelled)
- `tourId`
- `page`
- `limit`

```json
Response (200):
{
  "bookings": [
    {
      "id": 1,
      "tour": { "title": "Sahara Desert Adventure" },
      "guestName": "John Doe",
      "participants": 2,
      "status": "pending",
      "createdAt": "2025-01-10T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "total": 50
  }
}
```

### 5. Update Booking Status
**PATCH** `/api/admin/bookings/[bookingId]`
*Requires Admin*

```json
Request:
{
  "status": "confirmed"
}

Response (200):
{
  "message": "Booking status updated",
  "booking": {
    "id": 1,
    "status": "confirmed"
  }
}
```

### 6. Get Dashboard Stats
**GET** `/api/admin/dashboard`
*Requires Admin*

```json
Response (200):
{
  "stats": {
    "totalTours": 25,
    "totalBookings": 150,
    "totalRevenue": 3750000,
    "pendingBookings": 12,
    "totalUsers": 320
  },
  "recentBookings": [...],
  "popularTours": [...]
}
```

### 7. Get All Users
**GET** `/api/admin/users`
*Requires Admin*

```json
Response (200):
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "emailVerified": true,
      "bookingsCount": 5,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 📊 Analytics APIs

### 1. Tour Analytics
**GET** `/api/admin/analytics/tours`
*Requires Admin*

```json
Response (200):
{
  "topTours": [
    {
      "tourId": 1,
      "title": "Sahara Desert Adventure",
      "bookingsCount": 47,
      "revenue": 1175000
    }
  ],
  "bookingsByMonth": [
    { "month": "January", "count": 25 },
    { "month": "February", "count": 32 }
  ]
}
```

### 2. Revenue Analytics
**GET** `/api/admin/analytics/revenue`
*Requires Admin*

```json
Response (200):
{
  "totalRevenue": 3750000,
  "thisMonth": 450000,
  "lastMonth": 380000,
  "growth": 18.4,
  "byTour": [...]
}
```

---

## 🔍 Search & Filter APIs

### 1. Filter Tours
**POST** `/api/tours/filter`

```json
Request:
{
  "location": "Sahara",
  "minPrice": 10000,
  "maxPrice": 30000,
  "minParticipants": 5
}

Response (200):
{
  "tours": [...],
  "count": 8
}
```

### 2. Get Locations
**GET** `/api/tours/locations`

```json
Response (200):
{
  "locations": [
    "Tamanrasset",
    "Algiers",
    "Constantine",
    "Djanet"
  ]
}
```

---

## 📧 Newsletter API

### 1. Subscribe to Newsletter
**POST** `/api/newsletter/subscribe`

```json
Request:
{
  "email": "user@example.com"
}

Response (201):
{
  "message": "Subscribed successfully!"
}
```

---

## 📤 File Upload API

### 1. Upload Image
**POST** `/api/upload`
*Requires Authentication*

```json
Content-Type: multipart/form-data

Response (200):
{
  "url": "https://cloudinary.com/...",
  "publicId": "tours/abc123"
}
```

---

## ❌ Error Responses

All APIs return consistent error format:

```json
{
  "error": "Error message here",
  "details": "Optional additional info"
}
```

Status Codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (not admin)
- `404` - Not Found
- `500` - Server Error

---

## 🔑 Authentication

For protected routes, include JWT token in header:

```
Authorization: Bearer your_jwt_token_here
```

Or use session cookie (NextAuth).

---

## 📄 Pagination

Paginated endpoints return:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

## 🎯 Rate Limiting

- Public APIs: 100 requests/hour
- Authenticated: 1000 requests/hour
- Admin: Unlimited

---

**All APIs are ready to implement! Let me create them now...**
