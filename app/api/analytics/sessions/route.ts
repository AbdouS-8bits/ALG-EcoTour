import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Create or update session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      userId,
      deviceType,
      browser,
      os,
      country,
      city,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
    } = body;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Get IP address
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';

    // Check if session exists
    const existing = await query(
      `SELECT id FROM user_sessions WHERE session_id = $1`,
      [sessionId]
    );

    if (existing.rows.length > 0) {
      // Update existing session
      await query(
        `UPDATE user_sessions 
         SET user_id = COALESCE($2, user_id),
             ended_at = NOW(),
             total_duration_seconds = EXTRACT(EPOCH FROM (NOW() - started_at))::INTEGER
         WHERE session_id = $1`,
        [sessionId, userId || null]
      );

      return NextResponse.json({
        success: true,
        message: 'Session updated',
      });
    } else {
      // Create new session
      const result = await query(
        `INSERT INTO user_sessions 
         (session_id, user_id, device_type, browser, os, ip_address, country, city,
          utm_source, utm_medium, utm_campaign, utm_content, utm_term)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         RETURNING id`,
        [
          sessionId,
          userId || null,
          deviceType || null,
          browser || null,
          os || null,
          ipAddress,
          country || null,
          city || null,
          utmSource || null,
          utmMedium || null,
          utmCampaign || null,
          utmContent || null,
          utmTerm || null,
        ]
      );

      return NextResponse.json({
        success: true,
        data: { id: result.rows[0].id },
      });
    }
  } catch (error) {
    console.error('Error managing session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to manage session' },
      { status: 500 }
    );
  }
}

// End session
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    await query(
      `UPDATE user_sessions 
       SET ended_at = NOW(),
           total_duration_seconds = EXTRACT(EPOCH FROM (NOW() - started_at))::INTEGER
       WHERE session_id = $1`,
      [sessionId]
    );

    return NextResponse.json({
      success: true,
      message: 'Session ended',
    });
  } catch (error) {
    console.error('Error ending session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to end session' },
      { status: 500 }
    );
  }
}
