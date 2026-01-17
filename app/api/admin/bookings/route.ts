import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { getAllBookings } from '@/lib/bookings';
import { updateBookingStatus, deleteBooking } from '@/lib/bookings';

// Zod schema for booking status update
const updateBookingStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled']),
  notes: z.string().optional(),
});

// Zod schema for query parameters
const bookingQuerySchema = z.object({
  status: z.enum(['all', 'pending', 'confirmed', 'cancelled']).optional(),
  tourId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  limit: z.string().transform(Number).optional(),
  offset: z.string().transform(Number).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const validation = bookingQuerySchema.safeParse(Object.fromEntries(searchParams));
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { status, tourId, dateFrom, dateTo, limit = 50, offset = 0 } = validation.data;

    // Build filters
    const filters: any = {};
    if (status && status !== 'all') {
      filters.status = status;
    }
    if (tourId) {
      filters.tourId = parseInt(tourId);
    }
    if (dateFrom) {
      filters.createdAt = { gte: new Date(dateFrom) };
    }
    if (dateTo) {
      filters.createdAt = { ...filters.createdAt, lte: new Date(dateTo) };
    }

    const bookings = await getAllBookings({
      ...filters,
      limit,
      offset,
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Get admin bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = updateBookingStatusSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { status, notes } = validation.data;

    // Get booking ID from request body or query params
    const bookingId = body.id || request.nextUrl.searchParams.get('id');
    
    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    const bookingIdNum = parseInt(bookingId);
    if (isNaN(bookingIdNum)) {
      return NextResponse.json(
        { error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    // Update booking status
    const updatedBooking = await updateBookingStatus(bookingIdNum, status);

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Update admin booking error:', error);
    return NextResponse.json(
      { error: 'Failed to update booking', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('id');
    
    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    const bookingIdNum = parseInt(bookingId);
    if (isNaN(bookingIdNum)) {
      return NextResponse.json(
        { error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    // Delete booking
    const deletedBooking = await deleteBooking(bookingIdNum);

    return NextResponse.json(
      { message: 'Booking deleted successfully', booking: deletedBooking },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete admin booking error:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking', details: (error as Error).message },
      { status: 500 }
    );
  }
}
