'use client';
import {HeroSection} from '@components/home/hero-section.component';
import {Container} from '@components/globals/container.component';
import {ProductSliderSection} from '@components/home/product/product-slider-section.component';
import {Benefits} from '@components/home/benefits-sections.component';
import {PromotionalBanner} from '@components/home/promotional-banner.component';
import {CategorySection} from '@components/home/category/category-section.component';
import {BannerList, Category, Faq} from '@components/home/home.types';
import React, {FC, useMemo} from 'react';
import {EnclosureProduct} from '@components/home/product/product.types';
import {FaqSectionComponent} from '@components/home/faq.section.component';
import dynamic from 'next/dynamic';

interface IHome {
  categories: Category[];
  underABuck: EnclosureProduct[];
  newAndExclusive: EnclosureProduct[];
  innovativeIdea: EnclosureProduct[];
  deals: EnclosureProduct[];
  bannersList: BannerList[];
  faqsList: Faq[];
}

const AddToCartModalClientSide = dynamic(
  () => import('./../globals/cart/add-to-cart-modal.component').then(file => file.AddToCartModal),
  {
    ssr: false,
    loading: () => null
  }
);

const HomeComponent: FC<IHome> = ({
  categories,
  underABuck,
  newAndExclusive,
  innovativeIdea,
  deals,
  bannersList,
  faqsList
}) => {
  const primaryBanners = useMemo(() => {
    return bannersList.filter(banner => banner.type === 'primary');
  }, [bannersList]);

  const secondaryBanners = useMemo(() => {
    return bannersList.filter(banner => banner.type === 'secondary');
  }, [bannersList]);

  const tertiaryBanners = useMemo(() => {
    return bannersList.filter(banner => banner.type === 'tertiary');
  }, [bannersList]);

  return (
    <main>
      <HeroSection bannersList={primaryBanners} />
      <Container>
        <CategorySection categoryList={categories.filter(item => item.imageUrl)} navNumber={1} />
        <ProductSliderSection
          title="new & exclusive"
          productList={newAndExclusive}
          navNumber={2}
          showAllUrl={`/search-results?tag=newAndExclusive&filter=priceHighToLow&page=1&size=20`}
        />
      </Container>
      {/*<div className="py-4 my-16 border-y border-primary-500">*/}
      {/*  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">*/}
      {/*    <PromotionalBanner imageUrl="/assets/posters.png" />*/}
      {/*    <PromotionalBanner imageUrl="/assets/flyers.png" />*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*<OffersSection*/}
      {/*  title="Gifts"*/}
      {/*  subtitle="Share the Love"*/}
      {/*  description="Create personalized gifts that are perfect for birthdays, holidays, and special moments. From photo books and custom puzzles to unique keepsakes, our range of personalized gifts will show your loved ones how much you care. Celebrate every occasion with a touch of creativity and thoughtfulness."*/}
      {/*  imageUrl="/assets/gifts.jpg"*/}
      {/*  imageLeft*/}
      {/*  imageHeight={380}*/}
      {/*/>*/}

      {/*<div className="py-4 my-16 border-y border-primary-500">*/}
      {/*  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">*/}
      {/*    <PromotionalBanner imageUrl="/assets/banners.png" />*/}
      {/*    <PromotionalBanner imageUrl="/assets/cards.png" />*/}
      {/*  </div>*/}
      {/*</div>*/}

      <Container>
        <ProductSliderSection
          title="innovative idea"
          productList={innovativeIdea}
          navNumber={4}
          showAllUrl={`/search-results?tag=mostPopular&filter=priceHighToLow&page=1&size=20`}
        />
      </Container>

      <div className="py-4 my-16 border-y border-primary-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {secondaryBanners?.map(banner => (
            <PromotionalBanner
              key={banner.id}
              link={banner.bannerCategory.ucategoryName}
              imageUrl={banner.bannerUrl}
              title={banner.heading}
              description={banner.tagLines}
            />
          ))}
        </div>
      </div>

      <Container>
        <ProductSliderSection
          title="under $1"
          productList={underABuck}
          navNumber={3}
          showAllUrl={`/search-results?tag=under1Dollar&filter=priceHighToLow&size=20&page=1`}
        />
      </Container>

      {/*<Container>*/}
      {/*  <ProductSliderSection title="deals" productList={deals} navNumber={5} />*/}
      {/*</Container>*/}

      <div className="py-4 my-16 border-y border-primary-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {tertiaryBanners?.map(banner => (
            <PromotionalBanner
              key={banner.id}
              link={banner.bannerCategory.ucategoryName}
              imageUrl={banner.bannerUrl}
              title={banner.heading}
              description={banner.tagLines}
            />
          ))}
        </div>
      </div>

      <Container>
        <ProductSliderSection
          title="deals"
          productList={deals}
          navNumber={4}
          showAllUrl={`/search-results?tag=deals&filter=priceHighToLow&size=20&page=1`}
        />
      </Container>

      {/*<OffersSection*/}
      {/*    tagLine="Check Our Upcoming Product Inventory"*/}
      {/*    title="Upcoming Product"*/}
      {/*    subtitle="Get Ready"*/}
      {/*    description="We’re constantly expanding our catalog to bring you the latest and greatest in print-on-demand products. Be on the lookout for upcoming additions like custom footwear, pet accessories, and more. Sign up for our newsletter to stay updated on new arrivals and exclusive offers."*/}
      {/*    imageUrl="/assets/upcoming-bags.jpg"*/}
      {/*/>*/}
      <Benefits />
      {/*<FeatureSection />*/}
      <FaqSectionComponent faqsList={faqsList} />
      <AddToCartModalClientSide />
    </main>
  );
};

export default HomeComponent;
