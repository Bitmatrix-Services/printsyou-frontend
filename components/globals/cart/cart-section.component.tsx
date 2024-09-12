import {CartItemComponent} from '@components/globals/cart/cart-item.component';
import React, {useCallback, useEffect} from 'react';
import {selectCartRootState, setCartState, setSidebarCartOpen} from '../../../store/slices/cart/cart.slice';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {useRouter} from 'next/navigation';
import {CartItemUpdated, CartRoot} from '../../../store/slices/cart/cart';
import axios, {AxiosResponse} from 'axios';
import {v4 as uuidv4} from 'uuid';
import Link from 'next/link';

export const CartSection = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const cartRoot = useAppSelector(selectCartRootState);

  useEffect(() => {
    getCartData();
  }, []);

  const handleCheckout = () => {
    dispatch(setSidebarCartOpen(false));
    router.push('/checkout');
  };

  const getCartId = () => {
    let cartId;
    try {
      cartId = localStorage.getItem('cartId');
      return cartId;
    } catch (error) {}
  };

  const handleRemoveItem = useCallback(
    async (item: CartItemUpdated) => {
      const cartId = getCartId();
      try {
        axios
          .put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/remove`, undefined, {
            params: {
              cartId: cartRoot?.id,
              cartItemId: item.id
            }
          })
          .then(() => axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/${cartId}`))
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

  const getCartData = async () => {
    const cartId = getCartId();

    try {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/${cartId}`)
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
    <>
      {cartRoot?.cartItems && cartRoot.cartItems.length > 0 ? (
        <>
          <h2 className="text-black text-xl font-semibold capitalize">Shopping Cart</h2>
          <div className="text-mute border-t border my-6" />
          {cartRoot?.cartItems?.map(item => (
            <CartItemComponent key={uuidv4()} cartItem={item} handleRemoveItem={handleRemoveItem} />
          ))}

          <div className="flex justify-evenly">
            <h4 className="text-black text-base font-normal">Subtotal</h4>
            <p className="text-lg font-semibold text-secondary-300"> ${cartRoot?.totalCartPrice || 0}</p>
          </div>

          <div className="text-mute border-t border my-6" />
          <div className="flex justify-center items-center">
            <div className="text-center w-[48%] border border-primary-700 py-2 px-4 rounded-full cursor-pointer hover:bg-primary-500 hover:text-white text-primary-700 hover:border-primary-500">
              <div className="capitalize" onClick={() => handleCheckout()}>
                Checkout
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center gap-2 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-24">
          <h2 className="text-black text-xl text-center font-semibold capitalize">your cart is empty!</h2>
          <h3 className="text-base text-black  font-normal text-center">
            {`Looks like you haven't added any items to your cart yet.`}
          </h3>
          <div className="flex justify-center items-center mt-6">
            <Link
              href="/"
              className="text-center border border-primary-700 py-2 px-6 rounded-full cursor-pointer hover:bg-primary-500 hover:text-white text-primary-700 hover:border-primary-500"
              onClick={(_) => dispatch(setSidebarCartOpen(false))}
            >
              <div className="capitalize">shop now</div>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
