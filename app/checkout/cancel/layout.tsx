import {Metadata} from 'next';
import {PropsWithChildren} from 'react';

export const metadata: Metadata = {
  title: 'Payment Cancelled | PrintsYou',
  description: 'Your payment was cancelled. You can try again or contact support.',
  robots: {
    index: false,
    follow: false
  }
};

export default function CheckoutCancelLayout({children}: PropsWithChildren) {
  return <>{children}</>;
}
