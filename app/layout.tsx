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
import {CSPostHogProvider} from './provider';
import NextTopLoader from 'nextjs-toploader';
import Script from 'next/script';
// @ts-ignore
import {Partytown} from '@builder.io/partytown/react';

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
            <Partytown debug={true} forward={['dataLayer.push']} />
            <Script
                id='parttown-script'
              dangerouslySetInnerHTML={{
                __html: ` partytown = {
                forward: [
                'chatwootSettings',
                'chatwootSDK.run'
                ]
            }`
              }}
            ></Script>
            {/* Google Tag Manager - Lazy Load */}
            <Script type="text/partytown" src="https://www.googletagmanager.com/gtag/js?id=AW-16709127988" />
            <Script
              id="gtag-integration"
              type="text/partytown"
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
              type="text/partytown"
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

            {/* Chatwoot - Defer & Lazy Load */}
            <Script
              id="chatwoot-integration"
              dangerouslySetInnerHTML={{
                __html: `
                  (function(d, t) {
                    console.log("In chatwootSDK")
                    if (!window.chatwootSDK) {
                      console.log("!window.chatwootSDK is true")
                      window.chatwootSettings = { position: "right", type: "standard", launcherTitle: "Chat" };
                      var BASE_URL = "https://chatwoot.printsyou.com/";
                      var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
                      g.src = BASE_URL + "/packs/js/sdk.js";
                      g.defer = true;
                      g.async = true;
                      s.parentNode.insertBefore(g, s);
                      g.onload = function() {
                        console.log("chatwoot onload function is called")
                        window.chatwootSDK.run({
                          websiteToken: "LQKAw5skqedd5h5WWeUAFvQR",
                          baseUrl: BASE_URL,
                        });
                      };
                    }
                  })(document, "script");
                `
              }}
            />

            <body className="overflow-x-hidden">
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
