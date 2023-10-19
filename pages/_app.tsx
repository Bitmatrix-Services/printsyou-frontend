import {Provider} from 'react-redux';
import type {AppProps} from 'next/app';
import {store} from '@store/store';
import {DefaultSeo} from 'next-seo';
import Header from '@components/globals/Header';
import Footer from '@components/globals/Footer';
import {metaConstants} from '@utils/Constants';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import '@styles/globals.css';
import {url} from 'inspector';

export default function App({Component, pageProps}: AppProps) {
  return (
    <Provider store={store}>
      <DefaultSeo
        title={metaConstants.SITE_NAME}
        description={metaConstants.DESCRIPTION}
        openGraph={{
          images: [
            {
              url: '/assets/logo.png',
              height: 70,
              width: 70,
              alt: 'site logo'
            }
          ]
        }}
      />
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </Provider>
  );
}
