import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Track page view
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      userId,
      pageUrl,
      pageTitle,
      referrer,
      userAgent,
      deviceType,
      browser,
      os,
      country,
      city,
    } = body;

    if (!sessionId || !pageUrl) {
      return NextResponse.json(
        { success: false, error: 'Session ID and page URL are required' },
        { status: 400 }
      );
    }

    // Get IP address from request
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';

    // Insert page view
    const result = await query(
      `INSERT INTO page_views 
       (session_id, user_id, page_url, page_title, referrer, user_agent, 
        ip_address, country, city, device_type, browser, os)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id`,
      [
        sessionId,
        userId || null,
        pageUrl,
        pageTitle || null,
        referrer || null,
        userAgent || null,
        ipAddress,
        country || null,
        city || null,
        deviceType || null,
        browser || null,
        os || null,
      ]
    );

    // Update session page count
    await query(
      `UPDATE user_sessions 
       SET pages_visited = pages_visited + 1,
           ended_at = NOW()
       WHERE session_id = $1`,
      [sessionId]
    );

    return NextResponse.json({
      success: true,
      data: { id: result.rows[0].id },
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track page view' },
      { status: 500 }
    );
  }
}

// Update page view duration when user leaves
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, pageUrl, durationSeconds } = body;

    if (!sessionId || !pageUrl || durationSeconds === undefined) {
      return NextResponse.json(
        { success: false, error: 'Session ID, page URL, and duration are required' },
        { status: 400 }
      );
    }

    await query(
      `UPDATE page_views 
       SET duration_seconds = $1
       WHERE session_id = $2 
       AND page_url = $3
       AND created_at = (
         SELECT MAX(created_at) 
         FROM page_views 
         WHERE session_id = $2 AND page_url = $3
       )`,
      [durationSeconds, sessionId, pageUrl]
    );

    return NextResponse.json({
      success: true,
      message: 'Duration updated',
    });
  } catch (error) {
    console.error('Error updating page view duration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update duration' },
      { status: 500 }
    );
  }
}
