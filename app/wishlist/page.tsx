import {WishListComponent} from '@components/wish-list.component';
import {Metadata} from 'next';
import {metaConstants} from '@utils/constants';

const WishlistPage = () => {
  return <WishListComponent />;
};

export default WishlistPage;

export const metadata: Metadata = {
  title: `Wishlist | ${metaConstants.SITE_NAME}`,
  alternates: {
    canonical: `${process.env.FE_URL}wishlist`
  }
};
