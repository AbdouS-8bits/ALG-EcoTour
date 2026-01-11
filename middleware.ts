import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
/*
  // Protect admin UI and admin API routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // If there's no token or the user's role isn't admin, redirect them away
    if (!token || token.role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }*/

  return NextResponse.next();
}

export const config = {
  //matcher: ["/admin/:path*", "/api/admin/:path*"],
};

// Provide a `proxy` export for Next.js versions that expect the new proxy convention
// (keeps backward compatibility with the older `middleware` usage).
export const proxy = middleware;
