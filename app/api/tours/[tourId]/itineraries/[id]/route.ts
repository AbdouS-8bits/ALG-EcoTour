import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET single itinerary
export async function GET(
  request: NextRequest,
  { params }: { params: { tourId: string; id: string } }
) {
  try {
    const result = await query(
      `SELECT * FROM "Itinerary" WHERE id = $1 AND "tourId" = $2`,
      [params.id, params.tourId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Itinerary not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch itinerary' },
      { status: 500 }
    );
  }
}

// PUT update itinerary
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ tourId: string; id: string }> }
) {
  const { tourId, id } = await params;
  try {
    const body = await request.json();
    const { dayNumber, title, description } = body;

    if (!dayNumber || !title || !description) {
      return NextResponse.json(
        { success: false, error: 'Day number, title, and description are required' },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE "Itinerary"
       SET "dayNumber" = $1, title = $2, description = $3
       WHERE id = $4 AND "tourId" = $5
       RETURNING *`,
      [dayNumber, title, description, id, tourId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Itinerary not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating itinerary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update itinerary' },
      { status: 500 }
    );
  }
}

// DELETE itinerary
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ tourId: string; id: string }> }
) {
  const { tourId, id } = await params;
  try {
    const result = await query(
      `DELETE FROM "Itinerary" WHERE id = $1 AND "tourId" = $2 RETURNING *`,
      [id, tourId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Itinerary not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Itinerary deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete itinerary' },
      { status: 500 }
    );
  }
}
