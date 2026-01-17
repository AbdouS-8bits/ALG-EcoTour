import { NextRequest, NextResponse } from 'next/server';
import { getTourAvailability, createAvailability, updateAvailability, deleteAvailability } from '@/lib/availability';
import { validateRequest } from '@/lib/validation';
import { z } from 'zod';

// Validation schemas
const createAvailabilitySchema = z.object({
  tourId: z.number().int().positive(),
  date: z.string().transform((val) => new Date(val)),
  isAvailable: z.boolean().optional(),
  maxBookings: z.number().int().positive().optional(),
});

const updateAvailabilitySchema = z.object({
  isAvailable: z.boolean().optional(),
  maxBookings: z.number().int().positive().optional(),
  currentBookings: z.number().int().min(0).optional(),
});

const queryAvailabilitySchema = z.object({
  tourId: z.number().int().positive(),
  startDate: z.string().transform((val) => new Date(val)).optional(),
  endDate: z.string().transform((val) => new Date(val)).optional(),
});

// GET /api/availability - Get availability for a tour
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tourId = searchParams.get('tourId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!tourId) {
      return NextResponse.json(
        { error: 'Tour ID is required' },
        { status: 400 }
      );
    }

    const validation = validateRequest(queryAvailabilitySchema, {
      tourId: parseInt(tourId),
      startDate,
      endDate,
    });

    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { tourId: validatedTourId, startDate: validatedStartDate, endDate: validatedEndDate } = validation.data;

    const availability = await getTourAvailability(validatedTourId, validatedStartDate, validatedEndDate);

    return NextResponse.json(availability);
  } catch (error) {
    console.error('Get availability error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability', details: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST /api/availability - Create availability record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = validateRequest(createAvailabilitySchema, body);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const availability = await createAvailability(validation.data);

    return NextResponse.json(availability, { status: 201 });
  } catch (error) {
    console.error('Create availability error:', error);
    return NextResponse.json(
      { error: 'Failed to create availability', details: (error as Error).message },
      { status: 500 }
    );
  }
}
