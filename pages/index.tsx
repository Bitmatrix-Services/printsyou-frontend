import React from 'react';
import HeroSection from '@components/sections/HeroSection';
import FeaturedProductsSection from '@components/sections/FeaturedProductsSection';
import {
  getAllNewAndExclusiveProducts,
  getAllUnderABuckProducts,
  getAllUniqueIdeasProducts,
  getAllHomeCategoryProducts
} from '@store/slices/product/product.slice';
import {getAllBannerList} from '@store/slices/category/catgory.slice';
import {GetStaticProps, NextPage} from 'next';
import {HomeCategoryProduts, Product} from '@store/slices/product/product';
import {BannerList} from '@store/slices/category/category';
import FeatureSection from '@components/sections/FeatureSection';
import ProductCategoriesSection from '@components/sections/ProductCategoriesSection';
import BenefitsSection from '@components/sections/BenefitsSection';
import {NextSeo} from 'next-seo';
import {metaConstants} from '@utils/Constants';

interface IHome {
  underABuckProducts: Product[];
  newAndExclusive: Product[];
  allUniqueIdeas: Product[];
  bannerList: BannerList[];
  homeCategoryProducts: HomeCategoryProduts[];
}

export const HomePage: NextPage<IHome> = ({
  underABuckProducts,
  newAndExclusive,
  allUniqueIdeas,
  bannerList,
  homeCategoryProducts
}) => {
  return (
    <>
      <NextSeo title={metaConstants.SITE_NAME} />
      <HeroSection bannerList={bannerList} />
      <ProductCategoriesSection homeCategoryProducts={homeCategoryProducts} />
      {/* under a buck section */}
      <FeaturedProductsSection
        title="Under"
        navNumber="1"
        subTitle="a buck"
        subTitleColor="text-[#56dabf]"
        products={underABuckProducts}
        viewMoreLink={`/search-results?filter=priceHighToLow&size=24&page=1&minPrice=0&maxPrice=1`}
      />
      {/* unique ideas section */}
      <FeaturedProductsSection
        title="Unique"
        navNumber="2"
        subTitle="Ideas"
        products={allUniqueIdeas}
        viewMoreLink={`/search-results?tag=mostPopular&filter=priceHighToLow&page=1&size=24`}
      />
      {/*New & Exclusive */}
      <FeaturedProductsSection
        title="New"
        navNumber="3"
        titleColor="text-primary-600"
        subTitle="& Exclusive"
        products={newAndExclusive}
        viewMoreLink={`/search-results?tag=newAndExclusive&filter=priceHighToLow&page=1&size=24`}
      />

      <BenefitsSection />
      <FeatureSection />
    </>
  );
};

export const getStaticProps = (async context => {
  const [
    underABuckProducts,
    newAndExclusive,
    allUniqueIdeas,
    bannerList,
    homeCategoryProducts
  ] = await Promise.all([
    getAllUnderABuckProducts(),
    getAllNewAndExclusiveProducts(),
    getAllUniqueIdeasProducts(),
    getAllBannerList(),
    getAllHomeCategoryProducts()
  ]);

  return {
    props: {
      underABuckProducts,
      newAndExclusive,
      allUniqueIdeas,
      bannerList,
      homeCategoryProducts
    },
    revalidate: 60
  };
}) satisfies GetStaticProps<IHome>;

export default HomePage;
