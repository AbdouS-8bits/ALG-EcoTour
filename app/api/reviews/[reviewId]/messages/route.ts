import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getReviewMessages, createReviewMessage } from '@/lib/reviews';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const { reviewId: reviewIdStr } = await params;
    const reviewId = parseInt(reviewIdStr);
    const messages = await getReviewMessages(reviewId);

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Get review messages error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { reviewId: reviewIdStr } = await params;
    const reviewId = parseInt(reviewIdStr);
    
    // Get user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { message } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (message.length > 500) {
      return NextResponse.json(
        { error: 'Message too long (max 500 characters)' },
        { status: 400 }
      );
    }

    const reviewMessage = await createReviewMessage(reviewId, user.id, message);

    return NextResponse.json(reviewMessage, { status: 201 });
  } catch (error) {
    console.error('Create review message error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to create message' },
      { status: 500 }
    );
  }
}
