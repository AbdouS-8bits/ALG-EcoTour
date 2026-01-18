# API Testing Checklist

Use this checklist to verify all APIs are working correctly.

## ✅ Categories API

### Test GET All Categories
```bash
curl http://localhost:3000/api/categories
```
Expected: List of all categories

### Test Create Category
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wildlife Safari",
    "description": "Experience nature up close",
    "icon": "🦁"
  }'
```
Expected: Created category with ID

### Test GET Single Category
```bash
curl http://localhost:3000/api/categories/1
```
Expected: Single category details

### Test Update Category
```bash
curl -X PUT http://localhost:3000/api/categories/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Wildlife Safari",
    "description": "Updated description"
  }'
```
Expected: Updated category

### Test Delete Category
```bash
curl -X DELETE http://localhost:3000/api/categories/1
```
Expected: Success message

---

## ✅ Tours API

### Test Search Tours (No filters)
```bash
curl "http://localhost:3000/api/tours/search"
```
Expected: Paginated list of tours

### Test Search Tours (With filters)
```bash
curl "http://localhost:3000/api/tours/search?search=mountain&difficulty=moderate&minPrice=50&maxPrice=200&page=1&limit=10"
```
Expected: Filtered tours

### Test Get Featured Tours
```bash
curl http://localhost:3000/api/tours/featured
```
Expected: Top 8 featured tours

### Test Get Tour Statistics
```bash
curl http://localhost:3000/api/tours/1/stats
```
Expected: Statistics with reviews and bookings data

---

## ✅ Itineraries API

### Test GET Tour Itineraries
```bash
curl http://localhost:3000/api/tours/1/itineraries
```
Expected: List of itineraries for tour 1

### Test Create Itinerary
```bash
curl -X POST http://localhost:3000/api/tours/1/itineraries \
  -H "Content-Type: application/json" \
  -d '{
    "dayNumber": 1,
    "title": "Day 1: Arrival",
    "description": "Arrive at base camp and settle in"
  }'
```
Expected: Created itinerary

### Test Update Itinerary
```bash
curl -X PUT http://localhost:3000/api/tours/1/itineraries/1 \
  -H "Content-Type: application/json" \
  -d '{
    "dayNumber": 1,
    "title": "Updated Day 1",
    "description": "Updated description"
  }'
```
Expected: Updated itinerary

### Test Delete Itinerary
```bash
curl -X DELETE http://localhost:3000/api/tours/1/itineraries/1
```
Expected: Success message

---

## ✅ Reviews API

### Test GET Tour Reviews
```bash
curl http://localhost:3000/api/tours/1/reviews
```
Expected: List of reviews with user information

### Test Create Review
```bash
curl -X POST http://localhost:3000/api/tours/1/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "rating": 5,
    "comment": "Amazing tour! Highly recommended!"
  }'
```
Expected: Created review

### Test Update Review
```bash
curl -X PUT http://localhost:3000/api/tours/1/reviews/1 \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 4,
    "comment": "Updated review"
  }'
```
Expected: Updated review

### Test Delete Review
```bash
curl -X DELETE http://localhost:3000/api/tours/1/reviews/1
```
Expected: Success message

---

## ✅ Tour Images API

### Test GET Tour Images
```bash
curl http://localhost:3000/api/tours/1/images
```
Expected: List of images for tour 1

### Test Create Tour Image
```bash
curl -X POST http://localhost:3000/api/tours/1/images \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/image.jpg",
    "alt": "Mountain view",
    "isMain": false
  }'
```
Expected: Created image

### Test Update Tour Image
```bash
curl -X PUT http://localhost:3000/api/tours/1/images/1 \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/new-image.jpg",
    "alt": "Updated view",
    "isMain": true
  }'
```
Expected: Updated image (other main images should be set to false)

### Test Delete Tour Image
```bash
curl -X DELETE http://localhost:3000/api/tours/1/images/1
```
Expected: Success message

---

## ✅ Users API

### Test GET All Users
```bash
curl "http://localhost:3000/api/users?page=1&limit=10"
```
Expected: Paginated list of users

### Test Search Users
```bash
curl "http://localhost:3000/api/users?search=john&role=user"
```
Expected: Filtered users

### Test GET Single User
```bash
curl http://localhost:3000/api/users/1
```
Expected: User details (without password)

### Test Update User
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "email": "newemail@example.com"
  }'
```
Expected: Updated user

### Test GET User's Bookings
```bash
curl http://localhost:3000/api/users/1/bookings
```
Expected: List of user's bookings with tour information

### Test GET User's Reviews
```bash
curl http://localhost:3000/api/users/1/reviews
```
Expected: List of user's reviews with tour information

---

## ✅ Admin API

### Test GET Dashboard Stats
```bash
curl http://localhost:3000/api/admin/dashboard
```
Expected: Complete dashboard statistics including:
- Overview counts
- Booking statistics
- Recent bookings
- Top rated tours
- Monthly revenue

### Test GET Audit Logs
```bash
curl "http://localhost:3000/api/admin/audit-logs?page=1&limit=20"
```
Expected: Paginated audit logs

### Test Create Audit Log
```bash
curl -X POST http://localhost:3000/api/admin/audit-logs \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "action": "CREATE_TOUR",
    "details": "Created new tour: Mountain Adventure"
  }'
```
Expected: Created audit log entry

---

## 📊 Database Verification Queries

Use these queries to verify data in your database:

```sql
-- Check categories
SELECT * FROM "Category";

-- Check tours with category info
SELECT t.*, c.name as category_name 
FROM eco_tours t 
LEFT JOIN "Category" c ON t."categoryId" = c.id;

-- Check reviews with ratings
SELECT r.*, u.name as user_name, t.title as tour_title
FROM "Review" r
LEFT JOIN users u ON r."userId" = u.id
LEFT JOIN eco_tours t ON r."tourId" = t.id;

-- Check tour statistics
SELECT 
  t.id,
  t.title,
  COUNT(DISTINCT r.id) as review_count,
  AVG(r.rating) as avg_rating,
  COUNT(DISTINCT b.id) as booking_count
FROM eco_tours t
LEFT JOIN "Review" r ON t.id = r."tourId"
LEFT JOIN bookings b ON t.id = b."tourId"
GROUP BY t.id, t.title;

-- Check itineraries
SELECT i.*, t.title as tour_title
FROM "Itinerary" i
LEFT JOIN eco_tours t ON i."tourId" = t.id
ORDER BY i."tourId", i."dayNumber";

-- Check tour images
SELECT ti.*, t.title as tour_title
FROM "TourImage" ti
LEFT JOIN eco_tours t ON ti."tourId" = t.id
ORDER BY ti."tourId", ti."isMain" DESC;

-- Check bookings
SELECT 
  b.*,
  t.title as tour_title,
  u.name as user_name
FROM bookings b
LEFT JOIN eco_tours t ON b."tourId" = t.id
LEFT JOIN users u ON b."userId" = u.id
ORDER BY b."createdAt" DESC;
```

---

## 🔍 Common Issues & Solutions

### Issue: "Tour not found"
**Solution**: Make sure the tour ID exists in the database
```sql
SELECT id, title FROM eco_tours;
```

### Issue: "User not found"
**Solution**: Check if user ID exists
```sql
SELECT id, email, name FROM users;
```

### Issue: Rating validation error
**Solution**: Rating must be between 1 and 5
```json
{
  "rating": 5  // Valid: 1, 2, 3, 4, or 5
}
```

### Issue: Empty response
**Solution**: Check if there's data in the database
```sql
SELECT COUNT(*) FROM eco_tours;
SELECT COUNT(*) FROM "Category";
```

---

## ✅ Integration Testing Workflow

Follow this workflow to test the complete flow:

### 1. Create a Category
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Adventure", "description": "Adventure tours", "icon": "🏔️"}'
```

### 2. Create a Tour (use category ID from step 1)
```bash
curl -X POST http://localhost:3000/api/tours \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mountain Hiking",
    "description": "Explore the mountains",
    "location": "Swiss Alps",
    "price": 150,
    "maxParticipants": 20,
    "categoryId": 1,
    "difficulty": "moderate",
    "duration": 3
  }'
```

### 3. Add Itinerary (use tour ID from step 2)
```bash
curl -X POST http://localhost:3000/api/tours/1/itineraries \
  -H "Content-Type: application/json" \
  -d '{
    "dayNumber": 1,
    "title": "Day 1: Base Camp",
    "description": "Arrive and settle in"
  }'
```

### 4. Add Tour Image
```bash
curl -X POST http://localhost:3000/api/tours/1/images \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/mountain.jpg",
    "alt": "Mountain view",
    "isMain": true
  }'
```

### 5. Create a Review (need user ID)
```bash
curl -X POST http://localhost:3000/api/tours/1/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "rating": 5,
    "comment": "Amazing experience!"
  }'
```

### 6. Create a Booking
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "tourId": 1,
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "guestPhone": "+1234567890",
    "participants": 2,
    "totalPrice": 300
  }'
```

### 7. Verify Everything
```bash
# Get tour with all data
curl http://localhost:3000/api/tours/search?search=Mountain

# Get tour statistics
curl http://localhost:3000/api/tours/1/stats

# Get admin dashboard
curl http://localhost:3000/api/admin/dashboard
```

---

## 📈 Performance Testing

Test pagination and large datasets:

```bash
# Test with different page sizes
curl "http://localhost:3000/api/tours/search?page=1&limit=5"
curl "http://localhost:3000/api/tours/search?page=1&limit=20"
curl "http://localhost:3000/api/tours/search?page=2&limit=10"

# Test sorting
curl "http://localhost:3000/api/tours/search?sortBy=price&sortOrder=ASC"
curl "http://localhost:3000/api/tours/search?sortBy=averageRating&sortOrder=DESC"

# Test combined filters
curl "http://localhost:3000/api/tours/search?search=mountain&difficulty=moderate&minPrice=50&maxPrice=200&sortBy=price&page=1&limit=10"
```

---

## ✅ Checklist Summary

- [ ] Categories CRUD operations work
- [ ] Tours search and filtering work
- [ ] Featured tours endpoint works
- [ ] Tour statistics are accurate
- [ ] Itineraries CRUD operations work
- [ ] Reviews CRUD operations work
- [ ] Tour images CRUD operations work
- [ ] Users management works
- [ ] User's bookings endpoint works
- [ ] User's reviews endpoint works
- [ ] Admin dashboard shows correct data
- [ ] Audit logs work
- [ ] Pagination works on all list endpoints
- [ ] Search functionality works
- [ ] Filters work correctly
- [ ] Sorting works as expected
- [ ] Error handling works (test with invalid IDs)
- [ ] Data relationships are correct (joins work)

All APIs are ready to use! 🎉
