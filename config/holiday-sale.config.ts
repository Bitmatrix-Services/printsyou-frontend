/**
 * Holiday Sale Configuration
 * ===========================
 * Toggle this config to enable/disable the 4th of July sale across the site.
 * Set HOLIDAY_SALE_ACTIVE to false to disable all sale features.
 */

export const HOLIDAY_SALE_CONFIG = {
  // Master toggle - set to false to disable all holiday sale features
  HOLIDAY_SALE_ACTIVE: true,

  // Sale details
  SALE_NAME: '4th of July Bulk Sale',
  DISCOUNT_PERCENT: 5, // 5% off
  PROMO_CODE: 'JULY4',
  FREE_SHIPPING_THRESHOLD: 500,

  // Date range (optional - for automatic expiration)
  START_DATE: new Date('2026-07-01T00:00:00'),
  END_DATE: new Date('2026-07-07T23:59:59'),

  // Styling
  BANNER_BG_COLOR: 'bg-slate-900', // Deep navy/charcoal
  BANNER_TEXT_COLOR: 'text-white',
  ACCENT_COLOR: 'text-amber-400',

  // Target categories (slugs) - empty array means all products
  TARGET_CATEGORIES: ['safety-apparel', 'hi-vis-custom-safety-vests', 'apparel'],

  // Announcement bar text
  ANNOUNCEMENT_TEXT: '🇺🇸 4th of July Bulk Sale: Get an Extra 5% Off + Free Shipping Over $500!',

  // Urgency badge text
  URGENCY_BADGE_TEXT: '🎉 July 4th Weekend Discount Applied to Your Selected Tier!',
};

/**
 * Check if the holiday sale is currently active
 */
export function isHolidaySaleActive(): boolean {
  if (!HOLIDAY_SALE_CONFIG.HOLIDAY_SALE_ACTIVE) return false;

  const now = new Date();
  return now >= HOLIDAY_SALE_CONFIG.START_DATE && now <= HOLIDAY_SALE_CONFIG.END_DATE;
}

/**
 * Calculate the discounted price
 */
export function getHolidayDiscountedPrice(originalPrice: number): number {
  if (!isHolidaySaleActive()) return originalPrice;
  const discount = originalPrice * (HOLIDAY_SALE_CONFIG.DISCOUNT_PERCENT / 100);
  return Math.round((originalPrice - discount) * 100) / 100;
}

/**
 * Check if a product category qualifies for the sale
 */
export function isEligibleForHolidaySale(categorySlug?: string): boolean {
  if (!isHolidaySaleActive()) return false;
  if (HOLIDAY_SALE_CONFIG.TARGET_CATEGORIES.length === 0) return true;
  if (!categorySlug) return false;
  return HOLIDAY_SALE_CONFIG.TARGET_CATEGORIES.includes(categorySlug.toLowerCase());
}
