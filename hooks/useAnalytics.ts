'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { getTracker } from '@/lib/analytics-tracker';

// Hook to automatically track page views
export function usePageTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tracker = getTracker();

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    tracker.trackPageView(url);
  }, [pathname, searchParams]);
}

// Hook to track tour interest
export function useTourTracking(tourId: number | null) {
  const tracker = getTracker();

  useEffect(() => {
    if (tourId) {
      tracker.trackTourInterest(tourId, 'view');
    }
  }, [tourId]);

  return {
    trackClick: () => tourId && tracker.trackTourInterest(tourId, 'click'),
    trackDetails: () => tourId && tracker.trackTourInterest(tourId, 'details_view'),
    trackSave: () => tourId && tracker.trackTourInterest(tourId, 'save'),
    trackShare: () => tourId && tracker.trackTourInterest(tourId, 'share'),
    trackBookAttempt: () => tourId && tracker.trackTourInterest(tourId, 'book_attempt'),
    trackBookComplete: () => tourId && tracker.trackTourInterest(tourId, 'booking_complete'),
  };
}

// Hook to track events
export function useEventTracking() {
  const tracker = getTracker();

  return {
    trackClick: (category: string, label: string, value?: any) => 
      tracker.trackEvent('click', category, label, value),
    trackSubmit: (category: string, label: string, value?: any) => 
      tracker.trackEvent('submit', category, label, value),
    trackScroll: (category: string, label: string, value?: any) => 
      tracker.trackEvent('scroll', category, label, value),
    trackCustom: (type: string, category: string, label: string, value?: any) => 
      tracker.trackEvent(type, category, label, value),
  };
}

// Hook to track conversion funnel
export function useConversionTracking(tourId: number | null) {
  const tracker = getTracker();

  return {
    trackView: () => tourId && tracker.trackFunnelStep(tourId, 'tour_view', 1, true),
    trackDetails: () => tourId && tracker.trackFunnelStep(tourId, 'details_view', 2, true),
    trackBookingForm: () => tourId && tracker.trackFunnelStep(tourId, 'booking_form', 3, true),
    trackCheckout: () => tourId && tracker.trackFunnelStep(tourId, 'checkout', 4, true),
    trackComplete: () => tourId && tracker.trackFunnelStep(tourId, 'booking_complete', 5, true),
  };
}

// Hook to track search
export function useSearchTracking() {
  const tracker = getTracker();

  return {
    trackSearch: (term: string, filters?: any, resultsCount?: number) => 
      tracker.trackSearch(term, filters, resultsCount),
    trackSearchClick: (term: string, filters: any, resultsCount: number, clickedId: number) => 
      tracker.trackSearch(term, filters, resultsCount, clickedId),
  };
}

// Example usage in components:

/*
// Automatic page tracking
'use client';
import { usePageTracking } from '@/hooks/useAnalytics';

export default function Page() {
  usePageTracking(); // Automatically tracks page views on route change
  return <div>Your page content</div>;
}

// Track tour interest
import { useTourTracking } from '@/hooks/useAnalytics';

function TourDetails({ tourId }) {
  const { trackClick, trackSave, trackBookAttempt } = useTourTracking(tourId);

  return (
    <div>
      <button onClick={trackClick}>View Details</button>
      <button onClick={trackSave}>Save Tour</button>
      <button onClick={trackBookAttempt}>Book Now</button>
    </div>
  );
}

// Track button clicks
import { useEventTracking } from '@/hooks/useAnalytics';

function SignupForm() {
  const { trackClick, trackSubmit } = useEventTracking();

  return (
    <form onSubmit={() => trackSubmit('form', 'signup_form')}>
      <button 
        type="button"
        onClick={() => trackClick('button', 'signup_cta')}
      >
        Sign Up
      </button>
    </form>
  );
}

// Track conversion funnel
import { useConversionTracking } from '@/hooks/useAnalytics';

function BookingFlow({ tourId }) {
  const { trackView, trackDetails, trackBookingForm, trackCheckout, trackComplete } = 
    useConversionTracking(tourId);

  useEffect(() => {
    trackView(); // Track when user enters booking flow
  }, []);

  const handleProceedToBooking = () => {
    trackBookingForm();
    // navigate to booking form
  };

  const handleCheckout = () => {
    trackCheckout();
    // navigate to checkout
  };

  const handleComplete = () => {
    trackComplete();
    // show confirmation
  };

  return <div>Booking flow</div>;
}

// Track search
import { useSearchTracking } from '@/hooks/useAnalytics';

function SearchBar() {
  const { trackSearch, trackSearchClick } = useSearchTracking();

  const handleSearch = async (term: string, filters: any) => {
    const results = await searchTours(term, filters);
    trackSearch(term, filters, results.length);
  };

  const handleResultClick = (term: string, filters: any, totalResults: number, clickedId: number) => {
    trackSearchClick(term, filters, totalResults, clickedId);
  };

  return <div>Search component</div>;
}
*/
