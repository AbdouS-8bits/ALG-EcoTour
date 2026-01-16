'use client';

import { useEffect } from 'react';

export function AnalyticsProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // Analytics provider - simplified for now
  // TODO: Implement page tracking with new analytics system
  
  return <>{children}</>;
}
