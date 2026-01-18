import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const result = await query(
      `SELECT 
        r.id,
        r.rating,
        r.comment,
        r."tourId",
        r."userId",
        r."createdAt",
        t.title as tour_title,
        u.email as user_email,
        u.name as user_name
      FROM "Review" r
      LEFT JOIN eco_tours t ON r."tourId" = t.id
      LEFT JOIN users u ON r."userId" = u.id
      ORDER BY r."createdAt" DESC`
    );

    const reviews = result.rows.map((row: any) => ({
      id: row.id,
      rating: row.rating,
      comment: row.comment,
      tourId: row.tourId,
      userId: row.userId,
      createdAt: row.createdAt,
      tour: { title: row.tour_title },
      user: { email: row.user_email, name: row.user_name }
    }));

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews', details: (error as Error).message },
      { status: 500 }
    );
  }
}
