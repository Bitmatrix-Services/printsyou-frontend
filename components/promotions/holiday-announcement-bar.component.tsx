'use client';

import React, {useState} from 'react';
import {IoClose} from 'react-icons/io5';
import {HOLIDAY_SALE_CONFIG, isHolidaySaleActive} from '@/config/holiday-sale.config';

/**
 * Holiday Announcement Bar
 * ========================
 * A sleek top banner for promoting the 4th of July sale.
 * Automatically hides when sale is not active.
 */
export const HolidayAnnouncementBar: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't render if sale is not active or user dismissed
  if (!isHolidaySaleActive() || isDismissed) return null;

  return (
    <div className={`${HOLIDAY_SALE_CONFIG.BANNER_BG_COLOR} ${HOLIDAY_SALE_CONFIG.BANNER_TEXT_COLOR} relative`}>
      {/* Subtle patriotic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-red-900/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 relative">
        <div className="flex items-center justify-center gap-2 sm:gap-4 pr-8">
          {/* Main text */}
          <p className="text-xs sm:text-sm font-medium text-center leading-tight">
            <span className="hidden sm:inline">{HOLIDAY_SALE_CONFIG.ANNOUNCEMENT_TEXT}</span>
            <span className="sm:hidden">🇺🇸 July 4th Sale: 5% Off High-Vis + Free Shipping $500+</span>
            <span className={`font-bold ml-2 ${HOLIDAY_SALE_CONFIG.ACCENT_COLOR}`}>
              Code: {HOLIDAY_SALE_CONFIG.PROMO_CODE}
            </span>
          </p>

          {/* Animated sparkle effect */}
          <span className="hidden md:inline-flex items-center gap-1 text-amber-400 animate-pulse">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </span>
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Dismiss announcement"
        >
          <IoClose className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 hover:text-white" />
        </button>
      </div>

      {/* Bottom accent line */}
      <div className="h-0.5 bg-gradient-to-r from-blue-600 via-white to-red-600" />
    </div>
  );
};

export default HolidayAnnouncementBar;
