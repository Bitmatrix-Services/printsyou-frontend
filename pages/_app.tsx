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
import '@styles/globals.scss';
import {useAppDispatch} from '@store/hooks';
import {useRouter} from 'next/router';
import React, {FC, useEffect} from 'react';
import {setTopProgressState} from '@store/slices/progress.slice';
import {LinearIndeterminate} from '@components/globals/LinearIndeterminate';
import {ThemeProvider} from '@mui/material';
import {theme} from '@utils/theme';
import {Resend} from 'resend';
import getConfig from 'next/config';
import dynamic from 'next/dynamic';
import {SpeedInsights} from '@vercel/speed-insights/next';

const config = getConfig();
export const resend = new Resend(config.publicRuntimeConfig.RESEND_API_KEY);

export const ShowLinearIndeterminateOnAll: FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const start = (url: string, {shallow}: {shallow: boolean}) => {
      if (!shallow) {
        dispatch(setTopProgressState(true));
      }
    };
    const stop = () => {
      dispatch(setTopProgressState(false));
    };

    router.events.on('routeChangeStart', start);
    router.events.on('routeChangeComplete', stop);
    router.events.on('routeChangeError', stop);

    return () => {
      router.events.off('routeChangeStart', start);
      router.events.off('routeChangeComplete', stop);
      router.events.off('routeChangeError', stop);
    };
  }, [router]);

  return null;
};

const UpdatedCartModalClientSide = dynamic(
  () =>
    import('@components/globals/CartModal').then(
      file => file.UpdateCartComponent
    ),
  {
    ssr: false,
    loading: () => null
  }
);

export default function App({Component, pageProps}: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ShowLinearIndeterminateOnAll />
        <LinearIndeterminate />
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
          <UpdatedCartModalClientSide />
          <SpeedInsights />
        </main>
        <Footer />
      </ThemeProvider>
    </Provider>
  );
}
