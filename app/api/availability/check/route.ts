import { NextRequest, NextResponse } from 'next/server';
import { isDateAvailable, incrementBookings, decrementBookings } from '@/lib/availability';
import { validateRequest } from '@/lib/validation';
import { z } from 'zod';

// Validation schemas
const checkAvailabilitySchema = z.object({
  tourId: z.number().int().positive(),
  date: z.string().transform((val) => new Date(val)),
});

const updateBookingsSchema = z.object({
  tourId: z.number().int().positive(),
  date: z.string().transform((val) => new Date(val)),
  action: z.enum(['increment', 'decrement']),
});

// GET /api/availability/check - Check if a specific date is available
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tourId = searchParams.get('tourId');
    const date = searchParams.get('date');

    if (!tourId || !date) {
      return NextResponse.json(
        { error: 'Tour ID and date are required' },
        { status: 400 }
      );
    }

    const validation = validateRequest(checkAvailabilitySchema, {
      tourId: parseInt(tourId),
      date,
    });

    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { tourId: validatedTourId, date: validatedDate } = validation.data;

    const isAvailable = await isDateAvailable(validatedTourId, validatedDate);

    return NextResponse.json({ 
      available: isAvailable,
      date: validatedDate,
      tourId: validatedTourId
    });
  } catch (error) {
    console.error('Check availability error:', error);
    return NextResponse.json(
      { error: 'Failed to check availability', details: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST /api/availability/check - Update booking count (increment/decrement)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = validateRequest(updateBookingsSchema, body);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { tourId, date, action } = validation.data;

    let result;
    if (action === 'increment') {
      result = await incrementBookings(tourId, date);
    } else if (action === 'decrement') {
      result = await decrementBookings(tourId, date);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Update bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to update bookings', details: (error as Error).message },
      { status: 500 }
    );
  }
}
