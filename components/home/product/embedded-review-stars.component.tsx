'use client';

import React, {FC, useMemo} from 'react';
import {EmbeddedReview} from '@components/home/product/product.types';

interface EmbeddedReviewStarsProps {
  reviews: EmbeddedReview[];
}

/**
 * EmbeddedReviewStars
 * ===================
 * Compact star rating display that appears below the product title.
 * Shows 5 gold stars with average rating and review count.
 * Clicking smoothly scrolls to the #reviews-section.
 */
export const EmbeddedReviewStars: FC<EmbeddedReviewStarsProps> = ({reviews}) => {
  // Filter active reviews and calculate stats
  const {avgRating, reviewCount} = useMemo(() => {
    const activeReviews = reviews.filter(r => r.isActive !== false);
    if (activeReviews.length === 0) {
      return {avgRating: 0, reviewCount: 0};
    }
    const total = activeReviews.reduce((sum, r) => sum + r.rating, 0);
    return {
      avgRating: total / activeReviews.length,
      reviewCount: activeReviews.length
    };
  }, [reviews]);

  // Don't render if no reviews
  if (reviewCount === 0) {
    return null;
  }

  const handleClick = () => {
    const reviewsSection = document.getElementById('reviews-section');
    if (reviewsSection) {
      reviewsSection.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 group hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-none p-0"
      aria-label={`${avgRating.toFixed(1)} out of 5 stars from ${reviewCount} reviews. Click to view reviews.`}
    >
      {/* 5 Gold Stars */}
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= Math.round(avgRating) ? 'text-amber-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Rating Text */}
      <span className="text-sm text-gray-600 group-hover:text-primary-500 transition-colors">
        <span className="font-semibold text-gray-900">{avgRating.toFixed(1)}</span>
        {' '}
        <span className="text-gray-500">
          ({reviewCount} Review{reviewCount !== 1 ? 's' : ''})
        </span>
      </span>

      {/* Small down arrow indicator */}
      <svg
        className="w-3 h-3 text-gray-400 group-hover:text-primary-500 transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
};

export default EmbeddedReviewStars;
