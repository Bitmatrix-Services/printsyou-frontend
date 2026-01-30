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
    ({product, imagePriority = true}) => {
        const [quickViewModalOpen, setQuickViewModal] = useState<boolean>(false);

        const prices = useMemo(() => {
            const sortedPriceGrid = product.priceGrids?.filter(item => item.price > 0).sort((a, b) => a.price - b.price);
            const salePrice = sortedPriceGrid[0]?.salePrice?.toFixed(2);
            const price = sortedPriceGrid[0]?.price?.toFixed(2);
            return {salePrice, price};
        }, [product.priceGrids]);

        return (
            <div className="group relative bg-white h-full" key={product.id}>
                {/* Card Container - Professional B2B styling, full height for grid alignment */}
                <div className="h-full flex flex-col border border-gray-200 hover:border-gray-300 hover:shadow-lg rounded-lg overflow-hidden transition-all duration-300">

                    {/* Image Container */}
                    <Link prefetch={false} href={`/products/${product.uniqueProductName}`} className="block relative flex-shrink-0">
                        <div className="relative bg-white aspect-square overflow-hidden">
                            <ImageWithFallback
                                className="object-contain w-full h-full p-4 group-hover:scale-105 transition-transform duration-300"
                                skeletonRounded={true}
                                width={300}
                                height={300}
                                src={product?.imageUrl}
                                alt={product?.productName || 'Product Image'}
                                priority={imagePriority}
                                loading={imagePriority ? 'eager' : 'lazy'}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />

                            {/* Out of Stock Badge - Top Right */}
                            {product.outOfStock && (
                                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded shadow-md">
                                    Out of Stock
                                </div>
                            )}

                            {/* Sale Badge - Top Left */}
                            {(product.priceGrids ?? []).sort((a, b) => a.price - b.price)[0]?.salePrice > 0 && (
                                <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded shadow-md uppercase">
                                    Sale
                                </div>
                            )}

                            {/* Quick View Overlay - Desktop Only */}
                            <div className="hidden md:block absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors">
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        type="button"
                                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-md shadow-lg transition-colors"
                                        onClick={e => {
                                            setQuickViewModal(true);
                                            e.preventDefault();
                                        }}
                                    >
                                        Quick View
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Content Section - Flex to push CTA to bottom */}
                    <div className="flex-1 flex flex-col p-4 border-t border-gray-200">

                        {/* Product Title */}
                        <Link prefetch={false} href={`/products/${product.uniqueProductName}`} className="block mb-3">
                            <h2
                                className="text-sm font-semibold text-gray-900 line-clamp-2 min-h-[2.5rem] group-hover:text-blue-600 transition-colors"
                                dangerouslySetInnerHTML={{__html: product?.productName}}
                            />
                        </Link>

                        {/* Spacer to push price and CTA to bottom */}
                        <div className="flex-1"></div>

                        {/* Price Section - Professional B2B Layout */}
                        <div className="flex items-baseline justify-between gap-2">
                            <span className="text-xs text-gray-500 font-medium">As Low As</span>

                            <div className="flex items-baseline gap-2">
                                {prices?.salePrice && parseInt(prices?.salePrice) > 0 ? (
                                    <>
                                        <span className="text-sm text-gray-400 line-through font-medium">${prices.price}</span>
                                        <span className="text-xl font-bold text-gray-900">${prices.salePrice}</span>
                                    </>
                                ) : (
                                    <span className="text-xl font-bold text-gray-900">${prices.price}</span>
                                )}
                            </div>
                        </div>

                        {/* Get Quote Button - Mobile Only (desktop has Quick View on hover) */}
                        <button
                            type="button"
                            className="md:hidden mt-3 w-full py-2 bg-gray-100 hover:bg-blue-600 text-gray-900 hover:text-white font-semibold rounded text-sm transition-colors border border-gray-200"
                            onClick={e => {
                                setQuickViewModal(true);
                                e.preventDefault();
                            }}
                        >
                            Get Quote
                        </button>
                    </div>
                </div>

                {/* Quick View Modal */}
                {quickViewModalOpen && (
                    <ProductQuickViewModal open={quickViewModalOpen} onClose={setQuickViewModal} productId={product.id} />
                )}
            </div>
        );
    },
    (prevProps, nextProps) => prevProps.product.id === nextProps.product.id
);

ProductCard.displayName = 'ProductCard';