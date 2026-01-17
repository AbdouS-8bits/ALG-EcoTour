import { NextResponse } from 'next/server';
import { prisma, dbConfigured, dbPool } from '@/lib/prisma';

export async function GET() {
  const health = {
    ok: true,
    dbConfigured: false,
    dbReachable: false,
    auth: false,
    cloudinary: false,
    email: false,
    timestamp: new Date().toISOString(),
    dbError: null as string | null,
  };

  try {
    // Check database configuration
    health.dbConfigured = dbConfigured;

    // Check database connectivity
    try {
      if (dbPool) {
        // Test pool connection directly
        await dbPool.query('SELECT 1');
        health.dbReachable = true;
        health.dbError = null;
      } else {
        // Fallback to prisma client
        await prisma.$queryRaw`SELECT 1`;
        health.dbReachable = true;
        health.dbError = null;
      }
    } catch (dbError) {
      console.error('Database health check failed:', dbError);
      health.dbReachable = false;
      // Provide safe error message without exposing secrets
      if (dbError instanceof Error) {
        if (dbError.message.includes('password authentication failed')) {
          health.dbError = 'Database authentication failed';
        } else if (dbError.message.includes('connection refused')) {
          health.dbError = 'Database connection refused';
        } else if (dbError.message.includes('database') && dbError.message.includes('does not exist')) {
          health.dbError = 'Database does not exist';
        } else if (dbError.message.includes('ENOTFOUND') || dbError.message.includes('getaddrinfo')) {
          health.dbError = 'Database host not found';
        } else {
          health.dbError = 'Database connection error';
        }
      } else {
        health.dbError = 'Unknown database error';
      }
    }

    // Check NextAuth configuration
    if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_URL) {
      health.auth = true;
    }

    // Check Cloudinary configuration
    if (process.env.CLOUDINARY_CLOUD_NAME && 
        process.env.CLOUDINARY_API_KEY && 
        process.env.CLOUDINARY_API_SECRET) {
      health.cloudinary = true;
    }

    // Check Email configuration
    if (process.env.EMAIL_HOST && 
        process.env.EMAIL_USER && 
        process.env.EMAIL_PASSWORD) {
      health.email = true;
    }

    // Overall health is true if critical services (db, auth) are working
    health.ok = health.dbConfigured && health.dbReachable && health.auth;

    return NextResponse.json(health);
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      ...health,
      ok: false,
      error: 'Health check failed'
    }, { status: 500 });
  } finally {
    // Only disconnect if we have a prisma client
    if (prisma && typeof prisma.$disconnect === 'function') {
      try {
        await prisma.$disconnect();
      } catch (disconnectError) {
        console.error('Error disconnecting from database:', disconnectError);
      }
    }
  }
}
