'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getTracker } from '@/lib/analytics-tracker';

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const tracker = getTracker();

  useEffect(() => {
    // Track page view on route change
    tracker.trackPageView();
  }, [pathname, tracker]);

  return <>{children}</>;
}
