import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET all users (Admin only - add authentication middleware)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let queryText = `SELECT 
      id, email, name, role, "createdAt", "updatedAt", "emailVerified"
      FROM users`;
    let countText = `SELECT COUNT(*) FROM users`;
    const params: any[] = [];
    const whereClauses: string[] = [];

    if (role) {
      whereClauses.push(`role = $${params.length + 1}`);
      params.push(role);
    }

    if (search) {
      whereClauses.push(`(email ILIKE $${params.length + 1} OR name ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }

    if (whereClauses.length > 0) {
      const whereClause = ` WHERE ${whereClauses.join(' AND ')}`;
      queryText += whereClause;
      countText += whereClause;
    }

    queryText += ` ORDER BY "createdAt" DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const [users, count] = await Promise.all([
      query(queryText, params),
      query(countText, params.slice(0, -2)),
    ]);

    return NextResponse.json({
      success: true,
      data: users.rows,
      pagination: {
        total: parseInt(count.rows[0].count),
        page,
        limit,
        totalPages: Math.ceil(parseInt(count.rows[0].count) / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
