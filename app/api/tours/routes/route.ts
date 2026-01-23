import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tourId = searchParams.get('tourId');

    // Get all waypoints
    const waypoints = await query(`
      SELECT 
        id,
        waypoint_code,
        name,
        waypoint_type,
        latitude,
        longitude,
        commune,
        description,
        visit_duration_minutes
      FROM tour_waypoints
      ORDER BY waypoint_code
    `);

    // Get route templates
    const templates = await query(`
      SELECT 
        id,
        tour_id,
        template_name,
        template_type,
        description,
        waypoint_sequence,
        estimated_duration_hours,
        difficulty,
        recommended_for,
        price_modifier
      FROM route_templates
      ${tourId ? 'WHERE tour_id = $1' : ''}
      ORDER BY 
        CASE template_type
          WHEN 'quick' THEN 1
          WHEN 'standard' THEN 2
          WHEN 'complete' THEN 3
          ELSE 4
        END
    `, tourId ? [tourId] : []);

    // Get road segments
    const roads = await query(`
      SELECT 
        id,
        segment_code,
        name,
        road_type,
        length_km,
        road_status,
        importance,
        description
      FROM road_segments
      ORDER BY segment_code
    `);

    // Build complete route data
    const routesWithWaypoints = templates.rows.map(template => {
      const waypointCodes = template.waypoint_sequence || [];
      const routeWaypoints = waypointCodes
        .map((code: string) => waypoints.rows.find(w => w.waypoint_code === code))
        .filter(Boolean);

      return {
        ...template,
        waypoints: routeWaypoints,
        totalDistance: routeWaypoints.reduce((sum: number, _: any, i: number) => {
          if (i === 0) return 0;
          // Estimate distance (can be improved with actual calculations)
          return sum + 5; // Average 5km between points
        }, 0),
        totalDuration: routeWaypoints.reduce((sum: number, wp: any) => {
          return sum + (wp.visit_duration_minutes || 0);
        }, 0)
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        waypoints: waypoints.rows,
        routes: routesWithWaypoints,
        roadSegments: roads.rows
      }
    });
  } catch (error) {
    console.error('Error fetching tour routes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tour routes' },
      { status: 500 }
    );
  }
}
