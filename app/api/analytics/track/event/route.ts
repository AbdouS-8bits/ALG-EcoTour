import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

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
      metadata,
    } = body;

    if (!sessionId || !eventType) {
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
        AND table_name = 'user_events'
      ) as exists
    `);

    if (!tablesExist.rows[0]?.exists) {
      return NextResponse.json({ success: true, message: 'Analytics not configured' });
    }

    // Insert event
    await query(
      `INSERT INTO user_events (
        session_id, user_id, event_type, event_category, 
        event_label, event_value, metadata, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [
        sessionId,
        userId,
        eventType,
        eventCategory,
        eventLabel,
        eventValue,
        metadata ? JSON.stringify(metadata) : null,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking event:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
