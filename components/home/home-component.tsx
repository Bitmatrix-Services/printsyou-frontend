'use client';
import {HeroSection} from '@components/home/hero-section.component';
import {Container} from '@components/globals/container.component';
import {CategorySection} from '@components/home/category/category-section.component';
import {BannerList, Category, Faq} from '@components/home/home.types';
import React, {FC, Suspense, useEffect, useMemo} from 'react';
import {EnclosureProduct} from '@components/home/product/product.types';
import dynamic from 'next/dynamic';

const SliderSkeleton = () => <div className="h-64 animate-pulse bg-gray-100 rounded-lg" />;
const BannerSkeleton = () => <div className="h-48 animate-pulse bg-gray-100 rounded-lg" />;

const ProductSliderSection = dynamic(
  () => import('@components/home/product/product-slider-section.component').then(mod => mod.ProductSliderSection),
  {
    ssr: false,
    loading: SliderSkeleton
  }
);

const PromotionalBanner = dynamic(
  () => import('@components/home/promotional-banner.component').then(mod => mod.PromotionalBanner),
  {
    ssr: false,
    loading: BannerSkeleton
  }
);

const Benefits = dynamic(() => import('@components/home/benefits-sections.component').then(mod => mod.Benefits), {
  ssr: false,
  loading: BannerSkeleton
});

const FaqSectionComponent = dynamic(
  () => import('@components/home/faq.section.component').then(mod => mod.FaqSectionComponent),
  {
    ssr: false,
    loading: SliderSkeleton
  }
);

interface IHome {
  categories: Category[];
  underABuck: EnclosureProduct[];
  newAndExclusive: EnclosureProduct[];
  innovativeIdea: EnclosureProduct[];
  deals: EnclosureProduct[];
  bannersList: BannerList[];
  faqsList: Faq[];
}

const HomeComponent: FC<IHome> = ({
  categories,
  underABuck,
  newAndExclusive,
  innovativeIdea,
  deals,
  bannersList,
  faqsList
}) => {
  useEffect(() => {
    import('@components/home/product/product-slider-section.component');
    import('@components/home/promotional-banner.component');
  }, []);

  const primaryBanners = useMemo(() => bannersList.filter(banner => banner.type === 'primary'), [bannersList]);
  const secondaryBanners = useMemo(() => bannersList.filter(banner => banner.type === 'secondary'), [bannersList]);
  const tertiaryBanners = useMemo(() => bannersList.filter(banner => banner.type === 'tertiary'), [bannersList]);

  return (
    <main>
      <HeroSection bannersList={primaryBanners} />

      <Container>
        <CategorySection categoryList={categories.filter(item => item.imageUrl)} navNumber={1} />

        <Suspense fallback={<SliderSkeleton />}>
          <ProductSliderSection
            title="new & exclusive"
            productList={newAndExclusive}
            navNumber={2}
            showAllUrl={`/search-results?tag=newAndExclusive&filter=priceHighToLow&page=1&size=20`}
          />
        </Suspense>
      </Container>

      <Container>
        <Suspense fallback={<SliderSkeleton />}>
          <ProductSliderSection
            title="innovative idea"
            productList={innovativeIdea}
            navNumber={4}
            showAllUrl={`/search-results?tag=mostPopular&filter=priceHighToLow&page=1&size=20`}
          />
        </Suspense>
      </Container>

      <div className="py-4 my-16 border-y border-primary-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {secondaryBanners?.map(banner => (
            <Suspense key={banner.id} fallback={<BannerSkeleton />}>
              <PromotionalBanner
                link={banner.bannerCategory.ucategoryName}
                imageUrl={banner.bannerUrl}
                title={banner.heading}
                description={banner.tagLines}
              />
            </Suspense>
          ))}
        </div>
      </div>

      <Container>
        <Suspense fallback={<SliderSkeleton />}>
          <ProductSliderSection
            title="under $1"
            productList={underABuck}
            navNumber={3}
            showAllUrl={`/search-results?tag=under1Dollar&filter=priceHighToLow&size=20&page=1`}
          />
        </Suspense>
      </Container>

      <div className="py-4 my-16 border-y border-primary-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {tertiaryBanners?.map(banner => (
            <Suspense key={banner.id} fallback={<BannerSkeleton />}>
              <PromotionalBanner
                link={banner.bannerCategory.ucategoryName}
                imageUrl={banner.bannerUrl}
                title={banner.heading}
                description={banner.tagLines}
              />
            </Suspense>
          ))}
        </div>
      </div>

      <Container>
        <Suspense fallback={<SliderSkeleton />}>
          <ProductSliderSection
            title="deals"
            productList={deals}
            navNumber={4}
            showAllUrl={`/search-results?tag=deals&filter=priceHighToLow&size=20&page=1`}
          />
        </Suspense>
      </Container>

      <Suspense fallback={<BannerSkeleton />}>
        <Benefits />
      </Suspense>

      <Suspense fallback={<SliderSkeleton />}>
        <FaqSectionComponent faqsList={faqsList} />
      </Suspense>
    </main>
  );
};

export default HomeComponent;
