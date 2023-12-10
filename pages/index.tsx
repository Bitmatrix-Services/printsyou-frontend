import React from 'react';
import AdvantageSection from '@components/sections/AdvantageSection';
import WhyIdentitySection from '@components/sections/WhyIdentitySection';
import HeroSection from '@components/sections/HeroSection';
import PromotionalCategoriesSection from '@components/sections/PromotionalCategoriesSection';
import FeaturedProductsSection from '@components/sections/FeaturedProductsSection';
import {
  getAllNewAndExclusiveProducts,
  getAllUnderABuckProducts,
  getAllUniqueIdeasProducts
} from '@store/slices/product/product.slice';
import {getAllPromotionalCategories} from '@store/slices/category/catgory.slice';
import {GetStaticProps, NextPage} from 'next';
import {Product} from '@store/slices/product/product';
import {Category} from '@store/slices/category/category';

interface IHome {
  promotionalCategories: Category[];
  underABuckProducts: Product[];
  newAndExclusive: Product[];
  allUniqueIdeas: Product[];
}

export const HomePage: NextPage<IHome> = ({
  underABuckProducts,
  newAndExclusive,
  allUniqueIdeas,
  promotionalCategories
}) => {
  return (
    <>
      <HeroSection />
      <PromotionalCategoriesSection categories={promotionalCategories} />
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
        products={allUniqueIdeas}
      />
      {/*New & Exclusive */}
      <FeaturedProductsSection
        title="New"
        navNumber="3"
        titleColor="text-primary-600"
        subTitle="& Exclusive"
        products={newAndExclusive}
      />
      <AdvantageSection />
      <WhyIdentitySection />
    </>
  );
};

export const getStaticProps = (async context => {
  const [
    promotionalCategories,
    underABuckProducts,
    newAndExclusive,
    allUniqueIdeas
  ] = await Promise.all([
    getAllPromotionalCategories(),
    getAllUnderABuckProducts(),
    getAllNewAndExclusiveProducts(),
    getAllUniqueIdeasProducts()
  ]);

  return {
    props: {
      promotionalCategories,
      underABuckProducts,
      newAndExclusive,
      allUniqueIdeas
    }
  };
}) satisfies GetStaticProps<IHome>;

export default HomePage;
