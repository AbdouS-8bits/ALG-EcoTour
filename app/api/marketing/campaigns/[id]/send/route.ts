import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { query } from '@/lib/db';
import { sendBulkEmails } from '@/lib/email';
import { getEmailTemplate } from '@/lib/emailTemplates';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params in Next.js 15
    const { id } = await params;
    const campaignId = id;

    // Get campaign details
    const campaignResult = await query(
      'SELECT * FROM email_campaigns WHERE id = $1',
      [campaignId]
    );

    if (campaignResult.rows.length === 0) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const campaign = campaignResult.rows[0];

    if (campaign.status === 'sent') {
      return NextResponse.json(
        { error: 'Campaign already sent' },
        { status: 400 }
      );
    }

    // Check SMTP configuration
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      return NextResponse.json(
        {
          error: 'Email not configured',
          message: 'Please configure SMTP settings in .env file: SMTP_HOST, SMTP_USER, SMTP_PASSWORD',
        },
        { status: 400 }
      );
    }

    // Get recipients based on segment
    const recipients = await getSegmentRecipients(campaign.segment);

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: 'No recipients found for this segment' },
        { status: 400 }
      );
    }

    // Get recommended tours for the template (if needed)
    const tours = await query(
      'SELECT id, title, description, location, price, "photoURL" FROM eco_tours WHERE status = $1 LIMIT 3',
      ['active']
    );

    // Send emails
    const results = await sendBulkEmails(
      recipients.map(r => ({ email: r.email, name: r.name })),
      campaign.subject,
      (userName) => getEmailTemplate(campaign.template, {
        userName,
        tours: tours.rows,
      }),
      {
        batchSize: 10,
        delayMs: 1000,
      }
    );

    // Update campaign status
    await query(
      `UPDATE email_campaigns 
       SET status = 'sent', 
           sent_count = $1, 
           sent_at = NOW(),
           target_count = $2
       WHERE id = $3`,
      [results.sent, recipients.length, campaignId]
    );

    // Log recipients (using user_id instead of email/name)
    for (const recipient of recipients) {
      try {
        await query(
          `INSERT INTO email_campaign_recipients (campaign_id, user_id, sent_at, status)
           VALUES ($1, $2, NOW(), $3)`,
          [
            campaignId,
            recipient.id, // Use user_id from the query
            'sent',
          ]
        );
      } catch (err) {
        console.error('Error logging recipient:', err);
        // Continue even if logging fails
      }
    }

    return NextResponse.json({
      success: true,
      message: `Campaign sent to ${results.sent} recipients`,
      stats: {
        sent: results.sent,
        failed: results.failed,
        total: recipients.length,
      },
      errors: results.errors.length > 0 ? results.errors : undefined,
    });
  } catch (error) {
    console.error('Error sending campaign:', error);
    return NextResponse.json(
      {
        error: 'Failed to send campaign',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

async function getSegmentRecipients(segment: string) {
  let recipientsQuery = '';

  switch (segment) {
    case 'all':
      recipientsQuery = `
        SELECT id, email, name 
        FROM users 
        WHERE "emailVerified" IS NOT NULL
        AND email IS NOT NULL
      `;
      break;

    case 'high_intent':
      recipientsQuery = `
        SELECT DISTINCT u.id, u.email, u.name
        FROM users u
        INNER JOIN page_views pv ON pv.user_id = u.id
        WHERE pv.created_at >= NOW() - INTERVAL '7 days'
          AND u."emailVerified" IS NOT NULL
          AND u.email IS NOT NULL
        GROUP BY u.id, u.email, u.name
        HAVING COUNT(pv.id) >= 5
      `;
      break;

    case 'adventure':
    case 'family':
    case 'luxury':
      recipientsQuery = `
        SELECT id, email, name 
        FROM users 
        WHERE "emailVerified" IS NOT NULL
        AND email IS NOT NULL
      `;
      break;

    case 'abandoned':
      recipientsQuery = `
        SELECT DISTINCT u.id, u.email, u.name
        FROM users u
        INNER JOIN bookings b ON b.user_id = u.id
        WHERE b.status = 'pending'
          AND b."createdAt" >= NOW() - INTERVAL '7 days'
          AND u."emailVerified" IS NOT NULL
          AND u.email IS NOT NULL
      `;
      break;

    case 'inactive':
      recipientsQuery = `
        SELECT id, email, name
        FROM users
        WHERE "emailVerified" IS NOT NULL
          AND email IS NOT NULL
          AND "createdAt" < NOW() - INTERVAL '30 days'
      `;
      break;

    default:
      recipientsQuery = `
        SELECT id, email, name 
        FROM users 
        WHERE "emailVerified" IS NOT NULL
        AND email IS NOT NULL
        LIMIT 10
      `;
  }

  const result = await query(recipientsQuery);
  return result.rows;
}
