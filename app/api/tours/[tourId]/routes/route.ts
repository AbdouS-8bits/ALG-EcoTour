import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tourId: string }> }
) {
  try {
    const { tourId } = await params;

    const result = await query(
      `SELECT * FROM route_templates WHERE tour_id = $1 ORDER BY template_type`,
      [tourId]
    );

    return NextResponse.json({
      routes: result.rows.map(row => ({
        ...row,
        waypoint_sequence: typeof row.waypoint_sequence === 'string' 
          ? JSON.parse(row.waypoint_sequence) 
          : row.waypoint_sequence
      }))
    });
  } catch (error) {
    console.error('Error fetching routes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch routes' },
      { status: 500 }
    );
  }
}
