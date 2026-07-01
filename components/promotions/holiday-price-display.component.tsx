'use client';

import React from 'react';
import {HOLIDAY_SALE_CONFIG, isHolidaySaleActive, getHolidayDiscountedPrice} from '@/config/holiday-sale.config';

interface HolidayPriceDisplayProps {
  originalPrice: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Holiday Price Display
 * =====================
 * Shows original price with strikethrough and the discounted price.
 * Used in tier buttons and price summaries.
 */
export const HolidayPriceDisplay: React.FC<HolidayPriceDisplayProps> = ({
  originalPrice,
  showLabel = false,
  size = 'sm',
  className = ''
}) => {
  const isActive = isHolidaySaleActive();
  const discountedPrice = getHolidayDiscountedPrice(originalPrice);

  // Size classes
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  if (!isActive) {
    // No sale - show regular price
    return (
      <span className={`${sizeClasses[size]} ${className}`}>
        ${originalPrice.toFixed(2)}/ea
      </span>
    );
  }

  // Sale active - show strikethrough and discounted price
  return (
    <span className={`${sizeClasses[size]} ${className}`}>
      <span className="line-through text-gray-400 mr-1">
        ${originalPrice.toFixed(2)}
      </span>
      <span className="text-red-600 font-semibold">
        ${discountedPrice.toFixed(2)}/ea
      </span>
      {showLabel && (
        <span className="ml-1 text-[10px] bg-red-100 text-red-700 px-1 py-0.5 rounded font-medium">
          -{HOLIDAY_SALE_CONFIG.DISCOUNT_PERCENT}%
        </span>
      )}
    </span>
  );
};

interface HolidayTierButtonProps {
  tier: {
    id: string;
    countFrom: number;
    price: number;
    salePrice?: number;
  };
  isSelected: boolean;
  isCurrentTier: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

/**
 * Holiday Tier Button
 * ===================
 * Enhanced tier selection button with holiday pricing.
 */
export const HolidayTierButton: React.FC<HolidayTierButtonProps> = ({
  tier,
  isSelected,
  isCurrentTier,
  isDisabled,
  onClick
}) => {
  const isActive = isHolidaySaleActive();
  const basePrice = tier.salePrice && tier.salePrice > 0 ? tier.salePrice : tier.price;
  const discountedPrice = getHolidayDiscountedPrice(basePrice);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`relative px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
        isCurrentTier
          ? 'bg-primary-600 border-primary-600 text-white shadow-lg scale-105'
          : isSelected
            ? 'bg-primary-50 border-primary-400 text-primary-700'
            : 'bg-white border-gray-200 text-gray-700 hover:border-primary-300'
      } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {/* Sale badge */}
      {isActive && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
          -{HOLIDAY_SALE_CONFIG.DISCOUNT_PERCENT}%
        </span>
      )}

      <div className="font-bold">{tier.countFrom}+</div>

      {isActive ? (
        <div className="text-xs opacity-90">
          <span className="line-through text-gray-400 mr-1">${basePrice.toFixed(2)}</span>
          <span className={isCurrentTier ? 'text-yellow-200' : 'text-red-600 font-semibold'}>
            ${discountedPrice.toFixed(2)}
          </span>
        </div>
      ) : (
        <div className="text-xs opacity-80">${basePrice.toFixed(2)}/ea</div>
      )}
    </button>
  );
};

export default HolidayPriceDisplay;
