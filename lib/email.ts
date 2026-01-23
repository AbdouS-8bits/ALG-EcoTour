import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verify connection on startup (optional)
export async function verifyEmailConnection() {
  try {
    await transporter.verify();
    console.log('✅ Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('❌ Email server connection failed:', error);
    return false;
  }
}

// Send a single email
export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'ALG EcoTour <noreply@algecotour.com>',
      to,
      subject,
      text: text || '', // Plain text version
      html, // HTML version
    });

    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: (error as Error).message };
  }
}

// Send bulk emails (with rate limiting)
export async function sendBulkEmails(
  recipients: { email: string; name?: string }[],
  subject: string,
  htmlTemplate: (name?: string) => string,
  options?: {
    batchSize?: number;
    delayMs?: number;
  }
) {
  const batchSize = options?.batchSize || 10;
  const delayMs = options?.delayMs || 1000;
  
  const results = {
    sent: 0,
    failed: 0,
    errors: [] as string[],
  };

  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    
    await Promise.all(
      batch.map(async (recipient) => {
        try {
          const html = htmlTemplate(recipient.name);
          const result = await sendEmail({
            to: recipient.email,
            subject,
            html,
          });

          if (result.success) {
            results.sent++;
          } else {
            results.failed++;
            results.errors.push(`${recipient.email}: ${result.error}`);
          }
        } catch (error) {
          results.failed++;
          results.errors.push(`${recipient.email}: ${(error as Error).message}`);
        }
      })
    );

    // Delay between batches to avoid rate limiting
    if (i + batchSize < recipients.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return results;
}
