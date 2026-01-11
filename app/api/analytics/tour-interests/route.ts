import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Track tour interest (views, clicks, saves)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      userId,
      tourId,
      interestType, // view, click, save, share, book_attempt
      interestScore,
    } = body;

    if (!sessionId || !tourId || !interestType) {
      return NextResponse.json(
        { success: false, error: 'Session ID, tour ID, and interest type are required' },
        { status: 400 }
      );
    }

    // Interest scores based on type
    const scoreMap: Record<string, number> = {
      view: 1,
      click: 2,
      details_view: 3,
      save: 5,
      share: 7,
      book_attempt: 10,
      booking_complete: 20,
    };

    const score = interestScore || scoreMap[interestType] || 1;

    const result = await query(
      `INSERT INTO tour_interests 
       (session_id, user_id, tour_id, interest_type, interest_score)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [sessionId, userId || null, tourId, interestType, score]
    );

    return NextResponse.json({
      success: true,
      data: { id: result.rows[0].id },
    });
  } catch (error) {
    console.error('Error tracking tour interest:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track tour interest' },
      { status: 500 }
    );
  }
}

// Get user's tour interests (for recommendations)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId && !sessionId) {
      return NextResponse.json(
        { success: false, error: 'User ID or Session ID is required' },
        { status: 400 }
      );
    }

    let queryText = `
      SELECT 
        ti.tour_id,
        t.title,
        t.location,
        t.price,
        t.difficulty,
        SUM(ti.interest_score) as total_interest_score,
        COUNT(*) as interaction_count,
        MAX(ti.created_at) as last_interaction
      FROM tour_interests ti
      LEFT JOIN eco_tours t ON ti.tour_id = t.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (userId) {
      params.push(userId);
      queryText += ` AND ti.user_id = $${params.length}`;
    }

    if (sessionId) {
      params.push(sessionId);
      queryText += ` AND ti.session_id = $${params.length}`;
    }

    queryText += `
      GROUP BY ti.tour_id, t.title, t.location, t.price, t.difficulty
      ORDER BY total_interest_score DESC, last_interaction DESC
    `;

    params.push(limit);
    queryText += ` LIMIT $${params.length}`;

    const result = await query(queryText, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching tour interests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tour interests' },
      { status: 500 }
    );
  }
}
