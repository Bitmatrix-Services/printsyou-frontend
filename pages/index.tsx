import React, {useEffect} from 'react';

import AdvantageSection from '@components/sections/AdvantageSection';
import WhyIdentitySection from '@components/sections/WhyIdentitySection';
import HeroSection from '@components/sections/HeroSection';
import PromotionalProductsSection from '@components/sections/PromotionalProductsSection';
import FeaturedProductsSection from '@components/sections/FeaturedProductsSection';
import {useAppDispatch} from '@store/hooks';
import {getPromotionalProducts} from '@store/slices/product/product.slice';

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getPromotionalProducts());
  }, []);

  return (
    <main>
      <HeroSection />
      <PromotionalProductsSection />
      {/* under a buck section */}
      <FeaturedProductsSection
        title="Under"
        subTitle="a buck"
        subTitleColor="#58c6f1"
        products={[]}
      />
      {/* unique ideas section */}
      <FeaturedProductsSection
        title="Unique"
        titleColor="text-red-500"
        subTitle="Ideas"
        products={[]}
      />
      {/*New & Exclusive */}
      <FeaturedProductsSection
        title="New"
        titleColor="text-primary-600"
        subTitle="& Exclusive"
        products={[]}
      />
      <AdvantageSection />
      <WhyIdentitySection />
    </main>
  );
}
