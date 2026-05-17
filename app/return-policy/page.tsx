import ReturnPolicyComponent from '@components/return-policy.component';
import {Metadata} from 'next';
import {metaConstants} from '@utils/constants';

const ReturnPolicyPage = () => {
  return <ReturnPolicyComponent />;
};

export default ReturnPolicyPage;

export const metadata: Metadata = {
  title: `Return & Refund Policy | ${metaConstants.SITE_NAME}`,
  description:
    'Learn about PrintsYou return and refund policies for custom printed products. We stand behind the quality of our products and will make it right if there are any issues.',
  alternates: {
    canonical: `${process.env.FE_URL}return-policy`
  }
};
