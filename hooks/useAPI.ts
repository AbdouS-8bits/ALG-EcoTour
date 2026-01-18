'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api-helpers';
import type {
  Tour,
  Category,
  Booking,
  Review,
  User,
  DashboardStats,
  TourStats,
  TourSearchParams,
  APIResponse,
  Pagination,
} from '@/types/api';

// ==================== TOURS HOOKS ====================

export function useTours(params?: TourSearchParams) {
  const [tours, setTours] = useState<Tour[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const response = await api.tours.search(params || {});
        setTours(response.data);
        setPagination(response.pagination);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [JSON.stringify(params)]);

  return { tours, pagination, loading, error };
}

export function useFeaturedTours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedTours = async () => {
      try {
        setLoading(true);
        const response = await api.tours.getFeatured();
        setTours(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTours();
  }, []);

  return { tours, loading, error };
}

export function useTour(id: number | null) {
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setTour(null);
      setLoading(false);
      return;
    }

    const fetchTour = async () => {
      try {
        setLoading(true);
        const response = await api.tours.getById(id);
        setTour(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  return { tour, loading, error };
}

export function useTourStats(tourId: number | null) {
  const [stats, setStats] = useState<TourStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tourId) {
      setStats(null);
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.tours.getStats(tourId);
        setStats(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [tourId]);

  return { stats, loading, error };
}

// ==================== CATEGORIES HOOKS ====================

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.categories.getAll();
        setCategories(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

// ==================== REVIEWS HOOKS ====================

export function useTourReviews(tourId: number | null) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    if (!tourId) {
      setReviews([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.reviews.getByTour(tourId);
      setReviews(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [tourId]);

  return { reviews, loading, error, refetch: fetchReviews };
}

// ==================== BOOKINGS HOOKS ====================

export function useBookings(params?: {
  status?: string;
  tourId?: number;
  userId?: number;
  page?: number;
  limit?: number;
}) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.bookings.getAll(params);
      setBookings(response.data);
      setPagination(response.pagination);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [JSON.stringify(params)]);

  return { bookings, pagination, loading, error, refetch: fetchBookings };
}

export function useUserBookings(userId: number | null) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setBookings([]);
      setLoading(false);
      return;
    }

    const fetchUserBookings = async () => {
      try {
        setLoading(true);
        const response = await api.users.getBookings(userId);
        setBookings(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [userId]);

  return { bookings, loading, error };
}

// ==================== USERS HOOKS ====================

export function useUsers(params?: {
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.users.getAll(params);
      setUsers(response.data);
      setPagination(response.pagination);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [JSON.stringify(params)]);

  return { users, pagination, loading, error, refetch: fetchUsers };
}

// ==================== ADMIN HOOKS ====================

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.admin.getDashboard();
      setStats(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return { stats, loading, error, refetch: fetchDashboard };
}

// ==================== EXAMPLE USAGE ====================

/*
// In your component:

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
    <div>
      {tours.map(tour => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
}

function HomePage() {
  const { tours, loading } = useFeaturedTours();

  if (loading) return <div>Loading featured tours...</div>;

  return (
    <div>
      <h2>Featured Tours</h2>
      {tours.map(tour => (
        <FeaturedTourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
}

function TourDetailsPage({ tourId }: { tourId: number }) {
  const { tour, loading: tourLoading } = useTour(tourId);
  const { reviews, loading: reviewsLoading, refetch } = useTourReviews(tourId);

  const handleReviewSubmit = async (reviewData) => {
    await api.reviews.create(tourId, reviewData);
    refetch(); // Refresh reviews after submitting
  };

  if (tourLoading) return <div>Loading tour...</div>;

  return (
    <div>
      <h1>{tour?.title}</h1>
      <div>Reviews: {reviews.length}</div>
      {reviews.map(review => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}

function AdminDashboard() {
  const { stats, loading, error } = useDashboard();

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <div>Total Tours: {stats?.overview.totalTours}</div>
      <div>Total Revenue: ${stats?.bookings.totalRevenue}</div>
    </div>
  );
}
*/
