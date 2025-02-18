import React, {memo, useMemo, useState} from 'react';
import Link from 'next/link';
import {ImageWithFallback} from '@components/globals/Image-with-fallback';
import {EnclosureProduct} from '@components/home/product/product.types';
import {ProductQuickViewModal} from '@components/home/product/product-quick-view-modal.component';

interface IProductCard {
  product: EnclosureProduct;
  imagePriority?: boolean;
}

export const ProductCard = memo<IProductCard>(
  ({product, imagePriority}) => {
    const [quickViewModalOpen, setQuickViewModal] = useState<boolean>(false);

    const prices = useMemo(() => {
      const sortedPriceGrid = product.priceGrids?.filter(item => item.price > 0).sort((a, b) => a.price - b.price);
      const salePrice = sortedPriceGrid[0]?.salePrice?.toFixed(2);
      const price = sortedPriceGrid[0]?.price?.toFixed(2);
      return {salePrice, price};
    }, [product.priceGrids]);

    return (
      <div className="group relative bg-white" key={product.id}>
        <div className="ring-1 ring-mute4 hover:ring-primary-500 hover:ring-2 group rounded-2xl pt-2 md:pt-2 px-2 md:px-3">
          <Link prefetch={false} href={`/products/${product.uniqueProductName}`} className="cursor-pointer">
            <div className="min-h-56 h-56 max-h-56 lg:min-h-46 lg:h-46 lg:max-h-46 2xl:min-h-72 2xl:h-72 2xl:max-h-72 relative hover:scale-95">
              <ImageWithFallback
                className="object-contain h-auto"
                skeletonRounded={true}
                width={238}
                height={238}
                src={product?.imageUrl}
                alt={product?.productName || 'Product Image'}
                priority={true}
                loading="eager"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {product.outOfStock ? (
                <div className="absolute top-2 -left-5 text-center bg-red-500 text-white text-[0.6rem] px-3 py-1 font-bold transform -rotate-45 ">
                  Out of Stock
                </div>
              ) : null}

              <div className="absolute top-0 left-0 w-[4rem] gap-2 h-auto flex flex-col justify-end p-2 text-sm">
                {(product.priceGrids ?? []).sort((a, b) => a.price - b.price)[0]?.salePrice > 0 ? (
                  <span className="flex items-center justify-center px-3 bg-blue-500 text-white font-medium capitalize">
                    sale
                  </span>
                ) : null}
              </div>
            </div>
          </Link>

          <div className="overlay rounded-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100 absolute top-[55%] lg:top-[60%] left-0 w-full p-3">
            <div className="flex flex-col">
              {/*<button type="button" className="ml-auto">*/}
              {/*  <FaRegHeart className="h-7 w-7 text-primary-500" />*/}
              {/*</button>*/}
              <div className="mt-auto flex gap-3">
                {/*<button*/}
                {/*  type="button"*/}
                {/*  className="hidden md:block w-full md:w-1/2 py-2 bg-primary-500 text-white font-semibold text-xs uppercase"*/}
                {/*  onClick={e => {*/}
                {/*    dispatch(*/}
                {/*      setCartStateForModal({*/}
                {/*        selectedProduct: structuredClone(product),*/}
                {/*        open: true,*/}
                {/*        selectedItem: null,*/}
                {/*        cartMode: 'new'*/}
                {/*      })*/}
                {/*    );*/}
                {/*    e.preventDefault();*/}
                {/*  }}*/}
                {/*>*/}
                {/*  add to cart*/}
                {/*</button>*/}
                <button
                  type="button"
                  className="hidden md:block w-full py-2 bg-primary text-white font-semibold text-xs uppercase relative xl:-translate-y-8"
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

          <div className="pb-2">
            <Link prefetch={false} href={`/products/${product.uniqueProductName}`} className="cursor-pointer">
              <div className="line-clamp-2 text-center">
                <h2
                  className="text-lg font-semibold text-subHeading min-h-[3.5rem]"
                  dangerouslySetInnerHTML={{
                    __html: product?.productName
                  }}
                ></h2>
              </div>
            </Link>
            {/*<div className="mt-2 flex gap-1">*/}
            {/*  {[1, 2, 3, 4, 5].map(rating => (*/}
            {/*    <IoMdStar key={rating} className="text-primary-500 w-6 h-6" />*/}
            {/*  ))}*/}
            {/*</div>*/}

            <div
              className={`mt-3 flex gap-2 ${prices?.salePrice && parseInt(prices?.salePrice) > 0 ? 'justify-end md:justify-between' : 'justify-between'} items-center`}
            >
              {
                <h3
                  className={`${prices?.salePrice && parseInt(prices?.salePrice) > 0 ? 'hidden md:block' : 'block'} text-[0.7rem] font-normal text-gray-600`}
                >
                  As Low As
                </h3>
              }
              <div className="flex justify-between items-center gap-2 sm:flex-grow">
                {prices?.salePrice && parseInt(prices?.salePrice) > 0 ? (
                  <>
                    <span className="line-through text-lg font-semibold">${prices.price}</span>
                    <span className="text-3xl font-semibold">${prices.salePrice}</span>
                  </>
                ) : (
                  <span className="text-3xl font-semibold">${prices.price}</span>
                )}
              </div>
            </div>
          </div>
        </div>
        {quickViewModalOpen ? (
          <ProductQuickViewModal open={quickViewModalOpen} onClose={setQuickViewModal} productId={product.id} />
        ) : null}
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.product.id === nextProps.product.id
);

ProductCard.displayName = 'ProductCard';
