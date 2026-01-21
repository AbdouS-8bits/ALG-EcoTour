'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Star, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface RatingStarsProps {
  tourId: string;
  tourTitle: string;
  initialRating?: number;
  totalRatings?: number;
  averageRating?: number;
  size?: 'small' | 'medium' | 'large';
  showStats?: boolean;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  className?: string;
}

interface RatingDistribution {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export default function RatingStars({ 
  tourId, 
  tourTitle,
  initialRating = 0,
  totalRatings = 0,
  averageRating = 0,
  size = 'medium',
  showStats = true,
  interactive = true,
  onRate,
  className = ""
}: RatingStarsProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  const containerSizeClasses = {
    small: 'gap-1',
    medium: 'gap-2',
    large: 'gap-3'
  };

  // Mock rating distribution
  const distribution: RatingDistribution = {
    5: Math.floor(totalRatings * 0.6),
    4: Math.floor(totalRatings * 0.25),
    3: Math.floor(totalRatings * 0.1),
    2: Math.floor(totalRatings * 0.04),
    1: Math.floor(totalRatings * 0.01)
  };

  const submitRating = async (value: number) => {
    if (!session || !interactive || isSubmitting) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setRating(value);
      setShowThankYou(true);
      onRate?.(value);
      
      setTimeout(() => {
        setShowThankYou(false);
        setIsSubmitting(false);
      }, 2000);
    }, 1000);
  };

  const getRatingLabel = (rating: number) => {
    const labels = {
      1: 'سيء جداً',
      2: 'سيء',
      3: 'جيد',
      4: 'جيد جداً',
      5: 'ممتاز'
    };
    return labels[rating as keyof typeof labels] || '';
  };

  const getRatingColor = (rating: number) => {
    const colors = {
      1: 'text-red-500',
      2: 'text-orange-500',
      3: 'text-yellow-500',
      4: 'text-lime-500',
      5: 'text-green-500'
    };
    return colors[rating as keyof typeof colors] || 'text-gray-400';
  };

  const getRatingBgColor = (rating: number) => {
    const colors = {
      1: 'bg-red-100',
      2: 'bg-orange-100',
      3: 'bg-yellow-100',
      4: 'bg-lime-100',
      5: 'bg-green-100'
    };
    return colors[rating as keyof typeof colors] || 'bg-gray-100';
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Star className="w-6 h-6 text-white fill-current" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">قيم هذه الرحلة</h3>
            <p className="text-sm text-gray-600">{tourTitle}</p>
          </div>
        </div>
        
        {showStats && totalRatings > 0 && (
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className={`text-3xl font-bold ${getRatingColor(Math.round(averageRating))}`}>
                {averageRating.toFixed(1)}
              </span>
              <div className="flex flex-col">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(averageRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  {totalRatings} تقييم
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Rating */}
      {interactive && (
        <div className="mb-6">
          {!session ? (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-blue-800 font-medium">سجل دخولك لتقييم هذه الرحلة</p>
            </div>
          ) : showThankYou ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 rounded-xl p-6 text-center"
            >
              <Sparkles className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-green-800 mb-2">شكراً لتقييمك!</h4>
              <p className="text-green-700">رأيك يساعدنا في تحسين خدماتنا</p>
            </motion.div>
          ) : (
            <div className="text-center">
              <div className={`flex items-center justify-center gap-4 mb-4`}>
                <div className={`flex items-center ${containerSizeClasses[size]}`}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => submitRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <Star
                        className={`${sizeClasses[size]} ${
                          (hover || rating) >= star
                            ? `${getRatingColor(hover || rating)} fill-current`
                            : 'text-gray-300'
                        } transition-colors`}
                      />
                    </motion.button>
                  ))}
                </div>
                
                {(hover || rating) > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`px-3 py-1 rounded-full ${getRatingBgColor(hover || rating)} ${getRatingColor(hover || rating)} font-medium`}
                  >
                    {getRatingLabel(hover || rating)}
                  </motion.div>
                )}
              </div>
              
              <p className="text-sm text-gray-600">
                {isSubmitting ? 'جاري حفظ تقييمك...' : 'انقر على النجوم للتقييم'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Rating Distribution */}
      {showStats && totalRatings > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            توزيع التقييمات
          </h4>
          
          {[5, 4, 3, 2, 1].map((ratingValue) => {
            const count = distribution[ratingValue as keyof RatingDistribution];
            const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
            
            return (
              <div key={ratingValue} className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-16">
                  <span className="text-sm font-medium text-gray-700 w-4">
                    {ratingValue}
                  </span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
                
                <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: ratingValue * 0.1 }}
                    className={`h-2 rounded-full ${getRatingBgColor(ratingValue)}`}
                  />
                </div>
                
                <div className="flex items-center gap-2 w-20 text-left">
                  <span className="text-sm text-gray-600">
                    {count}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({percentage.toFixed(0)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* User's Current Rating */}
      {interactive && session && rating > 0 && !showThankYou && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            تقييمك الحالي: 
            <span className={`font-bold ${getRatingColor(rating)} mr-1`}>
              {rating}/5 {getRatingLabel(rating)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
