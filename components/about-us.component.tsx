import {Breadcrumb} from '@components/globals/breadcrumb.component';
import {AboutPrintsYouSection} from '@components/about-us/about-prints-you-section.component';
import {HeadlineSection} from '@components/about-us/headline-section.component';
import {IconBoxesSection} from '@components/about-us/icon-boxes.section.component';
import {OffersSection} from '@components/about-us/offers-section.component';
import React from 'react';
import Script from 'next/script';

export const AboutUsComponent = () => {
  return (
    <>
      <Script
        id="organization-ld-schema"
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
            ],
            makesOffer: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Product',
                  name: 'Promotional Products'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Product',
                  name: 'Custom Printed Products'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Product',
                  name: 'Corporate Gifts'
                }
              }
            ]
          })
        }}
      />
      <Breadcrumb list={[]} prefixTitle="About Us" />
      <AboutPrintsYouSection />
      <HeadlineSection />
      <IconBoxesSection />
      <OffersSection />
    </>
  );
};
