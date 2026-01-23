import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

function convertBigInt(obj: any) {
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

// Mock data when analytics tables don't exist
function getMockData() {
  return {
    overview: {
      total_sessions: 0,
      total_page_views: 0,
      unique_users: 0,
      total_events: 0,
      avg_session_duration: 0,
      avg_pages_per_session: 0
    },
    topPages: [],
    topEvents: [],
    trafficSources: [],
    deviceStats: [],
    browserStats: [],
    geoStats: [],
    topTours: [],
    topSearches: [],
    dailyTrends: [],
    conversionFunnel: [],
    activeUsers: { active_now: 0 },
    consentStats: {
      total_consents: 0,
      analytics_accepted: 0,
      marketing_accepted: 0,
      preferences_accepted: 0
    }
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Check if analytics tables exist
    const tablesExist = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'page_views'
      ) as exists
    `);

    if (!tablesExist.rows[0]?.exists) {
      console.log('Analytics tables do not exist, returning mock data');
      return NextResponse.json({
        success: true,
        data: getMockData(),
        message: 'Analytics tracking not yet configured. Install analytics tables to see real data.'
      });
    }

    // Build date filter
    const dateFilter = `created_at >= NOW() - INTERVAL '${days} days'`;

    // 1. Overview Statistics
    let overview;
    try {
      overview = await query(`
        SELECT 
          COALESCE((SELECT COUNT(DISTINCT session_id) FROM page_views WHERE ${dateFilter}), 0) as total_sessions,
          COALESCE((SELECT COUNT(*) FROM page_views WHERE ${dateFilter}), 0) as total_page_views,
          COALESCE((SELECT COUNT(DISTINCT user_id) FROM page_views WHERE ${dateFilter} AND user_id IS NOT NULL), 0) as unique_users,
          COALESCE((SELECT COUNT(*) FROM user_events WHERE ${dateFilter}), 0) as total_events,
          COALESCE((SELECT AVG(total_duration_seconds) FROM user_sessions WHERE started_at >= NOW() - INTERVAL '${days} days'), 0) as avg_session_duration,
          COALESCE((SELECT AVG(pages_visited) FROM user_sessions WHERE started_at >= NOW() - INTERVAL '${days} days'), 0) as avg_pages_per_session
      `);
    } catch (err) {
      console.error('Overview query error:', err);
      overview = { rows: [getMockData().overview] };
    }

    // 2. Top Pages
    let topPages;
    try {
      topPages = await query(`
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
      `);
    } catch (err) {
      topPages = { rows: [] };
    }

    // 3. Top Events
    let topEvents;
    try {
      topEvents = await query(`
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
      `);
    } catch (err) {
      topEvents = { rows: [] };
    }

    // 4. Traffic Sources
    let trafficSources;
    try {
      trafficSources = await query(`
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
    } catch (err) {
      trafficSources = { rows: [] };
    }

    // 5. Device Stats
    let deviceStats;
    try {
      deviceStats = await query(`
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
    } catch (err) {
      deviceStats = { rows: [] };
    }

    // 6. Browser Stats
    let browserStats;
    try {
      browserStats = await query(`
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
    } catch (err) {
      browserStats = { rows: [] };
    }

    // 7. Geographic Data
    let geoStats;
    try {
      geoStats = await query(`
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
    } catch (err) {
      geoStats = { rows: [] };
    }

    // 8. Most Interested Tours
    let topTours;
    try {
      topTours = await query(`
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
        WHERE ti.created_at >= NOW() - INTERVAL '${days} days'
        GROUP BY ti.tour_id, t.title, t.location, t.price
        ORDER BY total_interest DESC
        LIMIT 10
      `);
    } catch (err) {
      topTours = { rows: [] };
    }

    // 9. Popular Search Terms
    let topSearches;
    try {
      topSearches = await query(`
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
      `);
    } catch (err) {
      topSearches = { rows: [] };
    }

    // 10. Daily Trends
    let dailyTrends;
    try {
      dailyTrends = await query(`
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
    } catch (err) {
      dailyTrends = { rows: [] };
    }

    // 11. Conversion Funnel
    let conversionFunnel;
    try {
      conversionFunnel = await query(`
        SELECT 
          step,
          COUNT(DISTINCT session_id) as sessions,
          COUNT(*) as total_steps,
          ROUND(AVG(CASE WHEN completed THEN 1 ELSE 0 END) * 100, 2) as completion_rate
        FROM conversion_funnels
        WHERE ${dateFilter}
        GROUP BY step, step_order
        ORDER BY step_order
      `);
    } catch (err) {
      conversionFunnel = { rows: [] };
    }

    // 12. Real-time Active Users
    let activeUsers;
    try {
      activeUsers = await query(`
        SELECT COUNT(DISTINCT session_id) as active_now
        FROM page_views
        WHERE created_at >= NOW() - INTERVAL '5 minutes'
      `);
    } catch (err) {
      activeUsers = { rows: [{ active_now: 0 }] };
    }

    // 13. Cookie Consent Stats
    let consentStats;
    try {
      consentStats = await query(`
        SELECT 
          COUNT(*) as total_consents,
          SUM(CASE WHEN analytics THEN 1 ELSE 0 END) as analytics_accepted,
          SUM(CASE WHEN marketing THEN 1 ELSE 0 END) as marketing_accepted,
          SUM(CASE WHEN preferences THEN 1 ELSE 0 END) as preferences_accepted
        FROM cookie_consents
        WHERE created_at >= NOW() - INTERVAL '${days} days'
      `);
    } catch (err) {
      consentStats = { rows: [getMockData().consentStats] };
    }

    return NextResponse.json({
      success: true,
      data: convertBigInt({
        overview: overview.rows[0] || getMockData().overview,
        topPages: topPages.rows || [],
        topEvents: topEvents.rows || [],
        trafficSources: trafficSources.rows || [],
        deviceStats: deviceStats.rows || [],
        browserStats: browserStats.rows || [],
        geoStats: geoStats.rows || [],
        topTours: topTours.rows || [],
        topSearches: topSearches.rows || [],
        dailyTrends: dailyTrends.rows || [],
        conversionFunnel: conversionFunnel.rows || [],
        activeUsers: activeUsers.rows[0] || { active_now: 0 },
        consentStats: consentStats.rows[0] || getMockData().consentStats,
      }),
    });
  } catch (error) {
    console.error('Error fetching analytics dashboard:', error);
    return NextResponse.json({
      success: true,
      data: getMockData(),
      error: 'Analytics tables not configured'
    });
  }
}
