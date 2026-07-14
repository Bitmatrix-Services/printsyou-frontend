'use client';

import React, {FC, useRef} from 'react';
import {EmbeddedReview, ReviewSourcePlatform} from '@components/home/product/product.types';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, Pagination, Navigation} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface ProductReviewsSliderProps {
  reviews: EmbeddedReview[];
}

// Platform badge configurations
const PLATFORM_CONFIG: Record<
  ReviewSourcePlatform,
  {label: string; bgColor: string; textColor: string; icon: JSX.Element}
> = {
  GOOGLE: {
    label: 'Google',
    bgColor: 'bg-white',
    textColor: 'text-gray-700',
    icon: <GoogleIcon />
  },
  ETSY: {
    label: 'Etsy',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    icon: <EtsyIcon />
  },
  TIKTOK: {
    label: 'TikTok',
    bgColor: 'bg-black',
    textColor: 'text-white',
    icon: <TikTokIcon />
  },
  AMAZON: {
    label: 'Amazon',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-800',
    icon: <AmazonIcon />
  },
  FACEBOOK: {
    label: 'Facebook',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    icon: <FacebookIcon />
  },
  YELP: {
    label: 'Yelp',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    icon: <YelpIcon />
  },
  TRUSTPILOT: {
    label: 'Trustpilot',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    icon: <TrustpilotIcon />
  },
  WEBSITE_VERIFIED: {
    label: 'Verified Buyer',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    icon: <VerifiedIcon />
  }
};

/**
 * ProductReviewsSlider
 * ====================
 * Displays product-specific reviews in a horizontal carousel.
 * Each review card shows platform badge, stars, reviewer info, and review text.
 */
export const ProductReviewsSlider: FC<ProductReviewsSliderProps> = ({reviews}) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Filter to only show active reviews
  const activeReviews = reviews.filter(r => r.isActive !== false);

  // Don't render if no reviews
  if (activeReviews.length === 0) {
    return null;
  }

  // Calculate aggregate stats
  const avgRating = activeReviews.reduce((sum, r) => sum + r.rating, 0) / activeReviews.length;

  return (
    <section id="reviews-section" ref={sectionRef} className="py-10 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${star <= Math.round(avgRating) ? 'text-amber-400' : 'text-gray-200'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 font-semibold text-gray-900">{avgRating.toFixed(1)}</span>
            </div>
            <span className="mx-2">•</span>
            <span>{activeReviews.length} Review{activeReviews.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Reviews Carousel */}
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={24}
          slidesPerView={1}
          pagination={{clickable: true}}
          navigation
          autoplay={{
            delay: 6000,
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
          {activeReviews.map((review) => (
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
const ReviewCard: FC<{review: EmbeddedReview}> = ({review}) => {
  const platformConfig = PLATFORM_CONFIG[review.sourcePlatform] || PLATFORM_CONFIG.WEBSITE_VERIFIED;

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      });
    } catch {
      return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      {/* Header with Platform Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {review.reviewerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{review.reviewerName}</h4>
            {review.roleOrCompany && (
              <p className="text-sm text-gray-500">{review.roleOrCompany}</p>
            )}
          </div>
        </div>

        {/* Platform Badge */}
        <div
          className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${platformConfig.bgColor} ${platformConfig.textColor} border border-gray-100 shadow-sm`}
        >
          <span className="w-4 h-4">{platformConfig.icon}</span>
          <span>{platformConfig.label}</span>
        </div>
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
        {formatDate(review.reviewDate) && (
          <span className="text-xs text-gray-400 ml-2">{formatDate(review.reviewDate)}</span>
        )}
      </div>

      {/* Review Text */}
      <div className="flex-1">
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
          &ldquo;{review.reviewText}&rdquo;
        </p>
      </div>

      {/* "via Platform" footer */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          via {platformConfig.label}
        </span>
      </div>
    </div>
  );
};

// ==================== Platform Icons ====================

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
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
}

function EtsyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="#F56400" className="w-full h-full">
      <path d="M8.56 3.04c.16-.05.65-.09 1.25-.09h3.69c.48 0 .84.05.89.65l.34 2.34c0 .19.14.34.33.34h.8c.14 0 .24-.1.24-.24v-.14l.2-2.8c0-.19-.15-.34-.34-.34H4.5c-.19 0-.34.14-.34.34L4 5.89c0 .14.1.24.24.24h.85c.19 0 .34-.15.34-.34.05-.75.44-2.3.84-2.55.26-.15 1.14-.2 2.29-.2zm5.28 4.76c.05 0 .1.05.1.1l-.25 3.7c0 .05-.05.1-.1.1H9.74c-.05 0-.1-.05-.1-.1l-.19-3.7c0-.05.04-.1.1-.1h4.29zm.04 5.3c.06 0 .1.04.1.1l-.2 3.2c0 .04-.04.1-.1.1H10c-.05 0-.1-.06-.1-.1l-.15-3.2c0-.06.05-.1.1-.1h3.99z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  );
}

function AmazonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="#FF9900" className="w-full h-full">
      <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685zm3.186 7.705c-.209.189-.512.201-.745.074-1.052-.872-1.238-1.276-1.814-2.106-1.734 1.767-2.962 2.297-5.209 2.297-2.66 0-4.731-1.641-4.731-4.925 0-2.565 1.391-4.309 3.37-5.164 1.715-.754 4.11-.891 5.942-1.095v-.41c0-.753.06-1.642-.383-2.294-.385-.579-1.124-.82-1.775-.82-1.205 0-2.277.618-2.54 1.897-.054.285-.261.567-.549.582l-3.061-.333c-.259-.056-.548-.266-.472-.66C6.083 1.058 9.514 0 12.573 0c1.553 0 3.58.413 4.802 1.587 1.553 1.463 1.405 3.417 1.405 5.541v5.017c0 1.51.626 2.171 1.214 2.985.209.292.256.642-.01.859-.665.557-1.851 1.593-2.503 2.174l-.337-.368z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="#1877F2" className="w-full h-full">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function YelpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="#D32323" className="w-full h-full">
      <path d="M20.16 12.594l-4.995 1.433c-.96.276-1.74-.8-1.176-1.63l2.905-4.308a1.072 1.072 0 011.596-.206 9.194 9.194 0 011.73 2.416c.39.678.37 1.227-.06 2.295zm-3.8 5.996l-5.063-1.33c-.98-.26-1.18-1.584-.304-2l4.49-2.135c.58-.27 1.252.088 1.426.76.373 1.456.398 2.757-.55 4.705zm-6.986-.77l1.33-5.064c.258-.98 1.584-1.18 2-.304l2.136 4.49c.273.58-.088 1.25-.76 1.425-1.454.373-2.756.398-4.706-.55zm-2.25-5.965l5.114 1.18c.978.226 1.22 1.545.367 1.998l-4.393 2.33c-.57.304-1.26-.026-1.467-.704-.436-1.452-.566-2.754.378-4.804zm4.27-5.393l-1.18 5.114c-.226.978-1.544 1.22-1.997.367l-2.33-4.393c-.302-.57.027-1.26.705-1.467 1.452-.436 2.754-.566 4.803.38z" />
    </svg>
  );
}

function TrustpilotIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="#00B67A" className="w-full h-full">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function VerifiedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-emerald-600">
      <path
        fillRule="evenodd"
        d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default ProductReviewsSlider;
