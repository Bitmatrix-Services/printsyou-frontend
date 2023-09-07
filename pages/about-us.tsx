import Header from '@components/globals/Header';
import PageHeader from '@components/globals/PageHeader';
import AboutIdentitySection from '@components/sections/about/AboutIdentitySection';
import HealineSection from '@components/sections/about/HeadlineSection';
import IconBoxesSection from '@components/sections/about/IconBoxesSection';
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
    </main>
  );
}

export default About;
