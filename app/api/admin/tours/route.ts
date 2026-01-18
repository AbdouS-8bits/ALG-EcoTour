import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { tourCreateSchema, validateRequest } from '@/lib/validation';

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
    
    // Validate input
    const validation = validateRequest(tourCreateSchema, body);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400, headers: corsHeaders() });
    }

    const { title, description, location, price, maxParticipants, latitude, longitude, photoURL } = validation.data;

    // Create tour in database using correct model name
    const tour = await prisma.ecoTour.create({
      data: {
        title,
        description,
        location,
        latitude: latitude || 0,
        longitude: longitude || 0,
        price,
        maxParticipants,
        photoURL,
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
