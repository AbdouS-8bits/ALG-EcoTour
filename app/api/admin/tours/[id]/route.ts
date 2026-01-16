import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { tourUpdateSchema, validateRequest } from '@/lib/validation';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tourId = parseInt(id);
    
    if (isNaN(tourId)) {
      return NextResponse.json(
        { error: 'Invalid tour ID' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validation = validateRequest(tourUpdateSchema, body);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400, headers: corsHeaders() });
    }

    const updateData = validation.data;

    // Check if tour exists
    const existingTour = await prisma.ecoTour.findUnique({
      where: { id: tourId },
    });

    if (!existingTour) {
      return NextResponse.json(
        { error: 'Tour not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    // Update tour
    const updatedTour = await prisma.ecoTour.update({
      where: { id: tourId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedTour, { headers: corsHeaders() });
  } catch (error) {
    console.error('Update tour error:', error);
    return NextResponse.json(
      { error: 'Failed to update tour', details: (error as Error).message },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tourId = parseInt(id);
    
    if (isNaN(tourId)) {
      return NextResponse.json(
        { error: 'Invalid tour ID' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Check if tour exists
    const existingTour = await prisma.ecoTour.findUnique({
      where: { id: tourId },
    });

    if (!existingTour) {
      return NextResponse.json(
        { error: 'Tour not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    // Check if there are any bookings for this tour
    const bookingsCount = await prisma.booking.count({
      where: { tourId },
    });

    if (bookingsCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete tour with existing bookings' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Delete tour
    await prisma.ecoTour.delete({
      where: { id: tourId },
    });

    return NextResponse.json(
      { message: 'Tour deleted successfully' },
      { status: 200, headers: corsHeaders() }
    );
  } catch (error) {
    console.error('Delete tour error:', error);
    return NextResponse.json(
      { error: 'Failed to delete tour', details: (error as Error).message },
      { status: 500, headers: corsHeaders() }
    );
  }
}
