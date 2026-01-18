import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get unique locations
    const tours = await prisma.ecoTour.findMany({
      select: {
        location: true
      },
      distinct: ['location']
    });

    const locations = tours.map(tour => tour.location);

    return NextResponse.json({ locations });
  } catch (error) {
    console.error('Get locations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}
