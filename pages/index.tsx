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
        viewMoreLink={`/search_results?filter=priceHighToLow&size=24&page=1&minPrice=0&maxPrice=1`}
      />
      {/* unique ideas section */}
      <FeaturedProductsSection
        title="Unique"
        navNumber="2"
        titleColor="text-red-500"
        subTitle="Ideas"
        products={allUniqueIdeas}
        viewMoreLink={`/search_results?tag=mostPopular&filter=priceHighToLow&page=1&size=24`}
      />
      {/*New & Exclusive */}
      <FeaturedProductsSection
        title="New"
        navNumber="3"
        titleColor="text-primary-600"
        subTitle="& Exclusive"
        products={newAndExclusive}
        viewMoreLink={`/search_results?tag=newAndExclusive&filter=priceHighToLow&page=1&size=24`}
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
