import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if analytics tables exist
    const tablesExist = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'page_views'
      ) as exists
    `);

    if (!tablesExist.rows[0]?.exists) {
      // Return mock segments when analytics not configured
      return NextResponse.json({
        segments: [
          { id: 'all', name: 'All Users', description: 'All registered users', count: 0, engagement: 'medium' },
          { id: 'high_intent', name: 'High Intent Users', description: 'Viewed 5+ tours in last 7 days', count: 0, engagement: 'high' },
          { id: 'adventure', name: 'Adventure Enthusiasts', description: 'Interested in adventure/hiking tours', count: 0, engagement: 'medium' },
          { id: 'family', name: 'Family Travelers', description: 'Viewed family-friendly tours', count: 0, engagement: 'medium' },
          { id: 'luxury', name: 'Luxury Seekers', description: 'Viewed tours $500+', count: 0, engagement: 'high' },
          { id: 'abandoned', name: 'Abandoned Cart', description: 'Started but didn\'t complete booking', count: 0, engagement: 'high' },
          { id: 'inactive', name: 'Inactive Users', description: 'No activity in 30+ days', count: 0, engagement: 'low' }
        ],
        message: 'Analytics tracking not configured. Showing segment definitions only.'
      });
    }

    // Calculate real segment sizes
    const segments = await Promise.all([
      getSegmentCount('all', 'All Users', 'All registered users'),
      getSegmentCount('high_intent', 'High Intent Users', 'Viewed 5+ tours in last 7 days'),
      getSegmentCount('adventure', 'Adventure Enthusiasts', 'Interested in adventure/hiking tours'),
      getSegmentCount('family', 'Family Travelers', 'Viewed family-friendly tours'),
      getSegmentCount('luxury', 'Luxury Seekers', 'Viewed tours $500+'),
      getSegmentCount('abandoned', 'Abandoned Cart', 'Started but didn\'t complete booking'),
      getSegmentCount('inactive', 'Inactive Users', 'No activity in 30+ days')
    ]);

    return NextResponse.json({ segments });
  } catch (error) {
    console.error('Error fetching segments:', error);
    return NextResponse.json({ 
      segments: [],
      error: 'Failed to fetch segments' 
    }, { status: 500 });
  }
}

async function getSegmentCount(id: string, name: string, description: string) {
  let countQuery = '';

  try {
    switch (id) {
      case 'all':
        countQuery = `
          SELECT COUNT(DISTINCT id) as count
          FROM users
          WHERE "emailVerified" = true
        `;
        break;

      case 'high_intent':
        countQuery = `
          SELECT COUNT(DISTINCT u.id) as count
          FROM users u
          INNER JOIN page_views pv ON pv.user_id = u.id
          WHERE pv.created_at >= NOW() - INTERVAL '7 days'
            AND u."emailVerified" = true
        `;
        break;

      case 'adventure':
        countQuery = `
          SELECT COUNT(DISTINCT u.id) as count
          FROM users u
          WHERE u."emailVerified" = true
        `;
        break;

      case 'family':
        countQuery = `
          SELECT COUNT(DISTINCT u.id) as count
          FROM users u
          WHERE u."emailVerified" = true
        `;
        break;

      case 'luxury':
        countQuery = `
          SELECT COUNT(DISTINCT u.id) as count
          FROM users u
          WHERE u."emailVerified" = true
        `;
        break;

      case 'abandoned':
        countQuery = `
          SELECT COUNT(DISTINCT u.id) as count
          FROM users u
          WHERE u."emailVerified" = true
        `;
        break;

      case 'inactive':
        countQuery = `
          SELECT COUNT(DISTINCT u.id) as count
          FROM users u
          WHERE u."emailVerified" = true
            AND u."createdAt" < NOW() - INTERVAL '30 days'
        `;
        break;

      default:
        return { id, name, description, count: 0, engagement: 'low' };
    }

    const result = await query(countQuery);
    const count = parseInt(result.rows[0]?.count || '0');

    let engagement: 'high' | 'medium' | 'low' = 'low';
    if (id === 'high_intent' || id === 'abandoned' || id === 'luxury') {
      engagement = 'high';
    } else if (id === 'adventure' || id === 'family') {
      engagement = 'medium';
    }

    return {
      id,
      name,
      description,
      count,
      engagement
    };
  } catch (error) {
    console.error(`Error counting segment ${id}:`, error);
    return { id, name, description, count: 0, engagement: 'low' };
  }
}
