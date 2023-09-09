import React from 'react';

import AdvantageSection from '@components/sections/AdvantageSection';
import WhyIdentitySection from '@components/sections/WhyIdentitySection';
import Footer from '@components/globals/Footer';
import HeroSection from '@components/sections/HeroSection';
import ProductCategoriesSection from '@components/sections/ProductCategoriesSection';
import FeaturedSection from '@components/sections/FeaturedSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProductCategoriesSection />
      <FeaturedSection />
      <AdvantageSection />
      <WhyIdentitySection />
    </main>
  );
}
