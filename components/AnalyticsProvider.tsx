'use client';

import { useEffect } from 'react';
import { usePageTracking } from '@/hooks/useAnalytics';

export function AnalyticsProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // Automatically track page views on route changes
  usePageTracking();

  return <>{children}</>;
}
