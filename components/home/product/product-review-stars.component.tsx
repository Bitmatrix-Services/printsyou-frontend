'use client';

import React, {FC, useEffect, useState} from 'react';
import axios from 'axios';

interface ProductReviewStarsProps {
  googleReviewCategory: string;
  scrollToReviews?: () => void;
}

interface ReviewStats {
  reviewCount: number;
  averageRating: number;
}

/**
 * ProductReviewStars
 * ==================
 * Displays a star rating row below the product title.
 * Shows 5 gold stars with review count that scrolls to the review section.
 */
export const ProductReviewStars: FC<ProductReviewStarsProps> = ({
  googleReviewCategory,
  scrollToReviews
}) => {
  const [stats, setStats] = useState<ReviewStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/google-reviews/category/${googleReviewCategory}/stats`
        );
        if (response.data?.payload) {
          setStats(response.data.payload);
        }
      } catch (error) {
        console.error('Failed to fetch review stats:', error);
      }
    };

    if (googleReviewCategory) {
      fetchStats();
    }
  }, [googleReviewCategory]);

  // Don't render if no reviews
  if (!stats || stats.reviewCount === 0) {
    return null;
  }

  const rating = stats.averageRating || 5;
  const count = stats.reviewCount || 0;

  const handleClick = () => {
    if (scrollToReviews) {
      scrollToReviews();
    } else {
      // Fallback: scroll to reviews section by ID
      const reviewsSection = document.getElementById('google-reviews-section');
      if (reviewsSection) {
        reviewsSection.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 group hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-none p-0"
      aria-label={`${rating.toFixed(1)} out of 5 stars from ${count} reviews. Click to view reviews.`}
    >
      {/* Star Rating */}
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Rating Text */}
      <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">
        <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
        {' '}
        <span className="text-gray-500">
          ({count} Customer Review{count !== 1 ? 's' : ''})
        </span>
      </span>

      {/* Small down arrow indicator */}
      <svg
        className="w-3 h-3 text-gray-400 group-hover:text-primary transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
};

export default ProductReviewStars;
