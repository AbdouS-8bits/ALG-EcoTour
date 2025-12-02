import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "./providers";
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
  title: "ALG EcoTour",
  description: "Sustainable eco tours and local experiences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">
            <a href="#main" className="sr-only focus:not-sr-only p-2">Skip to content</a>

            <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-black/60 backdrop-blur">
              <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="text-lg font-bold">ALG EcoTour</Link>

                <nav className="flex items-center gap-3">
                  <Link href="/tours" className="text-sm px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900">Tours</Link>
                  <Link href="/signup" className="text-sm px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900">Sign Up</Link>
                  <Link href="/admin/login" className="text-sm px-3 py-2 rounded bg-green-600 text-white">Admin</Link>
                </nav>
              </div>
            </header>

            <main id="main" className="flex-1">
              <div className="max-w-6xl mx-auto px-6 py-8">
                {children}
              </div>
            </main>

            <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-black/60">
              <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                  <div>© {new Date().getFullYear()} ALG EcoTour — Built with care.</div>
                  <div className="flex gap-4">
                    <Link href="/terms" className="hover:underline">Terms</Link>
                    <Link href="/privacy" className="hover:underline">Privacy</Link>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
