'use client';

import { v4 as uuidv4 } from 'uuid';

// Analytics Tracker Class
class AnalyticsTracker {
  private sessionId: string;
  private userId: string | null = null;
  private startTime: number;
  private currentPage: string = '';
  private consentGiven: boolean = false;
  private marketingConsentGiven: boolean = false;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.startTime = Date.now();
    this.initializeTracking();
  }

  // Get or create session ID
  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return '';
    
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = uuidv4();
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  // Initialize tracking
  private async initializeTracking() {
    if (typeof window === 'undefined') return;

    // Check cookie consent
    await this.checkCookieConsent();

    // Get device info
    const deviceInfo = this.getDeviceInfo();

    // Get UTM parameters
    const utmParams = this.getUTMParameters();

    // Create session
    await this.createSession(deviceInfo, utmParams);

    // Track initial page view
    this.trackPageView();

    // Listen for page unload to update duration
    window.addEventListener('beforeunload', () => {
      this.updatePageDuration();
    });

    // Listen for visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.updatePageDuration();
      } else {
        this.startTime = Date.now();
      }
    });
  }

  // Check cookie consent
  private async checkCookieConsent() {
    try {
      const response = await fetch(`/api/analytics/cookie-consent?sessionId=${this.sessionId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        this.consentGiven = data.data.analytics || false;
        this.marketingConsentGiven = data.data.marketing || false;
      }
    } catch (error) {
      console.error('Error checking cookie consent:', error);
    }
  }

  // Set cookie consent
  async setCookieConsent(consents: {
    necessary?: boolean;
    analytics?: boolean;
    marketing?: boolean;
    preferences?: boolean;
  }) {
    try {
      const response = await fetch('/api/analytics/cookie-consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          userId: this.userId,
          ...consents,
        }),
      });

      const data = await response.json();
      if (data.success) {
        this.consentGiven = consents.analytics || false;
        this.marketingConsentGiven = consents.marketing || false;
        
        // Store in localStorage
        localStorage.setItem('cookie_consent', JSON.stringify(consents));
      }
    } catch (error) {
      console.error('Error setting cookie consent:', error);
    }
  }

  // Get device information
  private getDeviceInfo() {
    if (typeof window === 'undefined') return {};

    const ua = navigator.userAgent;
    let deviceType = 'desktop';
    
    if (/mobile/i.test(ua)) deviceType = 'mobile';
    else if (/tablet/i.test(ua)) deviceType = 'tablet';

    // Detect browser
    let browser = 'Unknown';
    if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
    else if (ua.indexOf('Chrome') > -1) browser = 'Chrome';
    else if (ua.indexOf('Safari') > -1) browser = 'Safari';
    else if (ua.indexOf('Edge') > -1) browser = 'Edge';

    // Detect OS
    let os = 'Unknown';
    if (ua.indexOf('Win') > -1) os = 'Windows';
    else if (ua.indexOf('Mac') > -1) os = 'MacOS';
    else if (ua.indexOf('Linux') > -1) os = 'Linux';
    else if (ua.indexOf('Android') > -1) os = 'Android';
    else if (ua.indexOf('iOS') > -1) os = 'iOS';

    return { deviceType, browser, os, userAgent: ua };
  }

  // Get UTM parameters from URL
  private getUTMParameters() {
    if (typeof window === 'undefined') return {};

    const params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get('utm_source'),
      utmMedium: params.get('utm_medium'),
      utmCampaign: params.get('utm_campaign'),
      utmContent: params.get('utm_content'),
      utmTerm: params.get('utm_term'),
    };
  }

  // Create session
  private async createSession(deviceInfo: any, utmParams: any) {
    if (!this.consentGiven) return;

    try {
      await fetch('/api/analytics/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          userId: this.userId,
          ...deviceInfo,
          ...utmParams,
        }),
      });
    } catch (error) {
      console.error('Error creating session:', error);
    }
  }

  // Set user ID when user logs in
  setUserId(userId: string) {
    this.userId = userId;
  }

  // Track page view
  async trackPageView(pageUrl?: string, pageTitle?: string) {
    if (!this.consentGiven) return;

    const url = pageUrl || window.location.pathname + window.location.search;
    const title = pageTitle || document.title;

    // Update page duration for previous page
    if (this.currentPage && this.currentPage !== url) {
      await this.updatePageDuration();
    }

    this.currentPage = url;
    this.startTime = Date.now();

    const deviceInfo = this.getDeviceInfo();

    try {
      await fetch('/api/analytics/page-views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          userId: this.userId,
          pageUrl: url,
          pageTitle: title,
          referrer: document.referrer,
          ...deviceInfo,
        }),
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }

  // Update page duration
  private async updatePageDuration() {
    if (!this.consentGiven || !this.currentPage) return;

    const duration = Math.floor((Date.now() - this.startTime) / 1000);

    try {
      await fetch('/api/analytics/page-views', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          pageUrl: this.currentPage,
          durationSeconds: duration,
        }),
      });
    } catch (error) {
      console.error('Error updating page duration:', error);
    }
  }

  // Track event (clicks, interactions)
  async trackEvent(
    eventType: string,
    eventCategory?: string,
    eventLabel?: string,
    eventValue?: any
  ) {
    if (!this.consentGiven) return;

    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          userId: this.userId,
          eventType,
          eventCategory,
          eventLabel,
          eventValue,
          pageUrl: window.location.pathname,
        }),
      });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  // Track tour interest
  async trackTourInterest(tourId: number, interestType: string, score?: number) {
    if (!this.marketingConsentGiven && !this.consentGiven) return;

    try {
      await fetch('/api/analytics/tour-interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          userId: this.userId,
          tourId,
          interestType,
          interestScore: score,
        }),
      });
    } catch (error) {
      console.error('Error tracking tour interest:', error);
    }
  }

  // Track search query
  async trackSearch(searchTerm: string, filters?: any, resultsCount?: number, clickedResultId?: number) {
    if (!this.consentGiven) return;

    try {
      await fetch('/api/analytics/search-queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          userId: this.userId,
          searchTerm,
          filters,
          resultsCount,
          clickedResultId,
        }),
      });
    } catch (error) {
      console.error('Error tracking search:', error);
    }
  }

  // Track conversion funnel step
  async trackFunnelStep(tourId: number, step: string, stepOrder: number, completed: boolean = false) {
    if (!this.consentGiven) return;

    try {
      await fetch('/api/analytics/conversion-funnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          userId: this.userId,
          tourId,
          step,
          stepOrder,
          completed,
        }),
      });
    } catch (error) {
      console.error('Error tracking funnel step:', error);
    }
  }
}

// Create singleton instance
let tracker: AnalyticsTracker | null = null;

export function getTracker(): AnalyticsTracker {
  if (typeof window === 'undefined') {
    // Return dummy tracker for SSR
    return {
      setUserId: () => {},
      trackPageView: async () => {},
      trackEvent: async () => {},
      trackTourInterest: async () => {},
      trackSearch: async () => {},
      trackFunnelStep: async () => {},
      setCookieConsent: async () => {},
    } as any;
  }

  if (!tracker) {
    tracker = new AnalyticsTracker();
  }
  return tracker;
}

export default AnalyticsTracker;
