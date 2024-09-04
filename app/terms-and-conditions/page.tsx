import TermsAndConditionsComponent from '@components/terms-and-conditions.component';
import {Metadata} from 'next';
import {metaConstants} from '@utils/constants';

const TermsAndConditionsPage = () => {
  return <TermsAndConditionsComponent />;
};

export default TermsAndConditionsPage;

export const metadata: Metadata = {
  title: `Terms and Conditions | ${metaConstants.SITE_NAME}`,
  alternates: {
    canonical: `${process.env.FE_URL}terms-and-conditions`
  }
};
