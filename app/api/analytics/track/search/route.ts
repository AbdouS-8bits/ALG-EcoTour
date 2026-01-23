import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, userId, searchTerm, resultsCount, filtersApplied } = body;

    if (!sessionId || !searchTerm) {
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
        AND table_name = 'search_queries'
      ) as exists
    `);

    if (!tablesExist.rows[0]?.exists) {
      return NextResponse.json({ success: true, message: 'Analytics not configured' });
    }

    // Insert search query
    await query(
      `INSERT INTO search_queries (
        session_id, user_id, search_term, results_count, filters_applied, created_at
      ) VALUES ($1, $2, $3, $4, $5, NOW())`,
      [
        sessionId,
        userId,
        searchTerm,
        resultsCount,
        filtersApplied ? JSON.stringify(filtersApplied) : null,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking search:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
