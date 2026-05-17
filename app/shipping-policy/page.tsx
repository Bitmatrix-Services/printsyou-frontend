import ShippingPolicyComponent from '@components/shipping-policy.component';
import {Metadata} from 'next';
import {metaConstants} from '@utils/constants';

const ShippingPolicyPage = () => {
  return <ShippingPolicyComponent />;
};

export default ShippingPolicyPage;

export const metadata: Metadata = {
  title: `Shipping Policy | ${metaConstants.SITE_NAME}`,
  description:
    'Learn about PrintsYou shipping methods, delivery times, and policies. We ship custom printed products throughout the United States with various shipping options.',
  alternates: {
    canonical: `${process.env.FE_URL}shipping-policy`
  }
};
