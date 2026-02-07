'use client';
import React, {FC, useEffect, useState} from 'react';
import {FaStar, FaStarHalfAlt, FaRegStar, FaQuoteLeft} from 'react-icons/fa';
import {SiGoogle} from 'react-icons/si';

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

const StarRating: FC<{rating: number; size?: 'sm' | 'md' | 'lg'}> = ({rating, size = 'md'}) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => {
        if (star <= Math.floor(rating)) {
          return <FaStar key={star} className={`${sizeClasses[size]} text-amber-400`} />;
        } else if (star === Math.ceil(rating) && rating % 1 !== 0) {
          return <FaStarHalfAlt key={star} className={`${sizeClasses[size]} text-amber-400`} />;
        }
        return <FaRegStar key={star} className={`${sizeClasses[size]} text-amber-400`} />;
      })}
    </div>
  );
};

const ReviewCard: FC<{review: CategoryReview}> = ({review}) => {
  const initials = review.reviewerName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const colors = [
    'from-blue-500 to-blue-600',
    'from-emerald-500 to-emerald-600',
    'from-violet-500 to-violet-600',
    'from-rose-500 to-rose-600',
    'from-amber-500 to-amber-600'
  ];
  const colorIndex = review.reviewerName.charCodeAt(0) % colors.length;

  return (
    <div className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300">
      {/* Quote icon */}
      <FaQuoteLeft className="absolute top-4 right-4 w-8 h-8 text-gray-100 group-hover:text-blue-50 transition-colors" />

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {review.reviewerPhotoUrl ? (
          <img
            src={review.reviewerPhotoUrl}
            alt={review.reviewerName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
          />
        ) : (
          <div
            className={`w-12 h-12 bg-gradient-to-br ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md`}
          >
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{review.reviewerName}</h4>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={review.rating} size="sm" />
            {review.reviewDate && (
              <span className="text-xs text-gray-400">
                {new Date(review.reviewDate).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Review text */}
      <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 mb-4">{review.reviewText}</p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <SiGoogle className="w-3.5 h-3.5" />
          <span>Google Review</span>
        </div>
        {review.googleReviewUrl && (
          <a
            href={review.googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Read more
          </a>
        )}
      </div>
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

  if (isLoading || !data || data.reviews.length === 0) {
    return null;
  }

  return (
    <section className="my-12">
      <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-white rounded-3xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 md:px-8 py-6 bg-white/60 backdrop-blur-sm border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100">
                <SiGoogle className="w-7 h-7 text-[#4285F4]" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">What Our Customers Say</h2>
                <p className="text-sm text-gray-500 mt-0.5">Verified reviews from Google Business</p>
              </div>
            </div>

            {/* Right side - Rating summary */}
            <div className="flex items-center gap-4 bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-100">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">{data.averageRating.toFixed(1)}</div>
                <div className="text-xs text-gray-500 mt-0.5">out of 5</div>
              </div>
              <div className="h-12 w-px bg-gray-200" />
              <div>
                <StarRating rating={data.averageRating} size="lg" />
                <p className="text-sm text-gray-500 mt-1">
                  Based on <span className="font-semibold text-gray-700">{data.totalReviews}</span>{' '}
                  {data.totalReviews === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.reviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 md:px-8 py-5 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-white">
              <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-xl">
                <SiGoogle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">Had a great experience?</p>
                <p className="text-sm text-blue-100">Share your feedback with others</p>
              </div>
            </div>
            <a
              href="https://g.page/r/printsyou/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
            >
              Write a Review
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
