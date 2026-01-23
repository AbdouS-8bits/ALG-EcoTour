import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, userId, tourId, interactionType, interestScore } = body;

    if (!sessionId || !tourId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if tables exist
    const tablesExist = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'tour_interests'
      ) as exists
    `);

    if (!tablesExist.rows[0]?.exists) {
      return NextResponse.json({ success: true, message: 'Analytics not configured' });
    }

    // Insert tour interest
    await query(
      `INSERT INTO tour_interests (
        session_id, user_id, tour_id, interaction_type, interest_score, created_at
      ) VALUES ($1, $2, $3, $4, $5, NOW())`,
      [sessionId, userId, tourId, interactionType, interestScore]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking tour interest:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
