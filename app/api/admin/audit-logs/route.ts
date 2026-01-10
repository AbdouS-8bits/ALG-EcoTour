import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET admin audit logs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let queryText = `SELECT 
      a.*,
      u.name as "userName",
      u.email as "userEmail"
      FROM admin_audit_logs a
      LEFT JOIN users u ON a."userId" = u.id`;
    let countText = `SELECT COUNT(*) FROM admin_audit_logs a`;
    const params: any[] = [];
    const whereClauses: string[] = [];

    if (userId) {
      whereClauses.push(`a."userId" = $${params.length + 1}`);
      params.push(userId);
    }

    if (action) {
      whereClauses.push(`a.action ILIKE $${params.length + 1}`);
      params.push(`%${action}%`);
    }

    if (whereClauses.length > 0) {
      const whereClause = ` WHERE ${whereClauses.join(' AND ')}`;
      queryText += whereClause;
      countText += whereClause;
    }

    queryText += ` ORDER BY a."createdAt" DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const [logs, count] = await Promise.all([
      query(queryText, params),
      query(countText, params.slice(0, -2)),
    ]);

    return NextResponse.json({
      success: true,
      data: logs.rows,
      pagination: {
        total: parseInt(count.rows[0].count),
        page,
        limit,
        totalPages: Math.ceil(parseInt(count.rows[0].count) / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}

// POST create audit log
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action, details } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { success: false, error: 'User ID and action are required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO admin_audit_logs ("userId", action, details)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, action, details || null]
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating audit log:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create audit log' },
      { status: 500 }
    );
  }
}
