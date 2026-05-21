'use client';

import {useEffect} from 'react';
import {usePathname, useSearchParams} from 'next/navigation';
import {captureGoogleAdsParams} from '@utils/google-ads-tracking';

/**
 * Component that captures Google Ads tracking parameters (gclid, gbraid, wbraid)
 * from URL on page load and stores them for Enhanced Conversions
 */
export function GoogleAdsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Capture tracking params whenever URL changes
    captureGoogleAdsParams();
  }, [pathname, searchParams]);

  // This component doesn't render anything
  return null;
}
