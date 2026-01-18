import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { bookingCreateSchema, validateRequest } from '@/lib/validation';
import { getUserBookings, getAllBookings, createBooking } from '@/lib/bookings';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = validateRequest(bookingCreateSchema, body);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { tourId, guestName, guestEmail, guestPhone, participants, paymentStatus, paymentInfo } = validation.data;

    // Create booking
    const booking = await createBooking({
      tourId,
      guestName,
      guestEmail,
      guestPhone,
      participants,
      paymentStatus: paymentStatus || 'PENDING',
      paymentInfo,
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    const { searchParams } = new URL(request.url);
    const tourId = searchParams.get('tourId');
    const status = searchParams.get('status') as 'pending' | 'confirmed' | 'cancelled' | undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    let bookings;

    if (session?.user?.email) {
      // Authenticated user - get their bookings
      bookings = await getUserBookings(session.user.email, {
        status,
        tourId: tourId ? parseInt(tourId) : undefined,
        limit,
        offset,
      });
    } else {
      // Admin or public access - get all bookings (you might want to restrict this)
      bookings = await getAllBookings({
        status,
        tourId: tourId ? parseInt(tourId) : undefined,
        limit,
        offset,
      });
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
