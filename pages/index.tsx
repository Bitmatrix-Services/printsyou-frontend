import React from 'react';
import HeroSection from '@components/sections/HeroSection';
import FeaturedProductsSection from '@components/sections/FeaturedProductsSection';
import {
  getAllNewAndExclusiveProducts,
  getAllUnderABuckProducts,
  getAllUniqueIdeasProducts
} from '@store/slices/product/product.slice';
import {
  getAllBannerList,
  getAllPromotionalCategories
} from '@store/slices/category/catgory.slice';
import {GetStaticProps, NextPage} from 'next';
import {Product} from '@store/slices/product/product';
import {BannerList, Category} from '@store/slices/category/category';
import FeatureSection from '@components/sections/FeatureSection';
import ProductCategoriesSection from '@components/sections/ProductCategoriesSection';

interface IHome {
  promotionalCategories: Category[];
  underABuckProducts: Product[];
  newAndExclusive: Product[];
  allUniqueIdeas: Product[];
  bannerList: BannerList[];
}

export const HomePage: NextPage<IHome> = ({
  underABuckProducts,
  newAndExclusive,
  allUniqueIdeas,
  promotionalCategories,
  bannerList
}) => {
  return (
    <>
      <HeroSection bannerList={bannerList} />
      <FeatureSection />
      <ProductCategoriesSection />
      {/* under a buck section */}
      <FeaturedProductsSection
        title="Under"
        navNumber="1"
        subTitle="a buck"
        subTitleColor="text-[#56dabf]"
        products={underABuckProducts}
        //viewMoreLink={`/search_results?filter=priceHighToLow&size=24&page=1&minPrice=0&maxPrice=1`}
        viewMoreLink={``}
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
    </>
  );
};

export const getStaticProps = (async context => {
  const [
    promotionalCategories,
    underABuckProducts,
    newAndExclusive,
    allUniqueIdeas,
    bannerList
  ] = await Promise.all([
    getAllPromotionalCategories(),
    getAllUnderABuckProducts(),
    getAllNewAndExclusiveProducts(),
    getAllUniqueIdeasProducts(),
    getAllBannerList()
  ]);

  return {
    props: {
      promotionalCategories,
      underABuckProducts,
      newAndExclusive,
      allUniqueIdeas,
      bannerList
    }
  };
}) satisfies GetStaticProps<IHome>;

export default HomePage;
