interface Tour {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  photoURL?: string;
}

interface EmailTemplateProps {
  userName?: string;
  tours?: Tour[];
  customContent?: string;
}

export function getEmailTemplate(
  templateId: string,
  props: EmailTemplateProps
): string {
  const baseStyles = `
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
      .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
      .tour-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 15px 0; }
      .tour-image { width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 10px; }
      .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
      .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
    </style>
  `;

  switch (templateId) {
    case 'tour_recommendation':
      return tourRecommendationTemplate(props, baseStyles);
    case 'abandoned_cart':
      return abandonedCartTemplate(props, baseStyles);
    case 'engagement':
      return reEngagementTemplate(props, baseStyles);
    case 'welcome':
      return welcomeTemplate(props, baseStyles);
    case 'seasonal':
      return seasonalTemplate(props, baseStyles);
    default:
      return genericTemplate(props, baseStyles);
  }
}

function tourRecommendationTemplate(
  { userName, tours }: EmailTemplateProps,
  styles: string
): string {
  const tourCards = tours?.map(tour => `
    <div class="tour-card">
      ${tour.photoURL ? `<img src="${tour.photoURL}" alt="${tour.title}" class="tour-image" />` : ''}
      <h3 style="margin: 10px 0; color: #10b981;">${tour.title}</h3>
      <p style="color: #6b7280; margin: 10px 0;">${tour.location}</p>
      <p style="margin: 10px 0;">${tour.description.substring(0, 150)}...</p>
      <p style="font-size: 24px; font-weight: bold; color: #10b981; margin: 10px 0;">
        ${tour.price} DZD
      </p>
      <a href="${process.env.NEXTAUTH_URL}/tours/${tour.id}" class="button">View Tour</a>
    </div>
  `).join('') || '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${styles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌿 Discover Your Next Adventure</h1>
        </div>
        <div class="content">
          <p>Hi ${userName || 'there'},</p>
          <p>We've handpicked some amazing eco tours in Algeria just for you!</p>
          ${tourCards}
          <p style="margin-top: 30px;">
            <a href="${process.env.NEXTAUTH_URL}/tours" class="button">Browse All Tours</a>
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ALG EcoTour. All rights reserved.</p>
          <p>
            <a href="${process.env.NEXTAUTH_URL}/unsubscribe" style="color: #6b7280;">Unsubscribe</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function abandonedCartTemplate(
  { userName }: EmailTemplateProps,
  styles: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      ${styles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎒 Don't Miss Out!</h1>
        </div>
        <div class="content">
          <p>Hi ${userName || 'there'},</p>
          <p>We noticed you started booking a tour but didn't complete your reservation.</p>
          <p>Your adventure is waiting! Complete your booking now and get ready for an unforgettable experience.</p>
          <p style="margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/bookings" class="button">Complete Your Booking</a>
          </p>
          <p>Need help? Our team is here to assist you 24/7.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ALG EcoTour</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function reEngagementTemplate(
  { userName }: EmailTemplateProps,
  styles: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      ${styles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌟 We Miss You!</h1>
        </div>
        <div class="content">
          <p>Hi ${userName || 'there'},</p>
          <p>It's been a while since your last visit, and we've added some incredible new tours!</p>
          <p>Here's what's new:</p>
          <ul>
            <li>🏔️ New mountain hiking experiences</li>
            <li>🏜️ Exclusive desert expeditions</li>
            <li>🌊 Coastal eco-adventures</li>
            <li>🏛️ Cultural heritage tours</li>
          </ul>
          <p style="margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/tours" class="button">Explore New Tours</a>
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ALG EcoTour</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function welcomeTemplate(
  { userName }: EmailTemplateProps,
  styles: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      ${styles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to ALG EcoTour!</h1>
        </div>
        <div class="content">
          <p>Hi ${userName || 'there'},</p>
          <p>We're thrilled to have you join our community of eco-conscious travelers!</p>
          <p>Get started with these steps:</p>
          <ol>
            <li><strong>Browse Tours</strong> - Explore our curated collection of sustainable adventures</li>
            <li><strong>Read Reviews</strong> - See what other travelers are saying</li>
            <li><strong>Book Your First Tour</strong> - Start your eco-tourism journey</li>
          </ol>
          <p style="margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/tours" class="button">Start Exploring</a>
          </p>
          <p>Need help? Contact us anytime at support@algecotour.com</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ALG EcoTour</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function seasonalTemplate(
  { userName, tours }: EmailTemplateProps,
  styles: string
): string {
  const tourCards = tours?.slice(0, 3).map(tour => `
    <div class="tour-card">
      ${tour.photoURL ? `<img src="${tour.photoURL}" alt="${tour.title}" class="tour-image" />` : ''}
      <h3 style="margin: 10px 0; color: #10b981;">${tour.title}</h3>
      <p style="margin: 10px 0;">${tour.description.substring(0, 100)}...</p>
      <p style="font-size: 24px; font-weight: bold; color: #10b981;">
        ${tour.price} DZD
      </p>
      <a href="${process.env.NEXTAUTH_URL}/tours/${tour.id}" class="button">Book Now</a>
    </div>
  `).join('') || '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      ${styles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌞 Limited Time Seasonal Offers!</h1>
        </div>
        <div class="content">
          <p>Hi ${userName || 'there'},</p>
          <p>This season's best tours are here with special pricing!</p>
          ${tourCards}
          <p style="margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 8px;">
            ⏰ <strong>Hurry!</strong> These seasonal offers won't last long.
          </p>
          <p style="margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/tours" class="button">See All Seasonal Tours</a>
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ALG EcoTour</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function genericTemplate(
  { userName, customContent }: EmailTemplateProps,
  styles: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      ${styles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>ALG EcoTour</h1>
        </div>
        <div class="content">
          <p>Hi ${userName || 'there'},</p>
          ${customContent || '<p>Thank you for being part of our eco-tourism community!</p>'}
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ALG EcoTour</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
