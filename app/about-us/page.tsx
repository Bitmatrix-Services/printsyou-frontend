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
  alternates: {
    canonical: `${process.env.FE_URL}about-us`
  }
};
