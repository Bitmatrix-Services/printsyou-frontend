import posthog from 'posthog-js';

// Event names as constants for consistency
export const ANALYTICS_EVENTS = {
  // Checkout funnel events
  CHECKOUT_STARTED: 'checkout_started',
  CHECKOUT_QUANTITY_CHANGED: 'checkout_quantity_changed',
  CHECKOUT_SIZE_BREAKDOWN_CHANGED: 'checkout_size_breakdown_changed',
  CHECKOUT_COLOR_SELECTED: 'checkout_color_selected',
  CHECKOUT_ARTWORK_UPLOADED: 'checkout_artwork_uploaded',
  CHECKOUT_SUBMITTED: 'checkout_submitted',
  CHECKOUT_SUCCESS: 'checkout_success',
  CHECKOUT_ERROR: 'checkout_error',

  // Quote funnel events
  QUOTE_STARTED: 'quote_started',
  QUOTE_SUBMITTED: 'quote_submitted',
  QUOTE_SUCCESS: 'quote_success',
  QUOTE_ERROR: 'quote_error',

  // Proof funnel events
  PROOF_VIEWED: 'proof_viewed',
  PROOF_APPROVED: 'proof_approved',
  PROOF_CHANGES_REQUESTED: 'proof_changes_requested',

  // Payment funnel events
  PAYMENT_STARTED: 'payment_started',
  PAYMENT_COMPLETED: 'payment_completed',
  PAYMENT_FAILED: 'payment_failed',

  // Product events
  PRODUCT_VIEWED: 'product_viewed',
  PRODUCT_ADDED_TO_CART: 'product_added_to_cart',

  // Category events
  CATEGORY_VIEWED: 'category_viewed',

  // Search events
  SEARCH_PERFORMED: 'search_performed',

  // Contact events
  CONTACT_FORM_SUBMITTED: 'contact_form_submitted',
  WHATSAPP_CLICKED: 'whatsapp_clicked'
} as const;

// Track an event with properties
export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
) {
  if (typeof window !== 'undefined' && posthog) {
    posthog.capture(eventName, properties);
  }
}

// Identify a user (call when user provides email/phone)
export function identifyUser(
  email: string,
  properties?: {
    name?: string;
    phone?: string;
    company?: string;
    [key: string]: unknown;
  }
) {
  if (typeof window !== 'undefined' && posthog) {
    // Use email as the distinct ID for consistency
    posthog.identify(email, {
      email,
      ...properties
    });
  }
}

// Reset user identity (call on logout or when switching users)
export function resetUser() {
  if (typeof window !== 'undefined' && posthog) {
    posthog.reset();
  }
}

// Set user properties without identifying
export function setUserProperties(properties: Record<string, unknown>) {
  if (typeof window !== 'undefined' && posthog) {
    posthog.people.set(properties);
  }
}

// Track page view with additional properties
export function trackPageView(properties?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && posthog) {
    posthog.capture('$pageview', properties);
  }
}

// Checkout-specific tracking functions
export const checkoutAnalytics = {
  started: (data: {
    productId: string;
    productName: string;
    productSku?: string;
    category?: string;
    source?: string;
  }) => {
    trackEvent(ANALYTICS_EVENTS.CHECKOUT_STARTED, {
      product_id: data.productId,
      product_name: data.productName,
      product_sku: data.productSku,
      category: data.category,
      source: data.source || 'direct'
    });
  },

  quantityChanged: (data: {
    productId: string;
    quantity: number;
    previousQuantity?: number;
  }) => {
    trackEvent(ANALYTICS_EVENTS.CHECKOUT_QUANTITY_CHANGED, {
      product_id: data.productId,
      quantity: data.quantity,
      previous_quantity: data.previousQuantity
    });
  },

  colorSelected: (data: {
    productId: string;
    color: string;
  }) => {
    trackEvent(ANALYTICS_EVENTS.CHECKOUT_COLOR_SELECTED, {
      product_id: data.productId,
      color: data.color
    });
  },

  artworkUploaded: (data: {
    productId: string;
    fileCount: number;
    fileTypes: string[];
  }) => {
    trackEvent(ANALYTICS_EVENTS.CHECKOUT_ARTWORK_UPLOADED, {
      product_id: data.productId,
      file_count: data.fileCount,
      file_types: data.fileTypes
    });
  },

  submitted: (data: {
    productId: string;
    productName: string;
    quantity: number;
    total: number;
    category?: string;
    color?: string;
    hasArtwork: boolean;
    hasSizeBreakdown: boolean;
  }) => {
    trackEvent(ANALYTICS_EVENTS.CHECKOUT_SUBMITTED, {
      product_id: data.productId,
      product_name: data.productName,
      quantity: data.quantity,
      total: data.total,
      category: data.category,
      color: data.color,
      has_artwork: data.hasArtwork,
      has_size_breakdown: data.hasSizeBreakdown
    });
  },

  success: (data: {
    quoteId: string;
    productId: string;
    productName: string;
    quantity: number;
    total: number;
    category?: string;
  }) => {
    trackEvent(ANALYTICS_EVENTS.CHECKOUT_SUCCESS, {
      quote_id: data.quoteId,
      product_id: data.productId,
      product_name: data.productName,
      quantity: data.quantity,
      total: data.total,
      category: data.category
    });
  },

  error: (data: {
    productId: string;
    errorMessage: string;
    step?: string;
  }) => {
    trackEvent(ANALYTICS_EVENTS.CHECKOUT_ERROR, {
      product_id: data.productId,
      error_message: data.errorMessage,
      step: data.step
    });
  }
};

// Quote request tracking functions
export const quoteAnalytics = {
  started: (data: {
    productId?: string;
    productName?: string;
    category?: string;
    source?: string;
  }) => {
    trackEvent(ANALYTICS_EVENTS.QUOTE_STARTED, {
      product_id: data.productId,
      product_name: data.productName,
      category: data.category,
      source: data.source
    });
  },

  submitted: (data: {
    quantity: number;
    category?: string;
    hasArtwork: boolean;
  }) => {
    trackEvent(ANALYTICS_EVENTS.QUOTE_SUBMITTED, {
      quantity: data.quantity,
      category: data.category,
      has_artwork: data.hasArtwork
    });
  },

  success: (data: {
    quoteId: string;
    quantity: number;
  }) => {
    trackEvent(ANALYTICS_EVENTS.QUOTE_SUCCESS, {
      quote_id: data.quoteId,
      quantity: data.quantity
    });
  },

  error: (data: {
    errorMessage: string;
  }) => {
    trackEvent(ANALYTICS_EVENTS.QUOTE_ERROR, {
      error_message: data.errorMessage
    });
  }
};

// Proof tracking functions
export const proofAnalytics = {
  viewed: (data: {
    proofId: string;
    quoteId?: string;
    version: number;
  }) => {
    trackEvent(ANALYTICS_EVENTS.PROOF_VIEWED, {
      proof_id: data.proofId,
      quote_id: data.quoteId,
      version: data.version
    });
  },

  approved: (data: {
    proofId: string;
    quoteId?: string;
    version: number;
  }) => {
    trackEvent(ANALYTICS_EVENTS.PROOF_APPROVED, {
      proof_id: data.proofId,
      quote_id: data.quoteId,
      version: data.version
    });
  },

  changesRequested: (data: {
    proofId: string;
    quoteId?: string;
    version: number;
    feedback?: string;
  }) => {
    trackEvent(ANALYTICS_EVENTS.PROOF_CHANGES_REQUESTED, {
      proof_id: data.proofId,
      quote_id: data.quoteId,
      version: data.version,
      has_feedback: !!data.feedback
    });
  }
};

// Payment tracking functions
export const paymentAnalytics = {
  started: (data: {
    quoteId: string;
    amount: number;
    method?: string;
  }) => {
    trackEvent(ANALYTICS_EVENTS.PAYMENT_STARTED, {
      quote_id: data.quoteId,
      amount: data.amount,
      method: data.method
    });
  },

  completed: (data: {
    quoteId: string;
    amount: number;
    method?: string;
  }) => {
    trackEvent(ANALYTICS_EVENTS.PAYMENT_COMPLETED, {
      quote_id: data.quoteId,
      amount: data.amount,
      method: data.method
    });
  },

  failed: (data: {
    quoteId: string;
    amount: number;
    errorMessage?: string;
  }) => {
    trackEvent(ANALYTICS_EVENTS.PAYMENT_FAILED, {
      quote_id: data.quoteId,
      amount: data.amount,
      error_message: data.errorMessage
    });
  }
};

// Product tracking functions
export const productAnalytics = {
  viewed: (data: {
    productId: string;
    productName: string;
    productSku?: string;
    category?: string;
    price?: number;
  }) => {
    trackEvent(ANALYTICS_EVENTS.PRODUCT_VIEWED, {
      product_id: data.productId,
      product_name: data.productName,
      product_sku: data.productSku,
      category: data.category,
      price: data.price
    });
  }
};
