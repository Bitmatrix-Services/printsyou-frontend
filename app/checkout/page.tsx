import {Metadata} from 'next';
import {Suspense} from 'react';
import {metaConstants} from '@utils/constants';
import {CheckoutComponent} from '@components/checkout.component';
import {CircularLoader} from '@components/globals/circular-loader.component';

const CheckoutPage = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><CircularLoader /></div>}>
      <CheckoutComponent />
    </Suspense>
  );
};

export default CheckoutPage;

export const metadata: Metadata = {
  title: `Checkout | ${metaConstants.SITE_NAME}`,
  robots: {
    index: false,
    follow: false
  },
  alternates: {
    canonical: `${process.env.FE_URL}checkout`
  }
};
