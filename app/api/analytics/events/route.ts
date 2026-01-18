import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Track user events (clicks, interactions)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      userId,
      eventType,
      eventCategory,
      eventLabel,
      eventValue,
      pageUrl,
    } = body;

    if (!sessionId || !eventType || !pageUrl) {
      return NextResponse.json(
        { success: false, error: 'Session ID, event type, and page URL are required' },
        { status: 400 }
      );
    }

    // Insert event
    const result = await query(
      `INSERT INTO user_events 
       (session_id, user_id, event_type, event_category, event_label, event_value, page_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [
        sessionId,
        userId || null,
        eventType,
        eventCategory || null,
        eventLabel || null,
        eventValue ? JSON.stringify(eventValue) : null,
        pageUrl,
      ]
    );

    // Update session event count
    await query(
      `UPDATE user_sessions 
       SET events_count = events_count + 1,
           ended_at = NOW()
       WHERE session_id = $1`,
      [sessionId]
    );

    return NextResponse.json({
      success: true,
      data: { id: result.rows[0].id },
    });
  } catch (error) {
    console.error('Error tracking event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track event' },
      { status: 500 }
    );
  }
}

// Get events by session
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const eventType = searchParams.get('eventType');
    const limit = parseInt(searchParams.get('limit') || '100');

    let queryText = `SELECT * FROM user_events WHERE 1=1`;
    const params: any[] = [];

    if (sessionId) {
      params.push(sessionId);
      queryText += ` AND session_id = $${params.length}`;
    }

    if (eventType) {
      params.push(eventType);
      queryText += ` AND event_type = $${params.length}`;
    }

    params.push(limit);
    queryText += ` ORDER BY created_at DESC LIMIT $${params.length}`;

    const result = await query(queryText, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
