import {ContactUsComponent} from '@components/contact-us.component';
import {Metadata} from 'next';
import {metaConstants} from '@utils/constants';

const ContactUsPage = () => {
  return <ContactUsComponent />;
};

export default ContactUsPage;

export const metadata: Metadata = {
  title: `Contact Us | ${metaConstants.SITE_NAME}`,
  alternates: {
    canonical: `${process.env.FE_URL}contact-us`
  }
};
