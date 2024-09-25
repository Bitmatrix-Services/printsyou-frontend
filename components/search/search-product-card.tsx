import React, {FC, useState} from 'react';
import Link from 'next/link';
import {ImageWithFallback} from '@components/globals/Image-with-fallback';
import {setCartStateForModal} from '../../store/slices/cart/cart.slice';
import {useAppDispatch} from '../../store/hooks';
import {EnclosureProduct} from '@components/home/product/product.types';
import {ProductQuickViewModal} from '@components/home/product/product-quick-view-modal.component';

interface ISearchProductCard {
  product: EnclosureProduct;
  imagePriority?: boolean;
}

export const SearchProductCard: FC<ISearchProductCard> = ({product, imagePriority}) => {
  const dispatch = useAppDispatch();
  const [quickViewModalOpen, setQuickViewModal] = useState<boolean>(false);

  return (
    <div className="group relative bg-white">
      <div className="ring-1 ring-mute4 hover:ring-primary-500 hover:ring-2 group rounded-2xl px-3">
        <Link href={`/products/${product.uniqueProductName}`} className="cursor-pointer">
          <div className=" min-h-56 h-56 max-h-56 2xl:min-h-72 2xl:h-72 2xl:max-h-72 relative hover:scale-95">
            <ImageWithFallback
              className="object-contain"
              skeletonRounded={true}
              fill
              priority={imagePriority}
              src={product?.imageUrl}
              alt={product.productName}
            />
            <div className="absolute top-0 left-0 w-[4rem] gap-2 h-auto flex flex-col justify-end p-2 text-sm">
              {(product.priceGrids ?? []).sort((a, b) => a.price - b.price)[0]?.salePrice > 0 ? (
                <span className="flex items-center justify-center px-3 bg-blue-500 text-white font-medium capitalize">
                  sale
                </span>
              ) : null}
            </div>
            <div className="overlay rounded-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100 absolute top-0 left-0 h-full w-full p-3">
              <div className="h-full flex flex-col">
                {/*<button type="button" className="ml-auto">*/}
                {/*  <FaRegHeart className="h-7 w-7 text-primary-500" />*/}
                {/*</button>*/}
                <div className="mt-auto mb-2 flex gap-3">
                  <button
                    type="button"
                    className="w-full md:w-1/2 py-2 bg-primary-500 text-white font-semibold text-xs uppercase"
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
                  >
                    add to cart
                  </button>
                  <button
                    type="button"
                    className="hidden md:block w-1/2 py-2 bg-secondary-500 text-white font-semibold text-xs uppercase"
                    onClick={e => {
                      setQuickViewModal(true);
                      e.preventDefault();
                    }}
                  >
                    quick view
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <div className="py-2 px-4">
          {/*<div className="flex gap-3">*/}
          {/*  {['black', 'red', 'white', 'green'].map(color => (*/}
          {/*    <span*/}
          {/*      key={color}*/}
          {/*      className="min-h-4 h-4 w-4 rounded-full border-2 border-black"*/}
          {/*      style={{backgroundColor: color}}*/}
          {/*    ></span>*/}
          {/*  ))}*/}
          {/*</div>*/}
          <div className="line-clamp-2">
            <h2
              className="text-lg font-semibold text-subHeading min-h-[3.40rem]"
              dangerouslySetInnerHTML={{
                __html: product?.productName
              }}
            ></h2>
          </div>
          {/*<div className="mt-2 flex gap-1">*/}
          {/*  {[1, 2, 3, 4, 5].map(rating => (*/}
          {/*    <IoMdStar key={rating} className="text-primary-500 w-6 h-6" />*/}
          {/*  ))}*/}
          {/*</div>*/}
          <h3 className="mt-3 flex gap-2 justify-between items-center text-base font-normal text-gray-600 ">
            <div>As Low As</div>
            <div>
              {(product.priceGrids ?? []).sort((a, b) => a.price - b.price)[0]?.salePrice > 0 ? (
                <>
                  <span className="line-through text-lg font-semibold">
                    ${(product.priceGrids ?? []).sort((a, b) => a.price - b.price)[0]?.price?.toFixed(2)}
                  </span>

                  <span>—</span>
                  <span className="text-2xl font-semibold text-primary-500">
                    ${(product.priceGrids ?? []).sort((a, b) => a.price - b.price)[0]?.salePrice?.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-semibold text-primary-500">
                  ${(product.priceGrids ?? []).sort((a, b) => a.price - b.price)[0]?.price?.toFixed(2)}
                </span>
              )}
            </div>
          </h3>
        </div>
      </div>
      {quickViewModalOpen ? (
        <ProductQuickViewModal open={quickViewModalOpen} onClose={setQuickViewModal} productId={product.id} />
      ) : null}
    </div>
  );
};
