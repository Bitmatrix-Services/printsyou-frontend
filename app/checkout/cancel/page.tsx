'use client';

import {useEffect} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {Container} from '@components/globals/container.component';
import {Breadcrumb} from '@components/globals/breadcrumb.component';
import {MdCancel} from 'react-icons/md';

const CheckoutCancelPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Track cancelled checkout
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'checkout_cancelled');
    }
  }, []);

  return (
    <>
      <Breadcrumb list={[]} prefixTitle="Payment Cancelled" />
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
          <div className="max-w-lg w-full text-center">
            {/* Cancel Icon */}
            <div className="mb-6">
              <MdCancel className="w-20 h-20 text-gray-400 mx-auto" />
            </div>

            {/* Cancel Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Cancelled</h1>
            <p className="text-gray-600 mb-8">
              Your payment was cancelled. No charges have been made to your account.
            </p>

            {/* Info Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 text-left">
              <h2 className="font-semibold text-gray-800 mb-3">What would you like to do?</h2>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">-</span>
                  <span>
                    <strong>Try again:</strong> Return to your quote and complete the payment.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">-</span>
                  <span>
                    <strong>Need help?</strong> Contact our support team if you encountered any issues.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">-</span>
                  <span>
                    <strong>Continue shopping:</strong> Browse our products and request a new quote.
                  </span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.back()}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Go Back
              </button>
              <Link
                href="/"
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Continue Shopping
              </Link>
            </div>

            {/* Support Contact */}
            <p className="mt-8 text-sm text-gray-500">
              Questions? Contact us at{' '}
              <a href="mailto:orders@printsyou.com" className="text-blue-600 hover:underline">
                orders@printsyou.com
              </a>{' '}
              or call{' '}
              <a href="tel:+14694347035" className="text-blue-600 hover:underline">
                (469) 434-7035
              </a>
            </p>
          </div>
        </div>
      </Container>
    </>
  );
};

export default CheckoutCancelPage;
