import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "./providers";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnalyticsProvider from "../components/AnalyticsProvider";
import CookieConsentBanner from "../components/CookieConsentBanner";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ALG EcoTour - Sustainable Eco Tourism in Algeria",
    template: "%s | ALG EcoTour"
  },
  description: "Discover sustainable eco tours and authentic local experiences across Algeria. Book guided tours, desert adventures, and cultural experiences with expert local guides.",
  keywords: ["eco tourism", "Algeria", "sustainable travel", "desert tours", "cultural experiences", "local guides", "adventure travel"],
  authors: [{ name: "ALG EcoTour Team" }],
  creator: "ALG EcoTour",
  publisher: "ALG EcoTour",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'),
  alternates: {
    canonical: './',
    languages: {
      'en': './en',
      'ar': './ar'
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000',
    title: 'ALG EcoTour - Sustainable Eco Tourism in Algeria',
    description: 'Discover sustainable eco tours and authentic local experiences across Algeria. Book guided tours, desert adventures, and cultural experiences with expert local guides.',
    siteName: 'ALG EcoTour',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ALG EcoTour - Sustainable Tourism in Algeria',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ALG EcoTour - Sustainable Eco Tourism in Algeria',
    description: 'Discover sustainable eco tours and authentic local experiences across Algeria. Book guided tours, desert adventures, and cultural experiences.',
    images: ['/images/og-image.jpg'],
    creator: '@algecotour',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        <SessionProvider>
          <AnalyticsProvider>
            <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">
              <a href="#main" className="sr-only focus:not-sr-only p-2">Skip to content</a>

              <Navbar />

              <main id="main" className="flex-1">
                {children}
              </main>

              <Footer />
            </div>

            <CookieConsentBanner />
          </AnalyticsProvider>
        </SessionProvider>

      </body>
    </html>
  );
}
