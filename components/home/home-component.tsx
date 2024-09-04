'use client';
import {HeroSection} from '@components/home/hero-section.component';
import {Container} from '@components/globals/container.component';
import {ProductSliderSection} from '@components/home/product/product-slider-section.component';
import {Benefits} from '@components/home/benefits-sections.component';
import {PromotionalBanner} from '@components/home/promotional-banner.component';
import {CategorySection} from '@components/home/category/category-section.component';
import {BannerList, Category, Faq} from '@components/home/home.types';
import {FC} from 'react';
import {FeatureSection} from '@components/home/feature-section.component';
import {FaqSectionComponent} from '@components/home/faq.section.component';
import {Product} from '@components/home/product/product.types';

interface IHome {
  categories: Category[];
  underABuckProducts: Product[];
  newAndExclusive: Product[];
  allUniqueIdeas: Product[];
  bannersList: BannerList[];
  faqsList: Faq[];
}

const HomeComponent: FC<IHome> = ({
  categories,
  underABuckProducts,
  newAndExclusive,
  allUniqueIdeas,
  bannersList,
  faqsList
}) => {
  return (
    <main>
      <HeroSection bannersList={bannersList} />
      <Container>
        <CategorySection categoryList={categories.filter(item => item.imageUrl)} navNumber={1} />
        <ProductSliderSection
          title="new & exclusive"
          productList={newAndExclusive}
          navNumber={2}
          showAllUrl={`/search-results?tag=newAndExclusive&filter=priceHighToLow&page=1&size=24`}
        />
      </Container>
      {/*<div className="py-4 my-16 border-y border-primary-500">*/}
      {/*  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">*/}
      {/*    <PromotionalBanner imageUrl="/assets/posters.png" />*/}
      {/*    <PromotionalBanner imageUrl="/assets/flyers.png" />*/}
      {/*  </div>*/}
      {/*</div>*/}

      <Container>
        <ProductSliderSection
          title="just a buck"
          productList={underABuckProducts}
          navNumber={3}
          showAllUrl={`/search-results?tag=featured&filter=priceHighToLow&size=24&page=1&minPrice=0&maxPrice=1`}
        />
      </Container>

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
          productList={allUniqueIdeas}
          navNumber={4}
          showAllUrl={`/search-results?tag=mostPopular&filter=priceHighToLow&page=1&size=24`}
        />
      </Container>

      <div className="py-4 my-16 border-y border-primary-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <PromotionalBanner
            link="/categories/plush-amp-novelties/fidget-toys-amp-stress-relievers"
            imageUrl="/assets/stress-reliver.png"
            title="fidget toys & stress relievers"
            description="Discover our range of fidget toys and stress relievers to boost focus and reduce anxiety. Perfect for all ages! Shop now for a calmer mind."
          />
          <PromotionalBanner
            link="/categories/desk-amp-office"
            imageUrl="/assets/office-supplies.png"
            title="desk & office"
            description="Discover stylish and functional desk and office solutions to enhance productivity and comfort in your workspace. Shop now!"
          />
        </div>
      </div>

      <Container>
        <ProductSliderSection title="deals" productList={allUniqueIdeas} navNumber={5} />
      </Container>

      <div className="py-4 my-16 border-y border-primary-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <PromotionalBanner
            link="/categories/awards"
            imageUrl="/assets/awards.png"
            title="awards"
            description="Explore our prestigious awards showcasing excellence and innovation. Discover winners and celebrate achievements in various fields."
          />
          <PromotionalBanner
            link="/categories/bags-duffels-amp-accessories"
            imageUrl="/assets/bags.png"
            title="bags, duffels & accessories"
            description="Discover stylish bags, duffels, and accessories for every occasion. Shop now for quality and versatility to elevate your travel game!"
          />
        </div>
      </div>

      {/*<OffersSection*/}
      {/*    tagLine="Check Our Upcoming Product Inventory"*/}
      {/*    title="Upcoming Product"*/}
      {/*    subtitle="Get Ready"*/}
      {/*    description="We’re constantly expanding our catalog to bring you the latest and greatest in print-on-demand products. Be on the lookout for upcoming additions like custom footwear, pet accessories, and more. Sign up for our newsletter to stay updated on new arrivals and exclusive offers."*/}
      {/*    imageUrl="/assets/upcoming-bags.jpg"*/}
      {/*/>*/}
      <Benefits />
      <FeatureSection />
      <FaqSectionComponent faqsList={faqsList} />
    </main>
  );
};

export default HomeComponent;
