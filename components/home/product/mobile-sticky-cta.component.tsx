'use client';
import React, {FC, useMemo} from 'react';
import Link from 'next/link';
import {Product} from '@components/home/product/product.types';
import {FaWhatsapp} from 'react-icons/fa';

/**
 * =====================================================
 * MOBILE STICKY CTA Component
 * Fixed bottom bar on mobile with quick action buttons
 * Includes Order Now, Get Quote, and WhatsApp options
 * =====================================================
 */

// WhatsApp number for direct contact
const WHATSAPP_NUMBER = '14694347035';

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

    return {lowestPrice, highestPrice};
  }, [product.priceGrids]);

  const minQuantity = useMemo(() => {
    const sortedPrices = [...product.priceGrids].sort((a, b) => a.countFrom - b.countFrom);
    return sortedPrices[0]?.countFrom || 10;
  }, [product.priceGrids]);

  if (!priceRange || !priceRange.lowestPrice) return null;

  const showOrderButton = product.orderType === 'CHECKOUT' || product.orderType === 'BOTH';
  const showQuoteButton = product.orderType === 'QUOTE_ONLY' || product.orderType === 'BOTH' || !product.orderType;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3 md:hidden z-50">
      {/* Price Display */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div>
          <div className="text-lg font-bold text-primary">
            {priceRange.lowestPrice === priceRange.highestPrice
              ? `$${priceRange.lowestPrice.toFixed(2)}/unit`
              : `$${priceRange.lowestPrice.toFixed(2)} - $${priceRange.highestPrice.toFixed(2)}/unit`}
          </div>
          <div className="text-xs text-gray-500">Min: {minQuantity} units</div>
        </div>

        {/* WhatsApp Quick Contact */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi! I'm interested in ${encodeURIComponent(product.productName)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#25D366] text-white"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp className="w-5 h-5" />
        </a>
      </div>

      {/* CTA Buttons */}
      <div className="flex gap-2">
        {/* PRIMARY: Order Now Button */}
        {showOrderButton && (
          <Link
            href={`/checkout?product_id=${product.id}`}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-sm font-bold text-center shadow-md transition-all"
          >
            Order Now
          </Link>
        )}

        {/* SECONDARY: Quote Button */}
        {showQuoteButton && (
          <Link
            href={`/request-quote?product=${product.id}`}
            className={`flex-1 px-4 py-3 rounded-lg text-sm font-semibold text-center shadow-md transition-all ${
              !showOrderButton
                ? 'bg-primary-500 hover:bg-primary-600 text-white'
                : 'bg-white border-2 border-primary-500 text-primary-500'
            }`}
          >
            Get Quote
          </Link>
        )}
      </div>
    </div>
  );
};
