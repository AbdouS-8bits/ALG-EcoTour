import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET user's reviews
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await query(
      `SELECT 
        r.*,
        t.title as "tourTitle",
        t.location as "tourLocation"
       FROM "Review" r
       LEFT JOIN eco_tours t ON r."tourId" = t.id
       WHERE r."userId" = $1
       ORDER BY r."createdAt" DESC`,
      [id]
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user reviews' },
      { status: 500 }
    );
  }
}
