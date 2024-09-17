import HomeComponent from '@components/home/home-component';
import {getAllCategories, getBannersList, getProductsByTag} from '@components/home/home-apis';
import React from 'react';

export default async function HomePage() {
  const categoriesData = await getAllCategories();
  const newAndExclusiveData = await getProductsByTag('newAndExclusive');
  const underABuck = await getProductsByTag('featured');
  const innovativeIdea = await getProductsByTag('mostPopular');
  const deals = await getProductsByTag('deals');
  const bannersList = await getBannersList();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'http://schema.org',
            '@type': 'LocalBusiness',
            name: 'Prints You',
            description:
              'Discover top-quality promotional products. Perfect for trade shows, conventions or office swag. Elevate your brand with unique promotional products today!',
            telephone: '877-934-1874',
            email: 'info@printsyou.com',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Rowlett',
              addressRegion: 'TX',
              streetAddress: '8602 Royal Star Road',
              postalCode: '75089',
              addressCountry: 'US'
            },
            sameAs: [['https://www.facebook.com/PrintsYouPromotional', 'https://www.linkedin.com/company/printsyou']],
            url: 'https://printsyou.com',
            image: 'https://printsyou.com/assets/logo-full.png'
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Store',
            image: ['https://printsyou.com/assets/logo-full.png'],
            name: 'Prints You Custom Promotional Products',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Rowlett',
              addressRegion: 'TX',
              streetAddress: '8602 Royal Star Road',
              postalCode: '75089',
              addressCountry: 'US'
            },
            priceRange: '$$$',
            telephone: '+18779341874',
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                opens: '08:00',
                closes: '19:00'
              },
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'Sunday',
                opens: '10:00',
                closes: '18:00'
              }
            ]
          })
        }}
      />
      <HomeComponent
        bannersList={bannersList.payload}
        categories={categoriesData.payload}
        newAndExclusive={newAndExclusiveData.payload.content}
        underABuck={underABuck.payload.content}
        innovativeIdea={innovativeIdea.payload.content}
        deals={deals.payload.content}
      />
    </>
  );
}
