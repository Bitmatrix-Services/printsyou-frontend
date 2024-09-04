import {Breadcrumb} from '@components/globals/breadcrumb.component';
import {AboutPrintsYouSection} from '@components/about-us/about-prints-you-section.component';
import {HeadlineSection} from '@components/about-us/headline-section.component';
import {IconBoxesSection} from '@components/about-us/icon-boxes.section.component';
import {OffersSection} from '@components/about-us/offers-section.component';
import React from 'react';

export const AboutUsComponent = () => {
  return (
    <>
      <Breadcrumb list={[]} prefixTitle="About Us" />
      <AboutPrintsYouSection />
      <HeadlineSection />
      <IconBoxesSection />
      <OffersSection />
    </>
  );
};
