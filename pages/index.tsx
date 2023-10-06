import React, {useEffect} from 'react';

import AdvantageSection from '@components/sections/AdvantageSection';
import WhyIdentitySection from '@components/sections/WhyIdentitySection';
import HeroSection from '@components/sections/HeroSection';
import PromotionalProductsSection from '@components/sections/PromotionalProductsSection';
import FeaturedProductsSection from '@components/sections/FeaturedProductsSection';
import {useAppDispatch, useAppSelector} from '@store/hooks';
import {getPromotionalProducts, getUnderABuckProducts, selectUnderABuckProducts} from '@store/slices/product/product.slice';

export default function Home() {
  const dispatch = useAppDispatch();

  const underABuckProducts = useAppSelector(selectUnderABuckProducts);

  useEffect(() => {
    dispatch(getPromotionalProducts());
    dispatch(getUnderABuckProducts());
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
        products={underABuckProducts}
      />
      {/* unique ideas section */}
      <FeaturedProductsSection
        title="Unique"
        titleColor="text-red-500"
        subTitle="Ideas"
        products={underABuckProducts}
      />
      {/*New & Exclusive */}
      <FeaturedProductsSection
        title="New"
        titleColor="text-primary-600"
        subTitle="& Exclusive"
        products={underABuckProducts}
      />
      <AdvantageSection />
      <WhyIdentitySection />
    </main>
  );
}
