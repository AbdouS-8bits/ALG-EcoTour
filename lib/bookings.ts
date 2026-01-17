import { prisma } from './prisma';

export interface BookingWithTour {
  id: number;
  tourId: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  participants: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  paymentInfo?: {
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
  };
  tour?: {
    id: number;
    title: string;
    location: string;
    price: number;
    photoURL?: string | null;
  };
}

export interface CreateBookingData {
  tourId: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  participants: number;
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED';
  paymentInfo?: {
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
  };
}

export interface BookingFilters {
  email?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  tourId?: number;
  limit?: number;
  offset?: number;
}

/**
 * Get bookings for a specific user by email
 */
export async function getUserBookings(email: string, filters: BookingFilters = {}) {
  try {
    const { status, tourId, limit = 50, offset = 0 } = filters;

    const bookings = await prisma.booking.findMany({
      where: {
        guestEmail: email,
        ...(status && { status }),
        ...(tourId && { tourId }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    // Fetch tour details separately
    const bookingsWithTours = await Promise.all(
      bookings.map(async (booking) => {
        const tour = await prisma.ecoTour.findUnique({
          where: { id: booking.tourId },
          select: {
            id: true,
            title: true,
            location: true,
            price: true,
            photoURL: true,
          },
        });

        return {
          ...booking,
          tour: tour || undefined,
        };
      })
    );

    return bookingsWithTours as BookingWithTour[];
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw new Error('Failed to fetch user bookings');
  }
}

/**
 * Get all bookings (admin only)
 */
export async function getAllBookings(filters: BookingFilters = {}) {
  try {
    const { status, tourId, limit = 100, offset = 0 } = filters;

    const bookings = await prisma.booking.findMany({
      where: {
        ...(status && { status }),
        ...(tourId && { tourId }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    // Fetch tour details separately
    const bookingsWithTours = await Promise.all(
      bookings.map(async (booking) => {
        const tour = await prisma.ecoTour.findUnique({
          where: { id: booking.tourId },
          select: {
            id: true,
            title: true,
            location: true,
            price: true,
            photoURL: true,
          },
        });

        return {
          ...booking,
          tour: tour || undefined,
        };
      })
    );

    return bookingsWithTours as BookingWithTour[];
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    throw new Error('Failed to fetch bookings');
  }
}

/**
 * Get bookings for a specific tour
 */
export async function getTourBookings(tourId: number, filters: BookingFilters = {}) {
  try {
    const { status, limit = 50, offset = 0 } = filters;

    const bookings = await prisma.booking.findMany({
      where: {
        tourId,
        ...(status && { status }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    // Fetch tour details separately
    const bookingsWithTours = await Promise.all(
      bookings.map(async (booking) => {
        const tour = await prisma.ecoTour.findUnique({
          where: { id: booking.tourId },
          select: {
            id: true,
            title: true,
            location: true,
            price: true,
            photoURL: true,
          },
        });

        return {
          ...booking,
          tour: tour || undefined,
        };
      })
    );

    return bookingsWithTours as BookingWithTour[];
  } catch (error) {
    console.error('Error fetching tour bookings:', error);
    throw new Error('Failed to fetch tour bookings');
  }
}

/**
 * Create a new booking
 */
export async function createBooking(data: CreateBookingData) {
  try {
    // Check if tour exists and has availability
    const tour = await prisma.ecoTour.findUnique({
      where: { id: data.tourId },
    });

    if (!tour) {
      throw new Error('Tour not found');
    }

    if (data.participants > tour.maxParticipants) {
      throw new Error(`Maximum participants allowed: ${tour.maxParticipants}`);
    }

    const booking = await prisma.booking.create({
      data: {
        ...data,
        status: data.paymentStatus === 'PAID' ? 'confirmed' : 'pending',
      },
    });

    // Fetch tour details separately
    const tourDetails = await prisma.ecoTour.findUnique({
      where: { id: booking.tourId },
      select: {
        id: true,
        title: true,
        location: true,
        price: true,
        photoURL: true,
      },
    });

    return {
      ...booking,
      tour: tourDetails || undefined,
    } as BookingWithTour;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

/**
 * Update booking status
 */
export async function updateBookingStatus(bookingId: number, status: 'pending' | 'confirmed' | 'cancelled') {
  try {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    // Fetch tour details separately
    const tourDetails = await prisma.ecoTour.findUnique({
      where: { id: booking.tourId },
      select: {
        id: true,
        title: true,
        location: true,
        price: true,
        photoURL: true,
      },
    });

    return {
      ...booking,
      tour: tourDetails || undefined,
    } as BookingWithTour;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw new Error('Failed to update booking status');
  }
}

/**
 * Delete a booking (admin only)
 */
export async function deleteBooking(bookingId: number) {
  try {
    const booking = await prisma.booking.delete({
      where: { id: bookingId },
    });

    // Fetch tour details separately
    const tourDetails = await prisma.ecoTour.findUnique({
      where: { id: booking.tourId },
      select: {
        id: true,
        title: true,
        location: true,
        price: true,
        photoURL: true,
      },
    });

    return {
      ...booking,
      tour: tourDetails || undefined,
    } as BookingWithTour;
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw new Error('Failed to delete booking');
  }
}

/**
 * Get booking statistics for a user
 */
export async function getUserBookingStats(email: string) {
  try {
    const stats = await prisma.booking.groupBy({
      by: ['status'],
      where: {
        guestEmail: email,
      },
      _count: {
        id: true,
      },
    });

    return stats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.id;
      return acc;
    }, {} as Record<string, number>);
  } catch (error) {
    console.error('Error fetching user booking stats:', error);
    throw new Error('Failed to fetch booking statistics');
  }
}

/**
 * Get booking statistics for all bookings (admin only)
 */
export async function getAllBookingStats() {
  try {
    const stats = await prisma.booking.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    return stats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.id;
      return acc;
    }, {} as Record<string, number>);
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    throw new Error('Failed to fetch booking statistics');
  }
}
