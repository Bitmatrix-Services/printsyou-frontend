'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaGift, FaClock, FaTag, FaShoppingCart, FaFire } from 'react-icons/fa';
import { UpsellOffer, UpsellProduct, DiscountType } from '@/types/upsell.types';
import {
  createUpsellSession,
  formatDiscount,
  calculateUpsellPrice,
  getUpsellRemainingSeconds
} from '@/utils/upsell-session';

const ASSETS_SERVER_URL = process.env.NEXT_PUBLIC_ASSETS_SERVER_URL || 'https://printsyouassets.s3.amazonaws.com';

interface PostPurchaseUpsellProps {
  orderId: string;
  storeSlug?: string;
}

interface UpsellProductCardProps {
  product: UpsellProduct;
  discountType: DiscountType;
  discountValue: number;
  badgeText: string;
  onAddToOrder: (product: UpsellProduct) => void;
}

// Countdown Timer Component
const CountdownTimer: React.FC<{ initialSeconds: number; onExpire: () => void }> = ({
  initialSeconds,
  onExpire
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) {
      onExpire();
      return;
    }

    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, onExpire]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const isUrgent = seconds < 300; // Less than 5 minutes

  return (
    <div className={`flex items-center gap-2 font-mono text-lg ${isUrgent ? 'text-red-600 animate-pulse' : 'text-orange-600'}`}>
      <FaClock className="w-5 h-5" />
      <span className="font-bold">
        {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </span>
      <span className="text-sm font-normal">remaining</span>
    </div>
  );
};

// Product Card Component
const UpsellProductCard: React.FC<UpsellProductCardProps> = ({
  product,
  discountType,
  discountValue,
  badgeText,
  onAddToOrder
}) => {
  const discountedPrice = calculateUpsellPrice(product.minPrice, discountType, discountValue);
  const savings = product.minPrice - discountedPrice;
  const savingsPercent = Math.round((savings / product.minPrice) * 100);

  // Ensure proper URL construction with leading slash
  const rawImagePath = product.productImage || '';
  const normalizedPath = rawImagePath.startsWith('/') ? rawImagePath : `/${rawImagePath}`;
  const imageUrl = rawImagePath
    ? `${ASSETS_SERVER_URL}${normalizedPath}`
    : '/images/placeholder-product.png';

  return (
    <div className="relative bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:border-green-400 transition-all duration-300 group">
      {/* Discount Badge */}
      <div className="absolute top-3 left-3 z-10">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
          <FaFire className="w-3 h-3" />
          {badgeText}
        </div>
      </div>

      {/* Savings Badge */}
      <div className="absolute top-3 right-3 z-10">
        <div className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
          Save {savingsPercent}%
        </div>
      </div>

      {/* Product Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.productName}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Category */}
        {product.categoryName && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {product.categoryName}
          </p>
        )}

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-3 line-clamp-2 min-h-[2.5rem]">
          {product.productName}
        </h3>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-green-600">
            ${discountedPrice.toFixed(2)}
          </span>
          <span className="text-sm text-gray-400 line-through">
            ${product.minPrice.toFixed(2)}
          </span>
          <span className="text-xs text-red-500 font-medium">
            -{formatDiscount(discountType, discountValue)}
          </span>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onAddToOrder(product)}
          className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
        >
          <FaShoppingCart className="w-4 h-4" />
          Configure & Add to New Order
        </button>
      </div>
    </div>
  );
};

// Main Post-Purchase Upsell Component
export const PostPurchaseUpsell: React.FC<PostPurchaseUpsellProps> = ({
  orderId,
  storeSlug = 'printsyou'
}) => {
  const [offer, setOffer] = useState<UpsellOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const [initialSeconds, setInitialSeconds] = useState(0);

  // Fetch upsell configuration and products
  useEffect(() => {
    const fetchUpsellOffer = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/stores/${storeSlug}/upsell-offer?orderId=${orderId}`
        );

        if (!response.ok) {
          console.log('[Upsell] No offer available');
          setLoading(false);
          return;
        }

        const data: UpsellOffer = await response.json();

        if (!data.configuration.enabled || data.products.length === 0) {
          setLoading(false);
          return;
        }

        setOffer(data);

        // Create session for tracking
        createUpsellSession(
          orderId,
          data.configuration.discountType,
          data.configuration.discountValue,
          data.configuration.productIds,
          data.configuration.timerMinutes
        );

        // Set initial timer
        if (data.configuration.timerEnabled) {
          setInitialSeconds(data.configuration.timerMinutes * 60);
        }

        setLoading(false);
      } catch (error) {
        console.error('[Upsell] Failed to fetch offer:', error);
        setLoading(false);
      }
    };

    fetchUpsellOffer();
  }, [orderId, storeSlug]);

  const handleExpire = useCallback(() => {
    setExpired(true);
  }, []);

  const handleAddToOrder = useCallback((product: UpsellProduct) => {
    // Navigate to product page with upsell parameter
    const url = `/products/${product.productId}?upsell=true&discount_code=${offer?.discountCode}`;
    window.location.href = url;
  }, [offer]);

  // Don't render if loading, no offer, or expired
  if (loading || !offer || expired) {
    return null;
  }

  const { configuration, products } = offer;
  const discountDisplay = formatDiscount(configuration.discountType, configuration.discountValue);

  // Replace {discount} placeholder in subheadline
  const subheadline = configuration.subheadline.replace('{discount}', discountDisplay);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Main Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-t-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-full">
              <FaGift className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                {configuration.headline}
              </h2>
              <p className="text-white/90 text-sm md:text-base mt-1">
                {subheadline}
              </p>
            </div>
          </div>

          {/* Timer */}
          {configuration.timerEnabled && initialSeconds > 0 && (
            <div className="bg-white rounded-xl px-4 py-3 shadow-lg">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1 text-center">
                Offer Expires In
              </div>
              <CountdownTimer
                initialSeconds={initialSeconds}
                onExpire={handleExpire}
              />
            </div>
          )}
        </div>
      </div>

      {/* Discount Highlight Bar */}
      <div className="bg-yellow-400 py-2 px-4 flex items-center justify-center gap-2">
        <FaTag className="w-4 h-4 text-yellow-800" />
        <span className="text-yellow-900 font-bold text-sm">
          EXCLUSIVE: Get {discountDisplay} OFF these items – This session only!
        </span>
      </div>

      {/* Product Grid */}
      <div className="bg-gray-50 rounded-b-2xl p-6 border-2 border-t-0 border-gray-200">
        <div className={`grid gap-4 ${
          products.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
          products.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' :
          products.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        }`}>
          {products.map((product) => (
            <UpsellProductCard
              key={product.id}
              product={product}
              discountType={configuration.discountType}
              discountValue={configuration.discountValue}
              badgeText={configuration.badgeText}
              onAddToOrder={handleAddToOrder}
            />
          ))}
        </div>

        {/* Fine Print */}
        <p className="text-center text-xs text-gray-500 mt-6">
          *Discount applies to new orders placed within this session. Cannot be combined with other offers.
        </p>
      </div>
    </div>
  );
};

export default PostPurchaseUpsell;
