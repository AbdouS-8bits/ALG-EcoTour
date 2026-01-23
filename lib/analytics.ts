// Analytics tracking utility
import { v4 as uuidv4 } from 'uuid';

// Get or create session ID
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

// Get or create user ID (persists across sessions)
export function getUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('analytics_user_id') || null;
}

// Set user ID (when user logs in)
export function setUserId(userId: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('analytics_user_id', userId);
}

// Track page view
export async function trackPageView(pageUrl: string, pageTitle: string, referrer?: string) {
  try {
    const sessionId = getSessionId();
    const userId = getUserId();

    await fetch('/api/analytics/track/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        userId,
        pageUrl,
        pageTitle,
        referrer: referrer || document.referrer,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}

// Track custom event
export async function trackEvent(
  eventType: string,
  eventCategory?: string,
  eventLabel?: string,
  eventValue?: number,
  metadata?: Record<string, any>
) {
  try {
    const sessionId = getSessionId();
    const userId = getUserId();

    await fetch('/api/analytics/track/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        userId,
        eventType,
        eventCategory,
        eventLabel,
        eventValue,
        metadata,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

// Track tour interest
export async function trackTourInterest(
  tourId: number,
  interactionType: 'view' | 'click' | 'favorite' | 'share',
  interestScore: number = 1
) {
  try {
    const sessionId = getSessionId();
    const userId = getUserId();

    await fetch('/api/analytics/track/tour-interest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        userId,
        tourId,
        interactionType,
        interestScore,
      }),
    });
  } catch (error) {
    console.error('Error tracking tour interest:', error);
  }
}

// Track search query
export async function trackSearch(
  searchTerm: string,
  resultsCount: number,
  filters?: Record<string, any>
) {
  try {
    const sessionId = getSessionId();
    const userId = getUserId();

    await fetch('/api/analytics/track/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        userId,
        searchTerm,
        resultsCount,
        filtersApplied: filters,
      }),
    });
  } catch (error) {
    console.error('Error tracking search:', error);
  }
}

// Initialize session (track UTM parameters, device info, etc.)
export async function initializeSession() {
  try {
    const sessionId = getSessionId();
    const userId = getUserId();

    // Parse UTM parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    const utmTerm = urlParams.get('utm_term');
    const utmContent = urlParams.get('utm_content');

    // Detect device type
    const userAgent = navigator.userAgent;
    let deviceType = 'desktop';
    if (/mobile/i.test(userAgent)) deviceType = 'mobile';
    else if (/tablet/i.test(userAgent)) deviceType = 'tablet';

    // Detect browser
    let browser = 'unknown';
    if (userAgent.indexOf('Chrome') > -1) browser = 'Chrome';
    else if (userAgent.indexOf('Safari') > -1) browser = 'Safari';
    else if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox';
    else if (userAgent.indexOf('Edge') > -1) browser = 'Edge';

    // Detect OS
    let os = 'unknown';
    if (userAgent.indexOf('Win') > -1) os = 'Windows';
    else if (userAgent.indexOf('Mac') > -1) os = 'MacOS';
    else if (userAgent.indexOf('Linux') > -1) os = 'Linux';
    else if (userAgent.indexOf('Android') > -1) os = 'Android';
    else if (userAgent.indexOf('iOS') > -1) os = 'iOS';

    await fetch('/api/analytics/track/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        userId,
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
        deviceType,
        browser,
        os,
        userAgent,
      }),
    });
  } catch (error) {
    console.error('Error initializing session:', error);
  }
}
