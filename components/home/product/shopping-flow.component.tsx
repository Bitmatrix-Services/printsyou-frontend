'use client';

import React, {FC, useMemo, useState, useCallback, useEffect} from 'react';
import {Product, PriceGrids, productColors} from '@components/home/product/product.types';
import {ArtworkUploader, ArtworkFile} from '@components/checkout/artwork-uploader';
import {SizeBreakdown, SizeQuantity, extractSizesFromProduct, isApparelProduct} from '@components/checkout/size-breakdown.component';
import {RiShoppingBag4Fill} from 'react-icons/ri';
import {FaTruck, FaClock, FaShieldAlt, FaCheckCircle, FaClipboardList, FaBolt, FaFire} from 'react-icons/fa';
import {HiLightningBolt} from 'react-icons/hi';
import axios from 'axios';
import Link from 'next/link';
import {CheckoutRoutes} from '@utils/routes/be-routes';
import {checkoutAnalytics} from '@utils/analytics';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ASSETS_SERVER_URL = process.env.NEXT_PUBLIC_ASSETS_SERVER_URL || 'https://printsyouassets.s3.amazonaws.com/';

// B2B bulk threshold - above this quantity, highlight Get Quote as recommended path
const B2B_BULK_THRESHOLD = 500;

// Production cutoff hour (2 PM CST = 14:00, converted to local timezone detection)
const PRODUCTION_CUTOFF_HOUR = 14; // 2 PM

// Shipping configuration - same as direct-checkout
const SHIPPING_CONFIG = {
  freeShippingThreshold: 500, // Free shipping for orders $500+
  rates: [
    {maxQty: 1, fee: 5.0},
    {maxQty: 7, fee: 7.0},
    {maxQty: 8, fee: 8.0},
    {maxQty: 9, fee: 12.0},
    {maxQty: 10, fee: 15.0},
    {maxQty: 50, fee: 20.99},
    {maxQty: 100, fee: 25.99},
    {maxQty: 250, fee: 29.99},
    {maxQty: 500, fee: 34.99},
    {maxQty: 1000, fee: 49.99},
    {maxQty: Infinity, fee: 79.99}
  ]
};

// Calculate shipping based on quantity
const calculateShipping = (qty: number, subtotal: number): number => {
  // Free shipping if subtotal exceeds threshold
  if (subtotal >= SHIPPING_CONFIG.freeShippingThreshold) {
    return 0;
  }
  // Find applicable shipping rate based on quantity
  const rate = SHIPPING_CONFIG.rates.find(r => qty <= r.maxQty);
  return rate?.fee || SHIPPING_CONFIG.rates[SHIPPING_CONFIG.rates.length - 1].fee;
};

// Helper to get cookie value by name
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

/**
 * Hook for calculating time until production cutoff
 * Returns hours and minutes until 2 PM CST (next business day if past cutoff)
 */
const useProductionCountdown = () => {
  const [timeLeft, setTimeLeft] = useState<{hours: number; minutes: number; isToday: boolean} | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Convert to CST (UTC-6)
      const cstOffset = -6 * 60;
      const localOffset = now.getTimezoneOffset();
      const cstTime = new Date(now.getTime() + (localOffset + cstOffset) * 60000);

      const currentHour = cstTime.getHours();
      const currentMinute = cstTime.getMinutes();
      const dayOfWeek = cstTime.getDay(); // 0 = Sunday, 6 = Saturday

      // Check if it's a business day and before cutoff
      const isBusinessDay = dayOfWeek >= 1 && dayOfWeek <= 5;
      const isBeforeCutoff = currentHour < PRODUCTION_CUTOFF_HOUR;

      if (isBusinessDay && isBeforeCutoff) {
        // Calculate time until 2 PM today
        const minutesLeft = (PRODUCTION_CUTOFF_HOUR * 60) - (currentHour * 60 + currentMinute);
        const hours = Math.floor(minutesLeft / 60);
        const minutes = minutesLeft % 60;
        return {hours, minutes, isToday: true};
      } else {
        // Calculate time until 2 PM next business day
        let daysToAdd = 1;
        if (dayOfWeek === 5 && !isBeforeCutoff) daysToAdd = 3; // Friday after cutoff -> Monday
        if (dayOfWeek === 6) daysToAdd = 2; // Saturday -> Monday
        if (dayOfWeek === 0) daysToAdd = 1; // Sunday -> Monday

        const nextBusinessDay = new Date(cstTime);
        nextBusinessDay.setDate(nextBusinessDay.getDate() + daysToAdd);
        nextBusinessDay.setHours(PRODUCTION_CUTOFF_HOUR, 0, 0, 0);

        const msLeft = nextBusinessDay.getTime() - cstTime.getTime();
        const totalMinutes = Math.floor(msLeft / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return {hours, minutes, isToday: false};
      }
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => setTimeLeft(calculateTimeLeft()), 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
};

/**
 * Urgency countdown widget component
 */
const UrgencyCountdown: FC<{leadTimeDays?: number}> = ({leadTimeDays = 3}) => {
  const timeLeft = useProductionCountdown();

  if (!timeLeft) return null;

  // Fast-track production active if lead time is 3 days or less
  const isFastTrack = leadTimeDays <= 3;

  return (
    <div className={`rounded-lg p-3 ${isFastTrack ? 'bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200' : 'bg-blue-50 border border-blue-200'}`}>
      <div className="flex items-center gap-2">
        {isFastTrack ? (
          <FaBolt className="w-4 h-4 text-orange-500 animate-pulse" />
        ) : (
          <FaClock className="w-4 h-4 text-blue-500" />
        )}
        <div className="flex-1">
          {timeLeft.isToday ? (
            <p className="text-sm font-semibold text-gray-800">
              Order within <span className="text-orange-600">{timeLeft.hours}h {timeLeft.minutes}m</span> for production to start today!
            </p>
          ) : (
            <p className="text-sm font-semibold text-gray-800">
              Order now for production to start {timeLeft.hours < 24 ? 'tomorrow' : 'next business day'}!
            </p>
          )}
          {isFastTrack && (
            <p className="text-xs text-orange-600 font-medium flex items-center gap-1 mt-0.5">
              <HiLightningBolt className="w-3 h-3" /> Fast-Track Production Active
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

interface ShoppingFlowProps {
  product: Product;
}

export const ShoppingFlow: FC<ShoppingFlowProps> = ({product}) => {
  // Sort price grids by quantity (lowest first)
  const sortedPriceGrids = useMemo(
    () => [...product.priceGrids].filter(pg => pg.price > 0).sort((a, b) => a.countFrom - b.countFrom),
    [product.priceGrids]
  );

  const firstTier = sortedPriceGrids[0];

  // State
  const [selectedTier, setSelectedTier] = useState<PriceGrids | null>(firstTier || null);
  const [quantity, setQuantity] = useState<number>(firstTier?.countFrom || 1);
  const [quantityInput, setQuantityInput] = useState<string>(String(firstTier?.countFrom || 1));
  const [artworkFiles, setArtworkFiles] = useState<ArtworkFile[]>([]);
  const [sizeBreakdown, setSizeBreakdown] = useState<SizeQuantity[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  // Available colors from product - sorted by sequenceNumber
  const availableColors = useMemo(() => {
    if (!product.productColors) return [];
    // Sort by sequenceNumber (nulls/undefined go last)
    return [...product.productColors].sort((a, b) => {
      const seqA = a.sequenceNumber ?? 999;
      const seqB = b.sequenceNumber ?? 999;
      return seqA - seqB;
    });
  }, [product.productColors]);

  const hasColors = availableColors.length > 0;

  // Auto-select first color (by sequence order) on mount to eliminate friction
  useEffect(() => {
    if (availableColors.length > 0 && !selectedColor) {
      setSelectedColor(availableColors[0].colorName);
    }
  }, [availableColors, selectedColor]);

  // Check if product is apparel
  const isApparel = useMemo(() => {
    return isApparelProduct(product.productName, product.allCategoryNameAndIds || []);
  }, [product.productName, product.allCategoryNameAndIds]);

  // Determine available sizes - use defaults for apparel if not specified
  const availableSizes = useMemo(() => {
    const extracted = extractSizesFromProduct(product.additionalFieldProductValues || []);
    // If it's apparel but no sizes found in data, use default sizes
    if (extracted.length === 0 && isApparel) {
      return ['S', 'M', 'L', 'XL', '2XL', '3XL'];
    }
    return extracted;
  }, [product.additionalFieldProductValues, isApparel]);

  // Show size breakdown for apparel products with sizes
  const needsSizeBreakdown = useMemo(
    () => isApparel && availableSizes.length > 0,
    [isApparel, availableSizes]
  );

  // Calculate current unit price based on quantity
  const currentUnitPrice = useMemo(() => {
    if (!selectedTier) return 0;

    // Find the applicable tier for the current quantity
    let applicableTier = selectedTier;
    for (const tier of sortedPriceGrids) {
      if (quantity >= tier.countFrom) {
        applicableTier = tier;
      } else {
        break;
      }
    }

    // Use sale price if available, otherwise regular price
    return applicableTier.salePrice && applicableTier.salePrice > 0
      ? applicableTier.salePrice
      : applicableTier.price;
  }, [selectedTier, quantity, sortedPriceGrids]);

  // Calculate subtotal
  const subtotal = useMemo(() => currentUnitPrice * quantity, [currentUnitPrice, quantity]);

  // Calculate shipping cost based on quantity (free for orders $500+)
  const shippingCost = useMemo(() => calculateShipping(quantity, subtotal), [quantity, subtotal]);

  // Calculate total price including shipping
  const totalPrice = useMemo(() => subtotal + shippingCost, [subtotal, shippingCost]);

  // Calculate next tier info for dynamic micro-copy
  const nextTierInfo = useMemo(() => {
    // Find current tier index
    let currentTierIndex = 0;
    for (let i = 0; i < sortedPriceGrids.length; i++) {
      if (quantity >= sortedPriceGrids[i].countFrom) {
        currentTierIndex = i;
      } else {
        break;
      }
    }

    // Check if there's a next tier
    if (currentTierIndex < sortedPriceGrids.length - 1) {
      const nextTier = sortedPriceGrids[currentTierIndex + 1];
      const nextPrice = nextTier.salePrice && nextTier.salePrice > 0 ? nextTier.salePrice : nextTier.price;
      const unitsNeeded = nextTier.countFrom - quantity;
      const currentPrice = currentUnitPrice;
      const savings = currentPrice - nextPrice;

      return {
        nextTier,
        nextPrice,
        unitsNeeded,
        savings,
        savingsPercent: Math.round((savings / currentPrice) * 100)
      };
    }
    return null;
  }, [sortedPriceGrids, quantity, currentUnitPrice]);

  // Check if quantity is above B2B bulk threshold - if so, recommend quote flow
  const isBulkOrder = useMemo(() => quantity >= B2B_BULK_THRESHOLD, [quantity]);

  // Get lead time from product data (default to 3 days)
  const leadTimeDays = useMemo(() => {
    // Try to extract lead time from product data if available
    return product.leadTimeDays || 3;
  }, [product]);

  // Handle tier selection
  const handleTierSelect = useCallback((tier: PriceGrids) => {
    setSelectedTier(tier);
    setQuantity(tier.countFrom);
    setQuantityInput(String(tier.countFrom));
    setError('');
  }, []);

  // Handle quantity change (from +/- buttons or blur)
  const handleQuantityChange = useCallback(
    (newQty: number) => {
      if (newQty < 1) return;

      // Find the appropriate tier for this quantity
      let newTier = sortedPriceGrids[0];
      for (const tier of sortedPriceGrids) {
        if (newQty >= tier.countFrom) {
          newTier = tier;
        } else {
          break;
        }
      }

      setSelectedTier(newTier);
      setQuantity(newQty);
      setQuantityInput(String(newQty));
      setError('');
    },
    [sortedPriceGrids]
  );

  // Handle size breakdown change
  const handleSizeBreakdownChange = useCallback((breakdown: SizeQuantity[]) => {
    setSizeBreakdown(breakdown);
  }, []);

  // Validate size breakdown
  const isSizeBreakdownValid = useMemo(() => {
    if (!needsSizeBreakdown) return true;
    const totalSizeQty = sizeBreakdown.reduce((sum, s) => sum + s.quantity, 0);
    return totalSizeQty === quantity;
  }, [needsSizeBreakdown, sizeBreakdown, quantity]);

  // Handle checkout
  const handleCheckout = async () => {
    setError('');

    // Validation - Color required if colors are available
    if (hasColors && !selectedColor) {
      setError('Please select a color before proceeding.');
      return;
    }

    // Validation - Size breakdown required for apparel
    if (needsSizeBreakdown && !isSizeBreakdownValid) {
      setError('Please complete the size breakdown to match your quantity.');
      return;
    }

    setIsProcessing(true);

    // Track checkout submitted in PostHog
    checkoutAnalytics.submitted({
      productId: product.id,
      productName: product.productName,
      quantity,
      total: totalPrice,
      category: product.allCategoryNameAndIds?.[0]?.name,
      color: selectedColor || undefined,
      hasArtwork: artworkFiles.length > 0,
      hasSizeBreakdown: sizeBreakdown.length > 0
    });

    // Fire Meta Pixel InitiateCheckout event with properly formatted value
    if (typeof window !== 'undefined' && (window as any).fbq) {
      const checkoutValue = Math.round(totalPrice * 100) / 100; // Ensure 2 decimal places
      (window as any).fbq('track', 'InitiateCheckout', {
        value: checkoutValue,
        currency: 'USD',
        content_name: product.productName,
        content_category: product.allCategoryNameAndIds?.[0]?.name || 'Promotional Products',
        content_ids: [product.id],
        content_type: 'product',
        contents: [{
          id: product.id,
          quantity: quantity,
          item_price: Math.round((totalPrice / quantity) * 100) / 100
        }],
        num_items: quantity
      });
      console.log('[Meta Pixel] InitiateCheckout fired:', { value: checkoutValue, product: product.productName, quantity });
    }

    try {
      // Get tracking cookies
      const gclid = getCookie('_gcl_aw')?.split('.').pop() || new URLSearchParams(window.location.search).get('gclid') || undefined;
      const fbp = getCookie('_fbp') || undefined;
      const fbclid = new URLSearchParams(window.location.search).get('fbclid');
      const fbc = getCookie('_fbc') || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined);

      // Determine artwork status for backend handling
      const artworkStatus = artworkFiles.length > 0 ? 'uploaded' : 'pending_email';

      const payload = {
        productId: product.id,
        quantity,
        selectedColor: selectedColor || undefined,
        artworkFiles: artworkFiles.map(f => ({
          fileUrl: f.fileKey,  // Send just the S3 key, not full URL
          fileName: f.filename,
          fileType: f.fileType
        })),
        artworkStatus, // Flag for backend: 'uploaded' or 'pending_email'
        sizeBreakdown: needsSizeBreakdown ? sizeBreakdown : undefined,
        notes: notes || undefined,
        sourceUrl: window.location.href,
        gclid,
        fbp,
        fbc
      };

      const response = await axios.post(`${API_BASE_URL}${CheckoutRoutes.createShoppingFlow}`, payload);

      const checkoutUrl = response.data?.payload?.checkoutUrl;
      if (checkoutUrl) {
        // Track checkout success (redirecting to Stripe)
        checkoutAnalytics.success({
          quoteId: response.data?.payload?.quoteId || '',
          productId: product.id,
          productName: product.productName,
          quantity,
          total: totalPrice,
          category: product.allCategoryNameAndIds?.[0]?.name
        });
        // Small delay to ensure analytics event is sent before redirect
        await new Promise(resolve => setTimeout(resolve, 100));
        window.location.href = checkoutUrl;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      console.error('Shopping flow checkout error:', err);
      // Track checkout error in PostHog
      checkoutAnalytics.error({
        productId: product.id,
        errorMessage: err.response?.data?.message || err.message || 'Unknown error',
        step: 'checkout_creation'
      });
      setError(err.response?.data?.message || 'Failed to create checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  const isOutOfStock = Boolean(product.outOfStock);

  if (!firstTier) {
    return null;
  }

  return (
    <div className="mt-6 space-y-5">
      {/* Dynamic Tier Micro-Copy - Encourages quantity increase */}
      {nextTierInfo && !isOutOfStock && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <FaFire className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <p className="text-sm text-gray-800">
              {needsSizeBreakdown ? (
                // Apparel-specific messaging - direct tier price focus
                <>
                  Add <span className="font-bold text-green-600">{nextTierInfo.unitsNeeded} more {nextTierInfo.unitsNeeded === 1 ? 'item' : 'items'}</span> to unlock the{' '}
                  <span className="font-bold text-green-600">${nextTierInfo.nextPrice.toFixed(2)}/ea</span> bulk price tier!{' '}
                  <span className="text-gray-600">(Mix sizes freely)</span>
                </>
              ) : (
                // Standard product messaging - direct tier price focus
                <>
                  Add <span className="font-bold text-green-600">{nextTierInfo.unitsNeeded} more {nextTierInfo.unitsNeeded === 1 ? 'item' : 'items'}</span> to unlock the{' '}
                  <span className="font-bold text-green-600">${nextTierInfo.nextPrice.toFixed(2)}/ea</span> bulk price tier!
                </>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Tier Selector */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Select Quantity Tier</h4>
        <div className="flex flex-wrap gap-2">
          {sortedPriceGrids.map(tier => {
            const price = tier.salePrice && tier.salePrice > 0 ? tier.salePrice : tier.price;
            const isSelected = selectedTier?.id === tier.id;
            const isCurrentTier = quantity >= tier.countFrom &&
              (sortedPriceGrids.indexOf(tier) === sortedPriceGrids.length - 1 ||
               quantity < sortedPriceGrids[sortedPriceGrids.indexOf(tier) + 1]?.countFrom);

            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => handleTierSelect(tier)}
                disabled={isOutOfStock}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                  isCurrentTier
                    ? 'border-green-600 bg-green-50 text-green-700 ring-2 ring-green-200'
                    : isSelected
                    ? 'border-green-400 bg-green-50/50 text-green-600'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                } ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="font-semibold">{tier.countFrom}+ PCS</div>
                <div className={`text-xs ${isCurrentTier ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
                  ${price.toFixed(2)}/ea
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity Input with Enhanced Pricing Display */}
      <div>
        <label htmlFor="quantity" className="text-sm font-semibold text-gray-900 mb-2 block">
          Enter Exact Quantity
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= (firstTier?.countFrom || 1) || isOutOfStock}
            className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg"
          >
            -
          </button>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            id="quantity"
            value={quantityInput}
            onChange={e => setQuantityInput(e.target.value.replace(/[^0-9]/g, ''))}
            onBlur={() => {
              const parsed = parseInt(quantityInput, 10);
              const minQty = firstTier?.countFrom || 1;
              const validQty = isNaN(parsed) || parsed < minQty ? minQty : parsed;
              handleQuantityChange(validQty);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
              }
            }}
            disabled={isOutOfStock}
            className="w-24 h-10 text-center border border-gray-300 rounded-lg font-bold text-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={isOutOfStock}
            className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg"
          >
            +
          </button>
          <div className="flex-1 text-right">
            <div className="text-sm text-gray-500">${currentUnitPrice.toFixed(2)} each</div>
            <div className="text-sm text-gray-500">Subtotal: ${subtotal.toFixed(2)}</div>
            <div className="text-sm text-gray-500">
              Shipping: {shippingCost === 0 ? <span className="text-green-600 font-medium">FREE</span> : `$${shippingCost.toFixed(2)}`}
            </div>
            <div className="text-xl font-bold text-gray-900">${totalPrice.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Color Selector with Product Images */}
      {hasColors && (
        <div>
          <label className="text-sm font-semibold text-gray-900 mb-2 block">
            Color: {selectedColor ? <span className="text-green-600">{selectedColor}</span> : <span className="text-red-500">* Select a color</span>}
          </label>
          {/* Grid with auto-fit: wraps to multiple rows, min 70px per item */}
          <div className="grid gap-2" style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))'
          }}>
            {availableColors.map((color: productColors) => {
              const isSelected = selectedColor === color.colorName;
              const colorImagePath = color.coloredProductImage || color.onlyColorImage;
              const imageUrl = colorImagePath ? `${ASSETS_SERVER_URL}${colorImagePath}` : null;

              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedColor(color.colorName)}
                  disabled={isOutOfStock}
                  className={`group relative rounded-lg border-2 transition-all overflow-hidden ${
                    isSelected
                      ? 'border-green-600 ring-2 ring-green-200'
                      : 'border-gray-200 hover:border-gray-400'
                  } ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={color.colorName}
                >
                  {/* Product Image with Color Name Overlay (shows on hover/selection) */}
                  {imageUrl ? (
                    <div className="relative w-full aspect-square overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={color.colorName}
                        className="w-full h-full object-cover"
                      />
                      {/* Color name overlay - hidden by default, shows on hover or selection */}
                      <div className={`absolute bottom-0 left-0 right-0 bg-black/70 px-1 py-1 transition-opacity duration-200 ${
                        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}>
                        <span className="text-[10px] text-white font-medium text-center block leading-tight truncate">
                          {color.colorName}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1">
                          <FaCheckCircle className="w-5 h-5 text-green-500 drop-shadow-lg" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative w-full aspect-square">
                      <div
                        className="w-full h-full"
                        style={{backgroundColor: color.colorHex || '#ccc'}}
                      />
                      {/* Color name overlay - hidden by default, shows on hover or selection */}
                      <div className={`absolute bottom-0 left-0 right-0 bg-black/70 px-1 py-1 transition-opacity duration-200 ${
                        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}>
                        <span className="text-[10px] text-white font-medium text-center block leading-tight truncate">
                          {color.colorName}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1">
                          <FaCheckCircle className="w-5 h-5 text-white drop-shadow-lg" />
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Breakdown (for apparel) */}
      {needsSizeBreakdown && (
        <div className="bg-gray-50 rounded-lg p-4">
          <SizeBreakdown
            availableSizes={availableSizes}
            totalQuantity={quantity}
            onChange={handleSizeBreakdownChange}
            disabled={isOutOfStock}
            autoAssignDefault={true}
          />
        </div>
      )}

      {/* Artwork Uploader - Frictionless with Skip Option */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-900">Upload Your Artwork</h4>
          <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-0.5 rounded">Optional</span>
        </div>
        <ArtworkUploader
          files={artworkFiles}
          onFilesChange={setArtworkFiles}
          uploadId={product.id}
          uploadType="QUOTE"
          disabled={isOutOfStock}
          maxFiles={5}
        />
        {/* Reassuring micro-copy for skipping artwork */}
        {artworkFiles.length === 0 && (
          <div className="mt-3 p-2 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-xs text-blue-700 flex items-start gap-2">
              <FaCheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-blue-500" />
              <span>
                <strong>Don&apos;t have your artwork handy?</strong> No problem! Place your order now, and you can upload or email us your logo later at{' '}
                <a href="mailto:orders@printsyou.com" className="underline font-medium">orders@printsyou.com</a>
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="text-sm font-semibold text-gray-900 mb-2 block">
          Special Instructions (Optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          disabled={isOutOfStock}
          placeholder="Any specific requirements or notes..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
        />
      </div>

      {/* Error Message */}
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

      {/* Urgency Countdown Widget */}
      <UrgencyCountdown leadTimeDays={leadTimeDays} />

      {/* CTA Buttons - Dynamic hierarchy based on order size */}
      {isBulkOrder ? (
        // B2B Bulk Order (500+ units) - Highlight Quote as smart path
        <div className="space-y-3">
          {/* B2B Recommendation Banner */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-3">
            <p className="text-sm text-purple-800 font-medium flex items-center gap-2">
              <FaClipboardList className="w-4 h-4 text-purple-600" />
              For orders of {B2B_BULK_THRESHOLD}+ units, we recommend getting a custom quote for the best pricing!
            </p>
          </div>

          {/* Get Quote - Primary CTA for bulk orders */}
          <Link
            href={`/request-quote?product=${product.id}&qty=${quantity}`}
            className="w-full min-h-[56px] py-4 px-4 flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-indigo-700"
          >
            <FaClipboardList className="mr-2 h-5 w-5" />
            Get Custom Quote for {quantity} Units
          </Link>

          {/* Buy Now - Secondary for bulk */}
          <button
            type="button"
            onClick={handleCheckout}
            disabled={isOutOfStock || isProcessing || (needsSizeBreakdown && !isSizeBreakdownValid) || (hasColors && !selectedColor)}
            className={`w-full py-3 px-4 flex items-center justify-center rounded-lg border-2 font-semibold text-sm transition-all ${
              isOutOfStock || isProcessing || (needsSizeBreakdown && !isSizeBreakdownValid) || (hasColors && !selectedColor)
                ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                : 'border-green-600 text-green-600 hover:bg-green-50'
            }`}
          >
            {isProcessing ? 'Processing...' : `Or Buy Now at $${totalPrice.toFixed(2)}`}
          </button>
        </div>
      ) : (
        // Standard Order - Buy Now is primary, Quote is secondary ghost button
        <div className="space-y-3">
          {/* Buy Now - Primary CTA */}
          <button
            type="button"
            onClick={handleCheckout}
            disabled={isOutOfStock || isProcessing || (needsSizeBreakdown && !isSizeBreakdownValid) || (hasColors && !selectedColor)}
            className={`w-full min-h-[56px] py-4 px-4 flex items-center justify-center rounded-xl text-white font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl ${
              isOutOfStock || isProcessing || (needsSizeBreakdown && !isSizeBreakdownValid) || (hasColors && !selectedColor)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
            }`}
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <RiShoppingBag4Fill className="mr-2 h-6 w-6" />
                Buy Now - ${totalPrice.toFixed(2)}
              </>
            )}
          </button>

          {/* Instant checkout messaging */}
          <p className="text-xs text-gray-500 text-center">
            Secure checkout • Shipping included • Proof within 30 minutes • No hidden fees
          </p>

          {/* Get Quote - Ghost/Secondary Link */}
          <div className="pt-2 border-t border-gray-200">
            <Link
              href={`/request-quote?product=${product.id}&qty=${quantity}`}
              className="w-full py-2 flex items-center justify-center text-sm text-gray-600 hover:text-green-600 transition-colors"
            >
              <FaClipboardList className="mr-2 h-4 w-4" />
              Need a custom quote or free mockup?
            </Link>
          </div>
        </div>
      )}

      {/* Trust Indicators - Clean horizontal strip */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <FaTruck className="w-3.5 h-3.5 text-blue-500" />
          <span>Free Shipping $500+</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <FaClock className="w-3.5 h-3.5 text-orange-500" />
          <span>Proof in 30 Min</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <FaShieldAlt className="w-3.5 h-3.5 text-green-500" />
          <span>256-bit SSL</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <FaCheckCircle className="w-3.5 h-3.5 text-primary-500" />
          <span>10,000+ Orders</span>
        </div>
      </div>
    </div>
  );
};
