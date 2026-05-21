import {Metadata} from 'next';
import {PropsWithChildren} from 'react';

export const metadata: Metadata = {
  title: 'Payment Successful | PrintsYou',
  description: 'Your payment has been processed successfully. Thank you for your order.',
  robots: {
    index: false,
    follow: false
  }
};

export default function CheckoutSuccessLayout({children}: PropsWithChildren) {
  return <>{children}</>;
}
