import type {Metadata} from 'next';
import React, {PropsWithChildren} from 'react';
import {ReactQueryClientProvider} from './query-client-provider';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '@styles/globals.scss';
import {Header} from '@components/globals/header.component';
import {Footer} from '@components/globals/footer.component';
import {getAllCategories} from '@components/home/home-apis';
import {ReduxProvider} from './redux-provider';
import dynamic from 'next/dynamic';
import {metaConstants} from '@utils/constants';
import {NotificationComponent} from '@components/notification/notification.component';
import {CSPostHogProvider} from './provider';
import Head from 'next/head';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.FE_URL as string),
  title: metaConstants.SITE_NAME,
  description: metaConstants.DESCRIPTION,
  openGraph: {
    images: '/assets/logo-full.png',
    title: metaConstants.SITE_NAME,
    description: metaConstants.DESCRIPTION
  }
};

const AddToCartModalClientSide = dynamic(
  () => import('./../components/globals/cart/add-to-cart-modal.component').then(file => file.AddToCartModal),
  {
    ssr: false,
    loading: () => null
  }
);

export default async function RootLayout({children}: PropsWithChildren) {
  const categoriesData = await getAllCategories();

  return (
    <ReduxProvider>
      <ReactQueryClientProvider>
        <CSPostHogProvider>
          <html lang="en">
            <Head>
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
                    sameAs: [
                      ['https://www.facebook.com/PrintsYouPromotional', 'https://www.linkedin.com/company/printsyou']
                    ],
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
                    image: [
                      "https://printsyou.com/assets/logo-full.png"
                    ],
                    name: "Prints You Custom Promotional Products",
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
                    ],
                  })
                }}
              />
              <link href="https://fonts.cdnfonts.com/css/graphik-trial" rel="stylesheet" />
            </Head>
            <body className="overflow-x-hidden" style={{fontFamily: 'Graphik Trial, sans-serif'}}>
              <NotificationComponent />
              <Header categories={categoriesData.payload} />
              {children}
              <Footer categories={categoriesData.payload.slice(0, 6)} />
              <AddToCartModalClientSide />
            </body>
          </html>
        </CSPostHogProvider>
      </ReactQueryClientProvider>
    </ReduxProvider>
  );
}
