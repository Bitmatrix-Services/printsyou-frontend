import PageHeader from '@components/globals/PageHeader';
import AboutIdentitySection from '@components/sections/about/AboutIdentitySection';
import HealineSection from '@components/sections/about/HeadlineSection';
import IconBoxesSection from '@components/sections/about/IconBoxesSection';
import OffersSection from '@components/sections/about/OffersSection';
import OurPetsSection from '@components/sections/about/OurPetsSection';
import React from 'react';

function About() {
  return (
    <main>
      <PageHeader pageTitle="About us" />
      <AboutIdentitySection />
      <OurPetsSection />
      <HealineSection />
      <IconBoxesSection />
      <OffersSection />
    </main>
  );
}

export default About;
