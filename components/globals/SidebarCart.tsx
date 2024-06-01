import React, {useCallback, useEffect} from 'react';
import sanitizeHtml from 'sanitize-html';
import {Drawer} from '@mui/material';
import {useAppDispatch, useAppSelector} from '@store/hooks';
import CloseIcon from '@mui/icons-material/Close';
import ImageWithFallback from '@components/ImageWithFallback';
import Image from 'next/image';
import {
  selectCartRootState,
  selectSidebarCartOpen,
  setCartState,
  setSidebarCartOpen
} from '@store/slices/cart/cart.slice';
import {useRouter} from 'next/router';
import {http} from 'services/axios.service';
import {CartItemUpdated, CartRoot} from '@store/slices/cart/cart';
import {AxiosResponse} from 'axios';

const SidebarCart = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const cartRoot = useAppSelector(selectCartRootState);
  const sidebarCartOpen = useAppSelector(selectSidebarCartOpen);

  useEffect(() => {
    getCartData();
  }, []);

  const handleCheckout = () => {
    dispatch(setSidebarCartOpen(false));
    router.push('/checkout');
  };

  const handleRemoveItem = useCallback(
    async (item: CartItemUpdated) => {
      const cartId = getCartId();
      try {
        http
          .put(`/cart/remove`, undefined, {
            params: {
              cartId: cartRoot?.id,
              cartItemId: item.id
            }
          })
          .then(() => http.get(`/cart/${cartId}`))
          .then((response: AxiosResponse) => {
            dispatch(setCartState(response.data.payload as CartRoot));
          })
          .catch(() => {
            dispatch(setCartState(null));
          });
      } catch {}
    },
    [cartRoot]
  );

  const getCartId = () => {
    let cartId;
    try {
      cartId = localStorage.getItem('cartId');
      return cartId;
    } catch (error) {}
  };

  const getCartData = async () => {
    const cartId = getCartId();

    try {
      http
        .get(`/cart/${cartId}`)
        .then((response: AxiosResponse) => {
          dispatch(setCartState(response.data.payload as CartRoot));
        })
        .catch(() => {
          dispatch(setCartState(null));
        });
      // setCartData(res.data.payload);
    } catch (error) {}
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

        {cartRoot?.cartItems?.map(item => (
          <div key={item.id} className="px-2 py-2 text-xs">
            <div className="py-2 text-sm text-yellow-500">
              <span className="text-black">Item#:</span>
              {item.sku}
            </div>
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 flex-shrink-0">
                  <ImageWithFallback
                    sizes=""
                    width={80}
                    height={80}
                    className="object-cover w-full h-full rounded-sm"
                    src={item?.imageUrl}
                    alt="Product"
                  />
                </div>
                <h3
                  className="text-sm font-bold"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(item.productName)
                  }}
                ></h3>
              </div>
              <div className="cursor-pointer">
                <CloseIcon
                  className="w-6 h-6 text-red-500"
                  onClick={() => handleRemoveItem(item)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between w-full py-2 border-b-2 border-gray-200">
              <div className="flex items-center">
                <div className="flex items-center">
                  <h2 className="text-sm font-semibold">
                    Qty: {item.qtyRequested || 0}
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-sm font-semibold">
                    <CloseIcon className="w-4 h-4" />$
                    <CloseIcon className="w-4 h-4" />${item.priceQuotedPerItem}
                  </h2>
                </div>
              </div>
              <div>
                <h2>
                  <span className="text-sm font-semibold">
                    ${item.itemTotalPrice}
                  </span>
                </h2>
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-col pt-2 pb-2">
          <div className="flex justify-between px-2 py-2">
            <h2>Total Price:</h2>
            <h2 className="font-bold"> ${cartRoot?.totalCartPrice || 0}</h2>
          </div>
          <div className="text-xs max-w-[25rem] my-4">
            *Final total including shipping and any additional charges will be
            sent with the artwork proof after the order is placed.
          </div>
          <div className="">
            <button
              className={`block w-full text-center uppercase py-2 px-4 text-white ${
                cartRoot?.cartItems?.length === 0
                  ? 'bg-gray-300'
                  : 'cursor-pointer bg-primary-500 hover:bg-body border-[#eaeaec] '
              } border text-sm font-bold`}
              disabled={cartRoot?.cartItems?.length === 0}
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
