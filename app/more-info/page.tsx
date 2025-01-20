import React from 'react';
import {MoreInfoComponent} from '@components/more-info.component';
import {getProductDetailsById} from '@components/home/product/product-apis';
import {Product} from '@components/home/product/product.types';
import {Metadata} from 'next';
import {metaConstants} from '@utils/constants';

const MoreInfoPage = async (params: {searchParams: {item_id: string}}) => {
  const response = await getProductDetailsById(params.searchParams.item_id);

  let product: Product | null = null;
  if (response?.payload) product = response?.payload;

  return <MoreInfoComponent product={product} />;
};

export default MoreInfoPage;

export const metadata: Metadata = {
  title: `Request Info | ${metaConstants.SITE_NAME}`,
  description: `Learn more about our wide range of promotional products and services. Explore how we help businesses create impactful, custom-branded merchandise to enhance brand visibility and engagement. Contact us today for personalized solutions and expert guidance.`,
  robots: {
     index: false,
     follow: false
  },
  alternates: {
    canonical: `${process.env.FE_URL}more-info`
  }
};
