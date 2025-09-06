import React from 'react';
import {Metadata} from 'next';
import {metaConstants} from '@utils/constants';
import {ThreePLComponent} from '@components/3pl.component';

function ThreePLPage() {
  return <ThreePLComponent />;
}

export default ThreePLPage;

export const metadata: Metadata = {
  title: `3PL | ${metaConstants.SITE_NAME}`,
  description: `Discover the story behind our promotional products company. Learn about our mission, values, and commitment to providing high-quality custom products that help businesses stand out. Find out more about us!`,
  alternates: {
    canonical: `${process.env.FE_URL}3pl`
  }
};
