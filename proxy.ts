import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// In-memory rate limiting store (for demo purposes)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMITS = {
  // Auth endpoints: 20 requests per 15 minutes (increased from 5)
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 20 },
  // General API: 200 requests per 15 minutes (increased from 100)
  general: { windowMs: 15 * 60 * 1000, maxRequests: 200 },
};

// Rate limiting function
function checkRateLimit(
  identifier: string,
  windowMs: number,
  maxRequests: number
): { allowed: boolean; resetTime: number; remaining: number } {
  const now = Date.now();
  
  // Clean up expired entries
  for (const [k, v] of Array.from(rateLimitStore.entries())) {
    if (now > v.resetTime) {
      rateLimitStore.delete(k);
    }
  }
  
  const record = rateLimitStore.get(identifier);
  
  if (!record || now > record.resetTime) {
    // New window or expired window
    const newRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(identifier, newRecord);
    return {
      allowed: true,
      resetTime: newRecord.resetTime,
      remaining: maxRequests - 1,
    };
  }
  
  if (record.count >= maxRequests) {
    return {
      allowed: false,
      resetTime: record.resetTime,
      remaining: 0,
    };
  }
  
  // Increment counter
  record.count += 1;
  rateLimitStore.set(identifier, record);
  return {
    allowed: true,
    resetTime: record.resetTime,
    remaining: maxRequests - record.count,
  };
}

// Get client identifier (IP address)
function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  return ip.trim();
}

// Security headers
function addSecurityHeaders(response: NextResponse): NextResponse {
  // X-Frame-Options: Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  
  // X-Content-Type-Options: Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Referrer-Policy: Control referrer information
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions-Policy: Restrict feature usage
  response.headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  );
  
  // Content-Security-Policy: Basic CSP (conservative for demo)
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.openstreetmap.org https://a.tile.openstreetmap.org https://b.tile.openstreetmap.org https://c.tile.openstreetmap.org; frame-ancestors 'none';"
  );
  
  // X-XSS-Protection: Enable XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Strict-Transport-Security: HTTPS only (in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIp = getClientIdentifier(request);

  // Apply rate limiting to auth endpoints
  if (pathname.startsWith('/api/auth/') || pathname.startsWith('/api/admin/')) {
    const rateLimitResult = checkRateLimit(
      `auth:${clientIp}`,
      RATE_LIMITS.auth.windowMs,
      RATE_LIMITS.auth.maxRequests
    );

    if (!rateLimitResult.allowed) {
      const response = NextResponse.json(
        {
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Please try again later.',
          resetTime: new Date(rateLimitResult.resetTime).toISOString(),
        },
        { status: 429 }
      );
      
      response.headers.set('Retry-After', Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString());
      return addSecurityHeaders(response);
    }
  }

  // Apply rate limiting to general API endpoints
  if (pathname.startsWith('/api/')) {
    const rateLimitResult = checkRateLimit(
      `api:${clientIp}`,
      RATE_LIMITS.general.windowMs,
      RATE_LIMITS.general.maxRequests
    );

    if (!rateLimitResult.allowed) {
      const response = NextResponse.json(
        {
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Please try again later.',
          resetTime: new Date(rateLimitResult.resetTime).toISOString(),
        },
        { status: 429 }
      );
      
      response.headers.set('Retry-After', Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString());
      return addSecurityHeaders(response);
    }
  }

  // Protect admin UI and admin API routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    // If there's no token or user's role isn't admin, redirect them away
    if (!token || token.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      const response = NextResponse.redirect(url);
      return addSecurityHeaders(response);
    }
  }

  // Continue with the request and add security headers
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
