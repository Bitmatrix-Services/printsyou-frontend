import PageHeader from '@components/globals/PageHeader';
import AboutPrintsYouSection from '@components/sections/about/AboutPrintsYouSection';
import HealineSection from '@components/sections/about/HeadlineSection';
import IconBoxesSection from '@components/sections/about/IconBoxesSection';
import OffersSection from '@components/sections/about/OffersSection';
import React from 'react';
import {NextSeo} from 'next-seo';
import {metaConstants} from '@utils/Constants';
import getConfig from 'next/config';

const config = getConfig();

function About() {
  return (
    <>
      <NextSeo
        title={`About Us | ${metaConstants.SITE_NAME}`}
        canonical={`${config.publicRuntimeConfig.FE_URL}about-us`}
      />
      <PageHeader pageTitle="About us" />
      <AboutPrintsYouSection />
      <HealineSection />
      <IconBoxesSection />
      <OffersSection />
    </>
  );
}

export default About;
