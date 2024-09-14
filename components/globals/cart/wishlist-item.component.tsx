import Image from 'next/image';
import React from 'react';
import {PiShoppingCartSimple} from 'react-icons/pi';

export const WishListItem = () => {
  return (
    <>
      <div className="flex items-center justify-between my-5 gap-6">
        <Image width={50} height={20} className=" object-contain" src="/assets/cat-image.jpg" alt="logo" />
        <div className="flex flex-col flex-1 gap-3 text-black ">
          <h6 className="text-black font-normal text-base"> STORMTECH® NAUTILUS MEN PERFORMANCE SHELL </h6>
          <div className="flex justify-between">
            <h6 className="text-green-600 font-bold  text-base uppercase"> in stock</h6>
            <div className="flex gap-4">
              <div className="text-center text-xs py-1 px-3 rounded-full cursor-pointer text-secondary-500 bg-secondary-100/25 hover:text-white hover:bg-primary-500">
                <div className="capitalize font-bold">add to cart</div>
              </div>
              <PiShoppingCartSimple className="h-6 w-6 text-mute cursor-pointer hover:text-primary-700" />
            </div>
          </div>
        </div>
      </div>
      <div className="text-mute border-t border my-6" />
    </>
  );
};
