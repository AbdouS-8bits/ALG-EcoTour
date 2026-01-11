import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Track search queries
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      userId,
      searchTerm,
      filters,
      resultsCount,
      clickedResultId,
    } = body;

    if (!sessionId || !searchTerm) {
      return NextResponse.json(
        { success: false, error: 'Session ID and search term are required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO search_queries 
       (session_id, user_id, search_term, filters, results_count, clicked_result_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        sessionId,
        userId || null,
        searchTerm,
        filters ? JSON.stringify(filters) : null,
        resultsCount || 0,
        clickedResultId || null,
      ]
    );

    return NextResponse.json({
      success: true,
      data: { id: result.rows[0].id },
    });
  } catch (error) {
    console.error('Error tracking search query:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track search query' },
      { status: 500 }
    );
  }
}

// Get popular search terms
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const days = parseInt(searchParams.get('days') || '30');

    const result = await query(
      `SELECT 
        search_term,
        COUNT(*) as search_count,
        AVG(results_count) as avg_results,
        COUNT(DISTINCT session_id) as unique_users
       FROM search_queries
       WHERE created_at >= NOW() - INTERVAL '${days} days'
       GROUP BY search_term
       ORDER BY search_count DESC
       LIMIT $1`,
      [limit]
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching search queries:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch search queries' },
      { status: 500 }
    );
  }
}
