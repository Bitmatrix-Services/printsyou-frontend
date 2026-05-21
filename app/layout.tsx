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
import {metaConstants} from '@utils/constants';
import {NotificationComponent} from '@components/notification/notification.component';
import {WhatsAppButton} from '@components/globals/whatsapp-button.component';
import {GoogleAdsTracker} from '@components/globals/google-ads-tracker.component';
import {CSPostHogProvider} from './provider';
import NextTopLoader from 'nextjs-toploader';
import Script from 'next/script';
import {Suspense} from 'react';

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
            </head>
            <body className="overflow-x-hidden">
              <Suspense fallback={null}>
                <GoogleAdsTracker />
              </Suspense>
              <NextTopLoader color="#019ce0" showSpinner={false} />
              <NotificationComponent />
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
      </ReactQueryClientProvider>
    </ReduxProvider>
  );
}
