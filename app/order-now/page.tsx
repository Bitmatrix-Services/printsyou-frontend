import {Metadata} from 'next';
import {metaConstants} from '@utils/constants';
import {OrderNowComponent} from '@components/order/order-now.component';
import {getProductDetailsById} from '@components/home/product/product-apis';
import {Product} from '@components/home/product/product.types';

type Params = Promise<{product_id: string}>;

const OrderNowPage = async (props: {searchParams: Params}) => {
  const searchParams = await props.searchParams;
  const response = await getProductDetailsById(searchParams.product_id);

  let product: Product | null = null;
  if (response?.payload) product = response?.payload;

  return <OrderNowComponent selectedProduct={product} />;
};

export default OrderNowPage;

export const metadata: Metadata = {
  title: `Order Now | ${metaConstants.SITE_NAME}`,
  description: `Shop our curated collection and find the perfect pieces to express yourself. Enjoy fast shipping, secure payments, and excellent customer service.`,
  alternates: {
    canonical: `${process.env.FE_URL}order-now`
  }
};
