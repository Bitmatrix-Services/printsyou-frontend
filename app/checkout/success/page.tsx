'use client';

import {Suspense, useEffect, useState, useRef} from 'react';
import {useSearchParams} from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import {Container} from '@components/globals/container.component';
import {Breadcrumb} from '@components/globals/breadcrumb.component';
import {CircularLoader} from '@components/globals/circular-loader.component';
import {FaCheckCircle} from 'react-icons/fa';
import {getGoogleAdsParams} from '@utils/google-ads-tracking';
import {paymentAnalytics, identifyUser} from '@utils/analytics';
import {PostPurchaseUpsell} from '@components/checkout/post-purchase-upsell.component';
import {CrossSellProducts} from '@components/checkout/cross-sell-products.component';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface SessionData {
  id: string;
  stripeSessionId: string;
  quoteRequestId?: string;
  orderId?: string;
  amountTotal: number;
  currency: string;
  status: string;
  customerEmail: string;
  customerPhone?: string;
  // Additional fields for enhanced tracking
  productName?: string;
  productId?: string;
  productCategory?: string;
  quantity?: number;
}

const CheckoutSuccessContent = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Prevent double calls in React Strict Mode
  const hasVerified = useRef(false);

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        setError('No session ID provided');
        setLoading(false);
        return;
      }

      // Prevent duplicate calls (React Strict Mode runs effects twice in dev)
      if (hasVerified.current) {
        return;
      }
      hasVerified.current = true;

      try {
        // Verify and complete payment (this triggers emails if not already sent)
        const verifyResponse = await axios.post(`${API_BASE_URL}/checkout/verify-payment/${sessionId}`);
        const data = verifyResponse.data.payload;
        console.log('[Checkout Success] Session data:', data);
        console.log('[Checkout Success] productId:', data.productId);
        setSessionData(data);

        // Track payment completed in PostHog
        paymentAnalytics.completed({
          quoteId: data.quoteRequestId || data.orderId || '',
          amount: data.amountTotal,
          method: 'stripe'
        });

        // Identify user in PostHog
        if (data.customerEmail) {
          identifyUser(data.customerEmail, {
            phone: data.customerPhone
          });
        }

        // Track successful payment - Google Analytics, Google Ads & Meta Pixel
        // Use retry logic since tracking scripts may not be ready immediately after Stripe redirect
        const fireConversions = () => {
          if (typeof window === 'undefined') {
            return false;
          }

          const gtag = (window as any).gtag;
          const fbq = (window as any).fbq;

          if (!gtag && !fbq) {
            console.warn('[Tracking] Neither gtag nor fbq ready, will retry...');
            return false;
          }

          // Prepare user data for Enhanced Conversions
          const userData: Record<string, string> = {};
          if (data.customerEmail) {
            userData.email = data.customerEmail.toLowerCase().trim();
          }
          if (data.customerPhone) {
            const cleanPhone = data.customerPhone.replace(/\D/g, '');
            userData.phone_number = cleanPhone.length === 10 ? '+1' + cleanPhone : '+' + cleanPhone;
          }

          // Get stored gclid for better attribution
          const googleAdsParams = getGoogleAdsParams();

          // === GOOGLE TRACKING ===
          if (gtag) {
            // Google Analytics purchase event
            gtag('event', 'purchase', {
              transaction_id: data.stripeSessionId,
              value: data.amountTotal,
              currency: data.currency || 'USD'
            });

            // Google Ads Purchase Conversion with Enhanced Conversions data
            const conversionData: Record<string, any> = {
              send_to: 'AW-16709127988/SI9-CNz_w_EbELSexJ8-',
              transaction_id: data.stripeSessionId,
              value: data.amountTotal,
              currency: data.currency || 'USD',
              user_data: userData
            };

            if (googleAdsParams?.gclid) {
              conversionData.gclid = googleAdsParams.gclid;
            }

            gtag('event', 'conversion', conversionData);

            console.log('[Google Ads] Purchase conversion fired:', {
              value: data.amountTotal,
              transaction_id: data.stripeSessionId,
              gclid: googleAdsParams?.gclid || 'none'
            });
          }

          // === META PIXEL TRACKING ===
          if (fbq) {
            // Ensure value is always a valid positive number with 2 decimal places
            const rawValue = typeof data.amountTotal === 'number'
              ? data.amountTotal
              : parseFloat(data.amountTotal);
            const purchaseValue = !isNaN(rawValue) && rawValue > 0
              ? Math.round(rawValue * 100) / 100
              : 1; // Fallback to $1 if invalid (Meta requires positive value)

            const itemQuantity = data.quantity && data.quantity > 0 ? data.quantity : 1;
            const itemPrice = Math.round((purchaseValue / itemQuantity) * 100) / 100;

            // Build contents array for better ROAS calculation
            const contents = [{
              id: data.productId || data.quoteRequestId || data.stripeSessionId,
              quantity: itemQuantity,
              item_price: itemPrice
            }];

            // Fire Purchase event with enhanced product data for better ROAS
            fbq('track', 'Purchase', {
              value: purchaseValue,
              currency: (data.currency || 'USD').toUpperCase(),
              content_type: 'product',
              content_ids: [data.productId || data.quoteRequestId || data.orderId || data.stripeSessionId],
              content_name: data.productName || 'Custom Order',
              content_category: data.productCategory || 'Promotional Products',
              contents: contents,
              num_items: itemQuantity
            }, {
              eventID: data.stripeSessionId // For deduplication with server CAPI
            });

            console.log('[Meta Pixel] Purchase event fired:', {
              value: purchaseValue,
              currency: (data.currency || 'USD').toUpperCase(),
              content_name: data.productName,
              content_category: data.productCategory,
              contents: contents,
              num_items: itemQuantity,
              eventID: data.stripeSessionId
            });
          }

          return true;
        };

        // Try immediately, then retry with delays if gtag not ready
        if (!fireConversions()) {
          const retryDelays = [500, 1000, 2000];
          let retryIndex = 0;

          const retryFire = () => {
            if (fireConversions()) return;
            retryIndex++;
            if (retryIndex < retryDelays.length) {
              setTimeout(retryFire, retryDelays[retryIndex]);
            } else {
              console.error('[Google Ads] Failed to fire conversion after retries - gtag not available');
            }
          };

          setTimeout(retryFire, retryDelays[0]);
        }
      } catch (err: any) {
        console.error('Error verifying session:', err);
        // Fallback to just getting session data if verification fails
        try {
          const response = await axios.get(`${API_BASE_URL}/checkout/session/stripe/${sessionId}`);
          setSessionData(response.data.payload);
        } catch {
          setError('Unable to verify your payment. Please contact support.');
        }
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [sessionId]);

  if (loading) {
    return (
      <>
        <Breadcrumb list={[]} prefixTitle="Payment Processing" />
        <Container>
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <CircularLoader />
            <p className="mt-4 text-gray-600">Verifying your payment...</p>
          </div>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Breadcrumb list={[]} prefixTitle="Payment Status" />
        <Container>
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-yellow-600 text-3xl">!</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Verification Issue</h1>
            <p className="text-gray-600 mb-6 max-w-md">{error}</p>
            <p className="text-sm text-gray-500 mb-6">
              If you completed a payment, please contact us at{' '}
              <a href="mailto:orders@printsyou.com" className="text-blue-600 hover:underline">
                orders@printsyou.com
              </a>
            </p>
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <Breadcrumb list={[]} prefixTitle="Payment Successful" />
      <Container>
        <div className="py-6 lg:py-12">
          {/* Success Header - Centered on all screens */}
          <div className="text-center mb-6 lg:mb-8">
            <div className="mb-3 lg:mb-4">
              <FaCheckCircle className="w-14 h-14 lg:w-20 lg:h-20 text-green-500 mx-auto" />
            </div>
            <h1 className="text-xl lg:text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-sm lg:text-base text-gray-600">
              Thank you for your payment. Your order has been confirmed.
            </p>
          </div>

          {/* 2-Column Grid Layout - 7/5 split on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Left Column (7 cols on desktop) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Order Details Card */}
              {sessionData && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 lg:p-6">
                  <h2 className="font-semibold text-gray-800 mb-3 lg:mb-4 text-base lg:text-lg">Payment Details</h2>
                  <div className="space-y-2 lg:space-y-3">
                    {sessionData.customerEmail && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-500 text-sm lg:text-base">Confirmation sent to:</span>
                        <span className="text-gray-800 font-medium text-sm lg:text-base truncate ml-2 max-w-[180px] lg:max-w-none">{sessionData.customerEmail}</span>
                      </div>
                    )}
                    {sessionData.amountTotal && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-500 text-sm lg:text-base">Amount Paid:</span>
                        <span className="text-gray-800 font-semibold text-base lg:text-lg">
                          ${sessionData.amountTotal.toFixed(2)} {sessionData.currency?.toUpperCase() || 'USD'}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-500 text-sm lg:text-base">Status:</span>
                      <span className="inline-flex items-center px-2.5 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium bg-green-100 text-green-800">
                        <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-500 rounded-full mr-1.5 lg:mr-2"></span>
                        Paid
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* MOBILE ONLY: Cross-Sell Products - Render between Payment Details and What's Next */}
              {sessionData && (
                <div className="lg:hidden">
                  <CrossSellProducts
                    productId={sessionData.productId}
                    discountPercent={10}
                    isOneTimeOffer={true}
                  />
                </div>
              )}

              {/* What's Next */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 lg:p-6">
                <h2 className="font-semibold text-blue-800 mb-3 lg:mb-4 text-base lg:text-lg">What Happens Next?</h2>
                <ul className="space-y-2.5 lg:space-y-3">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-5 h-5 lg:w-6 lg:h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs lg:text-sm font-medium mr-2.5 lg:mr-3">1</span>
                    <span className="text-blue-700 text-sm lg:text-base">You&apos;ll receive a confirmation email with your order details.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-5 h-5 lg:w-6 lg:h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs lg:text-sm font-medium mr-2.5 lg:mr-3">2</span>
                    <span className="text-blue-700 text-sm lg:text-base">Our team will review your order and prepare it for production.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-5 h-5 lg:w-6 lg:h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs lg:text-sm font-medium mr-2.5 lg:mr-3">3</span>
                    <span className="text-blue-700 text-sm lg:text-base">You&apos;ll receive tracking information once your order ships.</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                <Link
                  href="/"
                  className="flex-1 px-5 lg:px-6 py-2.5 lg:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-center text-sm lg:text-base"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/contact-us"
                  className="flex-1 px-5 lg:px-6 py-2.5 lg:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center text-sm lg:text-base"
                >
                  Contact Support
                </Link>
              </div>
            </div>

            {/* Right Column (5 cols) - DESKTOP ONLY: Cross-Sell Products */}
            <div className="hidden lg:block lg:col-span-5">
              {/* Cross-Sell Products - Based on purchased product */}
              {sessionData && (
                <CrossSellProducts
                  productId={sessionData.productId}
                  discountPercent={10}
                  isOneTimeOffer={true}
                />
              )}

              {/* Post-Purchase Upsell Offer - Store-level (fallback) */}
              {sessionData && (
                <div className="mt-6">
                  <PostPurchaseUpsell
                    orderId={sessionData.quoteRequestId || sessionData.stripeSessionId}
                    storeSlug="printsyou"
                  />
                </div>
              )}
            </div>

            {/* MOBILE ONLY: Post-Purchase Upsell at bottom */}
            {sessionData && (
              <div className="lg:hidden">
                <PostPurchaseUpsell
                  orderId={sessionData.quoteRequestId || sessionData.stripeSessionId}
                  storeSlug="printsyou"
                />
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

const CheckoutSuccessPage = () => {
  return (
    <Suspense
      fallback={
        <>
          <Breadcrumb list={[]} prefixTitle="Payment Processing" />
          <Container>
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <CircularLoader />
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </Container>
        </>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
};

export default CheckoutSuccessPage;
