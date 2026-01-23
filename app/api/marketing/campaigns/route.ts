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

    // Check if email_campaigns table exists
    const tableExists = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'email_campaigns'
      ) as exists
    `);

    if (!tableExists.rows[0]?.exists) {
      return NextResponse.json({ 
        campaigns: [],
        message: 'Email campaigns table not created. Run migration: migrations/004_email_campaigns.sql'
      });
    }

    const campaigns = await query(`
      SELECT 
        id,
        name,
        subject,
        template,
        segment,
        status,
        sent_count as sent,
        open_count as opens,
        click_count as clicks,
        conversion_count as conversions,
        scheduled_for,
        created_at,
        sent_at
      FROM email_campaigns
      ORDER BY created_at DESC
    `);

    return NextResponse.json({ campaigns: campaigns.rows });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ 
      campaigns: [],
      error: 'Database not configured for email campaigns'
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if table exists
    const tableExists = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'email_campaigns'
      ) as exists
    `);

    if (!tableExists.rows[0]?.exists) {
      return NextResponse.json({ 
        error: 'Email campaigns table not created. Please run the migration first.',
        migration: 'migrations/004_email_campaigns.sql'
      }, { status: 400 });
    }

    const body = await request.json();
    const { name, subject, template, segment, scheduledFor } = body;

    if (!name || !subject || !template || !segment) {
      return NextResponse.json(
        { error: 'Missing required fields: name, subject, template, segment' },
        { status: 400 }
      );
    }

    // For now, just create the campaign without sending
    // (email sending requires SMTP configuration)
    const campaign = await query(`
      INSERT INTO email_campaigns (
        name, subject, template, segment, 
        target_count, status, scheduled_for, created_at
      )
      VALUES ($1, $2, $3, $4, 0, 'draft', $5, NOW())
      RETURNING *
    `, [
      name,
      subject,
      template,
      segment,
      scheduledFor || null
    ]);

    return NextResponse.json({ 
      success: true, 
      campaign: campaign.rows[0],
      message: 'Campaign created. Configure SMTP settings in .env to send emails.'
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json({ 
      error: 'Failed to create campaign',
      details: (error as Error).message 
    }, { status: 500 });
  }
}
