// API Response Types for ALG-EcoTour Application

export interface Tour {
  id: number;
  title: string;
  description: string | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  price: number;
  maxParticipants: number;
  photoURL: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: number;
  tourId: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  participants: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  notes: string | null;
  tourDate: string;
  specialRequests: string;
  createdAt: Date;
  updatedAt: Date;
  tour?: Tour;
}

export interface User {
  id: number;
  email: string;
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
}
