/**
 * Post-Purchase Upsell Configuration Types
 * Used for managing upsell offers shown on the checkout success page
 */

export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export interface UpsellProduct {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  productImage: string;
  minPrice: number;
  originalPrice: number;
  discountedPrice: number;
  categoryName?: string;
}

export interface UpsellConfiguration {
  id: string;
  storeId: string;
  enabled: boolean;

  // Selected products (1-4)
  productIds: string[];

  // Discount settings
  discountType: DiscountType;
  discountValue: number; // Percentage (e.g., 10 for 10%) or Fixed amount (e.g., 20 for $20)

  // Timer settings (optional)
  timerEnabled: boolean;
  timerMinutes: number; // e.g., 20 minutes

  // Display settings
  headline: string;
  subheadline: string;
  badgeText: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface UpsellConfigurationRequest {
  enabled: boolean;
  productIds: string[];
  discountType: DiscountType;
  discountValue: number;
  timerEnabled: boolean;
  timerMinutes: number;
  headline?: string;
  subheadline?: string;
  badgeText?: string;
}

export interface UpsellOffer {
  configuration: UpsellConfiguration;
  products: UpsellProduct[];
  expiresAt?: string; // ISO timestamp when offer expires
  discountCode: string; // Unique code for this session
}

export interface UpsellSessionData {
  discountCode: string;
  discountType: DiscountType;
  discountValue: number;
  productIds: string[];
  expiresAt: string;
  originalOrderId: string;
  createdAt: string;
}

// Default configuration values
export const DEFAULT_UPSELL_CONFIG: Partial<UpsellConfiguration> = {
  enabled: false,
  productIds: [],
  discountType: 'PERCENTAGE',
  discountValue: 10,
  timerEnabled: true,
  timerMinutes: 20,
  headline: '🎁 Exclusive One-Time Offer!',
  subheadline: 'Add any of these curated items to a new order and lock in an extra {discount} off! Valid for this session only.',
  badgeText: 'One-Time Offer'
};
