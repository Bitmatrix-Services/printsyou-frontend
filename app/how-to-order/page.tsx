import {HowToOrderComponent} from '@components/how-to-order.component';
import {Metadata} from 'next';
import {metaConstants} from '@utils/constants';

const HowToOrderPage = () => {
  return <HowToOrderComponent />;
};

export default HowToOrderPage;

export const metadata: Metadata = {
  title: `How to Order | ${metaConstants.SITE_NAME}`,
  alternates: {
    canonical: `${process.env.FE_URL}how-to-order`
  }
};
