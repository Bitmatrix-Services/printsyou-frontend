'use client';

import {Suspense, useEffect, useState, useRef} from 'react';
import {useSearchParams} from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import {Container} from '@components/globals/container.component';
import {Breadcrumb} from '@components/globals/breadcrumb.component';
import {CircularLoader} from '@components/globals/circular-loader.component';
import {FaCheckCircle} from 'react-icons/fa';

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
        setSessionData(data);

        // Track successful payment - Google Analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'purchase', {
            transaction_id: data.stripeSessionId,
            value: data.amountTotal,
            currency: data.currency || 'USD'
          });

          // Google Ads Purchase Conversion
          (window as any).gtag('event', 'conversion', {
            send_to: 'AW-16709127988/SI9-CNz_w_EbELSexJ8-',
            transaction_id: data.stripeSessionId,
            value: data.amountTotal,
            currency: data.currency || 'USD'
          });
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
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
          <div className="max-w-lg w-full text-center">
            {/* Success Icon */}
            <div className="mb-6">
              <FaCheckCircle className="w-20 h-20 text-green-500 mx-auto" />
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
            <p className="text-gray-600 mb-8">
              Thank you for your payment. Your order has been confirmed and is being processed.
            </p>

            {/* Order Details Card */}
            {sessionData && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 text-left">
                <h2 className="font-semibold text-gray-800 mb-4">Payment Details</h2>
                <div className="space-y-3">
                  {sessionData.customerEmail && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Confirmation sent to:</span>
                      <span className="text-gray-800">{sessionData.customerEmail}</span>
                    </div>
                  )}
                  {sessionData.amountTotal && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount Paid:</span>
                      <span className="text-gray-800 font-semibold">
                        ${sessionData.amountTotal.toFixed(2)} {sessionData.currency?.toUpperCase() || 'USD'}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className="text-green-600 font-medium">Paid</span>
                  </div>
                </div>
              </div>
            )}

            {/* What&apos;s Next */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-8 text-left">
              <h2 className="font-semibold text-blue-800 mb-3">What Happens Next?</h2>
              <ul className="space-y-2 text-blue-700 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">1.</span>
                  <span>You&apos;ll receive a confirmation email with your order details.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2.</span>
                  <span>Our team will review your order and prepare it for production.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3.</span>
                  <span>You&apos;ll receive tracking information once your order ships.</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Continue Shopping
              </Link>
              <Link
                href="/contact-us"
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Contact Support
              </Link>
            </div>
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
