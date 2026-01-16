// API Helper Functions for Frontend
// Import this file in your components to make API calls

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Generic fetch wrapper with error handling
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'An error occurred');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ==================== CATEGORIES ====================

export const categoriesAPI = {
  getAll: () => fetchAPI('/categories'),
  getById: (id: number) => fetchAPI(`/categories/${id}`),
  create: (data: any) => fetchAPI('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => fetchAPI(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => fetchAPI(`/categories/${id}`, {
    method: 'DELETE',
  }),
};

// ==================== TOURS ====================

export const toursAPI = {
  search: (params: {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    return fetchAPI(`/tours/search?${queryParams.toString()}`);
  },

  getFeatured: () => fetchAPI('/tours/featured'),
  
  getById: (id: number) => fetchAPI(`/tours/${id}`),
  
  create: (data: any) => fetchAPI('/tours', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: number, data: any) => fetchAPI(`/tours/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: number) => fetchAPI(`/tours/${id}`, {
    method: 'DELETE',
  }),
  
  getStats: (tourId: number) => fetchAPI(`/tours/${tourId}/stats`),
};

// ==================== ITINERARIES ====================

export const itinerariesAPI = {
  getByTour: (tourId: number) => fetchAPI(`/tours/${tourId}/itineraries`),
  
  getById: (tourId: number, id: number) => 
    fetchAPI(`/tours/${tourId}/itineraries/${id}`),
  
  create: (tourId: number, data: any) => 
    fetchAPI(`/tours/${tourId}/itineraries`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (tourId: number, id: number, data: any) => 
    fetchAPI(`/tours/${tourId}/itineraries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (tourId: number, id: number) => 
    fetchAPI(`/tours/${tourId}/itineraries/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== REVIEWS ====================

export const reviewsAPI = {
  getByTour: (tourId: number) => fetchAPI(`/tours/${tourId}/reviews`),
  
  getById: (tourId: number, id: number) => 
    fetchAPI(`/tours/${tourId}/reviews/${id}`),
  
  create: (tourId: number, data: { userId: number; rating: number; comment?: string }) => 
    fetchAPI(`/tours/${tourId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (tourId: number, id: number, data: { rating: number; comment?: string }) => 
    fetchAPI(`/tours/${tourId}/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (tourId: number, id: number) => 
    fetchAPI(`/tours/${tourId}/reviews/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== TOUR IMAGES ====================

export const tourImagesAPI = {
  getByTour: (tourId: number) => fetchAPI(`/tours/${tourId}/images`),
  
  getById: (tourId: number, id: number) => 
    fetchAPI(`/tours/${tourId}/images/${id}`),
  
  create: (tourId: number, data: { url: string; alt?: string; isMain?: boolean }) => 
    fetchAPI(`/tours/${tourId}/images`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (tourId: number, id: number, data: { url: string; alt?: string; isMain?: boolean }) => 
    fetchAPI(`/tours/${tourId}/images/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (tourId: number, id: number) => 
    fetchAPI(`/tours/${tourId}/images/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== BOOKINGS ====================

export const bookingsAPI = {
  getAll: (params?: {
    status?: string;
    tourId?: number;
    userId?: number;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return fetchAPI(`/bookings?${queryParams.toString()}`);
  },
  
  getById: (id: number) => fetchAPI(`/bookings/${id}`),
  
  create: (data: {
    tourId: number;
    userId?: number;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    participants: number;
    totalPrice: number;
  }) => fetchAPI('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: number, data: {
    status?: string;
    paymentStatus?: string;
  }) => fetchAPI(`/bookings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: number) => fetchAPI(`/bookings/${id}`, {
    method: 'DELETE',
  }),
};

// ==================== USERS ====================

export const usersAPI = {
  getAll: (params?: {
    role?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return fetchAPI(`/users?${queryParams.toString()}`);
  },
  
  getById: (id: number) => fetchAPI(`/users/${id}`),
  
  update: (id: number, data: {
    name?: string;
    email?: string;
    role?: string;
  }) => fetchAPI(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: number) => fetchAPI(`/users/${id}`, {
    method: 'DELETE',
  }),
  
  getBookings: (id: number) => fetchAPI(`/users/${id}/bookings`),
  
  getReviews: (id: number) => fetchAPI(`/users/${id}/reviews`),
};

// ==================== ADMIN ====================

export const adminAPI = {
  getDashboard: () => fetchAPI('/admin/dashboard'),
  
  getAuditLogs: (params?: {
    userId?: number;
    action?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return fetchAPI(`/admin/audit-logs?${queryParams.toString()}`);
  },
  
  createAuditLog: (data: {
    userId: number;
    action: string;
    details?: string;
  }) => fetchAPI('/admin/audit-logs', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// ==================== UPLOAD ====================

export const uploadAPI = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }

    return data;
  },
};

// ==================== EXAMPLE USAGE ====================

/*
// In your React component:

import { toursAPI, bookingsAPI, reviewsAPI } from '@/lib/api-helpers';

// Search tours
const tours = await toursAPI.search({
  search: 'mountain',
  difficulty: 'moderate',
  minPrice: 50,
  maxPrice: 200,
  page: 1,
  limit: 10
});

// Get featured tours
const featured = await toursAPI.getFeatured();

// Create a booking
const booking = await bookingsAPI.create({
  tourId: 1,
  guestName: 'John Doe',
  guestEmail: 'john@example.com',
  guestPhone: '+1234567890',
  participants: 2,
  totalPrice: 300
});

// Add a review
const review = await reviewsAPI.create(1, {
  userId: 1,
  rating: 5,
  comment: 'Amazing tour!'
});

// Upload an image
const imageFile = event.target.files[0];
const uploadResult = await uploadAPI.uploadImage(imageFile);
console.log('Uploaded URL:', uploadResult.url);

// Get dashboard stats (admin)
const stats = await adminAPI.getDashboard();
*/

export default {
  categories: categoriesAPI,
  tours: toursAPI,
  itineraries: itinerariesAPI,
  reviews: reviewsAPI,
  tourImages: tourImagesAPI,
  bookings: bookingsAPI,
  users: usersAPI,
  admin: adminAPI,
  upload: uploadAPI,
};
