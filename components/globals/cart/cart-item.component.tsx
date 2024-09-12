'use client';
import {IoCloseCircle} from 'react-icons/io5';
import React, {FC} from 'react';
import {CartItemUpdated} from '../../../store/slices/cart/cart';
import {ImageWithFallback} from '@components/globals/Image-with-fallback';

interface ICartItem {
  cartItem: CartItemUpdated;
  handleRemoveItem: (_: CartItemUpdated) => void;
}

export const CartItemComponent: FC<ICartItem> = ({cartItem, handleRemoveItem}) => {
  return (
    <>
      <div className="flex flex-col justify-start my-5">
        <div className="flex justify-start py-2 text-sm">
          <div className="text-black">Item#:</div>
          <div className="text-secondary-500"> {cartItem.sku}</div>
        </div>
        <div className="flex items-center gap-3 mb-3 relative">
          <ImageWithFallback
            width={50}
            height={20}
            className=" object-contain"
            src={cartItem?.imageUrl}
            alt="prodcut image"
          />
          <div className="flex flex-wrap text-black">
            <h6 className="text-black font-normal text-base"> {cartItem.productName}</h6>
          </div>

          <div className="flex items-center gap-4">
            {/*<FaRegHeart className="h-5 w-5 text-primary-500 cursor-pointer hover:text-primary-700" />*/}
            <IoCloseCircle
              className="h-6 w-6 text-mute cursor-pointer hover:text-primary-700"
              onClick={() => handleRemoveItem(cartItem)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm text-secondary-300">
            <span className="font-light text-black">Price per item</span> ${cartItem.priceQuotedPerItem}
          </p>
          <p className="text-mute2 text-sm font-light">
            Qty ordered: <b className="text-black ml-1">{cartItem.qtyRequested}</b>
          </p>
          <p className="text-mute2 text-sm font-light">
            Total Price:{' '}
            <b className="text-black ml-1">
              {' '}
              <span className="font-bold">${cartItem.itemTotalPrice}</span>
            </b>
          </p>
        </div>
      </div>
      <div className="text-mute border-t border my-6" />
    </>
  );
};
