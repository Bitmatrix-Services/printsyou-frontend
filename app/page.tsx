import HomeComponent from '@components/home/home-component';
import {getAllCategories, getBannersList, getFaqsList, getProductsByTag} from '@components/home/home-apis';
import React from 'react';

const ldJsonData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Prints You',
    description:
      'Discover top-quality promotional products. Perfect for trade shows, conventions or office swag. Elevate your brand with unique promotional products today!',
    email: 'info@printsyou.com',
    url: 'https://printsYou.com',
    logo: 'https://printsyou.com/assets/logo-full.png',
    telephone: '+1-469-434-7035',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '8602 Royal Star Rd',
      addressLocality: 'Rowlett',
      addressRegion: 'TX',
      postalCode: '75089',
      addressCountry: 'US'
    },
    sameAs: ['https://www.facebook.com/PrintsYouPromotional', 'https://www.linkedin.com/company/printsyou'],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-469-434-7035',
      contactOption: 'Phone',
      contactType: 'customer service',
      areaServed: 'US',
      availableLanguage: ['English'],
      email: 'info@printsyou.com'
    }
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: 'https://www.printsyou.com/',
    name: 'PrintsYou',
    potentialAction: {
      '@type': 'SearchAction',
      target:
        'https://printsyou.com/search-results?keywords={searchTerms}&filter=priceHighToLow&size=20&page=1&icid=gsearch',
      'query-input': 'required name=searchTerms'
    }
  }
];

export default async function HomePage() {
  const [categoriesData, bannersList, faqsResponse, ...productsData] = await Promise.all([
    getAllCategories(),
    getBannersList(),
    getFaqsList(),
    getProductsByTag('newAndExclusive'),
    getProductsByTag('under1Dollar'),
    getProductsByTag('mostPopular'),
    getProductsByTag('deals')
  ]);

  const sortedFaqs = [...(faqsResponse?.payload || [])].sort((a, b) => a.sequenceNumber - b.sequenceNumber);

  const getFaqsSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      [...sortedFaqs].map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      }))
    ]
  });

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ldJsonData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getFaqsSchema())
        }}
      />
      <HomeComponent
        bannersList={bannersList.payload}
        categories={categoriesData.payload}
        newAndExclusive={productsData[0]?.payload.content}
        underABuck={productsData[1]?.payload.content}
        innovativeIdea={productsData[2]?.payload.content}
        deals={productsData[3]?.payload.content}
        faqsList={sortedFaqs}
      />
    </section>
  );
}
