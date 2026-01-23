import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(
      `SELECT * FROM tour_waypoints ORDER BY waypoint_code`
    );

    return NextResponse.json({
      waypoints: result.rows
    });
  } catch (error) {
    console.error('Error fetching waypoints:', error);
    return NextResponse.json(
      { error: 'Failed to fetch waypoints' },
      { status: 500 }
    );
  }
}
