'use client';
import Image from 'next/image';
import {IoCloseCircle} from 'react-icons/io5';

export const WishListItem = ({product}: any) => {
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
          <h6 className="text-black font-normal text-base">{product?.productName}</h6>
          <div className="flex justify-between">
            <h6 className="text-green-600 font-bold  text-base uppercase"> in stock</h6>
            <div className="flex gap-4">
              <div className="text-center text-xs py-1 px-3 rounded-full cursor-pointer text-secondary-500 bg-secondary-100/25 hover:text-white hover:bg-primary-500">
                <div className="capitalize font-bold">add to cart</div>
              </div>
              <IoCloseCircle
                className="h-6 w-6 text-mute cursor-pointer hover:text-primary-700"
                onClick={() => alert('remove from wishlist test')}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="text-mute border-t border my-6" />
    </>
  );
};
