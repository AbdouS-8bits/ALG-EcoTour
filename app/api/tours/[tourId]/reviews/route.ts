import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET reviews for a specific tour
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tourId: string }> }
) {
  const { tourId } = await params;

  try {
    const result = await query(
      `SELECT r.*, u.name as "userName", u.email as "userEmail"
       FROM "Review" r
       LEFT JOIN users u ON r."userId" = u.id
       WHERE r."tourId" = $1 
       ORDER BY r."createdAt" DESC`,
      [tourId]
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST create new review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tourId: string }> }
) {
  const { tourId } = await params;

  try {
    const body = await request.json();
    const { userId, rating, comment } = body;

    if (!userId || !rating) {
      return NextResponse.json(
        { success: false, error: 'User ID and rating are required' },
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
      `INSERT INTO "Review" ("tourId", "userId", rating, comment, "updatedAt")
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [tourId, userId, rating, comment || null]
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    );
  }
}