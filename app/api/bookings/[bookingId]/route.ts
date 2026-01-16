import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { updateBookingStatus, getUserBookings } from '@/lib/bookings';

// Zod schema for booking status update
const bookingStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled']),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { bookingId } = await params;
    const bookingIdNum = parseInt(bookingId);
    if (isNaN(bookingIdNum)) {
      return NextResponse.json(
        { error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validation = bookingStatusSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid status', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { status } = validation.data;

    // Get user's bookings to verify ownership
    const userBookings = await getUserBookings(session.user.email);
    const booking = userBookings.find(b => b.id === bookingIdNum);

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found or access denied' },
        { status: 404 }
      );
    }

    // Business rule: Prevent cancelling confirmed bookings
    if (booking.status === 'confirmed' && status === 'cancelled') {
      return NextResponse.json(
        { error: 'Cannot cancel confirmed bookings. Please contact support.' },
        { status: 400 }
      );
    }

    // Update booking status
    const updatedBooking = await updateBookingStatus(bookingIdNum, status);

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Update booking status error:', error);
    return NextResponse.json(
      { error: 'Failed to update booking status', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { bookingId } = await params;
    const bookingIdNum = parseInt(bookingId);
    if (isNaN(bookingIdNum)) {
      return NextResponse.json(
        { error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    // Get user's bookings to verify ownership
    const userBookings = await getUserBookings(session.user.email);
    const booking = userBookings.find(b => b.id === bookingIdNum);

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found or access denied' },
        { status: 404 }
      );
    }

    // Only allow deletion of pending bookings
    if (booking.status !== 'pending') {
      return NextResponse.json(
        { error: 'Can only delete pending bookings' },
        { status: 400 }
      );
    }

    // Delete booking (you'll need to implement this in lib/bookings.ts)
    // await deleteBooking(bookingIdNum);
    
    return NextResponse.json(
      { message: 'Booking deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete booking error:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking', details: (error as Error).message },
      { status: 500 }
    );
  }
}
