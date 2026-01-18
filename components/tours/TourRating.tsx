'use client';
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface TourRatingProps {
  tourId: number;
}

export default function TourRating({ tourId }: TourRatingProps) {
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchRating = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reviews?tourId=${tourId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch rating');
      }
      const reviews = await response.json();
      
      // Calculate average rating and count
      const avgRating = reviews.length > 0 
        ? reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / reviews.length 
        : 0;
      
      setAverageRating(avgRating);
      setReviewCount(reviews.length);
    } catch (error) {
      console.error('Error fetching rating:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRating();
  }, [tourId]);

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= averageRating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-gray-600">
        ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
      </span>
    </div>
  );
}
