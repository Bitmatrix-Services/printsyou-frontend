/**
 * Google Ads Enhanced Conversions Tracking Utility
 * Captures and stores gclid, gbraid, wbraid from URL parameters
 * for use in checkout sessions to improve conversion attribution
 */

const STORAGE_KEY = 'google_ads_tracking';
const EXPIRY_DAYS = 90; // Google recommends 90 days for gclid

interface GoogleAdsTrackingData {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  capturedAt: number;
  landingPage?: string;
}

/**
 * Captures Google Ads tracking parameters from URL and stores them
 * Call this on app initialization or page load
 */
export function captureGoogleAdsParams(): void {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const gclid = urlParams.get('gclid');
  const gbraid = urlParams.get('gbraid');
  const wbraid = urlParams.get('wbraid');

  // Only store if we have at least one tracking param
  if (gclid || gbraid || wbraid) {
    const trackingData: GoogleAdsTrackingData = {
      gclid: gclid || undefined,
      gbraid: gbraid || undefined,
      wbraid: wbraid || undefined,
      capturedAt: Date.now(),
      landingPage: window.location.pathname
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trackingData));
      console.log('[GoogleAds] Captured tracking params:', {gclid, gbraid, wbraid});
    } catch (e) {
      console.warn('[GoogleAds] Failed to store tracking params:', e);
    }
  }
}

/**
 * Retrieves stored Google Ads tracking parameters
 * Returns null if expired or not found
 */
export function getGoogleAdsParams(): GoogleAdsTrackingData | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data: GoogleAdsTrackingData = JSON.parse(stored);

    // Check if expired (90 days)
    const expiryMs = EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    if (Date.now() - data.capturedAt > expiryMs) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return data;
  } catch (e) {
    console.warn('[GoogleAds] Failed to retrieve tracking params:', e);
    return null;
  }
}

/**
 * Gets Enhanced Conversions data for checkout session
 * Includes gclid, gbraid, wbraid, userAgent, and prepares for ipAddress
 */
export function getEnhancedConversionsData(): {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  userAgent?: string;
} {
  const trackingData = getGoogleAdsParams();

  return {
    gclid: trackingData?.gclid,
    gbraid: trackingData?.gbraid,
    wbraid: trackingData?.wbraid,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
  };
}

/**
 * Clears stored tracking data (e.g., after successful conversion)
 */
export function clearGoogleAdsParams(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // Ignore errors
  }
}
