<<<<<<< HEAD
// TypeScript Types for API Responses

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  createdAt: string;
}
=======
// API Response Types for ALG-EcoTour Application
>>>>>>> 443de18544d2103bd20d47933e022c8be4587715

export interface Tour {
  id: number;
  title: string;
<<<<<<< HEAD
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
=======
  description: string | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  price: number;
  maxParticipants: number;
  photoURL: string | null;
  createdAt: Date;
  updatedAt: Date;
>>>>>>> 443de18544d2103bd20d47933e022c8be4587715
}

export interface Booking {
  id: number;
  tourId: number;
<<<<<<< HEAD
  userId?: number;
=======
>>>>>>> 443de18544d2103bd20d47933e022c8be4587715
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  participants: number;
  status: 'pending' | 'confirmed' | 'cancelled';
<<<<<<< HEAD
  paymentStatus: 'pending' | 'paid' | 'refunded';
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  // Additional fields from joins
  tourTitle?: string;
  tourLocation?: string;
  tourPrice?: number;
  userName?: string;
=======
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  notes: string | null;
  tourDate: string;
  specialRequests: string;
  createdAt: Date;
  updatedAt: Date;
  tour?: Tour;
>>>>>>> 443de18544d2103bd20d47933e022c8be4587715
}

export interface User {
  id: number;
  email: string;
<<<<<<< HEAD
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
=======
  name: string | null;
  phone: string | null;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  tourId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentData {
  cardHolderName: string;
  paymentMethod: 'card' | 'mobile' | 'wallet';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  billingAddress: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
  transactionId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PAID';
  timestamp: string;
}

export interface Payment {
  id?: number;
  cardHolderName: string;
  paymentMethod: 'card' | 'mobile' | 'wallet';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  billingAddress: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
  transactionId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PAID';
  timestamp: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AnalyticsData {
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
  bookingsPerMonth: Array<{
    month: string;
    count: number;
    revenue: number;
  }>;
  recentBookings: Booking[];
  monthlyStats: Array<{
    month: string;
    bookings: number;
    revenue: number;
  }>;
}

// Additional types for analytics queries
export interface BookingMonthData {
  month: string;
  count: string;
  revenue: string;
}

export interface RecentBookingData {
  id: number;
  guestName: string;
  guestEmail: string;
  status: string;
  createdAt: Date;
  tour?: {
    id: number;
    title: string;
    location: string;
  };
}

export interface MonthlyRevenueData {
  month: string;
  revenue: string;
}

export interface TopTourData {
  id: string;
  title: string;
  location: string;
  bookingCount: string;
  totalParticipants: string;
>>>>>>> 443de18544d2103bd20d47933e022c8be4587715
}
