import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Add CORS headers
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// Handle preflight OPTIONS request
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { title, location, price, maxParticipants } = body;
    
    if (!title || !location || !price || !maxParticipants) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create tour in database using the correct model name
    const tour = await prisma.ecoTour.create({
      data: {
        title,
        description: body.description || null,
        location,
        latitude: body.latitude ? parseFloat(body.latitude) : null,
        longitude: body.longitude ? parseFloat(body.longitude) : null,
        price: parseFloat(price),
        maxParticipants: parseInt(maxParticipants),
        photoURL: body.photoURL || null,
      },
    });

    return NextResponse.json(tour, { status: 201, headers: corsHeaders() });
  } catch (error) {
    console.error('Create tour error:', error);
    return NextResponse.json(
      { error: 'Failed to create tour', details: (error as Error).message },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const tours = await prisma.ecoTour.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(tours, { headers: corsHeaders() });
  } catch (error) {
    console.error('Get tours error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tours' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
