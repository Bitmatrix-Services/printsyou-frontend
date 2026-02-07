'use client';
import React, {FC, useEffect, useState} from 'react';
import {FaStar, FaGoogle} from 'react-icons/fa';

interface CategoryReview {
  id: string;
  reviewerName: string;
  rating: number;
  reviewText: string;
  reviewDate: string | null;
  googleReviewUrl: string | null;
  reviewerPhotoUrl: string | null;
}

interface CategoryReviewSummary {
  reviews: CategoryReview[];
  averageRating: number;
  totalReviews: number;
}

interface CategoryReviewsProps {
  categoryId: string;
}

const StarRating: FC<{rating: number}> = ({rating}) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <FaStar
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
        />
      ))}
    </div>
  );
};

export const CategoryReviews: FC<CategoryReviewsProps> = ({categoryId}) => {
  const [data, setData] = useState<CategoryReviewSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;

    setIsLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/${categoryId}/reviews`)
      .then(res => res.json())
      .then(response => {
        const summary = response.payload || response;
        if (summary && summary.reviews && summary.reviews.length > 0) {
          setData(summary);
        }
      })
      .catch(err => console.error('Error fetching category reviews:', err))
      .finally(() => setIsLoading(false));
  }, [categoryId]);

  // Don't render if no reviews
  if (isLoading || !data || data.reviews.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 p-6 md:p-8 my-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <FaGoogle className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
            <p className="text-sm text-gray-500">From Google Business Profile</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-gray-900">{data.averageRating}</span>
            <div>
              <StarRating rating={Math.round(data.averageRating)} />
              <p className="text-xs text-gray-500 mt-0.5">{data.totalReviews} reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.reviews.map(review => (
          <div
            key={review.id}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            {/* Reviewer Info */}
            <div className="flex items-center gap-3 mb-3">
              {review.reviewerPhotoUrl ? (
                <img
                  src={review.reviewerPhotoUrl}
                  alt={review.reviewerName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {review.reviewerName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{review.reviewerName}</p>
                <StarRating rating={review.rating} />
              </div>
            </div>

            {/* Review Text */}
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
              "{review.reviewText}"
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              {review.reviewDate && (
                <span className="text-xs text-gray-400">
                  {new Date(review.reviewDate).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              )}
              {review.googleReviewUrl && (
                <a
                  href={review.googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:text-blue-600 font-medium"
                >
                  View on Google
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Google Badge */}
      <div className="flex items-center justify-center mt-6 pt-4 border-t border-blue-100">
        <a
          href="https://g.page/r/printsyou/review"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          <FaGoogle className="w-4 h-4" />
          <span>Leave us a review on Google</span>
        </a>
      </div>
    </div>
  );
};
