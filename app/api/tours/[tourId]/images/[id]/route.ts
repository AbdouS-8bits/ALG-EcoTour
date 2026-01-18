import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET single tour image
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tourId: string; id: string }> }
) {
  const { tourId, id } = await params;
  try {
    const result = await query(
      `SELECT * FROM "TourImage" WHERE id = $1 AND "tourId" = $2`,
      [id, tourId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tour image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching tour image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tour image' },
      { status: 500 }
    );
  }
}

// PUT update tour image
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ tourId: string; id: string }> }
) {
  const { tourId, id } = await params;
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
        `UPDATE "TourImage" SET "isMain" = false WHERE "tourId" = $1 AND id != $2`,
        [tourId, id]
      );
    }

    const result = await query(
      `UPDATE "TourImage"
       SET url = $1, alt = $2, "isMain" = $3
       WHERE id = $4 AND "tourId" = $5
       RETURNING *`,
      [url, alt || null, isMain || false, id, tourId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tour image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating tour image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update tour image' },
      { status: 500 }
    );
  }
}

// DELETE tour image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ tourId: string; id: string }> }
) {
  const { tourId, id } = await params;
  try {
    const result = await query(
      `DELETE FROM "TourImage" WHERE id = $1 AND "tourId" = $2 RETURNING *`,
      [id, tourId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tour image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tour image deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting tour image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete tour image' },
      { status: 500 }
    );
  }
}
