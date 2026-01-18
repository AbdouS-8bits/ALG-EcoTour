import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET single review
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tourId: string; id: string }> }
) {
  const { tourId, id } = await params;
  try {
    const result = await query(
      `SELECT r.*, u.name as "userName", u.email as "userEmail"
       FROM "Review" r
       LEFT JOIN users u ON r."userId" = u.id
       WHERE r.id = $1 AND r."tourId" = $2`,
      [id, tourId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch review' },
      { status: 500 }
    );
  }
}

// PUT update review
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ tourId: string; id: string }> }
) {
  const { tourId, id } = await params;
  try {
    const body = await request.json();
    const { rating, comment } = body;

    if (!rating) {
      return NextResponse.json(
        { success: false, error: 'Rating is required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE "Review"
       SET rating = $1, comment = $2, "updatedAt" = NOW()
       WHERE id = $3 AND "tourId" = $4
       RETURNING *`,
      [rating, comment || null, id, tourId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

// DELETE review
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ tourId: string; id: string }> }
) {
  const { tourId, id } = await params;
  try {
    const result = await query(
      `DELETE FROM "Review" WHERE id = $1 AND "tourId" = $2 RETURNING *`,
      [id, tourId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}
