import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET images for a specific tour
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tourId: string }> }
) {
  const { tourId } = await params;
  try {
    const result = await query(
      `SELECT * FROM "TourImage" 
       WHERE "tourId" = $1 
       ORDER BY "isMain" DESC, "createdAt" DESC`,
      [tourId]
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching tour images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tour images' },
      { status: 500 }
    );
  }
}

// POST create new tour image
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tourId: string }> }
) {
  const { tourId } = await params;
  try {
    const body = await request.json();
    const { url, alt, isMain } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // If this is set as main image, unset other main images
    if (isMain) {
      await query(
        `UPDATE "TourImage" SET "isMain" = false WHERE "tourId" = $1`,
        [tourId]
      );
    }

    const result = await query(
      `INSERT INTO "TourImage" ("tourId", url, alt, "isMain")
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [tourId, url, alt || null, isMain || false]
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating tour image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create tour image' },
      { status: 500 }
    );
  }
}
