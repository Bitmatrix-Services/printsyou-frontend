'use client';
import React, {FC, useMemo} from 'react';
import Link from 'next/link';
import {Product} from '@components/home/product/product.types';

interface MobileStickyCtaProps {
  product: Product;
}

export const MobileStickyCta: FC<MobileStickyCtaProps> = ({product}) => {
  const priceRange = useMemo(() => {
    if (!product.priceGrids?.length) return null;

    const sortedByQty = [...product.priceGrids].sort((a, b) => a.countFrom - b.countFrom);

    // Price at MOQ (highest price - first tier)
    const highestPrice = sortedByQty[0]?.salePrice || sortedByQty[0]?.price;

    // Price at max qty (lowest price - last tier)
    const lowestPrice = sortedByQty[sortedByQty.length - 1]?.salePrice || sortedByQty[sortedByQty.length - 1]?.price;

    return { lowestPrice, highestPrice };
  }, [product.priceGrids]);

  const minQuantity = useMemo(() => {
    const sortedPrices = [...product.priceGrids].sort((a, b) => a.countFrom - b.countFrom);
    return sortedPrices[0]?.countFrom || 10;
  }, [product.priceGrids]);

  if (!priceRange || !priceRange.lowestPrice) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3 md:hidden z-50">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-lg font-bold text-primary">
            {priceRange.lowestPrice === priceRange.highestPrice
              ? `$${priceRange.lowestPrice.toFixed(2)}/unit`
              : `$${priceRange.lowestPrice.toFixed(2)} - $${priceRange.highestPrice.toFixed(2)}/unit`
            }
          </div>
          <div className="text-xs text-gray-500">Min: {minQuantity} units</div>
        </div>
        <div className="flex gap-2">
          {/* Show Order Now button only if orderType is CHECKOUT or BOTH */}
          {(product.orderType === 'CHECKOUT' || product.orderType === 'BOTH') && (
            <Link
              href={`/checkout?product_id=${product.id}`}
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all"
            >
              Order Now
            </Link>
          )}
          {/* Show Quote button if orderType is QUOTE_ONLY, BOTH, or not set (default is QUOTE_ONLY) */}
          {(product.orderType === 'QUOTE_ONLY' || product.orderType === 'BOTH' || !product.orderType) && (
            <Link
              href={`/request-quote?product=${product.id}`}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all ${
                product.orderType === 'QUOTE_ONLY' || !product.orderType
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                  : 'bg-white border-2 border-primary-500 text-primary-500'
              }`}
            >
              Get Quote
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
