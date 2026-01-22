import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { reportReview } from '@/lib/reviews';

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
    const body = await request.json();
    const { reason } = body;

    if (!reason || !reason.trim()) {
      return NextResponse.json(
        { error: 'Report reason is required' },
        { status: 400 }
      );
    }

    const review = await reportReview(reviewId);

    // Log the report for admin review
    console.log(`🚩 Review ${reviewId} reported by ${session.user.email}. Reason: ${reason}`);

    return NextResponse.json({ 
      message: 'Review reported successfully. Thank you for helping keep our community safe.',
      review 
    });
  } catch (error) {
    console.error('Report review error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to report review' },
      { status: 500 }
    );
  }
}
