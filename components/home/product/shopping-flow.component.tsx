'use client';

import React, {FC, useMemo, useState, useCallback} from 'react';
import {Product, PriceGrids, productColors} from '@components/home/product/product.types';
import {ArtworkUploader, ArtworkFile} from '@components/checkout/artwork-uploader';
import {SizeBreakdown, SizeQuantity, extractSizesFromProduct, isApparelProduct} from '@components/checkout/size-breakdown.component';
import {RiShoppingBag4Fill} from 'react-icons/ri';
import {FaTruck, FaClock, FaShieldAlt, FaCheckCircle, FaClipboardList} from 'react-icons/fa';
import axios from 'axios';
import Link from 'next/link';
import {CheckoutRoutes} from '@utils/routes/be-routes';
import {checkoutAnalytics} from '@utils/analytics';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ASSETS_SERVER_URL = process.env.NEXT_PUBLIC_ASSETS_SERVER_URL || 'https://printsyouassets.s3.amazonaws.com/';

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

  // Available colors from product
  const availableColors = useMemo(() => {
    return product.productColors || [];
  }, [product.productColors]);

  const hasColors = availableColors.length > 0;

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

    try {
      // Get tracking cookies
      const gclid = getCookie('_gcl_aw')?.split('.').pop() || new URLSearchParams(window.location.search).get('gclid') || undefined;
      const fbp = getCookie('_fbp') || undefined;
      const fbclid = new URLSearchParams(window.location.search).get('fbclid');
      const fbc = getCookie('_fbc') || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined);

      const payload = {
        productId: product.id,
        quantity,
        selectedColor: selectedColor || undefined,
        artworkFiles: artworkFiles.map(f => ({
          fileUrl: f.fileKey,  // Send just the S3 key, not full URL
          fileName: f.filename,
          fileType: f.fileType
        })),
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
      {/* Tier Selector */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Select Quantity</h4>
        <div className="flex flex-wrap gap-2">
          {sortedPriceGrids.map(tier => {
            const price = tier.salePrice && tier.salePrice > 0 ? tier.salePrice : tier.price;
            const isSelected = selectedTier?.id === tier.id;

            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => handleTierSelect(tier)}
                disabled={isOutOfStock}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                  isSelected
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                } ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="font-semibold">{tier.countFrom}+ PCS</div>
                <div className="text-xs text-gray-500">${price.toFixed(2)}/ea</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity Input */}
      <div>
        <label htmlFor="quantity" className="text-sm font-semibold text-gray-900 mb-2 block">
          Quantity
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= (firstTier?.countFrom || 1) || isOutOfStock}
            className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="w-20 h-10 text-center border border-gray-300 rounded-lg font-semibold focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={isOutOfStock}
            className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
          <div className="flex-1 text-right">
            <div className="text-sm text-gray-500">${currentUnitPrice.toFixed(2)} each</div>
            <div className="text-sm text-gray-500">Subtotal: ${subtotal.toFixed(2)}</div>
            <div className="text-sm text-gray-500">
              Shipping: {shippingCost === 0 ? <span className="text-green-600 font-medium">FREE</span> : `$${shippingCost.toFixed(2)}`}
            </div>
            <div className="text-lg font-bold text-gray-900">${totalPrice.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Color Selector with Product Images */}
      {hasColors && (
        <div>
          <label className="text-sm font-semibold text-gray-900 mb-2 block">
            Color: {selectedColor ? <span className="text-green-600">{selectedColor}</span> : <span className="text-red-500">* Select a color</span>}
          </label>
          {/* Dynamic grid: more colors = smaller images to fit in one row */}
          <div className="grid gap-1.5" style={{
            gridTemplateColumns: `repeat(${availableColors.length}, minmax(0, 1fr))`,
            maxWidth: availableColors.length <= 5 ? `${availableColors.length * 70}px` : '100%'
          }}>
            {availableColors.map((color: productColors) => {
              const isSelected = selectedColor === color.colorName;
              const colorImagePath = color.coloredProductImage || color.onlyColorImage;
              const imageUrl = colorImagePath ? `${ASSETS_SERVER_URL}${colorImagePath}` : null;
              // Smaller size when many colors
              const sizeClass = availableColors.length > 6 ? 'h-16' : 'h-20';

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
                  {/* Product Image with Color Name Overlay */}
                  {imageUrl ? (
                    <div className={`relative w-full ${sizeClass} overflow-hidden`}>
                      <img
                        src={imageUrl}
                        alt={color.colorName}
                        className="w-full h-full object-cover"
                      />
                      {/* Color name overlay at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-0.5 py-0.5">
                        <span className="text-[9px] text-white font-medium text-center block leading-tight line-clamp-2">
                          {color.colorName}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-0.5 right-0.5">
                          <FaCheckCircle className="w-4 h-4 text-green-500 drop-shadow-lg" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={`relative w-full ${sizeClass}`}>
                      <div
                        className="w-full h-full"
                        style={{backgroundColor: color.colorHex || '#ccc'}}
                      />
                      {/* Color name overlay at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-0.5 py-0.5">
                        <span className="text-[9px] text-white font-medium text-center block leading-tight line-clamp-2">
                          {color.colorName}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-0.5 right-0.5">
                          <FaCheckCircle className="w-4 h-4 text-white drop-shadow-lg" />
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

      {/* Artwork Uploader */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Upload Your Artwork (Optional)</h4>
        <p className="text-xs text-gray-500 mb-3">
          You can upload your logo/design now or send it later via email.
        </p>
        <ArtworkUploader
          files={artworkFiles}
          onFilesChange={setArtworkFiles}
          uploadId={product.id}
          uploadType="QUOTE"
          disabled={isOutOfStock}
          maxFiles={5}
        />
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

      {/* CTA Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {/* Buy Now Button */}
        <div className="flex flex-col">
          <button
            type="button"
            onClick={handleCheckout}
            disabled={isOutOfStock || isProcessing || (needsSizeBreakdown && !isSizeBreakdownValid) || (hasColors && !selectedColor)}
            className={`w-full min-h-[60px] py-3 px-3 flex items-center justify-center rounded-lg text-white font-bold text-base transition-all duration-200 shadow-lg hover:shadow-xl ${
              isOutOfStock || isProcessing || (needsSizeBreakdown && !isSizeBreakdownValid) || (hasColors && !selectedColor)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                Buy Now
                <RiShoppingBag4Fill className="ml-2 h-5 w-5 flex-shrink-0" />
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Fast checkout for ready-to-order customers
          </p>
        </div>

        {/* Get Quote Button */}
        <div className="flex flex-col">
          <Link
            href={`/request-quote?product=${product.id}`}
            className="w-full min-h-[60px] py-3 px-3 flex items-center justify-center rounded-lg border-2 border-green-600 text-green-600 font-bold text-sm transition-all duration-200 hover:bg-green-50 text-center"
          >
            <span>Get Free Quote + Mockup</span>
            <FaClipboardList className="ml-2 h-4 w-4 flex-shrink-0" />
          </Link>
          <p className="text-xs text-gray-500 text-center mt-2">
            Best for bulk orders & custom requirements
          </p>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <FaTruck className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <span>Free Shipping $500+</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <FaClock className="w-4 h-4 text-orange-500 flex-shrink-0" />
          <span>Proof in 30 Minutes</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <FaShieldAlt className="w-4 h-4 text-green-500 flex-shrink-0" />
          <span>Secure Checkout</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <FaCheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0" />
          <span>Trusted by US Businesses</span>
        </div>
      </div>
    </div>
  );
};
