// TypeScript Types for API Responses

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  createdAt: string;
}

export interface Tour {
  id: number;
  title: string;
  description?: string;
  location: string;
  price: number;
  maxParticipants: number;
  categoryId?: number;
  difficulty: 'easy' | 'moderate' | 'hard';
  duration: number;
  status: 'active' | 'inactive';
  photoURL?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
  // Additional fields from joins
  categoryName?: string;
  categoryIcon?: string;
  averageRating?: string;
  reviewCount?: number;
  bookingCount?: number;
  mainImage?: string;
}

export interface Itinerary {
  id: number;
  tourId: number;
  dayNumber: number;
  title: string;
  description: string;
  createdAt: string;
}

export interface Review {
  id: number;
  tourId: number;
  userId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  // Additional fields from joins
  userName?: string;
  userEmail?: string;
  tourTitle?: string;
  tourLocation?: string;
}

export interface TourImage {
  id: number;
  tourId: number;
  url: string;
  alt?: string;
  isMain: boolean;
  createdAt: string;
}

export interface Booking {
  id: number;
  tourId: number;
  userId?: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  participants: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  // Additional fields from joins
  tourTitle?: string;
  tourLocation?: string;
  tourPrice?: number;
  userName?: string;
}

export interface User {
  id: number;
  email: string;
  name?: string;
  role: 'user' | 'admin';
  emailVerified?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: number;
  userId: number;
  action: string;
  details?: string;
  createdAt: string;
  // Additional fields from joins
  userName?: string;
  userEmail?: string;
}

export interface TourStats {
  tour: {
    id: number;
    title: string;
    location: string;
    price: number;
    maxParticipants: number;
    difficulty: string;
    duration: number;
    status: string;
  };
  reviews: {
    count: number;
    averageRating: string;
  };
  bookings: {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    totalParticipants: number;
    totalRevenue: number;
  };
}

export interface DashboardStats {
  overview: {
    totalTours: number;
    totalUsers: number;
    totalBookings: number;
    totalReviews: number;
  };
  bookings: {
    confirmed: number;
    pending: number;
    cancelled: number;
    totalRevenue: number;
  };
  recentBookings: Booking[];
  topRatedTours: Tour[];
  monthlyRevenue: Array<{
    month: string;
    revenue: string;
    bookings: string;
  }>;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: Pagination;
}

// Request types
export interface CreateCategoryRequest {
  name: string;
  description?: string;
  icon?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  icon?: string;
}

export interface CreateTourRequest {
  title: string;
  description?: string;
  location: string;
  price: number;
  maxParticipants: number;
  categoryId?: number;
  difficulty: 'easy' | 'moderate' | 'hard';
  duration: number;
  status?: 'active' | 'inactive';
  latitude?: number;
  longitude?: number;
}

export interface UpdateTourRequest {
  title?: string;
  description?: string;
  location?: string;
  price?: number;
  maxParticipants?: number;
  categoryId?: number;
  difficulty?: 'easy' | 'moderate' | 'hard';
  duration?: number;
  status?: 'active' | 'inactive';
  latitude?: number;
  longitude?: number;
}

export interface CreateItineraryRequest {
  dayNumber: number;
  title: string;
  description: string;
}

export interface UpdateItineraryRequest {
  dayNumber?: number;
  title?: string;
  description?: string;
}

export interface CreateReviewRequest {
  userId: number;
  rating: number;
  comment?: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
}

export interface CreateTourImageRequest {
  url: string;
  alt?: string;
  isMain?: boolean;
}

export interface UpdateTourImageRequest {
  url?: string;
  alt?: string;
  isMain?: boolean;
}

export interface CreateBookingRequest {
  tourId: number;
  userId?: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  participants: number;
  totalPrice: number;
}

export interface UpdateBookingRequest {
  status?: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus?: 'pending' | 'paid' | 'refunded';
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: 'user' | 'admin';
}

export interface CreateAuditLogRequest {
  userId: number;
  action: string;
  details?: string;
}

export interface TourSearchParams {
  search?: string;
  categoryId?: number;
  difficulty?: 'easy' | 'moderate' | 'hard';
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  status?: 'active' | 'inactive';
  sortBy?: 'createdAt' | 'price' | 'title' | 'averageRating' | 'duration';
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface UserSearchParams {
  role?: 'user' | 'admin';
  search?: string;
  page?: number;
  limit?: number;
}

export interface BookingSearchParams {
  status?: 'pending' | 'confirmed' | 'cancelled';
  tourId?: number;
  userId?: number;
  page?: number;
  limit?: number;
}

export interface AuditLogSearchParams {
  userId?: number;
  action?: string;
  page?: number;
  limit?: number;
}
