import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';


function convertBigInt(obj: any): any {
  if (Array.isArray(obj)) return obj.map(convertBigInt);
  if (obj && typeof obj === "object") {
    for (const key in obj) {
      if (typeof obj[key] === "bigint") {
        obj[key] = Number(obj[key]); // convert BigInt to Number
      } else if (typeof obj[key] === "object") {
        obj[key] = convertBigInt(obj[key]);
      }
    }
  }
  return obj;
}

// Get comprehensive analytics dashboard data

export async function GET(request: NextRequest) {
  try {
    
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build date filter
    let dateFilter = `created_at >= NOW() - INTERVAL '${days} days'`;
    const dateParams: any[] = [];
    
    if (startDate && endDate) {
      dateFilter = `created_at BETWEEN $1 AND $2`;
      dateParams.push(startDate, endDate);
    }

    // 1. Overview Statistics
    const overview = await query(`
      SELECT 
        (SELECT COUNT(DISTINCT session_id) FROM page_views WHERE ${dateFilter}) as total_sessions,
        (SELECT COUNT(*) FROM page_views WHERE ${dateFilter}) as total_page_views,
        (SELECT COUNT(DISTINCT user_id) FROM page_views WHERE ${dateFilter} AND user_id IS NOT NULL) as unique_users,
        (SELECT COUNT(*) FROM user_events WHERE ${dateFilter}) as total_events,
        (SELECT AVG(total_duration_seconds) FROM user_sessions WHERE started_at >= NOW() - INTERVAL '${days} days') as avg_session_duration,
        (SELECT AVG(pages_visited) FROM user_sessions WHERE started_at >= NOW() - INTERVAL '${days} days') as avg_pages_per_session
    `, dateParams);

    // 2. Top Pages
    const topPages = await query(`
      SELECT 
        page_url,
        page_title,
        COUNT(*) as views,
        COUNT(DISTINCT session_id) as unique_views,
        AVG(duration_seconds) as avg_duration
      FROM page_views
      WHERE ${dateFilter}
      GROUP BY page_url, page_title
      ORDER BY views DESC
      LIMIT 10
    `, dateParams);

    // 3. Top Events (Most clicked buttons/links)
    const topEvents = await query(`
      SELECT 
        event_type,
        event_category,
        event_label,
        COUNT(*) as event_count,
        COUNT(DISTINCT session_id) as unique_users
      FROM user_events
      WHERE ${dateFilter}
      GROUP BY event_type, event_category, event_label
      ORDER BY event_count DESC
      LIMIT 20
    `, dateParams);

    // 4. Traffic Sources
    const trafficSources = await query(`
      SELECT 
        utm_source,
        utm_medium,
        utm_campaign,
        COUNT(*) as sessions,
        AVG(pages_visited) as avg_pages,
        AVG(total_duration_seconds) as avg_duration
      FROM user_sessions
      WHERE started_at >= NOW() - INTERVAL '${days} days'
        AND utm_source IS NOT NULL
      GROUP BY utm_source, utm_medium, utm_campaign
      ORDER BY sessions DESC
      LIMIT 10
    `);

    // 5. Device and Browser Stats
    const deviceStats = await query(`
      SELECT 
        device_type,
        COUNT(*) as sessions,
        AVG(pages_visited) as avg_pages
      FROM user_sessions
      WHERE started_at >= NOW() - INTERVAL '${days} days'
        AND device_type IS NOT NULL
      GROUP BY device_type
      ORDER BY sessions DESC
    `);

    const browserStats = await query(`
      SELECT 
        browser,
        COUNT(*) as sessions
      FROM user_sessions
      WHERE started_at >= NOW() - INTERVAL '${days} days'
        AND browser IS NOT NULL
      GROUP BY browser
      ORDER BY sessions DESC
      LIMIT 10
    `);

    // 6. Geographic Data
    const geoStats = await query(`
      SELECT 
        country,
        city,
        COUNT(*) as sessions
      FROM user_sessions
      WHERE started_at >= NOW() - INTERVAL '${days} days'
        AND country IS NOT NULL
      GROUP BY country, city
      ORDER BY sessions DESC
      LIMIT 20
    `);

    // 7. Most Interested Tours
    const topTours = await query(`
      SELECT 
        ti.tour_id,
        t.title,
        t.location,
        t.price,
        SUM(ti.interest_score) as total_interest,
        COUNT(DISTINCT ti.session_id) as unique_visitors,
        COUNT(*) as total_interactions
      FROM tour_interests ti
      LEFT JOIN eco_tours t ON ti.tour_id = t.id
      WHERE ti.${dateFilter}
      GROUP BY ti.tour_id, t.title, t.location, t.price
      ORDER BY total_interest DESC
      LIMIT 10
    `, dateParams);

    // 8. Popular Search Terms
    const topSearches = await query(`
      SELECT 
        search_term,
        COUNT(*) as search_count,
        AVG(results_count) as avg_results,
        COUNT(DISTINCT session_id) as unique_searchers
      FROM search_queries
      WHERE ${dateFilter}
      GROUP BY search_term
      ORDER BY search_count DESC
      LIMIT 15
    `, dateParams);

    // 9. Daily Trends (last 30 days)
    const dailyTrends = await query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(DISTINCT session_id) as sessions,
        COUNT(*) as page_views,
        COUNT(DISTINCT user_id) as unique_users
      FROM page_views
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    // 10. Conversion Funnel
    const conversionFunnel = await query(`
      SELECT 
        step,
        COUNT(DISTINCT session_id) as sessions,
        COUNT(*) as total_steps,
        ROUND(AVG(CASE WHEN completed THEN 1 ELSE 0 END) * 100, 2) as completion_rate
      FROM conversion_funnels
      WHERE ${dateFilter}
      GROUP BY step, step_order
      ORDER BY step_order
    `, dateParams);

    // 11. Real-time Active Users (last 5 minutes)
    const activeUsers = await query(`
      SELECT COUNT(DISTINCT session_id) as active_now
      FROM page_views
      WHERE created_at >= NOW() - INTERVAL '5 minutes'
    `);

    // 12. Cookie Consent Stats
    const consentStats = await query(`
      SELECT 
        COUNT(*) as total_consents,
        SUM(CASE WHEN analytics THEN 1 ELSE 0 END) as analytics_accepted,
        SUM(CASE WHEN marketing THEN 1 ELSE 0 END) as marketing_accepted,
        SUM(CASE WHEN preferences THEN 1 ELSE 0 END) as preferences_accepted
      FROM cookie_consents
      WHERE created_at >= NOW() - INTERVAL '${days} days'
    `);

    return NextResponse.json({
      success: true,
      data: convertBigInt({
        overview: overview.rows[0],
        topPages: topPages.rows,
        topEvents: topEvents.rows,
        trafficSources: trafficSources.rows,
        deviceStats: deviceStats.rows,
        browserStats: browserStats.rows,
        geoStats: geoStats.rows,
        topTours: topTours.rows,
        topSearches: topSearches.rows,
        dailyTrends: dailyTrends.rows,
        conversionFunnel: conversionFunnel.rows,
        activeUsers: activeUsers.rows[0],
        consentStats: consentStats.rows[0],
      }),
    });
  } catch (error) {
    console.error('Error fetching analytics dashboard:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics dashboard' },
      { status: 500 }
    );
  }
}
