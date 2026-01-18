# Analytics & Cookie Tracking System Documentation

## 🎯 Overview

A comprehensive analytics and tracking system that helps you understand your customers, track their behavior, and send targeted marketing campaigns and emails.

## 📊 What's Included

### 1. **Cookie Consent Management** (GDPR Compliant)
- Cookie consent banner with customizable preferences
- Track user consent for analytics, marketing, and preferences
- Compliant with GDPR and privacy regulations

### 2. **User Behavior Tracking**
- Page views and session tracking
- Event tracking (clicks, interactions)
- Time spent on pages
- Device and browser information
- Geographic location data

### 3. **Tour Interest Tracking**
- Track which tours users are viewing
- Interest scoring system (view, click, details, save, book)
- Personalized tour recommendations based on interests

### 4. **Search Analytics**
- Track what users are searching for
- Popular search terms
- Search filters and results

### 5. **Conversion Funnel**
- Track user journey through booking process
- Identify drop-off points
- Optimize conversion rates

### 6. **Marketing Insights**
- UTM campaign tracking
- Traffic source analysis
- Email campaign performance (ready to integrate)
- User segmentation for targeted marketing

### 7. **Analytics Dashboard**
- Real-time visitor count
- Page view statistics
- Event tracking (clicks)
- Popular tours
- Geographic distribution
- Device breakdown
- Traffic sources

---

## 🚀 Quick Start

### Step 1: Run Database Migrations

```bash
# Run the analytics schema SQL
psql your_database < prisma/analytics_schema.sql
```

### Step 2: Add Cookie Consent Banner

In your root layout file:

```typescript
// app/layout.tsx
import CookieConsentBanner from '@/components/CookieConsentBanner';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <CookieConsentBanner />
      </body>
    </html>
  );
}
```

### Step 3: Initialize Tracking

In your root layout or a tracking component:

```typescript
'use client';

import { useEffect } from 'react';
import { getTracker } from '@/lib/analytics-tracker';
import { usePathname } from 'next/navigation';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const tracker = getTracker();

  useEffect(() => {
    // Track page view on route change
    tracker.trackPageView();
  }, [pathname]);

  return <>{children}</>;
}
```

### Step 4: Track Events in Your Components

```typescript
import { getTracker } from '@/lib/analytics-tracker';

function TourCard({ tour }) {
  const tracker = getTracker();

  const handleClick = () => {
    // Track tour interest
    tracker.trackTourInterest(tour.id, 'click');
    
    // Track click event
    tracker.trackEvent('click', 'tour_card', tour.title);
  };

  return (
    <div onClick={handleClick}>
      <h3>{tour.title}</h3>
    </div>
  );
}
```

---

## 📝 Tracking Examples

### Track Page Views

```typescript
const tracker = getTracker();

// Automatic - tracked on mount
useEffect(() => {
  tracker.trackPageView();
}, []);

// Manual with custom data
tracker.trackPageView('/tours/mountain-hiking', 'Mountain Hiking Tour');
```

### Track Button Clicks

```typescript
<button 
  onClick={() => {
    tracker.trackEvent('click', 'button', 'book_now_button', { tourId: 123 });
  }}
>
  Book Now
</button>
```

### Track Tour Interests

```typescript
// When user views a tour
tracker.trackTourInterest(tourId, 'view');

// When user clicks for details
tracker.trackTourInterest(tourId, 'details_view');

// When user saves/favorites
tracker.trackTourInterest(tourId, 'save');

// When user shares
tracker.trackTourInterest(tourId, 'share');

// When user attempts booking
tracker.trackTourInterest(tourId, 'book_attempt');

// When booking is complete
tracker.trackTourInterest(tourId, 'booking_complete');
```

### Track Search Queries

```typescript
function SearchComponent() {
  const handleSearch = async (term: string, filters: any) => {
    const results = await searchTours(term, filters);
    
    tracker.trackSearch(
      term, 
      filters, 
      results.length,
      null // clickedResultId - track when user clicks a result
    );
  };
}
```

### Track Conversion Funnel

```typescript
// Step 1: Tour view
tracker.trackFunnelStep(tourId, 'tour_view', 1, true);

// Step 2: Details page
tracker.trackFunnelStep(tourId, 'details_view', 2, true);

// Step 3: Booking form
tracker.trackFunnelStep(tourId, 'booking_form', 3, true);

// Step 4: Checkout
tracker.trackFunnelStep(tourId, 'checkout', 4, true);

// Step 5: Complete
tracker.trackFunnelStep(tourId, 'booking_complete', 5, true);
```

### Set User ID After Login

```typescript
function LoginComponent() {
  const tracker = getTracker();

  const handleLogin = async (email: string, password: string) => {
    const user = await login(email, password);
    
    // Set user ID for tracking
    tracker.setUserId(user.id.toString());
  };
}
```

---

## 🎨 Analytics Dashboard

### Add to Admin Panel

```typescript
// app/admin/analytics/page.tsx
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

export default function AnalyticsPage() {
  return <AnalyticsDashboard />;
}
```

### Dashboard Features

1. **Overview Tab**
   - Total sessions, page views, unique users
   - Real-time active users
   - Average session duration
   - Daily trends chart
   - Cookie consent statistics

2. **Behavior Tab**
   - Most visited pages
   - Most clicked buttons/elements
   - Popular search terms

3. **Traffic Tab**
   - Device distribution
   - Browser statistics
   - Traffic sources (UTM)
   - Geographic distribution

4. **Tours Tab**
   - Most interested tours
   - Interest scores
   - Unique visitors per tour

5. **Marketing Tab**
   - Conversion funnel visualization
   - Email campaign performance

---

## 📧 Using Analytics for Targeted Marketing

### Get User Interests

```typescript
// Get tours a user is interested in
const response = await fetch(`/api/analytics/tour-interests?userId=${userId}`);
const data = await response.json();

// data.data contains tours sorted by interest score
const interestedTours = data.data;

// Use this to send personalized emails
sendEmail({
  to: user.email,
  subject: 'Tours you might like',
  tours: interestedTours.slice(0, 5) // Top 5 interested tours
});
```

### Segment Users by Behavior

```sql
-- Users who viewed tours but didn't book
SELECT DISTINCT u.id, u.email, u.name
FROM users u
INNER JOIN tour_interests ti ON u.id = ti.user_id
LEFT JOIN bookings b ON u.id = b.user_id AND ti.tour_id = b.tour_id
WHERE b.id IS NULL
  AND ti.interest_score > 5
  AND ti.created_at >= NOW() - INTERVAL '30 days';
```

### Popular Search Terms for Content Ideas

```typescript
const response = await fetch('/api/analytics/search-queries?limit=20&days=30');
const data = await response.json();

// Use popular searches to:
// 1. Create new tour packages
// 2. Optimize existing tour descriptions
// 3. Create blog content
// 4. Improve SEO
```

---

## 🔒 Privacy & GDPR Compliance

### Cookie Consent

The system respects user privacy:

1. **Necessary cookies** - Always enabled (required for website functionality)
2. **Analytics cookies** - Must be accepted to track user behavior
3. **Marketing cookies** - Must be accepted to track for ads/emails
4. **Preference cookies** - Store user preferences

### Data Retention

Configure data retention in your database:

```sql
-- Delete old page views (older than 90 days)
DELETE FROM page_views WHERE created_at < NOW() - INTERVAL '90 days';

-- Delete old events
DELETE FROM user_events WHERE created_at < NOW() - INTERVAL '90 days';
```

### User Data Export (GDPR Right to Access)

```typescript
// Get all user data
const userData = {
  pageViews: await query('SELECT * FROM page_views WHERE user_id = $1', [userId]),
  events: await query('SELECT * FROM user_events WHERE user_id = $1', [userId]),
  interests: await query('SELECT * FROM tour_interests WHERE user_id = $1', [userId]),
  searches: await query('SELECT * FROM search_queries WHERE user_id = $1', [userId]),
};
```

### User Data Deletion (GDPR Right to be Forgotten)

```sql
-- Delete all user analytics data
DELETE FROM page_views WHERE user_id = $1;
DELETE FROM user_events WHERE user_id = $1;
DELETE FROM user_sessions WHERE user_id = $1;
DELETE FROM tour_interests WHERE user_id = $1;
DELETE FROM search_queries WHERE user_id = $1;
DELETE FROM cookie_consents WHERE user_id = $1;
```

---

## 📊 Sample Email Campaign Workflow

### 1. Identify Interested Users

```typescript
// Find users interested in specific tour categories
const interestedUsers = await query(`
  SELECT DISTINCT 
    u.id, 
    u.email, 
    u.name,
    ti.tour_id,
    t.title,
    SUM(ti.interest_score) as total_interest
  FROM users u
  INNER JOIN tour_interests ti ON u.id = ti.user_id
  INNER JOIN eco_tours t ON ti.tour_id = t.id
  WHERE t.category_id = $1
    AND ti.created_at >= NOW() - INTERVAL '30 days'
  GROUP BY u.id, u.email, u.name, ti.tour_id, t.title
  HAVING SUM(ti.interest_score) > 10
  ORDER BY total_interest DESC
`, [categoryId]);
```

### 2. Create Personalized Emails

```typescript
for (const user of interestedUsers.rows) {
  await sendEmail({
    to: user.email,
    subject: `Special offer on ${user.title}`,
    template: 'tour-interest',
    data: {
      userName: user.name,
      tourTitle: user.title,
      discount: '20%',
    }
  });
}
```

### 3. Track Email Engagement

(Email campaign tracking tables are already created - integrate with your email service)

---

## 🎯 Best Practices

1. **Always respect cookie consent** - Only track when user has given permission
2. **Anonymize IP addresses** - Store only partial IPs for privacy
3. **Set user ID on login** - Better attribution and insights
4. **Track meaningful events** - Focus on business-critical interactions
5. **Regular data cleanup** - Remove old analytics data
6. **Monitor dashboard regularly** - Make data-driven decisions
7. **A/B test changes** - Use conversion funnel to optimize

---

## 📈 Advanced Features

### Real-time Notifications

```typescript
// Alert when high-value user is active
if (analytics.activeUsers.active_now > 100) {
  sendSlackNotification('🔥 100+ users currently active!');
}
```

### Automated Abandoned Cart Emails

```typescript
// Find users who started booking but didn't complete
const abandonedCarts = await query(`
  SELECT DISTINCT 
    u.email, 
    u.name,
    cf.tour_id,
    t.title
  FROM conversion_funnels cf
  INNER JOIN users u ON cf.user_id = u.id
  INNER JOIN eco_tours t ON cf.tour_id = t.id
  WHERE cf.step = 'booking_form'
    AND cf.created_at >= NOW() - INTERVAL '24 hours'
    AND NOT EXISTS (
      SELECT 1 FROM conversion_funnels cf2 
      WHERE cf2.session_id = cf.session_id 
      AND cf2.step = 'booking_complete'
    )
`);

// Send reminder emails
```

---

## 🛠️ API Endpoints Reference

All analytics endpoints are documented in the main API documentation.

Quick reference:
- `POST /api/analytics/page-views` - Track page view
- `POST /api/analytics/events` - Track event
- `POST /api/analytics/sessions` - Create/update session
- `POST /api/analytics/tour-interests` - Track tour interest
- `POST /api/analytics/search-queries` - Track search
- `POST /api/analytics/cookie-consent` - Set cookie consent
- `GET /api/analytics/dashboard` - Get dashboard data

---

## 🎉 You're All Set!

 analytics and tracking system is ready to:
- ✅ Track user behavior
- ✅ Respect privacy with cookie consent
- ✅ Provide insights via dashboard
- ✅ Enable targeted marketing
- ✅ Optimize conversion rates

