import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Track conversion funnel step
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, userId, tourId, step, stepOrder, completed } = body;

    if (!sessionId || !step || stepOrder === undefined) {
      return NextResponse.json(
        { success: false, error: 'Session ID, step, and step order are required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO conversion_funnels 
       (session_id, user_id, tour_id, step, step_order, completed)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [sessionId, userId || null, tourId || null, step, stepOrder, completed || false]
    );

    return NextResponse.json({
      success: true,
      data: { id: result.rows[0].id },
    });
  } catch (error) {
    console.error('Error tracking conversion funnel:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track conversion funnel' },
      { status: 500 }
    );
  }
}
