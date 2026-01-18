import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getAnalyticsData } from '@/lib/analytics';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get analytics data
    const analyticsData = await getAnalyticsData();

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data', details: (error as Error).message },
      { status: 500 }
    );
  }
}
