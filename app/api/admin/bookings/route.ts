import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const result = await query(
      `SELECT 
        b.id,
        b."tourId",
        b."guestName",
        b."guestEmail",
        b."guestPhone",
        b.participants,
        b.status,
        b."paymentStatus",
        b."totalPrice",
        b."createdAt",
        t.title as tour_title,
        t.price as tour_price
      FROM bookings b
      LEFT JOIN eco_tours t ON b."tourId" = t.id
      ORDER BY b."createdAt" DESC`
    );

    const bookings = result.rows.map((row: any) => ({
      id: row.id,
      tourId: row.tourId,
      guestName: row.guestName,
      guestEmail: row.guestEmail,
      guestPhone: row.guestPhone,
      participants: row.participants,
      status: row.status,
      paymentStatus: row.paymentStatus,
      totalPrice: row.totalPrice,
      createdAt: row.createdAt,
      tour: { title: row.tour_title, price: row.tour_price }
    }));

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Get admin bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings', details: (error as Error).message },
      { status: 500 }
    );
  }
}
