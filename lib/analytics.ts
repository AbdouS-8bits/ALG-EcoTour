import { prisma } from './prisma';
import { BookingMonthData, MonthlyRevenueData, TopTourData } from '@/types/api';

export interface AnalyticsData {
  totalTours: number;
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  totalUsers: number;
  bookingsPerMonth: Array<{
    month: string;
    count: number;
  }>;
  recentBookings: Array<{
    id: number;
    guestName: string;
    guestEmail: string;
    status: string;
    createdAt: Date;
    tour?: {
      id: number;
      title: string;
      location: string;
    };
  }>;
}

/**
 * Get comprehensive analytics data for admin dashboard
 */
export async function getAnalyticsData(): Promise<AnalyticsData> {
  try {
    // Get booking statistics by status
    const bookingStats = await prisma.booking.groupBy({
      by: ['status'],
      _count: true,
    });

    const confirmedBookings = (bookingStats.find(s => s.status === 'confirmed')?._count as number) || 0;
    const pendingBookings = (bookingStats.find(s => s.status === 'pending')?._count as number) || 0;
    const totalBookings = confirmedBookings + pendingBookings;

    // Get total users
    const totalUsers = await prisma.user.count();

    // Get total tours
    const totalTours = await prisma.ecoTour.count();

    // Get recent bookings with proper typing
    const recentBookings = await prisma.booking.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    // Get bookings per month for the last 6 months
    const bookingsPerMonth = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(*) as count,
        COALESCE(SUM(CASE WHEN status = 'confirmed' THEN price * participants ELSE 0 END), 0) as revenue
      FROM "bookings"
      WHERE "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month DESC
    ` as BookingMonthData[];

    const analyticsData: AnalyticsData = {
      totalTours,
      totalBookings,
      confirmedBookings,
      pendingBookings,
      totalUsers,
      bookingsPerMonth: (bookingsPerMonth as BookingMonthData[]).map((item: BookingMonthData) => ({
        month: item.month,
        count: parseInt(item.count),
        revenue: parseFloat(item.revenue)
      })),
      recentBookings: recentBookings.map(booking => ({
        id: booking.id,
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        status: booking.status,
        createdAt: booking.createdAt,
        tour: undefined // No relation available in current schema
      }))
    };
    return analyticsData;
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw new Error('Failed to fetch analytics data');
  }
}

/**
 * Get booking statistics by status (for backward compatibility)
 */
export async function getBookingStats() {
  return getAnalyticsData();
}

/**
 * Get monthly revenue data
 */
export async function getMonthlyRevenue() {
  try {
    const revenueData = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        SUM(b."participants" * t."price") as revenue
      FROM "bookings" b
      JOIN "eco_tours" t ON b."tourId" = t."id"
      WHERE b."status" = 'confirmed'
        AND b."createdAt" >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month ASC
    ` as MonthlyRevenueData[];

    return (revenueData as MonthlyRevenueData[]).map((item: MonthlyRevenueData) => ({
      month: item.month,
      revenue: parseFloat(item.revenue)
    }));
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
    throw new Error('Failed to fetch monthly revenue');
  }
}

/**
 * Get top performing tours
 */
export async function getTopTours(limit: number = 5) {
  try {
    const topTours = await prisma.$queryRaw`
      SELECT 
        t."id",
        t."title",
        t."location",
        COUNT(b."id") as bookingCount,
        SUM(b."participants") as totalParticipants
      FROM "eco_tours" t
      LEFT JOIN "bookings" b ON t."id" = b."tourId"
      GROUP BY t."id", t."title", t."location"
      ORDER BY bookingCount DESC
      LIMIT ${limit}
    ` as TopTourData[];

    return (topTours as TopTourData[]).map((tour: TopTourData) => ({
      id: tour.id,
      title: tour.title,
      location: tour.location,
      bookingCount: parseInt(tour.bookingCount),
      totalParticipants: parseInt(tour.totalParticipants)
    }));
  } catch (error) {
    console.error('Error fetching top tours:', error);
    throw new Error('Failed to fetch top tours');
  }
}
