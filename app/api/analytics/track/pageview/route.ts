import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, userId, pageUrl, pageTitle, referrer } = body;

    if (!sessionId || !pageUrl) {
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
        AND table_name = 'page_views'
      ) as exists
    `);

    if (!tablesExist.rows[0]?.exists) {
      // Tables don't exist, silently ignore
      return NextResponse.json({ success: true, message: 'Analytics not configured' });
    }

    // Insert page view
    await query(
      `INSERT INTO page_views (
        session_id, user_id, page_url, page_title, referrer, created_at
      ) VALUES ($1, $2, $3, $4, $5, NOW())`,
      [sessionId, userId, pageUrl, pageTitle, referrer]
    );

    // Update session last activity
    await query(
      `UPDATE user_sessions 
       SET last_activity = NOW(), 
           pages_visited = pages_visited + 1
       WHERE session_id = $1`,
      [sessionId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking page view:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
