'use client';
import React, {FC, useEffect, useState} from 'react';
import {FaStar, FaStarHalfAlt, FaRegStar} from 'react-icons/fa';
import {ReviewRoutes} from '@utils/routes/be-routes';

interface Review {
  id: string;
  reviewerName: string;
  companyName?: string;
  rating: number;
  createdAt: string;
  comment: string;
  verifiedBuyer: boolean;
}

interface CustomerReviewsProps {
  productId?: string;
  reviews?: Review[];
  averageRating?: number;
  totalReviews?: number;
}


const StarRating: FC<{rating: number; size?: 'sm' | 'md'}> = ({rating, size = 'md'}) => {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className={`${sizeClass} text-yellow-400`} />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className={`${sizeClass} text-yellow-400`} />);
    } else {
      stars.push(<FaRegStar key={i} className={`${sizeClass} text-gray-300`} />);
    }
  }

  return <div className="flex gap-0.5">{stars}</div>;
};

export const CustomerReviews: FC<CustomerReviewsProps> = ({
  productId,
  reviews: propReviews,
  averageRating: propAvgRating,
  totalReviews: propTotalReviews
}) => {
  const [reviews, setReviews] = useState<Review[]>(propReviews || []);
  const [averageRating, setAverageRating] = useState(propAvgRating || 0);
  const [totalReviews, setTotalReviews] = useState(propTotalReviews || 0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      setIsLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${ReviewRoutes.productReviews}/${productId}`)
        .then(res => res.json())
        .then(data => {
          // Handle both direct array and wrapped response
          const reviewData = Array.isArray(data) ? data : (data.payload || data.content || []);
          setReviews(reviewData);
          if (reviewData.length > 0) {
            const avgRating = reviewData.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviewData.length;
            setAverageRating(Math.round(avgRating * 10) / 10);
            setTotalReviews(reviewData.length);
          }
        })
        .catch(err => console.error('Error fetching reviews:', err))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [productId]);
  // Don't render if no reviews and not loading
  if (!isLoading && reviews.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Customer Reviews</h2>
        <button className="text-primary hover:underline text-sm font-medium">Write a Review</button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading reviews...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Rating Summary */}
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-4xl font-bold text-gray-900">{averageRating}</div>
            <div className="flex justify-center my-2">
              <StarRating rating={averageRating} />
            </div>
            <div className="text-sm text-gray-500">Based on {totalReviews} reviews</div>
          </div>

          {/* Reviews List */}
          <div className="md:col-span-2 space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                      {review.reviewerName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {review.reviewerName}
                        {review.companyName && ` - ${review.companyName}`}
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {review.verifiedBuyer && 'Verified Buyer \u2022 '}
                    {new Date(review.createdAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">&quot;{review.comment}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
