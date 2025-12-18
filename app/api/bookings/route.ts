import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { tourId, guestName, guestEmail, guestPhone, participants } = body;
    
    if (!tourId || !guestName || !guestEmail || !guestPhone || !participants) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if tour exists
    const tour = await prisma.ecoTour.findUnique({
      where: { id: tourId },
    });

    if (!tour) {
      return NextResponse.json(
        { error: 'Tour not found' },
        { status: 404 }
      );
    }

    // Check if participants exceed max
    if (participants > tour.maxParticipants) {
      return NextResponse.json(
        { error: `Maximum participants allowed: ${tour.maxParticipants}` },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        tourId: parseInt(tourId),
        guestName,
        guestEmail,
        guestPhone,
        participants: parseInt(participants),
        status: 'pending',
      },
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
    const { searchParams } = new URL(request.url);
    const tourId = searchParams.get('tourId');

    let bookings;
    
    if (tourId) {
      // Get bookings for specific tour
      bookings = await prisma.booking.findMany({
        where: {
          tourId: parseInt(tourId),
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      // Get all bookings
      bookings = await prisma.booking.findMany({
        orderBy: {
          createdAt: 'desc',
        },
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
