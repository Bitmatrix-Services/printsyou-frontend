'use client';

import {useState, useEffect} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {FaShoppingCart, FaStar, FaGift, FaClock} from 'react-icons/fa';

const ASSETS_SERVER_URL = process.env.NEXT_PUBLIC_ASSETS_SERVER_URL || 'https://printsyouassets.s3.amazonaws.com';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface CrossSellProduct {
  id: string;
  productName: string;
  uniqueProductName: string;
  sku: string;
  productImages?: Array<{imageUrl: string}>;
  priceGrids?: Array<{price: number}>;
}

interface CrossSellProductsProps {
  productId?: string;
  discountPercent?: number;
  isOneTimeOffer?: boolean;
}

export const CrossSellProducts: React.FC<CrossSellProductsProps> = ({
  productId,
  discountPercent = 0,
  isOneTimeOffer = false
}) => {
  const [products, setProducts] = useState<CrossSellProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrossSellProducts = async () => {
      if (!productId) {
        console.log('[CrossSell] No productId provided');
        setLoading(false);
        return;
      }

      try {
        console.log('[CrossSell] Fetching cross-sell products for:', productId);
        const response = await fetch(`${API_BASE_URL}/product/${productId}/cross-sells`);

        if (!response.ok) {
          console.log('[CrossSell] No cross-sell products available');
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log('[CrossSell] Response:', data);

        const crossSellProducts = data.payload || data;
        if (Array.isArray(crossSellProducts) && crossSellProducts.length > 0) {
          setProducts(crossSellProducts);
        }
      } catch (error) {
        console.error('[CrossSell] Failed to fetch cross-sell products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCrossSellProducts();
  }, [productId]);

  if (loading || products.length === 0) {
    return null;
  }

  // Calculate discounted price
  const getDiscountedPrice = (originalPrice: number): number => {
    if (discountPercent <= 0) return originalPrice;
    return originalPrice * (1 - discountPercent / 100);
  };

  return (
    <div className="w-full">
      {/* Hide scrollbar for webkit browsers */}
      <style jsx>{`
        .cross-sell-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {/* Promotional Header */}
      <div className={`rounded-t-2xl p-5 text-white ${
        isOneTimeOffer
          ? 'bg-gradient-to-r from-gray-900 via-red-900 to-gray-900'
          : 'bg-gradient-to-r from-blue-600 to-indigo-600'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full ${isOneTimeOffer ? 'bg-red-500/30' : 'bg-white/20'}`}>
            {isOneTimeOffer ? <FaGift className="w-6 h-6" /> : <FaStar className="w-6 h-6" />}
          </div>
          <div>
            <h2 className="text-xl font-bold">
              {isOneTimeOffer ? 'Exclusive One-Time Offer!' : 'You May Also Like'}
            </h2>
            <p className="text-white/90 text-sm mt-1">
              {isOneTimeOffer
                ? `Save ${discountPercent}% on these items - offer expires when you leave this page!`
                : 'Customers who bought this item also purchased these products'
              }
            </p>
          </div>
        </div>
        {isOneTimeOffer && (
          <div className="flex items-center gap-2 mt-3 text-yellow-300 text-xs">
            <FaClock className="w-3 h-3" />
            <span>Limited time offer - Only available now!</span>
          </div>
        )}
      </div>

      {/* Product Grid - Horizontal scroll on mobile, grid on desktop */}
      <div className={`rounded-b-2xl p-3 lg:p-4 border-2 border-t-0 ${
        isOneTimeOffer ? 'bg-gray-900/5 border-red-200' : 'bg-gray-50 border-gray-200'
      }`}>
        {/* Mobile: Horizontal swipeable carousel | Desktop: 2-column grid */}
        <div
          className="cross-sell-scroll flex lg:grid lg:grid-cols-2 gap-3 lg:gap-4 overflow-x-auto snap-x snap-mandatory pb-2 lg:pb-0 -mx-1 px-1 lg:mx-0 lg:px-0"
          style={{scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch'}}
        >
          {products.map(product => {
            // Ensure proper URL construction - add leading slash if needed
            const rawImageUrl = product.productImages?.[0]?.imageUrl || '';
            const normalizedPath = rawImageUrl.startsWith('/') ? rawImageUrl : `/${rawImageUrl}`;
            const imageUrl = rawImageUrl
              ? `${ASSETS_SERVER_URL}${normalizedPath}`
              : '/images/placeholder-product.png';

            const originalPrice = product.priceGrids?.[0]?.price || 0;
            const discountedPrice = getDiscountedPrice(originalPrice);
            const hasDiscount = discountPercent > 0;

            // Build URL with discount parameter for cross-sell offers
            const productUrl = discountPercent > 0
              ? `/products/${product.uniqueProductName}?cross_sell_discount=${discountPercent}`
              : `/products/${product.uniqueProductName}`;

            return (
              <Link
                key={product.id}
                href={productUrl}
                className="group w-[80vw] sm:w-[300px] lg:w-auto flex-shrink-0 snap-center lg:snap-align-none"
              >
                <div className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full ${
                  isOneTimeOffer
                    ? 'border-2 border-red-200 hover:border-red-400'
                    : 'border-2 border-gray-200 hover:border-blue-400'
                }`}>
                  {/* Product Image with Badge */}
                  <div className="relative h-36 lg:h-40 bg-gray-100 overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={product.productName}
                      fill
                      className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 80vw, (max-width: 1024px) 300px, 50vw"
                    />

                    {/* ONE-TIME OFFER Badge */}
                    {isOneTimeOffer && (
                      <div className="absolute top-2 left-2 z-10">
                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase tracking-wide">
                          {discountPercent}% OFF
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2 line-clamp-2 min-h-[2.5rem]">
                      {product.productName}
                    </h3>

                    {/* Pricing */}
                    <div className="flex items-center gap-2 mb-3">
                      {hasDiscount ? (
                        <>
                          <span className="text-gray-400 line-through text-sm">
                            ${originalPrice.toFixed(2)}
                          </span>
                          <span className="text-lg font-bold text-red-600">
                            ${discountedPrice.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-blue-600">
                          ${originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <button className={`w-full py-2 px-4 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm ${
                      isOneTimeOffer
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}>
                      <FaShoppingCart className="w-4 h-4" />
                      {isOneTimeOffer ? 'Claim Offer' : 'View Product'}
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile scroll indicator dots */}
        {products.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3 lg:hidden">
            {products.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-red-500' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CrossSellProducts;
