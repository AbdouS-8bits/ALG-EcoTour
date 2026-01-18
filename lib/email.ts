import * as nodemailer from 'nodemailer';

// Create transporter with your actual env variable names
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || process.env.EMAIL_SERVER_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"ALG EcoTour" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your email - ALG EcoTour',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🌿 ALG EcoTour</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="color: #333333; margin: 0 0 20px 0;">Verify Your Email Address</h2>
                    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Thank you for signing up with ALG EcoTour! To complete your registration and start exploring amazing eco-tours in Algeria, please verify your email address.
                    </p>
                    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                      Click the button below to verify your email:
                    </p>
                    
                    <!-- Button -->
                    <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                      <tr>
                        <td style="background-color: #10b981; border-radius: 4px; text-align: center;">
                          <a href="${verificationUrl}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold;">
                            Verify Email Address
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                      Or copy and paste this link into your browser:
                    </p>
                    <p style="color: #10b981; font-size: 14px; word-break: break-all; margin: 10px 0 0 0;">
                      ${verificationUrl}
                    </p>
                    
                    <p style="color: #999999; font-size: 12px; line-height: 1.6; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #eeeeee;">
                      If you didn't create an account with ALG EcoTour, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f8f8; padding: 20px; text-align: center;">
                    <p style="color: #999999; font-size: 12px; margin: 0;">
                      © ${new Date().getFullYear()} ALG EcoTour. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent to:', email);
    console.log('📧 Message ID:', info.messageId);
    return true;
  } catch (error: any) {
    console.error('❌ Failed to send verification email:', error);
    console.error('Error details:', error.message);
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"ALG EcoTour" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset your password - ALG EcoTour',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your Password</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px;">
                <tr>
                  <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0;">🌿 ALG EcoTour</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="color: #333333;">Reset Your Password</h2>
                    <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                      You requested to reset your password. Click the button below to create a new password:
                    </p>
                    <table cellpadding="0" cellspacing="0" style="margin: 20px auto;">
                      <tr>
                        <td style="background-color: #10b981; border-radius: 4px;">
                          <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-weight: bold;">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="color: #666666; font-size: 14px;">
                      Or copy this link: <br>
                      <span style="color: #10b981; word-break: break-all;">${resetUrl}</span>
                    </p>
                    <p style="color: #999999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eeeeee; padding-top: 20px;">
                      If you didn't request this, please ignore this email. This link will expire in 1 hour.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent to:', email);
    console.log('📧 Message ID:', info.messageId);
    return true;
  } catch (error: any) {
    console.error('❌ Failed to send password reset email:', error);
    console.error('Error details:', error.message);
    throw error;
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || `"ALG EcoTour" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to ALG EcoTour! 🌿',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0;">Welcome to ALG EcoTour! 🌿</h1>
          </div>
          <div style="padding: 40px;">
            <h2 style="color: #333333;">Hi ${name}!</h2>
            <p style="color: #666666; font-size: 16px; line-height: 1.6;">
              Thank you for joining ALG EcoTour! We're excited to help you discover the natural beauty of Algeria.
            </p>
            <p style="color: #666666; font-size: 16px;">
              Start exploring our eco-tours and book your next adventure today!
            </p>
            <table cellpadding="0" cellspacing="0" style="margin: 20px auto;">
              <tr>
                <td style="background-color: #10b981; border-radius: 4px;">
                  <a href="${process.env.NEXTAUTH_URL}/tours" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-weight: bold;">
                    Explore Tours
                  </a>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent to:', email);
    console.log('📧 Message ID:', info.messageId);
  } catch (error: any) {
    console.error('⚠️  Failed to send welcome email:', error);
    console.error('Error details:', error.message);
    // Don't throw - welcome email failure shouldn't break the flow
  }
}

// Test email connection
export async function testEmailConnection() {
  try {
    await transporter.verify();
    console.log('✅ Email server connection verified');
    return true;
  } catch (error: any) {
    console.error('❌ Email server connection failed:', error.message);
    return false;
  }
}
