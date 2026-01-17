import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET dashboard statistics
export async function GET() {
  try {
    // Get total counts
    const [tours, users, bookings, reviews] = await Promise.all([
      query(`SELECT COUNT(*) as count FROM eco_tours`),
      query(`SELECT COUNT(*) as count FROM users`),
      query(`SELECT COUNT(*) as count FROM bookings`),
      query(`SELECT COUNT(*) as count FROM "Review"`),
    ]);

    // Get booking statistics
    const bookingStats = await query(
      `SELECT 
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
        COALESCE(SUM(CASE WHEN status = 'confirmed' THEN "totalPrice" ELSE 0 END), 0) as revenue
       FROM bookings`
    );

    // Get recent bookings
    const recentBookings = await query(
      `SELECT 
        b.*,
        t.title as "tourTitle",
        u.name as "userName"
       FROM bookings b
       LEFT JOIN eco_tours t ON b."tourId" = t.id
       LEFT JOIN users u ON b."userId" = u.id
       ORDER BY b."createdAt" DESC
       LIMIT 10`
    );

    // Get top rated tours
    const topRatedTours = await query(
      `SELECT 
        t.*,
        COALESCE(AVG(r.rating), 0) as "averageRating",
        COUNT(r.id) as "reviewCount"
       FROM eco_tours t
       LEFT JOIN "Review" r ON t.id = r."tourId"
       WHERE t.status = 'active'
       GROUP BY t.id
       HAVING COUNT(r.id) > 0
       ORDER BY AVG(r.rating) DESC, COUNT(r.id) DESC
       LIMIT 5`
    );

    // Get monthly revenue (last 6 months)
    const monthlyRevenue = await query(
      `SELECT 
        TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') as month,
        COALESCE(SUM("totalPrice"), 0) as revenue,
        COUNT(*) as bookings
       FROM bookings
       WHERE status = 'confirmed' 
       AND "createdAt" >= NOW() - INTERVAL '6 months'
       GROUP BY DATE_TRUNC('month', "createdAt")
       ORDER BY month DESC`
    );

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalTours: parseInt(tours.rows[0].count),
          totalUsers: parseInt(users.rows[0].count),
          totalBookings: parseInt(bookings.rows[0].count),
          totalReviews: parseInt(reviews.rows[0].count),
        },
        bookings: {
          confirmed: parseInt(bookingStats.rows[0].confirmed),
          pending: parseInt(bookingStats.rows[0].pending),
          cancelled: parseInt(bookingStats.rows[0].cancelled),
          totalRevenue: parseFloat(bookingStats.rows[0].revenue),
        },
        recentBookings: recentBookings.rows,
        topRatedTours: topRatedTours.rows.map(tour => ({
          ...tour,
          averageRating: parseFloat(tour.averageRating).toFixed(1),
        })),
        monthlyRevenue: monthlyRevenue.rows,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
