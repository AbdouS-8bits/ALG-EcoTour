import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getTourReviews, createReview } from '@/lib/reviews';
import { reviewCreateSchema, validateRequest } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tourId = searchParams.get('tourId');

    if (!tourId) {
      return NextResponse.json(
        { error: 'Tour ID is required' },
        { status: 400 }
      );
    }

    const reviews = await getTourReviews(parseInt(tourId));

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validation = validateRequest(reviewCreateSchema, body);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { rating, comment, tourId } = validation.data;

    // Get user ID from session
    const userId = parseInt(session.user.id);

    const review = await createReview({
      rating,
      comment,
      tourId,
      userId,
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Failed to create review', details: (error as Error).message },
      { status: 500 }
    );
  }
}
