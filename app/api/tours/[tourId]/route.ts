import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tourId: string }> }
) {
  try {
    // Unwrap params Promise
    const { tourId } = await params;
    const tourIdNum = parseInt(tourId);

    if (isNaN(tourIdNum)) {
      return NextResponse.json(
        { error: 'Invalid tour ID' },
        { status: 400 }
      );
    }

    const tour = await prisma.ecoTour.findUnique({
      where: {
        id: tourIdNum,
      },
    });

    if (!tour) {
      return NextResponse.json(
        { error: 'Tour not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(tour);
  } catch (error) {
    console.error('Get tour error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tour' },
      { status: 500 }
    );
  }
}
