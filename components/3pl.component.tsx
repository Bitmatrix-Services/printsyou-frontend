import {Breadcrumb} from '@components/globals/breadcrumb.component';
import {ThreePLServicesDetails} from '@components/3pl/threePL-components';
import React from 'react';

export const ThreePLComponent = () => {
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
          })
        }}
      />
      <Breadcrumb list={[]} prefixTitle="3PL + Fulfillment" />
      <ThreePLServicesDetails />
    </>
  );
};
