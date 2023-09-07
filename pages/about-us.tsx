import Header from '@components/globals/Header';
import PageHeader from '@components/globals/PageHeader';
import AboutIdentitySection from '@components/sections/about/AboutIdentitySection';
import OurPetsSection from '@components/sections/about/OurPetsSection';
import React from 'react';

function About() {
  return (
    <main>
      <Header />
      <PageHeader pageTitle="About us" />
      <AboutIdentitySection />
      <OurPetsSection />
    </main>
  );
}

export default About;
