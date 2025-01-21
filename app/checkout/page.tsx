import {Metadata} from 'next';
import {metaConstants} from '@utils/constants';
import {CheckoutComponent} from '@components/checkout.component';

const CheckoutPage = () => {
  return <CheckoutComponent />;
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
