'use client';
import Image from 'next/image';
import Link from 'next/link';
import {IoCloseCircle} from 'react-icons/io5';
import {useAppDispatch} from 'store/hooks';
import {removeFromWishlist} from 'store/slices/wishlist/wishlist.slice';
import {setCartStateForModal} from 'store/slices/cart/cart.slice';

export const WishListItem = ({product}: any) => {
  const dispatch = useAppDispatch();

  const handleRemoveFromWishlist = () => {
    dispatch(removeFromWishlist({productId: product.id}));
  };

  return (
    <>
      <div className="flex items-center justify-between my-5 gap-6">
        <Image
          src={`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${product?.productImages?.[0]?.imageUrl}`}
          alt={product.productName}
          width={50}
          height={50}
          className="object-contain"
        />
        <div className="flex flex-col flex-1 gap-3 text-black ">
          <Link href={`/products/${product.uniqueProductName}`}>
            <h6 className="text-black font-normal text-base">{product?.productName}</h6>
          </Link>
          <div className="flex justify-between">
            <h6 className="text-green-600 font-bold  text-base uppercase"> in stock</h6>
            <div className="flex gap-4">
              <div className="text-center text-xs py-1 px-3 rounded-full cursor-pointer text-secondary-500 bg-secondary-100/25 hover:text-white hover:bg-primary-500">
                <button
                  onClick={e => {
                    dispatch(
                      setCartStateForModal({
                        selectedProduct: structuredClone(product),
                        open: true,
                        selectedItem: null,
                        cartMode: 'new'
                      })
                    );
                    e.preventDefault();
                  }}
                  className="capitalize font-bold"
                >
                  add to cart
                </button>
              </div>
              <IoCloseCircle
                className="h-6 w-6 text-mute cursor-pointer hover:text-primary-700"
                onClick={handleRemoveFromWishlist}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="text-mute border-t border my-6" />
    </>
  );
};
