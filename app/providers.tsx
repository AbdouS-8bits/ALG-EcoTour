'use client';

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { SupportProvider } from "@/app/contexts/SupportContext";
import { ReactNode } from "react";

export default function SessionProvider({ children }: { children: ReactNode }) {
  return (
    <NextAuthSessionProvider
      // Reduce session polling to every 5 minutes instead of default (every page)
      refetchInterval={5 * 60}
      // Only refetch when window regains focus after 5 minutes
      refetchOnWindowFocus={false}
    >
      <SupportProvider>
        {children}
      </SupportProvider>
    </NextAuthSessionProvider>
  );
}
