import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET itineraries for a specific tour
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tourId: string }> }
) {
  const { tourId } = await params;
  try {
    const result = await query(
      `SELECT * FROM "Itinerary" 
       WHERE "tourId" = $1 
       ORDER BY "dayNumber" ASC`,
      [tourId]
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch itineraries' },
      { status: 500 }
    );
  }
}

// POST create new itinerary
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tourId: string }> }
) {
  const { tourId } = await params;
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
      `INSERT INTO "Itinerary" ("tourId", "dayNumber", title, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [tourId, dayNumber, title, description]
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating itinerary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create itinerary' },
      { status: 500 }
    );
  }
}
