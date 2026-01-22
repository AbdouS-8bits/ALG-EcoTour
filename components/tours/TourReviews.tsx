'use client';
// UPDATED: 2026-01-22 - Fixed fetch syntax
import { useState, useEffect } from 'react';
import { Star, MessageSquare, User, Send, ThumbsUp, Flag, Edit, Trash2, X, Check } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { ReviewWithUser } from '@/lib/reviews';

interface TourReviewsProps {
  tourId: number;
  tourTitle: string;
}

interface ReviewMessage {
  id: number;
  reviewId: number;
  userId: number;
  message: string;
  createdAt: string;
  user: {
    id: number;
    name: string | null;
    email: string;
  };
}

export default function TourReviews({ tourId, tourTitle }: TourReviewsProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: '',
  });

  // Messaging state
  const [activeReviewMessages, setActiveReviewMessages] = useState<number | null>(null);
  const [messages, setMessages] = useState<Record<number, ReviewMessage[]>>({});
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // Editing state
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ rating: 5, comment: '' });

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reviews?tourId=${tourId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [tourId]);

  const fetchMessages = async (reviewId: number) => {
    try {
      // FIXED: Using parentheses with template literal, not backticks
      const response = await fetch(`/api/reviews/${reviewId}/messages`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(prev => ({ ...prev, [reviewId]: data }));
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reviewData.comment.trim()) {
      setError('Please enter a review comment');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: reviewData.rating,
          comment: reviewData.comment,
          tourId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      const newReview = await response.json();
      setReviews(prev => [newReview, ...prev]);
      setReviewData({ rating: 5, comment: '' });
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      setError((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = async (reviewId: number) => {
    if (!editData.comment.trim()) {
      setError('Please enter a review comment');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: editData.rating,
          comment: editData.comment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update review');
      }

      const updatedReview = await response.json();
      setReviews(prev => prev.map(r => r.id === reviewId ? updatedReview : r));
      setEditingReviewId(null);
    } catch (error) {
      console.error('Error updating review:', error);
      setError((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
      setError((error as Error).message);
    }
  };

  const handleSendMessage = async (reviewId: number) => {
    if (!newMessage.trim()) return;

    setSendingMessage(true);
    try {
      const response = await fetch(`/api/reviews/${reviewId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const message = await response.json();
      setMessages(prev => ({
        ...prev,
        [reviewId]: [...(prev[reviewId] || []), message]
      }));
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleLikeReview = async (reviewId: number) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/like`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error('Error liking review:', error);
    }
  };

  const handleHelpfulReview = async (reviewId: number) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error('Error marking as helpful:', error);
    }
  };

  const handleReportReview = async (reviewId: number) => {
    const reason = prompt('Please provide a reason for reporting this review:');
    if (!reason) return;

    try {
      const response = await fetch(`/api/reviews/${reviewId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      
      if (response.ok) {
        alert('Review reported successfully. Thank you for your feedback.');
      }
    } catch (error) {
      console.error('Error reporting review:', error);
    }
  };

  const toggleMessages = (reviewId: number) => {
    if (activeReviewMessages === reviewId) {
      setActiveReviewMessages(null);
    } else {
      setActiveReviewMessages(reviewId);
      if (!messages[reviewId]) {
        fetchMessages(reviewId);
      }
    }
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const renderStars = (rating: number, size = 'small', interactive = false, onRatingChange?: (rating: number) => void) => {
    const sizeClass = size === 'small' ? 'w-4 h-4' : 'w-5 h-5';
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            disabled={!interactive}
            className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}
          >
            <Star
              className={`${sizeClass} ${
                star <= rating 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              } transition-colors`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews & Ratings</h2>

      {/* Rating Summary */}
      <div className="mb-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-4">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex items-center gap-1 justify-center mb-2">
              {renderStars(Math.round(averageRating), 'large')}
            </div>
            <div className="text-sm text-gray-600">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </div>
          </div>
          
          <div className="flex-1 w-full">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm text-gray-700 font-medium">{rating}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${reviews.length > 0 ? (ratingDistribution[rating] || 0) / reviews.length * 100 : 0}%`
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-10 text-right font-medium">
                  {ratingDistribution[rating] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Review Button */}
      {session && (
        <div className="mb-6">
          {!showReviewForm ? (
            <button
              onClick={() => setShowReviewForm(true)}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
            >
              <MessageSquare className="w-5 h-5" />
              Write a Review
            </button>
          ) : (
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-6 border-2 border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Share Your Experience
              </h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {renderStars(reviewData.rating, 'large', true, (rating) => setReviewData(prev => ({ ...prev, rating })))}
                    <span className="text-sm text-gray-600 ml-2">
                      {reviewData.rating} out of 5
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Share your experience with this tour..."
                    minLength={10}
                    maxLength={1000}
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    {reviewData.comment.length}/1000 characters
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewForm(false);
                      setReviewData({ rating: 5, comment: '' });
                      setError('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No reviews yet. Be the first to review this tour!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              {editingReviewId === review.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {renderStars(editData.rating, 'large', true, (rating) => setEditData(prev => ({ ...prev, rating })))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={editData.comment}
                      onChange={(e) => setEditData(prev => ({ ...prev, comment: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditingReviewId(null)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={() => handleEditReview(review.id)}
                      disabled={submitting}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      {submitting ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {review.user.name?.[0]?.toUpperCase() || review.user.email[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {review.user.name || 'Anonymous'}
                          </h4>
                          <p className="text-sm text-gray-600">{review.user.email}</p>
                        </div>
                        <div className="text-right">
                          {renderStars(review.rating)}
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {review.comment}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-4 flex-wrap">
                        {session && (
                          <>
                            <button
                              onClick={() => handleLikeReview(review.id)}
                              className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                            >
                              <ThumbsUp className="w-4 h-4" />
                              <span>{review.likes || 0}</span>
                            </button>
                            <button
                              onClick={() => handleHelpfulReview(review.id)}
                              className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                              <span>Helpful ({review.helpful || 0})</span>
                            </button>
                            <button
                              onClick={() => toggleMessages(review.id)}
                              className="flex items-center gap-1 text-sm text-gray-600 hover:text-purple-600 transition-colors"
                            >
                              <MessageSquare className="w-4 h-4" />
                              <span>Comments ({review._count?.messages || 0})</span>
                            </button>

                            {session.user.id === review.userId.toString() && (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingReviewId(review.id);
                                    setEditData({ rating: review.rating, comment: review.comment || '' });
                                  }}
                                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteReview(review.id)}
                                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </>
                            )}

                            {session.user.id !== review.userId.toString() && (
                              <button
                                onClick={() => handleReportReview(review.id)}
                                className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                              >
                                <Flag className="w-4 h-4" />
                                Report
                              </button>
                            )}
                          </>
                        )}
                      </div>

                      {/* Messages Section */}
                      {activeReviewMessages === review.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h5 className="font-medium text-gray-900 mb-3">Comments</h5>
                          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                            {messages[review.id]?.map((msg) => (
                              <div key={msg.id} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                                    {msg.user.name?.[0]?.toUpperCase() || msg.user.email[0].toUpperCase()}
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">
                                    {msg.user.name || msg.user.email}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(msg.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 ml-8">{msg.message}</p>
                              </div>
                            ))}
                          </div>

                          {session && (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Write a comment..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSendMessage(review.id);
                                  }
                                }}
                              />
                              <button
                                onClick={() => handleSendMessage(review.id)}
                                disabled={sendingMessage || !newMessage.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
