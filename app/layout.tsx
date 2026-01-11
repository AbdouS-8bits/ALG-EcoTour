import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "./providers";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Link from "next/link";
import CookieConsentBanner from '@/components/CookieConsentBanner';
import { AnalyticsProvider } from '@/components/AnalyticsProvider';
   


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ALG EcoTour",
  description: "Sustainable eco tours and local experiences",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
        <AnalyticsProvider>
          <SessionProvider>
            <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">
              
              <a href="#main" className="sr-only focus:not-sr-only p-2">
                Skip to content
              </a>

              <Navbar />

              <main id="main" className="flex-1">
                {children}
              </main>

              <Footer />
            </div>

            <CookieConsentBanner />
          </SessionProvider>
        </AnalyticsProvider>

      </body>
    </html>
  );
}
