import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET user's bookings
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const result = await query(
      `SELECT 
        b.*,
        t.title as "tourTitle",
        t.location as "tourLocation",
        t.price as "tourPrice"
       FROM bookings b
       LEFT JOIN eco_tours t ON b."tourId" = t.id
       WHERE b."userId" = $1
       ORDER BY b."createdAt" DESC`,
      [id]
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user bookings' },
      { status: 500 }
    );
  }
}
