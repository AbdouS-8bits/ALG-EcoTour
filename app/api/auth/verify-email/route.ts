import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Find user with this token
    const user = await prisma.user.findFirst({
      where: { verificationToken: token }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null, // Clear the token
      },
    });

    console.log('✅ Email verified for:', user.email);

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! You can now login.',
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}

// GET endpoint for email verification via link
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/auth/login?error=invalid_token', request.url));
    }

    // Find user with this token
    const user = await prisma.user.findFirst({
      where: { verificationToken: token }
    });

    if (!user) {
      return NextResponse.redirect(new URL('/auth/login?error=invalid_token', request.url));
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
      },
    });

    console.log('✅ Email verified for:', user.email);

    return NextResponse.redirect(new URL('/auth/login?verified=true', request.url));

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.redirect(new URL('/auth/login?error=verification_failed', request.url));
  }
}
