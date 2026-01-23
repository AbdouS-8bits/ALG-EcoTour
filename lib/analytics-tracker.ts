'use client';

import { v4 as uuidv4 } from 'uuid';

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

  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return '';
    
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = uuidv4();
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  private async initializeTracking() {
    if (typeof window === 'undefined') return;

    // Check cookie consent
    await this.checkCookieConsent();

    // Only proceed if consent is given
    if (!this.consentGiven) {
      console.log('📊 Analytics: Waiting for cookie consent');
      return;
    }

    console.log('✅ Analytics: Consent given, initializing tracking');

    // Get device info and UTM parameters
    const deviceInfo = this.getDeviceInfo();
    const utmParams = this.getUTMParameters();

    // Initialize session
    await this.initializeSession(deviceInfo, utmParams);

    // Track initial page view
    this.trackPageView();

    // Listen for page unload
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

  private async checkCookieConsent() {
    try {
      const response = await fetch(`/api/analytics/cookie-consent?sessionId=${this.sessionId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        this.consentGiven = data.data.analytics || false;
        this.marketingConsentGiven = data.data.marketing || false;
        console.log('📊 Cookie Consent Status:', {
          analytics: this.consentGiven,
          marketing: this.marketingConsentGiven
        });
      }
    } catch (error) {
      console.error('Error checking cookie consent:', error);
    }
  }

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
        
        console.log('✅ Cookie consent updated:', consents);
        
        // Reinitialize tracking if analytics consent was just given
        if (consents.analytics) {
          await this.initializeTracking();
        }
      }
    } catch (error) {
      console.error('Error setting cookie consent:', error);
    }
  }

  private getDeviceInfo() {
    if (typeof window === 'undefined') return {};

    const ua = navigator.userAgent;
    let deviceType = 'desktop';
    
    if (/mobile/i.test(ua)) deviceType = 'mobile';
    else if (/tablet/i.test(ua)) deviceType = 'tablet';

    let browser = 'Unknown';
    if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
    else if (ua.indexOf('Chrome') > -1) browser = 'Chrome';
    else if (ua.indexOf('Safari') > -1) browser = 'Safari';
    else if (ua.indexOf('Edge') > -1) browser = 'Edge';

    let os = 'Unknown';
    if (ua.indexOf('Win') > -1) os = 'Windows';
    else if (ua.indexOf('Mac') > -1) os = 'MacOS';
    else if (ua.indexOf('Linux') > -1) os = 'Linux';
    else if (ua.indexOf('Android') > -1) os = 'Android';
    else if (ua.indexOf('iOS') > -1) os = 'iOS';

    return { deviceType, browser, os, userAgent: ua };
  }

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

  private async initializeSession(deviceInfo: any, utmParams: any) {
    if (!this.consentGiven) return;

    try {
      console.log('📊 Initializing session:', this.sessionId);
      await fetch('/api/analytics/track/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          userId: this.userId,
          ...deviceInfo,
          ...utmParams,
        }),
      });
      console.log('✅ Session initialized');
    } catch (error) {
      console.error('Error initializing session:', error);
    }
  }

  setUserId(userId: string) {
    this.userId = userId;
    console.log('📊 User ID set:', userId);
  }

  async trackPageView(pageUrl?: string, pageTitle?: string) {
    if (!this.consentGiven) {
      console.log('📊 Skipping page view tracking - no consent');
      return;
    }

    const url = pageUrl || (window.location.pathname + window.location.search);
    const title = pageTitle || document.title;

    // Update duration for previous page
    if (this.currentPage && this.currentPage !== url) {
      await this.updatePageDuration();
    }

    this.currentPage = url;
    this.startTime = Date.now();

    try {
      console.log('📊 Tracking page view:', url);
      await fetch('/api/analytics/track/pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          userId: this.userId,
          pageUrl: url,
          pageTitle: title,
          referrer: document.referrer,
        }),
      });
      console.log('✅ Page view tracked');
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }

  private async updatePageDuration() {
    if (!this.consentGiven || !this.currentPage) return;

    const duration = Math.floor((Date.now() - this.startTime) / 1000);

    try {
      console.log('📊 Updating page duration:', duration, 'seconds');
      // Note: We don't have a PUT endpoint for this yet, so this will fail silently
      // You can implement this later if needed
    } catch (error) {
      console.error('Error updating page duration:', error);
    }
  }

  async trackEvent(
    eventType: string,
    eventCategory?: string,
    eventLabel?: string,
    eventValue?: any
  ) {
    if (!this.consentGiven) return;

    try {
      console.log('📊 Tracking event:', eventType, eventCategory, eventLabel);
      await fetch('/api/analytics/track/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          userId: this.userId,
          eventType,
          eventCategory,
          eventLabel,
          eventValue,
        }),
      });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  async trackTourInterest(tourId: number, interactionType: string, interestScore: number = 1) {
    if (!this.consentGiven && !this.marketingConsentGiven) return;

    try {
      console.log('📊 Tracking tour interest:', tourId, interactionType);
      await fetch('/api/analytics/track/tour-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          userId: this.userId,
          tourId,
          interactionType,
          interestScore,
        }),
      });
    } catch (error) {
      console.error('Error tracking tour interest:', error);
    }
  }

  async trackSearch(searchTerm: string, resultsCount: number, filters?: any) {
    if (!this.consentGiven) return;

    try {
      console.log('📊 Tracking search:', searchTerm);
      await fetch('/api/analytics/track/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          userId: this.userId,
          searchTerm,
          resultsCount,
          filtersApplied: filters,
        }),
      });
    } catch (error) {
      console.error('Error tracking search:', error);
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
      setCookieConsent: async () => {},
    } as any;
  }

  if (!tracker) {
    tracker = new AnalyticsTracker();
  }
  return tracker;
}

export default AnalyticsTracker;
