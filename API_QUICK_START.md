# Quick Start Guide - API Usage

## 📦 What's Been Created

I've created a complete API ecosystem for your eco-tourism platform with:

### ✅ New API Endpoints (40+ endpoints)
1. **Categories API** - 5 endpoints
2. **Tours API** - 7 endpoints (including search & featured)
3. **Itineraries API** - 5 endpoints
4. **Reviews API** - 5 endpoints
5. **Tour Images API** - 5 endpoints
6. **Users API** - 7 endpoints
7. **Admin API** - 3 endpoints

### 📁 Files Created

```
app/api/
├── categories/
│   ├── route.ts                    # GET all, POST create
│   └── [id]/route.ts              # GET, PUT, DELETE single category
├── tours/
│   ├── search/route.ts            # Advanced search with filters
│   ├── featured/route.ts          # Get top 8 featured tours
│   └── [tourId]/
│       ├── stats/route.ts         # Tour statistics
│       ├── reviews/
│       │   ├── route.ts           # GET all, POST create
│       │   └── [id]/route.ts     # GET, PUT, DELETE single review
│       ├── itineraries/
│       │   ├── route.ts           # GET all, POST create
│       │   └── [id]/route.ts     # GET, PUT, DELETE single itinerary
│       └── images/
│           ├── route.ts           # GET all, POST create
│           └── [id]/route.ts     # GET, PUT, DELETE single image
├── users/
│   ├── route.ts                   # GET all with pagination
│   └── [id]/
│       ├── route.ts               # GET, PUT, DELETE single user
│       ├── bookings/route.ts      # GET user's bookings
│       └── reviews/route.ts       # GET user's reviews
└── admin/
    ├── dashboard/route.ts         # Dashboard statistics
    └── audit-logs/route.ts        # GET all, POST create audit log

lib/
└── api-helpers.ts                 # Frontend API helper functions

hooks/
└── useAPI.ts                      # React hooks for API calls

types/
└── api.ts                         # TypeScript types

Documentation/
├── COMPLETE_API_DOCUMENTATION.md  # Full API documentation
├── API_SUMMARY.md                 # Quick reference
└── ALG_EcoTour_Postman_Collection.json  # Postman collection
```

---

## 🚀 Quick Start

### 1. Test APIs with Postman

1. Open Postman
2. Import `ALG_EcoTour_Postman_Collection.json`
3. The base URL is set to `http://localhost:3000`
4. Test any endpoint by selecting it from the collection

### 2. Use API Helpers in Your Components

```typescript
// Import the API helpers
import api from '@/lib/api-helpers';

// Example: Search tours
const tours = await api.tours.search({
  search: 'mountain',
  difficulty: 'moderate',
  page: 1,
  limit: 10
});

// Example: Create a booking
const booking = await api.bookings.create({
  tourId: 1,
  guestName: 'John Doe',
  guestEmail: 'john@example.com',
  guestPhone: '+1234567890',
  participants: 2,
  totalPrice: 300
});

// Example: Add a review
const review = await api.reviews.create(tourId, {
  userId: 1,
  rating: 5,
  comment: 'Amazing tour!'
});
```

### 3. Use React Hooks (Recommended)

```typescript
import { useTours, useFeaturedTours, useTourReviews } from '@/hooks/useAPI';

function ToursPage() {
  const { tours, pagination, loading, error } = useTours({
    difficulty: 'moderate',
    page: 1,
    limit: 12,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {tours.map(tour => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
}
```

---

## 📋 Common Use Cases

### 1. Display Tours on Homepage

```typescript
import { useFeaturedTours } from '@/hooks/useAPI';

function HomePage() {
  const { tours, loading } = useFeaturedTours();

  return (
    <section>
      <h2>Featured Tours</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {tours.map(tour => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      )}
    </section>
  );
}
```

### 2. Search and Filter Tours

```typescript
import { useTours } from '@/hooks/useAPI';
import { useState } from 'react';

function SearchPage() {
  const [filters, setFilters] = useState({
    search: '',
    difficulty: '',
    minPrice: 0,
    maxPrice: 1000,
    page: 1,
  });

  const { tours, pagination, loading } = useTours(filters);

  return (
    <div>
      <input
        type="text"
        placeholder="Search tours..."
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      />
      
      <select
        onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
      >
        <option value="">All Difficulties</option>
        <option value="easy">Easy</option>
        <option value="moderate">Moderate</option>
        <option value="hard">Hard</option>
      </select>

      <div className="tours-grid">
        {tours.map(tour => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={pagination?.page || 1}
        totalPages={pagination?.totalPages || 1}
        onPageChange={(page) => setFilters({ ...filters, page })}
      />
    </div>
  );
}
```

### 3. Tour Details with Reviews

```typescript
import { useTour, useTourReviews } from '@/hooks/useAPI';
import api from '@/lib/api-helpers';

function TourDetailsPage({ tourId }: { tourId: number }) {
  const { tour, loading: tourLoading } = useTour(tourId);
  const { reviews, loading: reviewsLoading, refetch } = useTourReviews(tourId);

  const handleReviewSubmit = async (data: { rating: number; comment: string }) => {
    try {
      await api.reviews.create(tourId, {
        userId: currentUserId, // Get from auth context
        rating: data.rating,
        comment: data.comment,
      });
      refetch(); // Refresh reviews
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  if (tourLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{tour?.title}</h1>
      <p>{tour?.description}</p>
      <p>Price: ${tour?.price}</p>
      <p>Difficulty: {tour?.difficulty}</p>
      
      <div className="reviews">
        <h2>Reviews ({reviews.length})</h2>
        {reviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      <ReviewForm onSubmit={handleReviewSubmit} />
    </div>
  );
}
```

### 4. Create a Booking

```typescript
import api from '@/lib/api-helpers';

function BookingForm({ tourId, tourPrice }: { tourId: number; tourPrice: number }) {
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    participants: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const booking = await api.bookings.create({
        tourId,
        ...formData,
        totalPrice: tourPrice * formData.participants,
      });
      
      alert('Booking created successfully!');
      // Redirect to confirmation page
    } catch (error) {
      alert('Failed to create booking');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={formData.guestName}
        onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.guestEmail}
        onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
      />
      <input
        type="tel"
        placeholder="Phone"
        value={formData.guestPhone}
        onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
      />
      <input
        type="number"
        min="1"
        placeholder="Participants"
        value={formData.participants}
        onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value) })}
      />
      <p>Total: ${tourPrice * formData.participants}</p>
      <button type="submit">Book Now</button>
    </form>
  );
}
```

### 5. Admin Dashboard

```typescript
import { useDashboard } from '@/hooks/useAPI';

function AdminDashboard() {
  const { stats, loading, error } = useDashboard();

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="stats-grid">
        <StatCard title="Total Tours" value={stats?.overview.totalTours} />
        <StatCard title="Total Users" value={stats?.overview.totalUsers} />
        <StatCard title="Total Bookings" value={stats?.overview.totalBookings} />
        <StatCard title="Total Revenue" value={`$${stats?.bookings.totalRevenue}`} />
      </div>

      <div className="charts">
        <h2>Monthly Revenue</h2>
        <RevenueChart data={stats?.monthlyRevenue} />
      </div>

      <div className="recent-bookings">
        <h2>Recent Bookings</h2>
        <BookingsTable bookings={stats?.recentBookings} />
      </div>

      <div className="top-tours">
        <h2>Top Rated Tours</h2>
        <ToursGrid tours={stats?.topRatedTours} />
      </div>
    </div>
  );
}
```

---

## 🔍 API Features

### ✅ Pagination
Most list endpoints support pagination:
```typescript
const { tours, pagination } = useTours({ page: 1, limit: 12 });
```

### ✅ Search & Filtering
Advanced search capabilities:
```typescript
const tours = await api.tours.search({
  search: 'mountain',
  categoryId: 1,
  difficulty: 'moderate',
  minPrice: 50,
  maxPrice: 200,
  location: 'Alps',
  sortBy: 'price',
  sortOrder: 'ASC',
});
```

### ✅ Statistics & Analytics
Get detailed statistics:
```typescript
const stats = await api.tours.getStats(tourId);
// Returns: reviews, average rating, bookings, revenue, etc.
```

### ✅ Relationships
APIs automatically include related data:
```typescript
// Reviews include user information
const reviews = await api.reviews.getByTour(tourId);
// Each review includes: userName, userEmail

// Tours include category and rating info
const tours = await api.tours.search({});
// Each tour includes: categoryName, averageRating, reviewCount
```

---

## 📝 Next Steps

1. **Test the APIs**: Use the Postman collection to test all endpoints
2. **Build UI Components**: Use the React hooks to build your pages
3. **Add Authentication**: Protect routes that need authentication
4. **Handle Errors**: Add proper error handling and loading states
5. **Add Validation**: Validate form inputs before API calls
6. **Optimize Performance**: Add caching where appropriate

---

## 📚 Documentation Files

- **COMPLETE_API_DOCUMENTATION.md** - Full API reference with all endpoints
- **API_SUMMARY.md** - Quick overview of all available APIs
- **ALG_EcoTour_Postman_Collection.json** - Postman collection for testing

---

## 🆘 Need Help?

- Check `COMPLETE_API_DOCUMENTATION.md` for detailed endpoint documentation
- Look at `hooks/useAPI.ts` for usage examples
- Refer to `lib/api-helpers.ts` for available helper functions
- See `types/api.ts` for TypeScript type definitions

Happy coding! 🚀
