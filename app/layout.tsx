import type {Metadata, Viewport} from 'next';
import React, {PropsWithChildren} from 'react';
import {Lato} from 'next/font/google';
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
import {CSPostHogProvider} from './provider';
import NextTopLoader from 'nextjs-toploader';
import Script from 'next/script';
// @ts-ignore
import {Partytown} from '@builder.io/partytown/react';

// Optimize font loading with next/font
const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  display: 'swap',
  preload: true,
  variable: '--font-lato'
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#019ce0'
};

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
              {/* Preconnect to critical third-party origins for faster resource loading */}
              <link rel="preconnect" href="https://printsyouassets.s3.amazonaws.com" />
              <link rel="dns-prefetch" href="https://printsyouassets.s3.amazonaws.com" />
              <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
              <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
              <link rel="preconnect" href="https://chatwoot.printsyou.com" crossOrigin="anonymous" />
              <link rel="preconnect" href="https://www.facebook.com" crossOrigin="anonymous" />
            </head>
            <Partytown debug={true} forward={['dataLayer.push']} />
            <Script
              id="parttown-script"
              dangerouslySetInnerHTML={{
                __html: ` partytown = {
                lib: "/_next/static/~partytown/",
                forward: [
                'chatwootSettings',
                'chatwootSDK.run',
                'dataLayer.push'
                ]
            }`
              }}
            ></Script>

            {/* Google Tag Manager - Load with worker strategy via Partytown */}
            <Script strategy="worker" src="https://www.googletagmanager.com/gtag/js?id=AW-16709127988" />
            <Script
              id="gtag-integration"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'AW-16709127988');
                `
              }}
            />

            <Script
              id="gtag-conversion"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `
                  function gtag_report_conversion(url) {
                    gtag('event', 'conversion', {
                      send_to: 'AW-16709127988/pXIgCID20IQaELSexJ8-',
                      transaction_id: '',
                      event_callback: () => {}
                    });
                    return false;
                  }
                `
              }}
            />

            {/* Meta Pixel - Load after page is interactive */}
            <Script
                id="facebook-pixel"
                strategy="lazyOnload"
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
            fbq('init', '852560867505438');
            fbq('track', 'PageView');
          `,
                }}
            />

            {/* Chatwoot - Load after user interaction or idle */}
            <Script
              id="chatwoot-integration"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `
                  setTimeout(function() {
                    if (!window.chatwootSDK) {
                      window.chatwootSettings = { position: "right", type: "standard", launcherTitle: "Chat" };
                      var BASE_URL = "https://chatwoot.printsyou.com/";
                      var g = document.createElement("script");
                      g.src = BASE_URL + "/packs/js/sdk.js";
                      g.defer = true;
                      g.async = true;
                      g.onload = function() {
                        window.chatwootSDK.run({
                          websiteToken: "LQKAw5skqedd5h5WWeUAFvQR",
                          baseUrl: BASE_URL,
                        });
                      };
                      document.body.appendChild(g);
                    }
                  }, 3000);
                `
              }}
            />

            <body className={`${lato.className} overflow-x-hidden`}>
              <NextTopLoader color="#019ce0" showSpinner={false} />
              <NotificationComponent />
              <Header categories={categoriesData.payload} />
              {children}
              <Footer categories={footerCategories} />
            </body>
          </html>
        </CSPostHogProvider>
      </ReactQueryClientProvider>
    </ReduxProvider>
  );
}
