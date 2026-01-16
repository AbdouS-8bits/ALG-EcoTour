import { NextRequest, NextResponse } from 'next/server';

// Redirect from /api/auth/register to /api/auth/signup
export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL('/api/auth/signup', request.url));
}

export async function POST(request: NextRequest) {
  return NextResponse.redirect(new URL('/api/auth/signup', request.url));
}

export async function PUT(request: NextRequest) {
  return NextResponse.redirect(new URL('/api/auth/signup', request.url));
}

export async function DELETE(request: NextRequest) {
  return NextResponse.redirect(new URL('/api/auth/signup', request.url));
}

export async function PATCH(request: NextRequest) {
  return NextResponse.redirect(new URL('/api/auth/signup', request.url));
}
