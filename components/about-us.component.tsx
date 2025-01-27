import {Breadcrumb} from '@components/globals/breadcrumb.component';
import {AboutPrintsYouSection} from '@components/about-us/about-prints-you-section.component';
import {HeadlineSection} from '@components/about-us/headline-section.component';
import {IconBoxesSection} from '@components/about-us/icon-boxes.section.component';
import {OffersSection} from '@components/about-us/offers-section.component';
import React from 'react';

export const AboutUsComponent = () => {
  return (
    <>
      <script
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
            logo: 'https://printsyou.com/assets/logo-full.png',
            telephone: '+1-888-299-2940',
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
              telephone: '+1-888-299-2940',
              contactOption: 'TollFree',
              contactType: 'customer service',
              areaServed: 'US',
              availableLanguage: ['English'],
              email: 'info@printsyou.com'
            }
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
