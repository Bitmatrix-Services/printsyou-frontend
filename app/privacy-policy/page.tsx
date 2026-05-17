import PrivacyPolicyComponent from '@components/privacy-policy.component';
import {Metadata} from 'next';
import {metaConstants} from '@utils/constants';

const PrivacyPolicyPage = () => {
  return <PrivacyPolicyComponent />;
};

export default PrivacyPolicyPage;

export const metadata: Metadata = {
  title: `Privacy Policy | ${metaConstants.SITE_NAME}`,
  description:
    'Learn how PrintsYou collects, uses, and protects your personal information. Our privacy policy explains our data practices and your rights regarding your personal data.',
  alternates: {
    canonical: `${process.env.FE_URL}privacy-policy`
  }
};
