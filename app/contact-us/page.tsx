import {ContactUsComponent} from '@components/contact-us.component';
import {Metadata} from 'next';
import {metaConstants} from '@utils/constants';

const ContactUsPage = () => {
  return <ContactUsComponent />;
};

export default ContactUsPage;

export const metadata: Metadata = {
  title: `Contact Us | ${metaConstants.SITE_NAME}`,
  description: `Get in touch with our team for any inquiries about our promotional products and services. We're here to assist with custom orders, product details, and expert advice. Contact us today to discuss your branding needs.`,
  alternates: {
    canonical: `${process.env.FE_URL}contact-us`
  }
};
