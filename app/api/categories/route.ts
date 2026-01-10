import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET all categories
export async function GET() {
  try {
    const result = await query(
      `SELECT * FROM "Category" ORDER BY "createdAt" DESC`
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, icon } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO "Category" (name, description, icon)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, description || null, icon || null]
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
