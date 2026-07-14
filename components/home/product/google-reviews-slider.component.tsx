'use client';

import React, {FC, useEffect, useState, useRef} from 'react';
import axios from 'axios';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

interface GoogleReview {
  id: string;
  reviewerName: string;
  reviewerTitle?: string;
  companyName?: string;
  rating: number;
  reviewText: string;
  highlightQuote?: string;
  reviewDate: string;
}

interface GoogleReviewsSliderProps {
  googleReviewCategory: string;
}

/**
 * GoogleReviewsSlider
 * ===================
 * Displays a horizontal carousel of Google reviews for B2B social proof.
 * Position: Below "How It Works", above "You may also like" section.
 */
export const GoogleReviewsSlider: FC<GoogleReviewsSliderProps> = ({googleReviewCategory}) => {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/google-reviews/category/${googleReviewCategory}`
        );
        if (response.data?.payload && Array.isArray(response.data.payload)) {
          setReviews(response.data.payload);
        }
      } catch (error) {
        console.error('Failed to fetch Google reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    if (googleReviewCategory) {
      fetchReviews();
    } else {
      setLoading(false);
    }
  }, [googleReviewCategory]);

  // Don't render if no reviews
  if (loading || reviews.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      id="google-reviews-section"
      className="py-10 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Loved by Safety Managers & Project Coordinators
          </h2>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <GoogleLogo />
            <span className="font-medium">Google Reviews</span>
            <span className="mx-2">•</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="w-4 h-4 text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 font-semibold text-gray-900">{reviews.length} Reviews</span>
            </div>
          </div>
        </div>

        {/* Reviews Carousel */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          pagination={{clickable: true}}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          breakpoints={{
            640: {
              slidesPerView: 2
            },
            1024: {
              slidesPerView: 3
            }
          }}
          className="pb-12"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <ReviewCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

// Individual Review Card Component
const ReviewCard: FC<{review: GoogleReview}> = ({review}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      {/* Header with Google badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
            {review.reviewerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{review.reviewerName}</h4>
            {(review.reviewerTitle || review.companyName) && (
              <p className="text-sm text-gray-500">
                {review.reviewerTitle}
                {review.reviewerTitle && review.companyName && ', '}
                {review.companyName}
              </p>
            )}
          </div>
        </div>
        <GoogleLogo />
      </div>

      {/* Star Rating */}
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= review.rating ? 'text-amber-400' : 'text-gray-200'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-xs text-gray-400 ml-2">{formatDate(review.reviewDate)}</span>
      </div>

      {/* Review Quote/Text */}
      <div className="flex-1">
        {review.highlightQuote ? (
          <blockquote className="text-gray-700 italic text-lg leading-relaxed">
            &ldquo;{review.highlightQuote}&rdquo;
          </blockquote>
        ) : (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
            {review.reviewText}
          </p>
        )}
      </div>

      {/* Verified Badge */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-green-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">Verified Purchase</span>
        </div>
      </div>
    </div>
  );
};

// Google Logo Component
const GoogleLogo: FC = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export default GoogleReviewsSlider;
