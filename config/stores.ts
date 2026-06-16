/**
 * Store configuration for multi-tenant frontend.
 * Defines feature flags and settings for each store type.
 */

export type StoreType = 'B2B' | 'RETAIL';

export interface StoreFeatures {
  // Pricing features
  tierPricing: boolean;        // Show tier-based quantity pricing
  bulkDiscounts: boolean;      // Enable bulk discount messaging

  // Customization features
  artworkUpload: boolean;      // Allow artwork file uploads
  sizeBreakdown: boolean;      // Show size breakdown for apparel
  colorSelection: boolean;     // Show color picker

  // Checkout features
  quoteRequests: boolean;      // Allow quote request flow
  proofApproval: boolean;      // Require proof approval
  directCheckout: boolean;     // Allow direct checkout

  // UI features
  showBulkThreshold: boolean;  // Show bulk order recommendation
  showProductionCountdown: boolean; // Show urgency countdown
}

export interface StoreConfig {
  id: string;
  name: string;
  slug: string;
  storeType: StoreType;
  domain: string;
  logoUrl: string;
  primaryColor: string;
  features: StoreFeatures;
  checkout: {
    bulkThreshold: number | null;
    freeShippingThreshold: number;
    requireArtwork: boolean;
    showQuoteOption: boolean;
  };
}

// Default B2B store configuration (PrintsYou)
export const B2B_STORE_CONFIG: StoreConfig = {
  id: 'default-printsyou-store',
  name: 'PrintsYou',
  slug: 'printsyou',
  storeType: 'B2B',
  domain: 'printsyou.com',
  logoUrl: '/assets/logo.png',
  primaryColor: '#019ce0',
  features: {
    tierPricing: true,
    bulkDiscounts: true,
    artworkUpload: true,
    sizeBreakdown: true,
    colorSelection: true,
    quoteRequests: true,
    proofApproval: true,
    directCheckout: true,
    showBulkThreshold: true,
    showProductionCountdown: true
  },
  checkout: {
    bulkThreshold: 500,
    freeShippingThreshold: 500,
    requireArtwork: false,
    showQuoteOption: true
  }
};

// Retail store configuration (TheWetSeal)
export const RETAIL_STORE_CONFIG: StoreConfig = {
  id: 'the-wet-seal-store',
  name: 'TheWetSeal',
  slug: 'thewetseal',
  storeType: 'RETAIL',
  domain: 'thewetseal.com',
  logoUrl: '/assets/wetseal-logo.png',
  primaryColor: '#ff6b6b',
  features: {
    tierPricing: false,
    bulkDiscounts: false,
    artworkUpload: false,
    sizeBreakdown: true,
    colorSelection: true,
    quoteRequests: false,
    proofApproval: false,
    directCheckout: true,
    showBulkThreshold: false,
    showProductionCountdown: false
  },
  checkout: {
    bulkThreshold: null,
    freeShippingThreshold: 75,
    requireArtwork: false,
    showQuoteOption: false
  }
};

// Store registry
export const STORE_CONFIGS: Record<string, StoreConfig> = {
  'default-printsyou-store': B2B_STORE_CONFIG,
  'printsyou': B2B_STORE_CONFIG,
  'printsyou.com': B2B_STORE_CONFIG,
  'the-wet-seal-store': RETAIL_STORE_CONFIG,
  'thewetseal': RETAIL_STORE_CONFIG,
  'thewetseal.com': RETAIL_STORE_CONFIG
};

/**
 * Get store configuration by ID, slug, or domain.
 */
export function getStoreConfig(identifier: string): StoreConfig {
  return STORE_CONFIGS[identifier] || B2B_STORE_CONFIG;
}

/**
 * Get store configuration from hostname.
 */
export function getStoreConfigFromHostname(hostname: string): StoreConfig {
  // Remove port if present
  const domain = hostname.includes(':') ? hostname.split(':')[0] : hostname;

  // Check for localhost (default to B2B)
  if (domain === 'localhost' || domain.match(/^\d+\.\d+\.\d+\.\d+$/)) {
    return B2B_STORE_CONFIG;
  }

  // Find matching config
  for (const [key, config] of Object.entries(STORE_CONFIGS)) {
    if (config.domain === domain || domain.includes(config.slug)) {
      return config;
    }
  }

  return B2B_STORE_CONFIG;
}
