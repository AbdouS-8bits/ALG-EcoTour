import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await query(
      `SELECT 
        id,
        campaign_name,
        campaign_type,
        subject,
        sent_count,
        opened_count,
        clicked_count,
        converted_count,
        created_at,
        sent_at
      FROM email_campaigns
      ORDER BY created_at DESC`
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching email campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { campaign_name, campaign_type, subject, content } = body;

    if (!campaign_name || !subject || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO email_campaigns (campaign_name, campaign_type, subject, content, sent_count, opened_count, clicked_count, converted_count, created_at)
       VALUES ($1, $2, $3, $4, 0, 0, 0, 0, NOW())
       RETURNING id, campaign_name, campaign_type, subject, content, sent_count, opened_count, clicked_count, converted_count, created_at`,
      [campaign_name, campaign_type || 'promotional', subject, content]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating email campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign', details: (error as Error).message },
      { status: 500 }
    );
  }
}
