import TermsAndConditionsComponent from '@components/terms-and-conditions.component';
import {Metadata} from 'next';
import {metaConstants} from '@utils/constants';

const TermsAndConditionsPage = () => {
  return <TermsAndConditionsComponent />;
};

export default TermsAndConditionsPage;

export const metadata: Metadata = {
  title: `Terms and Conditions | ${metaConstants.SITE_NAME}`,
  description:
    'Review the terms and conditions that govern your use of our promotional products store. Learn about our policies on purchasing, returns, privacy, and more to ensure a smooth shopping experience.',
  alternates: {
    canonical: `${process.env.FE_URL}terms-and-conditions`
  }
};
