import {WishListItem} from '@components/globals/cart/wishlist-item.component';
import {useEffect} from 'react';
import axios from 'axios';
import {useAppDispatch, useAppSelector} from 'store/hooks';
import {selectWishlistItems, selectWishlistId, setWishlistItems} from 'store/slices/wishlist/wishlist.slice';

export const WishlistSection = () => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector(selectWishlistItems);
  const wishlistId = useAppSelector(selectWishlistId);

  const getWishlistData = async (wishlistId: string) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/wishlist/${wishlistId}`);

      if (response.data && !response.data.hasError) {
        dispatch(setWishlistItems(response.data.payload.wishlistItems));
      } else {
        console.error('Error fetching wishlist data:', response.data);
      }
    } catch (error) {
      console.error('Error making GET request:', error);
    }
  };

  useEffect(() => {
    if (wishlistId) {
      getWishlistData(wishlistId);
    }
  }, [wishlistId]);

  return (
    <>
      <div className="text-mute border-t border my-6" />

      {wishlistItems.length === 0 ? (
        <div className="flex flex-col justify-center items-center gap-2 ">
          <h2 className="text-black text-xl text-center font-semibold capitalize">Your Wish List is Empty!</h2>
          <h3 className="text-base text-black  font-normal text-center">Start adding your favorite items here.</h3>
          <div className="flex justify-center items-center mt-6">
            <div className="text-center border border-primary-700 py-2 px-6 rounded-full cursor-pointer hover:bg-primary-500 hover:text-white text-primary-700 hover:border-primary-500">
              <div className="capitalize">explore products</div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-black text-xl font-semibold">Wish List</h2>
          <div className="text-mute border-t border my-6" />

          {wishlistItems.map((item, i): any => (
            <WishListItem key={i} product={item.product} />
          ))}

          <div className="mt-auto mb-6"></div>
        </>
      )}
    </>
  );
};
