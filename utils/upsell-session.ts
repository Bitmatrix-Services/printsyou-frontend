/**
 * Upsell Session Management
 * Handles storing and retrieving post-purchase upsell discount data
 */

import { UpsellSessionData, DiscountType } from '@/types/upsell.types';

const UPSELL_SESSION_KEY = 'printsyou_upsell_session';

/**
 * Generate a unique discount code for the upsell session
 */
export function generateUpsellDiscountCode(orderId: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `UPSELL-${orderId.slice(-6).toUpperCase()}-${random}`;
}

/**
 * Save upsell session data to sessionStorage
 */
export function saveUpsellSession(data: UpsellSessionData): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.setItem(UPSELL_SESSION_KEY, JSON.stringify(data));
    console.log('[Upsell] Session saved:', data.discountCode);
  } catch (error) {
    console.error('[Upsell] Failed to save session:', error);
  }
}

/**
 * Get active upsell session data
 * Returns null if no session exists or if it has expired
 */
export function getUpsellSession(): UpsellSessionData | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = sessionStorage.getItem(UPSELL_SESSION_KEY);
    if (!stored) return null;

    const data: UpsellSessionData = JSON.parse(stored);

    // Check if session has expired
    if (new Date(data.expiresAt) < new Date()) {
      clearUpsellSession();
      console.log('[Upsell] Session expired');
      return null;
    }

    return data;
  } catch (error) {
    console.error('[Upsell] Failed to get session:', error);
    return null;
  }
}

/**
 * Clear upsell session data
 */
export function clearUpsellSession(): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.removeItem(UPSELL_SESSION_KEY);
    console.log('[Upsell] Session cleared');
  } catch (error) {
    console.error('[Upsell] Failed to clear session:', error);
  }
}

/**
 * Check if a product is eligible for upsell discount
 */
export function isProductEligibleForUpsell(productId: string): boolean {
  const session = getUpsellSession();
  if (!session) return false;

  return session.productIds.includes(productId);
}

/**
 * Calculate discounted price based on upsell session
 */
export function calculateUpsellPrice(
  originalPrice: number,
  discountType: DiscountType,
  discountValue: number
): number {
  if (discountType === 'PERCENTAGE') {
    const discount = originalPrice * (discountValue / 100);
    return Math.max(0, originalPrice - discount);
  } else {
    // FIXED_AMOUNT
    return Math.max(0, originalPrice - discountValue);
  }
}

/**
 * Format discount for display
 */
export function formatDiscount(discountType: DiscountType, discountValue: number): string {
  if (discountType === 'PERCENTAGE') {
    return `${discountValue}%`;
  } else {
    return `$${discountValue.toFixed(2)}`;
  }
}

/**
 * Create upsell session from offer data
 */
export function createUpsellSession(
  orderId: string,
  discountType: DiscountType,
  discountValue: number,
  productIds: string[],
  timerMinutes: number
): UpsellSessionData {
  const discountCode = generateUpsellDiscountCode(orderId);
  const expiresAt = new Date(Date.now() + timerMinutes * 60 * 1000).toISOString();

  const sessionData: UpsellSessionData = {
    discountCode,
    discountType,
    discountValue,
    productIds,
    expiresAt,
    originalOrderId: orderId,
    createdAt: new Date().toISOString()
  };

  saveUpsellSession(sessionData);
  return sessionData;
}

/**
 * Get remaining time in seconds for upsell offer
 */
export function getUpsellRemainingSeconds(): number {
  const session = getUpsellSession();
  if (!session) return 0;

  const remaining = new Date(session.expiresAt).getTime() - Date.now();
  return Math.max(0, Math.floor(remaining / 1000));
}

/**
 * Check if there's an active upsell session
 */
export function hasActiveUpsellSession(): boolean {
  return getUpsellSession() !== null;
}
