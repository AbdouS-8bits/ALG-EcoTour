import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET featured/popular tours
export async function GET() {
  try {
    const result = await query(
      `SELECT 
        t.*,
        c.name as "categoryName",
        c.icon as "categoryIcon",
        COALESCE(AVG(r.rating), 0) as "averageRating",
        COUNT(DISTINCT r.id) as "reviewCount",
        COUNT(DISTINCT b.id) as "bookingCount",
        (SELECT url FROM "TourImage" WHERE "tourId" = t.id AND "isMain" = true LIMIT 1) as "mainImage"
       FROM eco_tours t
       LEFT JOIN "Category" c ON t."categoryId" = c.id
       LEFT JOIN "Review" r ON t.id = r."tourId"
       LEFT JOIN bookings b ON t.id = b."tourId" AND b.status = 'confirmed'
       WHERE t.status = 'active'
       GROUP BY t.id, c.id
       HAVING COUNT(DISTINCT r.id) > 0 OR COUNT(DISTINCT b.id) > 0
       ORDER BY 
         (COALESCE(AVG(r.rating), 0) * 0.4 + COUNT(DISTINCT b.id) * 0.6) DESC,
         t."createdAt" DESC
       LIMIT 8`
    );

    return NextResponse.json({
      success: true,
      data: result.rows.map(tour => ({
        ...tour,
        averageRating: parseFloat(tour.averageRating).toFixed(1),
        reviewCount: parseInt(tour.reviewCount),
        bookingCount: parseInt(tour.bookingCount),
      })),
    });
  } catch (error) {
    console.error('Error fetching featured tours:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured tours' },
      { status: 500 }
    );
  }
}
