import React, {FC} from 'react';
import Link from 'next/link';
import sanitizeHtml from 'sanitize-html';
import {ShoppingBagIcon} from '@heroicons/react/24/outline';
import {IProductCardForSearch} from '@components/cards/FeaturedProductCard';
import ImageWithFallback from '@components/globals/ImageWithFallback';

export const ProductCardForSearch: FC<IProductCardForSearch> = ({product}) => {
  return (
    <>
      <Link
        href={`/products/${product.uniqueProductName}`}
        className="tp-product group relative bg-white cursor-pointer"
      >
        <div className="p-6 md:min-h-[21.40rem] border border-[#edeff2]">
          <div className="block relative h-28 w-28 md:h-48 md:w-48 mx-auto group">
            <ImageWithFallback
              src={product.imageUrl}
              alt={product.productName}
              fill
            />
          </div>
          <div className="line-clamp-2 md:line-clamp-3">
            <div
              className={`block mt-4 min-h-[50px] md:min-h-[60px] text-center text-base md:text-[18px]  font-semibold text-[#303541]`}
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(product?.productName)
              }}
            ></div>
          </div>
        </div>
        <div className="border border-[#edeff2] flex">
          <div className="md:py-2 flex-1 flex gap-3 items-center px-2 md:px-5 group-hover:bg-primary-500 group-hover:text-white">
            <div className="as-low text-[8px] md:text-xs font-semibold mr-auto">
              AS LOW AS
            </div>
            <div className="prive-value flex items-end gap-1">
              <div className="prive-value flex items-end gap-1">
                <div className="deno font-semibold text-lg">$</div>
                <div className="value font-bold text-lg md:text-2xl font-oswald">
                  <span className="sale">{product.minPrice?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          <Link
            href={`/order_request?item_id=${product.productId}`}
            className="w-10 h-12 md:h-16 md:w-16 flex items-center justify-center bg-white group-hover:bg-black group-hover:border-black group-hover:text-white border-l border-[#edeff2]"
          >
            <ShoppingBagIcon className="h-5 w-5 md:h-7 md:w-7" />
          </Link>
        </div>
      </Link>
    </>
  );
};
