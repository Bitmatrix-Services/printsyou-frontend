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
              id="parttown-script"
              dangerouslySetInnerHTML={{
                __html: ` partytown = {
                lib: "/_next/static/~partytown/",
                forward: [
                'dataLayer.push'
                ]
            }`
              }}
            ></Script>

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
            fbq('init', '852560867505438');
            fbq('track', 'PageView');
          `,
                }}
            />

            {/* Noscript fallback */}
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: "none" }}
                    src="https://www.facebook.com/tr?id=850875120645150&ev=PageView&noscript=1"
                />
            </noscript>

            {/* Google Tag Manager - Lazy Load */}
            <Script strategy="worker" src="https://www.googletagmanager.com/gtag/js?id=AW-16709127988" />
            <Script
              async={true}
              id="gtag-integration"
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

            {/* Chatwoot - Disabled
            <Script
              id="chatwoot-integration"
              dangerouslySetInnerHTML={{
                __html: `
                  (function(d, t) {
                    if (!window.chatwootSDK) {
                      window.chatwootSettings = { position: "right", type: "standard", launcherTitle: "Chat" };
                      var BASE_URL = "https://chatwoot.printsyou.com/";
                      var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
                      g.src = BASE_URL + "/packs/js/sdk.js";
                      g.defer = true;
                      g.async = true;
                      s.parentNode.insertBefore(g, s);
                      g.onload = function() {
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
            */}

            <body className="overflow-x-hidden">
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
