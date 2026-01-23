import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      userId,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      deviceType,
      browser,
      os,
      userAgent,
    } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session ID' },
        { status: 400 }
      );
    }

    // Check if tables exist
    const tablesExist = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_sessions'
      ) as exists
    `);

    if (!tablesExist.rows[0]?.exists) {
      return NextResponse.json({ success: true, message: 'Analytics not configured' });
    }

    // Check if session already exists
    const existing = await query(
      'SELECT id FROM user_sessions WHERE session_id = $1',
      [sessionId]
    );

    if (existing.rows.length > 0) {
      // Session exists, just update it
      await query(
        `UPDATE user_sessions 
         SET last_activity = NOW(),
             user_id = COALESCE($2, user_id)
         WHERE session_id = $1`,
        [sessionId, userId]
      );
    } else {
      // Create new session
      await query(
        `INSERT INTO user_sessions (
          session_id, user_id, utm_source, utm_medium, utm_campaign,
          utm_term, utm_content, device_type, browser, os, user_agent,
          started_at, last_activity
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())`,
        [
          sessionId,
          userId,
          utmSource,
          utmMedium,
          utmCampaign,
          utmTerm,
          utmContent,
          deviceType,
          browser,
          os,
          userAgent,
        ]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error initializing session:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
