import React, {useEffect} from 'react';

import AdvantageSection from '@components/sections/AdvantageSection';
import WhyIdentitySection from '@components/sections/WhyIdentitySection';
import HeroSection from '@components/sections/HeroSection';
import PromotionalCategoriesSection from '@components/sections/PromotionalCategoriesSection';
import FeaturedProductsSection from '@components/sections/FeaturedProductsSection';
import {useAppDispatch, useAppSelector} from '@store/hooks';
import {
  getUnderABuckProducts,
  selectUnderABuckProducts,
  getNewAndExclusiveProducts,
  selectNewAndExclusiveProducts,
  getUniqueIdeaProducts,
  selectUniqueIdeaProducts
} from '@store/slices/product/product.slice';
import {getPromotionalCategories} from '@store/slices/category/catgory.slice';

export default function Home() {
  const dispatch = useAppDispatch();

  const underABuckProducts = useAppSelector(selectUnderABuckProducts);
  const newAndExclusiveProducts = useAppSelector(selectNewAndExclusiveProducts);
  const uniqueIdeaProducts = useAppSelector(selectUniqueIdeaProducts);

  useEffect(() => {
    dispatch(getPromotionalCategories());
    dispatch(getUnderABuckProducts());
    dispatch(getNewAndExclusiveProducts());
    dispatch(getUniqueIdeaProducts());
  }, []);

  return (
    <main>
      <HeroSection />
      <PromotionalCategoriesSection />
      {/* under a buck section */}
      <FeaturedProductsSection
        title="Under"
        navNumber="1"
        subTitle="a buck"
        subTitleColor="text-[#56dabf]"
        products={underABuckProducts}
      />
      {/* unique ideas section */}
      <FeaturedProductsSection
        title="Unique"
        navNumber="2"
        titleColor="text-red-500"
        subTitle="Ideas"
        products={uniqueIdeaProducts}
      />
      {/*New & Exclusive */}
      <FeaturedProductsSection
        title="New"
        navNumber="3"
        titleColor="text-primary-600"
        subTitle="& Exclusive"
        products={newAndExclusiveProducts}
      />
      <AdvantageSection />
      <WhyIdentitySection />
    </main>
  );
}
