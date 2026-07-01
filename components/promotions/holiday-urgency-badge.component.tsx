'use client';

import React from 'react';
import {HOLIDAY_SALE_CONFIG, isHolidaySaleActive} from '@/config/holiday-sale.config';

interface HolidayUrgencyBadgeProps {
  categorySlug?: string;
  className?: string;
}

/**
 * Holiday Urgency Badge
 * =====================
 * Displays above the price total in the configurator sidebar
 * to create urgency and highlight the active discount.
 */
export const HolidayUrgencyBadge: React.FC<HolidayUrgencyBadgeProps> = ({
  categorySlug,
  className = ''
}) => {
  // Check if sale is active and product is eligible
  const isActive = isHolidaySaleActive();

  // Show badge for all products during sale period (remove category check for broader reach)
  if (!isActive) return null;

  return (
    <div className={`mb-4 ${className}`}>
      {/* Main badge container */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-amber-50 to-blue-50 border border-amber-200 p-3 shadow-sm">
        {/* Animated background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-12 animate-shimmer" />

        <div className="relative flex items-start gap-2">
          {/* Icon */}
          <span className="flex-shrink-0 text-lg">🎉</span>

          {/* Text content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-900 leading-tight">
              July 4th Weekend Discount Applied!
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Extra {HOLIDAY_SALE_CONFIG.DISCOUNT_PERCENT}% off your selected tier •
              <span className="font-medium"> Code: {HOLIDAY_SALE_CONFIG.PROMO_CODE}</span>
            </p>
          </div>

          {/* Flag accent */}
          <span className="flex-shrink-0 text-lg">🇺🇸</span>
        </div>

        {/* Timer countdown hint */}
        <div className="relative mt-2 pt-2 border-t border-amber-200/50">
          <p className="text-xs text-amber-600 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Limited time offer • Ends July 7th</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// Add shimmer animation to tailwind
// Add this to your globals.css or tailwind config:
// @keyframes shimmer { from { transform: translateX(-100%) skewX(-12deg); } to { transform: translateX(200%) skewX(-12deg); } }
// .animate-shimmer { animation: shimmer 3s infinite; }

export default HolidayUrgencyBadge;
