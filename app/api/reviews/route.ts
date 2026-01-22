import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getTourReviews, createReview } from '@/lib/reviews';
import { reviewCreateSchema, validateRequest } from '@/lib/validation';
import { prisma } from '@/lib/prisma';

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
    
    console.log('📝 Review creation attempt - Session:', JSON.stringify(session, null, 2));
    
    if (!session?.user?.email) {
      console.log('❌ No session or user email found');
      return NextResponse.json(
        { error: 'Authentication required. Please log in to write a review.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('📝 Request body:', body);
    
    // Validate input
    const validation = validateRequest(reviewCreateSchema, body);
    if (!validation.success) {
      console.error('❌ Validation error:', validation.error);
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { rating, comment, tourId } = validation.data;

    // Get user by email since we need the numeric ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, name: true }
    });

    if (!user) {
      console.error('❌ User not found in database:', session.user.email);
      return NextResponse.json(
        { error: 'User not found. Please log in again.' },
        { status: 404 }
      );
    }

    console.log('✅ User found:', user.id, user.email);

    // Check if tour exists
    const tour = await prisma.ecoTour.findUnique({
      where: { id: tourId }
    });

    if (!tour) {
      console.error('❌ Tour not found:', tourId);
      return NextResponse.json(
        { error: 'Tour not found' },
        { status: 404 }
      );
    }

    console.log('✅ Tour found:', tour.id, tour.title);

    // Create the review
    const review = await createReview({
      rating,
      comment,
      tourId,
      userId: user.id,
    });

    console.log('✅ Review created successfully:', review.id);

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('❌ Create review error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('already reviewed')) {
        return NextResponse.json(
          { error: 'You have already reviewed this tour' },
          { status: 409 }
        );
      }
      
      if (error.message.includes('Rating must be between 1 and 5')) {
        return NextResponse.json(
          { error: 'Rating must be between 1 and 5' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
