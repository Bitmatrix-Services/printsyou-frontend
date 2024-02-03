import React, {Dispatch, FC, SetStateAction} from 'react';
import sanitizeHtml from 'sanitize-html';
import {Drawer} from '@mui/material';
import {useAppDispatch, useAppSelector} from '@store/hooks';
import CloseIcon from '@mui/icons-material/Close';
import ImageWithFallback from '@components/ImageWithFallback';
import Image from 'next/image';
import {
  removefromcart,
  selectSidebarCartOpen,
  setSidebarCartOpen
} from '@store/slices/cart/cart.slice';
import {useRouter} from 'next/router';

const SidebarCart = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector(state => state.cart.cartItems);
  const sidebarCartOpen = useAppSelector(selectSidebarCartOpen);

  const handleCheckout = () => {
    dispatch(setSidebarCartOpen(false));
    router.push('/checkout');
  };

  const calculateTotalCartPrice = () => {
    let totalPrice = 0;
    cartItems.forEach(item => {
      totalPrice += Number(item.totalPrice);
    });
    return totalPrice.toFixed(2);
  };

  return (
    <Drawer
      anchor="right"
      open={sidebarCartOpen}
      onClose={() => dispatch(setSidebarCartOpen(false))}
      PaperProps={{
        style: {
          background: '#fbfbfb'
        }
      }}
    >
      <div className="w-[300px] lg:w-[350px] py-2 px-4">
        <div className="flex justify-center w-full">
          <Image
            src={'/assets/logo.png'}
            width={200}
            height={200}
            alt="logo"
            className="py-4"
          />
        </div>

        {cartItems.map(item => (
          <div key={item.product.id} className="px-2 py-2 text-xs">
            <div className="py-2 text-sm text-yellow-500">
              <span className="text-black">Item#:</span>
              {item.product.sku}
            </div>
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 flex-shrink-0">
                  <ImageWithFallback
                    sizes=""
                    width={80}
                    height={80}
                    className="object-cover w-full h-full rounded-sm"
                    src={item?.product.productImages?.[0]?.imageUrl}
                    alt="Product"
                  />
                </div>
                <h3
                  className="text-sm font-bold"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(item.product.productName)
                  }}
                ></h3>
              </div>
              <div className="cursor-pointer">
                <CloseIcon
                  className="w-6 h-6 text-red-500"
                  onClick={() =>
                    dispatch(removefromcart({productId: item.product.id}))
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-between w-full py-2 border-b-2 border-gray-200">
              <div className="flex items-center">
                <div className="flex items-center">
                  <h2 className="text-sm font-semibold">
                    Qty: {item.itemsQuantity || 0}
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-sm font-semibold">
                    <CloseIcon className="w-4 h-4" />$
                    {item.calculatePriceForQuantity}
                  </h2>
                </div>
              </div>
              <div>
                <h2>
                  <span className="text-sm font-semibold">
                    ${item.totalPrice}
                  </span>
                </h2>
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-col pt-2 pb-2">
          <div className="flex justify-between px-2 py-2">
            <h2>Total Price:</h2>
            <h2 className="font-bold"> ${calculateTotalCartPrice()}</h2>
          </div>
          <div className="text-xs max-w-[25rem] my-4">
            *Final total including shipping and any additional charges will be
            sent with the artwork proof after the order is placed.
          </div>
          <div className="">
            <button
              className={`block w-full text-center uppercase py-2 px-4 text-white ${
                cartItems?.length === 0
                  ? 'bg-gray-300'
                  : 'cursor-pointer bg-primary-500 hover:bg-body border-[#eaeaec] '
              } border text-sm font-bold`}
              disabled={cartItems?.length === 0}
              onClick={() => handleCheckout()}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default SidebarCart;
