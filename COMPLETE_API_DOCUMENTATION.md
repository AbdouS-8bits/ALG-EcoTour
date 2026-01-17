# Complete API Documentation for ALG EcoTour

## Base URL
```
http://localhost:3000/api
```

---

## Table of Contents
1. [Authentication APIs](#authentication-apis)
2. [Categories APIs](#categories-apis)
3. [Tours APIs](#tours-apis)
4. [Bookings APIs](#bookings-apis)
5. [Reviews APIs](#reviews-apis)
6. [Itineraries APIs](#itineraries-apis)
7. [Tour Images APIs](#tour-images-apis)
8. [Users APIs](#users-apis)
9. [Admin APIs](#admin-apis)

---

## Authentication APIs

### Register User
**POST** `/api/auth/register`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### Login
**POST** `/api/auth/login`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Verify Email
**POST** `/api/auth/verify-email`

**Body:**
```json
{
  "token": "verification_token"
}
```

### Forgot Password
**POST** `/api/auth/forgot-password`

**Body:**
```json
{
  "email": "user@example.com"
}
```

### Reset Password
**POST** `/api/auth/reset-password`

**Body:**
```json
{
  "token": "reset_token",
  "password": "newpassword123"
}
```

---

## Categories APIs

### Get All Categories
**GET** `/api/categories`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Adventure",
      "description": "Adventure tours",
      "icon": "🏔️",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Single Category
**GET** `/api/categories/:id`

### Create Category
**POST** `/api/categories`

**Body:**
```json
{
  "name": "Adventure",
  "description": "Adventure tours",
  "icon": "🏔️"
}
```

### Update Category
**PUT** `/api/categories/:id`

**Body:**
```json
{
  "name": "Updated Adventure",
  "description": "Updated description",
  "icon": "🏔️"
}
```

### Delete Category
**DELETE** `/api/categories/:id`

---

## Tours APIs

### Get All Tours (with search and filters)
**GET** `/api/tours/search`

**Query Parameters:**
- `search` - Search in title, description, location
- `categoryId` - Filter by category ID
- `difficulty` - Filter by difficulty (easy, moderate, hard)
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `location` - Filter by location
- `status` - Filter by status (active, inactive) - default: active
- `sortBy` - Sort field (createdAt, price, title, averageRating, duration) - default: createdAt
- `sortOrder` - Sort order (ASC, DESC) - default: DESC
- `page` - Page number - default: 1
- `limit` - Items per page - default: 12

**Example:**
```
GET /api/tours/search?search=mountain&difficulty=moderate&minPrice=50&maxPrice=200&page=1&limit=10&sortBy=price&sortOrder=ASC
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Mountain Adventure",
      "description": "Explore the mountains",
      "location": "Alps",
      "price": 150.00,
      "maxParticipants": 20,
      "difficulty": "moderate",
      "duration": 3,
      "status": "active",
      "categoryId": 1,
      "categoryName": "Adventure",
      "categoryIcon": "🏔️",
      "averageRating": "4.5",
      "reviewCount": 10,
      "mainImage": "https://example.com/image.jpg",
      "latitude": 46.0,
      "longitude": 8.0,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### Get Featured Tours
**GET** `/api/tours/featured`

Returns top 8 tours based on ratings and bookings.

### Get Single Tour
**GET** `/api/tours/:id`

### Create Tour
**POST** `/api/tours`

**Body:**
```json
{
  "title": "Mountain Adventure",
  "description": "Explore the beautiful mountains",
  "location": "Alps",
  "price": 150.00,
  "maxParticipants": 20,
  "categoryId": 1,
  "difficulty": "moderate",
  "duration": 3,
  "status": "active",
  "latitude": 46.0,
  "longitude": 8.0
}
```

### Update Tour
**PUT** `/api/tours/:id`

### Delete Tour
**DELETE** `/api/tours/:id`

### Get Tour Statistics
**GET** `/api/tours/:tourId/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "tour": {
      "id": 1,
      "title": "Mountain Adventure",
      "location": "Alps",
      "price": 150.00,
      "maxParticipants": 20,
      "difficulty": "moderate",
      "duration": 3,
      "status": "active"
    },
    "reviews": {
      "count": 15,
      "averageRating": "4.5"
    },
    "bookings": {
      "total": 30,
      "confirmed": 25,
      "pending": 3,
      "cancelled": 2,
      "totalParticipants": 80,
      "totalRevenue": 3750.00
    }
  }
}
```

---

## Bookings APIs

### Get All Bookings (check existing files)
**GET** `/api/bookings`

### Get Single Booking
**GET** `/api/bookings/:id`

### Create Booking
**POST** `/api/bookings`

**Body:**
```json
{
  "tourId": 1,
  "userId": 1, // optional
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "+1234567890",
  "participants": 2,
  "totalPrice": 300.00
}
```

### Update Booking
**PUT** `/api/bookings/:id`

**Body:**
```json
{
  "status": "confirmed",
  "paymentStatus": "paid"
}
```

### Delete Booking
**DELETE** `/api/bookings/:id`

---

## Reviews APIs

### Get Reviews for Tour
**GET** `/api/tours/:tourId/reviews`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "tourId": 1,
      "userId": 1,
      "rating": 5,
      "comment": "Amazing experience!",
      "userName": "John Doe",
      "userEmail": "john@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Single Review
**GET** `/api/tours/:tourId/reviews/:id`

### Create Review
**POST** `/api/tours/:tourId/reviews`

**Body:**
```json
{
  "userId": 1,
  "rating": 5,
  "comment": "Amazing experience!"
}
```

### Update Review
**PUT** `/api/tours/:tourId/reviews/:id`

**Body:**
```json
{
  "rating": 4,
  "comment": "Updated review comment"
}
```

### Delete Review
**DELETE** `/api/tours/:tourId/reviews/:id`

---

## Itineraries APIs

### Get Itineraries for Tour
**GET** `/api/tours/:tourId/itineraries`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "tourId": 1,
      "dayNumber": 1,
      "title": "Day 1: Arrival",
      "description": "Arrive at the base camp and settle in",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Single Itinerary
**GET** `/api/tours/:tourId/itineraries/:id`

### Create Itinerary
**POST** `/api/tours/:tourId/itineraries`

**Body:**
```json
{
  "dayNumber": 1,
  "title": "Day 1: Arrival",
  "description": "Arrive at the base camp and settle in"
}
```

### Update Itinerary
**PUT** `/api/tours/:tourId/itineraries/:id`

**Body:**
```json
{
  "dayNumber": 1,
  "title": "Updated Day 1: Arrival",
  "description": "Updated description"
}
```

### Delete Itinerary
**DELETE** `/api/tours/:tourId/itineraries/:id`

---

## Tour Images APIs

### Get Images for Tour
**GET** `/api/tours/:tourId/images`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "tourId": 1,
      "url": "https://example.com/image.jpg",
      "alt": "Mountain view",
      "isMain": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Single Image
**GET** `/api/tours/:tourId/images/:id`

### Create Tour Image
**POST** `/api/tours/:tourId/images`

**Body:**
```json
{
  "url": "https://example.com/image.jpg",
  "alt": "Mountain view",
  "isMain": false
}
```

### Update Tour Image
**PUT** `/api/tours/:tourId/images/:id`

**Body:**
```json
{
  "url": "https://example.com/new-image.jpg",
  "alt": "Updated mountain view",
  "isMain": true
}
```

### Delete Tour Image
**DELETE** `/api/tours/:tourId/images/:id`

---

## Users APIs

### Get All Users (Admin)
**GET** `/api/users`

**Query Parameters:**
- `role` - Filter by role (user, admin)
- `search` - Search by email or name
- `page` - Page number - default: 1
- `limit` - Items per page - default: 10

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "emailVerified": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### Get Single User
**GET** `/api/users/:id`

### Update User
**PUT** `/api/users/:id`

**Body:**
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com",
  "role": "admin"
}
```

### Delete User
**DELETE** `/api/users/:id`

### Get User's Bookings
**GET** `/api/users/:id/bookings`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "tourId": 1,
      "userId": 1,
      "guestName": "John Doe",
      "guestEmail": "john@example.com",
      "guestPhone": "+1234567890",
      "participants": 2,
      "status": "confirmed",
      "paymentStatus": "paid",
      "totalPrice": 300.00,
      "tourTitle": "Mountain Adventure",
      "tourLocation": "Alps",
      "tourPrice": 150.00,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get User's Reviews
**GET** `/api/users/:id/reviews`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "tourId": 1,
      "userId": 1,
      "rating": 5,
      "comment": "Amazing!",
      "tourTitle": "Mountain Adventure",
      "tourLocation": "Alps",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## Admin APIs

### Get Dashboard Statistics
**GET** `/api/admin/dashboard`

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalTours": 50,
      "totalUsers": 200,
      "totalBookings": 150,
      "totalReviews": 100
    },
    "bookings": {
      "confirmed": 120,
      "pending": 20,
      "cancelled": 10,
      "totalRevenue": 15000.00
    },
    "recentBookings": [...],
    "topRatedTours": [...],
    "monthlyRevenue": [
      {
        "month": "2024-01",
        "revenue": "2500.00",
        "bookings": "15"
      }
    ]
  }
}
```

### Get Audit Logs
**GET** `/api/admin/audit-logs`

**Query Parameters:**
- `userId` - Filter by user ID
- `action` - Search by action
- `page` - Page number - default: 1
- `limit` - Items per page - default: 20

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "action": "CREATE_TOUR",
      "details": "Created tour: Mountain Adventure",
      "userName": "Admin User",
      "userEmail": "admin@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 500,
    "page": 1,
    "limit": 20,
    "totalPages": 25
  }
}
```

### Create Audit Log
**POST** `/api/admin/audit-logs`

**Body:**
```json
{
  "userId": 1,
  "action": "CREATE_TOUR",
  "details": "Created tour: Mountain Adventure"
}
```

---

## Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

## Status Codes

- `200 OK` - Success
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Enums and Constants

### Tour Difficulty
- `easy`
- `moderate`
- `hard`

### Tour Status
- `active`
- `inactive`

### Booking Status
- `pending`
- `confirmed`
- `cancelled`

### Payment Status
- `pending`
- `paid`
- `refunded`

### User Roles
- `user`
- `admin`

---

## Notes

1. All timestamps are in ISO 8601 format
2. All prices are in decimal format (e.g., 150.00)
3. Authentication required endpoints need JWT token in Authorization header
4. Image uploads should use the `/api/upload` endpoint
5. For admin endpoints, user must have admin role

---

## File Upload API

### Upload Image
**POST** `/api/upload`

**Body:** multipart/form-data
- `file` - Image file

**Response:**
```json
{
  "success": true,
  "url": "https://example.com/uploads/image.jpg"
}
```
