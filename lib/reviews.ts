import { prisma } from './prisma';

export interface Review {
  id: number;
  rating: number;
  comment: string;
  tourId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: number;
    name: string | null;
    email: string;
  };
}

export interface CreateReviewData {
  rating: number;
  comment: string;
  tourId: number;
  userId: number;
}

export interface ReviewWithUser extends Review {
  user: {
    id: number;
    name: string | null;
    email: string;
  };
}

/**
 * Get reviews for a specific tour
 */
export async function getTourReviews(tourId: number): Promise<ReviewWithUser[]> {
  try {
    const reviews = await prisma.review.findMany({
      where: { tourId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reviews;
  } catch (error) {
    console.error('Error fetching tour reviews:', error);
    throw new Error('Failed to fetch tour reviews');
  }
}

/**
 * Create a new review
 */
export async function createReview(data: CreateReviewData): Promise<ReviewWithUser> {
  try {
    // Validate rating is between 1 and 5
    if (data.rating < 1 || data.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Check if user already reviewed this tour
    const existingReview = await prisma.review.findFirst({
      where: {
        tourId: data.tourId,
        userId: data.userId,
      },
    });

    if (existingReview) {
      throw new Error('You have already reviewed this tour');
    }

    const review = await prisma.review.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return review;
  } catch (error) {
    console.error('Error creating review:', error);
    throw new Error('Failed to create review');
  }
}

/**
 * Get average rating for a tour
 */
export async function getTourAverageRating(tourId: number): Promise<number> {
  try {
    const result = await prisma.review.aggregate({
      where: { tourId },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    return result._avg.rating || 0;
  } catch (error) {
    console.error('Error calculating average rating:', error);
    throw new Error('Failed to calculate average rating');
  }
}

/**
 * Get review count for a tour
 */
export async function getTourReviewCount(tourId: number): Promise<number> {
  try {
    const count = await prisma.review.count({
      where: { tourId },
    });

    return count;
  } catch (error) {
    console.error('Error counting reviews:', error);
    throw new Error('Failed to count reviews');
  }
}

/**
 * Get rating distribution for a tour
 */
export async function getTourRatingDistribution(tourId: number): Promise<Record<number, number>> {
  try {
    const ratings = await prisma.review.groupBy({
      by: ['rating'],
      where: { tourId },
      _count: {
        rating: true,
      },
    });

    const distribution: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    ratings.forEach(rating => {
      distribution[rating.rating] = rating._count.rating;
    });

    return distribution;
  } catch (error) {
    console.error('Error getting rating distribution:', error);
    throw new Error('Failed to get rating distribution');
  }
}

/**
 * Update a review
 */
export async function updateReview(
  reviewId: number,
  userId: number,
  data: Partial<CreateReviewData>
): Promise<ReviewWithUser> {
  try {
    // Check if user owns the review
    const existingReview = await prisma.review.findFirst({
      where: {
        id: reviewId,
        userId: userId,
      },
    });

    if (!existingReview) {
      throw new Error('Review not found or you do not have permission to update it');
    }

    const review = await prisma.review.update({
      where: { id: reviewId },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return review;
  } catch (error) {
    console.error('Error updating review:', error);
    throw new Error('Failed to update review');
  }
}

/**
 * Delete a review
 */
export async function deleteReview(reviewId: number, userId: number): Promise<void> {
  try {
    // Check if user owns the review
    const existingReview = await prisma.review.findFirst({
      where: {
        id: reviewId,
        userId: userId,
      },
    });

    if (!existingReview) {
      throw new Error('Review not found or you do not have permission to delete it');
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    throw new Error('Failed to delete review');
  }
}

/**
 * Get all reviews by a user
 */
export async function getUserReviews(userId: number): Promise<ReviewWithUser[]> {
  try {
    const reviews = await prisma.review.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tour: {
          select: {
            id: true,
            title: true,
            location: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reviews;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    throw new Error('Failed to fetch user reviews');
  }
}
