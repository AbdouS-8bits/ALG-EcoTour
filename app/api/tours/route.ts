import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '6';
    
    const tours = await prisma.ecoTour.findMany({
      take: parseInt(limit),
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    console.log('Tours from database:', tours);
    
    return NextResponse.json(tours);
  } catch (error) {
    console.error('Error fetching tours:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tours' },
      { status: 500 }
    );
  }
}
