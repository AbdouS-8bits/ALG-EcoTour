import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { toggleReviewLike } from '@/lib/reviews';

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
    const review = await toggleReviewLike(reviewId);

    return NextResponse.json(review);
  } catch (error) {
    console.error('Like review error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to like review' },
      { status: 500 }
    );
  }
}
