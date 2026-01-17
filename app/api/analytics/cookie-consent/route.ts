import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Track cookie consent (GDPR compliance)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      userId,
      necessary,
      analytics,
      marketing,
      preferences,
    } = body;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Get IP and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Check if consent already exists
    const existing = await query(
      `SELECT id FROM cookie_consents 
       WHERE session_id = $1 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [sessionId]
    );

    if (existing.rows.length > 0) {
      // Update existing consent
      await query(
        `UPDATE cookie_consents 
         SET necessary = $1, analytics = $2, marketing = $3, 
             preferences = $4, updated_at = NOW()
         WHERE id = $5`,
        [
          necessary !== false, // necessary is always true
          analytics || false,
          marketing || false,
          preferences || false,
          existing.rows[0].id,
        ]
      );

      return NextResponse.json({
        success: true,
        message: 'Cookie consent updated',
      });
    } else {
      // Create new consent
      const result = await query(
        `INSERT INTO cookie_consents 
         (session_id, user_id, necessary, analytics, marketing, preferences, 
          ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [
          sessionId,
          userId || null,
          necessary !== false,
          analytics || false,
          marketing || false,
          preferences || false,
          ipAddress,
          userAgent,
        ]
      );

      return NextResponse.json({
        success: true,
        data: { id: result.rows[0].id },
      });
    }
  } catch (error) {
    console.error('Error tracking cookie consent:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track cookie consent' },
      { status: 500 }
    );
  }
}

// Get user's cookie consent
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');

    if (!sessionId && !userId) {
      return NextResponse.json(
        { success: false, error: 'Session ID or User ID is required' },
        { status: 400 }
      );
    }

    let queryText = `
      SELECT necessary, analytics, marketing, preferences, created_at, updated_at
      FROM cookie_consents
      WHERE 1=1
    `;
    const params: any[] = [];

    if (sessionId) {
      params.push(sessionId);
      queryText += ` AND session_id = $${params.length}`;
    }

    if (userId) {
      params.push(userId);
      queryText += ` AND user_id = $${params.length}`;
    }

    queryText += ` ORDER BY created_at DESC LIMIT 1`;

    const result = await query(queryText, params);

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: true,
        data: null, // No consent yet
      });
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching cookie consent:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cookie consent' },
      { status: 500 }
    );
  }
}
