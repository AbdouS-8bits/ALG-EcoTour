# API Endpoints Summary

## 🔐 Authentication APIs
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/me` - Get current user

## 📂 Categories APIs
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

## 🌍 Tours APIs
- `GET /api/tours/search` - Search and filter tours
- `GET /api/tours/featured` - Get featured tours (top 8)
- `GET /api/tours/:id` - Get single tour
- `POST /api/tours` - Create tour
- `PUT /api/tours/:id` - Update tour
- `DELETE /api/tours/:id` - Delete tour
- `GET /api/tours/:tourId/stats` - Get tour statistics

## 📅 Itineraries APIs
- `GET /api/tours/:tourId/itineraries` - Get all itineraries for a tour
- `GET /api/tours/:tourId/itineraries/:id` - Get single itinerary
- `POST /api/tours/:tourId/itineraries` - Create itinerary
- `PUT /api/tours/:tourId/itineraries/:id` - Update itinerary
- `DELETE /api/tours/:tourId/itineraries/:id` - Delete itinerary

## ⭐ Reviews APIs
- `GET /api/tours/:tourId/reviews` - Get all reviews for a tour
- `GET /api/tours/:tourId/reviews/:id` - Get single review
- `POST /api/tours/:tourId/reviews` - Create review
- `PUT /api/tours/:tourId/reviews/:id` - Update review
- `DELETE /api/tours/:tourId/reviews/:id` - Delete review

## 🖼️ Tour Images APIs
- `GET /api/tours/:tourId/images` - Get all images for a tour
- `GET /api/tours/:tourId/images/:id` - Get single image
- `POST /api/tours/:tourId/images` - Create tour image
- `PUT /api/tours/:tourId/images/:id` - Update tour image
- `DELETE /api/tours/:tourId/images/:id` - Delete tour image

## 📝 Bookings APIs
- `GET /api/bookings` - Get all bookings (with filters)
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

## 👥 Users APIs
- `GET /api/users` - Get all users (admin, with pagination & search)
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/:id/bookings` - Get user's bookings
- `GET /api/users/:id/reviews` - Get user's reviews

## 🔧 Admin APIs
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/audit-logs` - Get audit logs (with pagination)
- `POST /api/admin/audit-logs` - Create audit log

## 📤 Upload API
- `POST /api/upload` - Upload image file

---

## Total Endpoints: 40+

### API Coverage by Entity:
- ✅ Authentication (7 endpoints)
- ✅ Categories (5 endpoints)
- ✅ Tours (7 endpoints)
- ✅ Itineraries (5 endpoints)
- ✅ Reviews (5 endpoints)
- ✅ Tour Images (5 endpoints)
- ✅ Bookings (5 endpoints)
- ✅ Users (7 endpoints)
- ✅ Admin (3 endpoints)
- ✅ Upload (1 endpoint)

### Features Covered:
✅ Full CRUD operations for all entities
✅ Advanced search and filtering
✅ Pagination support
✅ User authentication and authorization
✅ Image upload functionality
✅ Statistics and analytics
✅ Audit logging
✅ Review system with ratings
✅ Booking management
✅ Multi-image support for tours
✅ Itinerary day-by-day planning
✅ Category-based tour organization

### Database Schema Support:
✅ Category
✅ Itinerary
✅ Review
✅ TourImage
✅ bookings
✅ eco_tours
✅ users
✅ admin_audit_logs

All database tables from your schema are fully supported with complete API endpoints!
