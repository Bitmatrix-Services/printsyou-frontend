import {HowToOrderComponent} from '@components/how-to-order.component';
import {Metadata} from 'next';
import {metaConstants} from '@utils/constants';

const HowToOrderPage = () => {
  return <HowToOrderComponent />;
};

export default HowToOrderPage;

export const metadata: Metadata = {
  title: `How to Order | ${metaConstants.SITE_NAME}`,
  description: `Learn how to easily place an order for custom promotional products. Follow our simple step-by-step guide to select, customize, and purchase items that boost your brand. Start your order today!`,
  alternates: {
    canonical: `${process.env.FE_URL}how-to-order`
  }
};
