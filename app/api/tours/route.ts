import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    // Build where clause
    const where: any = {};
    
    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive',
      };
    }

    // Get tours with optional filtering
    const tours = await prisma.ecoTour.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return NextResponse.json(tours);
  } catch (error) {
    console.error('Get tours error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tours', details: (error as Error).message },
      { status: 500 }
    );
  }
}
