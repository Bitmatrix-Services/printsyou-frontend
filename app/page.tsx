import HomeComponent from '@components/home/home-component';
import {getAllCategories, getBannersList, getFaqsList, getProductsByTag} from '@components/home/home-apis';
import React from 'react';
import Script from 'next/script';
import {Faq} from '@components/home/home.types';

export default async function HomePage() {
  const categoriesData = await getAllCategories();
  const newAndExclusiveData = await getProductsByTag('newAndExclusive');
  const underABuck = await getProductsByTag('under1Dollar');
  const innovativeIdea = await getProductsByTag('mostPopular');
  const deals = await getProductsByTag('deals');
  const bannersList = await getBannersList();

  const response = await getFaqsList();
  let faqsList: Faq[] = [];
  if (response?.payload) faqsList = response.payload;

  return (
    <section>
      <Script
        id="home-page-ld-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Prints You',
            description:
              'Discover top-quality promotional products. Perfect for trade shows, conventions or office swag. Elevate your brand with unique promotional products today!',
            email: 'info@printsyou.com',
            url: 'https://printsYou.com',
            telephone: '+1-877-934-1874',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '8602 Royal Star Rd',
              addressLocality: 'Rowlett',
              addressRegion: 'TX',
              postalCode: '75089',
              addressCountry: 'US'
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: '32.93553656433128',
              longitude: '-96.57029793014921'
            },
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '08:00',
                closes: '17:00'
              }
            ],
            sameAs: ['https://www.facebook.com/PrintsYouPromotional', 'https://www.linkedin.com/company/printsyou'],
            foundingDate: '2022',
            image: 'https://printsyou.com/assets/logo-full.png',
            priceRange: '$$',
            areaServed: 'United States',
            contactPoint: [
              {
                '@type': 'ContactPoint',
                telephone: '+1-877-934-1874',
                contactType: 'customer service'
              },
              {
                '@type': 'ContactPoint',
                email: 'info@printsyou.com',
                contactType: 'customer support'
              }
            ]
            // makesOffer: [
            //   {
            //     '@type': 'Offer',
            //     itemOffered: {
            //       '@type': 'Product',
            //       name: 'Promotional Products'
            //     }
            //   },
            //   {
            //     '@type': 'Offer',
            //     itemOffered: {
            //       '@type': 'Product',
            //       name: 'Custom Printed Products'
            //     }
            //   },
            //   {
            //     '@type': 'Offer',
            //     itemOffered: {
            //       '@type': 'Product',
            //       name: 'Corporate Gifts'
            //     }
            //   }
            // ]
          })
        }}
      />
      <Script
        id="store-page-ld-schema"
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
      <Script
        id="faq-ld-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              [...faqsList]
                .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
                .map(item => ({
                  '@type': 'Question',
                  name: item.question,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.answer
                  }
                }))
            ]
          })
        }}
      />
      <Script
        id="chatwoot-integration"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            (function(d,t) {
              var BASE_URL="https://chatwoot.printsyou.com/";
              var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
              g.src=BASE_URL+"/packs/js/sdk.js";
              g.defer = true;
              g.async = true;
              s.parentNode.insertBefore(g,s);
              g.onload=function(){
                window.chatwootSDK.run({
                  websiteToken: 'LQKAw5skqedd5h5WWeUAFvQR',
                  baseUrl: BASE_URL
                })
              }
            })(document,"script");
          `
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
    </section>
  );
}
