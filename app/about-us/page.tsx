import React from 'react';
import {Metadata} from 'next';
import {metaConstants} from '@utils/constants';
import {AboutUsComponent} from '@components/about-us.component';

function AboutUsPage() {
  return <AboutUsComponent />;
}

export default AboutUsPage;

export const metadata: Metadata = {
  title: `About Us | ${metaConstants.SITE_NAME}`,
  description: `Discover the story behind our promotional products company. Learn about our mission, values, and commitment to providing high-quality custom products that help businesses stand out. Find out more about us!`,
  alternates: {
    canonical: `${process.env.FE_URL}about-us`
  }
};
