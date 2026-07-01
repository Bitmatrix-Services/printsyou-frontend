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
import {StoreProvider} from '@/providers/store-provider';
import {metaConstants} from '@utils/constants';
import {NotificationComponent} from '@components/notification/notification.component';
import {WhatsAppButton} from '@components/globals/whatsapp-button.component';
import {GoogleAdsTracker} from '@components/globals/google-ads-tracker.component';
import {CSPostHogProvider} from './provider';
import NextTopLoader from 'nextjs-toploader';
import Script from 'next/script';
import {Suspense} from 'react';
import {HolidayAnnouncementBar} from '@components/promotions/holiday-announcement-bar.component';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.FE_URL as string),
  title: metaConstants.SITE_NAME,
  description: metaConstants.DESCRIPTION,
  alternates: {
    canonical: `${process.env.FE_URL}`
  },
  openGraph: {
    images: '/assets/logo-full.png',
    title: metaConstants.SITE_NAME,
    description: metaConstants.DESCRIPTION
  }
};

export default async function RootLayout({children}: PropsWithChildren) {
  const categoriesData = await getAllCategories();
  const footerCategories = categoriesData.payload.slice(0, 6);

  return (
    <ReduxProvider>
      <ReactQueryClientProvider>
        <StoreProvider>
          <CSPostHogProvider>
            <html lang="en">
            <head>
              {/* Google Tag Manager */}
              <Script
                id="gtag-base"
                strategy="beforeInteractive"
                src="https://www.googletagmanager.com/gtag/js?id=AW-16709127988"
              />
              <Script
                id="gtag-integration"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    window.gtag = function(){window.dataLayer.push(arguments);};
                    window.gtag('js', new Date());
                    window.gtag('config', 'AW-16709127988');
                  `
                }}
              />
              <Script
                id="gtag-conversion"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    window.gtag_report_conversion = function(url) {
                      if (window.gtag) {
                        window.gtag('event', 'conversion', {
                          send_to: 'AW-16709127988/pXIgCID20IQaELSexJ8-',
                          transaction_id: '',
                          event_callback: function() {}
                        });
                      }
                      return false;
                    };
                  `
                }}
              />

              {/* Meta Pixel Base Code */}
              <Script
                id="facebook-pixel"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '850875120645150');
                    fbq('track', 'PageView');
                  `
                }}
              />

              {/* Global Organization Schema - sitewide */}
              <script
                id="organization-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'Organization',
                    '@id': `${process.env.NEXT_PUBLIC_FE_URL}#organization`,
                    name: 'PrintsYou',
                    url: process.env.NEXT_PUBLIC_FE_URL,
                    logo: {
                      '@type': 'ImageObject',
                      url: `${process.env.NEXT_PUBLIC_FE_URL}assets/logo-full.png`,
                      width: 250,
                      height: 60
                    },
                    description: 'Premium custom printing services for promotional products, apparel, and business merchandise. Fast turnaround, competitive pricing, and quality guaranteed.',
                    contactPoint: {
                      '@type': 'ContactPoint',
                      telephone: '+1-469-434-7035',
                      contactType: 'Customer Service',
                      availableLanguage: 'English',
                      areaServed: 'US'
                    },
                    address: {
                      '@type': 'PostalAddress',
                      addressCountry: 'US'
                    },
                    sameAs: [
                      'https://www.facebook.com/printsyoupromo',
                      'https://www.linkedin.com/company/printsyou'
                    ]
                  })
                }}
              />

              {/* Global WebSite Schema - sitewide with SearchAction */}
              <script
                id="website-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'WebSite',
                    '@id': `${process.env.NEXT_PUBLIC_FE_URL}#website`,
                    name: 'PrintsYou',
                    url: process.env.NEXT_PUBLIC_FE_URL,
                    publisher: {
                      '@id': `${process.env.NEXT_PUBLIC_FE_URL}#organization`
                    },
                    potentialAction: {
                      '@type': 'SearchAction',
                      target: {
                        '@type': 'EntryPoint',
                        urlTemplate: `${process.env.NEXT_PUBLIC_FE_URL}search?q={search_term_string}`
                      },
                      'query-input': 'required name=search_term_string'
                    },
                    inLanguage: 'en-US'
                  })
                }}
              />
            </head>
            <body className="overflow-x-hidden">
              <Suspense fallback={null}>
                <GoogleAdsTracker />
              </Suspense>
              <NextTopLoader color="#019ce0" showSpinner={false} />
              <NotificationComponent />
              {/* Holiday Sale Announcement Bar - Remove when sale ends */}
              <Suspense fallback={null}>
                <HolidayAnnouncementBar />
              </Suspense>
              <Header categories={categoriesData.payload} />
              {children}
              <Footer categories={footerCategories} />
              <WhatsAppButton
                phoneNumber="14694347035"
                defaultMessage="Hi! I'm interested in custom printing and have a question."
              />
            </body>
          </html>
        </CSPostHogProvider>
      </StoreProvider>
    </ReactQueryClientProvider>
  </ReduxProvider>
  );
}
