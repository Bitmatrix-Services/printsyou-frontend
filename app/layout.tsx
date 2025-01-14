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
import NextTopLoader from 'nextjs-toploader';
import Script from 'next/script';

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
            <Script strategy="beforeInteractive" src="https://www.googletagmanager.com/gtag/js?id=AW-16709127988" />
            <Script
              id="gtag-integration-initialization"
              strategy="beforeInteractive"
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
                id="gtag-integration"
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
            {/*<Script*/}
            {/*  id="google-tag-manager"*/}
            {/*  strategy="beforeInteractive"*/}
            {/*  dangerouslySetInnerHTML={{*/}
            {/*    __html: `window.dataLayer = window.dataLayer || [];*/}
            {/*                    function gtag(){dataLayer.push(arguments);}*/}
            {/*                    gtag('js', new Date());*/}
            {/*                    gtag('config', 'AW-16709127988');*/}
            {/*                    */}
            {/*                    function gtag_report_conversion(url) {*/}
            {/*                      var callback = function () {*/}
            {/*                        if (typeof(url) != 'undefined') {*/}
            {/*                          window.location = url;*/}
            {/*                        }*/}
            {/*                      };*/}
            {/*                      gtag('event', 'conversion', {*/}
            {/*                          'send_to': 'AW-16709127988/LWP-CNKl59YZELSexJ8-',*/}
            {/*                          'transaction_id': '',*/}
            {/*                          'event_callback': callback*/}
            {/*                      });*/}
            {/*                      return false;*/}
            {/*                    }`*/}
            {/*  }}*/}
            {/*/>*/}
            <Script
              id="chatwoot-integration"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `
                  (function(d,t) {
                    window.chatwootSettings = {"position":"right","type":"expanded_bubble","launcherTitle":"Chat"};
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
                      });
                    };
                  })(document,"script");
                `
              }}
            />
            <body className="overflow-x-hidden">
              <NextTopLoader color="#DB0481" showSpinner={false} />
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
