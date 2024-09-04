import {WishListItem} from '@components/globals/cart/wishlist-item.component';
import React from 'react';
import {v4 as uuidv4} from 'uuid';

export const WishlistSection = () => {
  let isEmpty = false;

  return (
    <>
      <div className="text-mute border-t border my-6" />

      {isEmpty ? (
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

          {new Array(2).fill(0).map(_ => (
            <WishListItem key={uuidv4()} />
          ))}

          <div className="mt-auto mb-6"></div>
        </>
      )}
    </>
  );
};
