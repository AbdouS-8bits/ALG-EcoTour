import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { query } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { bookingId } = await params;
    const bookingIdNum = parseInt(bookingId);
    if (isNaN(bookingIdNum)) {
      return NextResponse.json(
        { error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, paymentStatus } = body;

    // Check if user is admin
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    if (status) {
      // Update booking status
      const result = await query(
        `UPDATE bookings 
         SET status = $1, "updatedAt" = NOW() 
         WHERE id = $2 
         RETURNING id, status, "paymentStatus", "totalPrice"`,
        [status, bookingId]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(result.rows[0]);
    }

    if (paymentStatus) {
      // Update payment status
      const result = await query(
        `UPDATE bookings 
         SET "paymentStatus" = $1, "updatedAt" = NOW() 
         WHERE id = $2 
         RETURNING id, status, "paymentStatus", "totalPrice"`,
        [paymentStatus, bookingId]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(result.rows[0]);
    }

    return NextResponse.json(
      { error: 'No update fields provided' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { error: 'Failed to update booking', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { bookingId } = await params;
    const bookingIdNum = parseInt(bookingId);
    if (isNaN(bookingIdNum)) {
      return NextResponse.json(
        { error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, paymentStatus } = body;

    if (status) {
      const result = await query(
        `UPDATE bookings 
         SET status = $1, "updatedAt" = NOW() 
         WHERE id = $2 
         RETURNING *`,
        [status, bookingIdNum]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(result.rows[0]);
    }

    if (paymentStatus) {
      const result = await query(
        `UPDATE bookings 
         SET "paymentStatus" = $1, "updatedAt" = NOW() 
         WHERE id = $2 
         RETURNING *`,
        [paymentStatus, bookingIdNum]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(result.rows[0]);
    }

    return NextResponse.json(
      { error: 'No update fields provided' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { error: 'Failed to update booking', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { bookingId } = await params;
    const bookingIdNum = parseInt(bookingId);
    if (isNaN(bookingIdNum)) {
      return NextResponse.json(
        { error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    const result = await query(
      'DELETE FROM bookings WHERE id = $1 RETURNING id',
      [bookingIdNum]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Booking deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete booking error:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking', details: (error as Error).message },
      { status: 500 }
    );
  }
}
