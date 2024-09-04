import type {Metadata} from 'next';
import {PropsWithChildren} from 'react';
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

export const metadata: Metadata = {
  title: metaConstants.SITE_NAME,
  description: metaConstants.DESCRIPTION
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
        <html lang="en">
          <head>
            <link href="https://fonts.cdnfonts.com/css/graphik-trial" rel="stylesheet" />
          </head>
          <body className="overflow-x-hidden" style={{fontFamily: 'Graphik Trial, sans-serif'}}>
            <Header categories={categoriesData.payload} />
            {children}
            <Footer categories={categoriesData.payload.slice(0, 6)} />
            <AddToCartModalClientSide />
          </body>
        </html>
      </ReactQueryClientProvider>
    </ReduxProvider>
  );
}
