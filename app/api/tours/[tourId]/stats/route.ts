import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET tour statistics (reviews, average rating, bookings)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tourId: string }> }
) {
  const { tourId } = await params;
  
  try {
    // Get average rating and review count
    const reviewStats = await query(
      `SELECT 
        COUNT(*) as "reviewCount",
        COALESCE(AVG(rating), 0) as "averageRating"
       FROM "Review"
       WHERE "tourId" = $1`,
      [tourId]
    );

    // Get booking statistics
    const bookingStats = await query(
      `SELECT 
        COUNT(*) as "totalBookings",
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as "confirmedBookings",
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as "pendingBookings",
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as "cancelledBookings",
        COALESCE(SUM(CASE WHEN status = 'confirmed' THEN participants ELSE 0 END), 0) as "totalParticipants",
        COALESCE(SUM(CASE WHEN status = 'confirmed' THEN "totalPrice" ELSE 0 END), 0) as "totalRevenue"
       FROM bookings
       WHERE "tourId" = $1`,
      [tourId]
    );

    // Get tour details
    const tourDetails = await query(
      `SELECT 
        id, title, location, price, "maxParticipants", difficulty, duration, status
       FROM eco_tours
       WHERE id = $1`,
      [tourId]
    );

    if (tourDetails.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tour not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        tour: tourDetails.rows[0],
        reviews: {
          count: parseInt(reviewStats.rows[0].reviewCount),
          averageRating: parseFloat(reviewStats.rows[0].averageRating).toFixed(1),
        },
        bookings: {
          total: parseInt(bookingStats.rows[0].totalBookings),
          confirmed: parseInt(bookingStats.rows[0].confirmedBookings),
          pending: parseInt(bookingStats.rows[0].pendingBookings),
          cancelled: parseInt(bookingStats.rows[0].cancelledBookings),
          totalParticipants: parseInt(bookingStats.rows[0].totalParticipants),
          totalRevenue: parseFloat(bookingStats.rows[0].totalRevenue),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching tour statistics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tour statistics' },
      { status: 500 }
    );
  }
}