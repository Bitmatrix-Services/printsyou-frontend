'use client';

/* eslint-disable @next/next/no-img-element */

/**
 * =============================================================================
 * SHOPPING FLOW COMPONENT - CRO-Optimized "Design-First" Layout
 * =============================================================================
 *
 * Optimized for paid Meta Ads traffic with psychological flow:
 * 1. CUSTOMIZATION (The Hook) - Build emotional ownership first
 * 2. COLOR SELECTION - Visual engagement continues
 * 3. QUANTITY & SIZES - Administrative details after commitment
 * 4. PRICE & CTA (The Finish Line) - Clear path to conversion
 *
 * =============================================================================
 */

import React, {FC, useMemo, useState, useCallback, useEffect} from 'react';
import {Product, PriceGrids, productColors, ProductImageWithZones, CustomizationData} from '@components/home/product/product.types';
import {ArtworkUploader, ArtworkFile} from '@components/checkout/artwork-uploader';
import {SizeBreakdown, SizeQuantity, extractSizesFromProduct, isApparelProduct} from '@components/checkout/size-breakdown.component';
import {ProductCustomizer} from '@components/home/product/product-customizer.component';
import {RiShoppingBag4Fill} from 'react-icons/ri';
import {FaTruck, FaClock, FaShieldAlt, FaCheckCircle, FaClipboardList, FaBolt, FaUpload, FaPencilAlt, FaBalanceScale} from 'react-icons/fa';
import {HiLightningBolt} from 'react-icons/hi';
import axios from 'axios';
import Link from 'next/link';
import {CheckoutRoutes} from '@utils/routes/be-routes';
import {checkoutAnalytics} from '@utils/analytics';
import {useStore, useHasFeature} from '@/providers/store-provider';
import {uploadBase64ToS3} from '@utils/s3-upload';
import {createPreviewDataUrl} from '@utils/preview-renderer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ASSETS_SERVER_URL = process.env.NEXT_PUBLIC_ASSETS_SERVER_URL || 'https://printsyouassets.s3.amazonaws.com/';

// B2B bulk threshold - above this quantity, highlight Get Quote as recommended path
const B2B_BULK_THRESHOLD = 500;

// Production cutoff hour (2 PM CST = 14:00)
const PRODUCTION_CUTOFF_HOUR = 14;

// Shipping configuration
const SHIPPING_CONFIG = {
  freeShippingThreshold: 500,
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

const calculateShipping = (qty: number, subtotal: number): number => {
  if (subtotal >= SHIPPING_CONFIG.freeShippingThreshold) return 0;
  const rate = SHIPPING_CONFIG.rates.find(r => qty <= r.maxQty);
  return rate?.fee || SHIPPING_CONFIG.rates[SHIPPING_CONFIG.rates.length - 1].fee;
};

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

// =============================================================================
// STEP HEADER COMPONENT
// =============================================================================
const StepHeader: FC<{step: number; title: string; isComplete?: boolean}> = ({step, title, isComplete}) => (
  <div className="flex items-center gap-3 mb-4">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
      isComplete
        ? 'bg-green-600 text-white'
        : 'bg-gray-900 text-white'
    }`}>
      {isComplete ? <FaCheckCircle className="w-4 h-4" /> : step}
    </div>
    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
  </div>
);

// =============================================================================
// URGENCY COUNTDOWN COMPONENT
// =============================================================================
const UrgencyCountdown: FC<{leadTimeDays?: number}> = ({leadTimeDays = 3}) => {
  const [timeLeft, setTimeLeft] = useState<{hours: number; minutes: number; isToday: boolean} | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const cstOffset = -6 * 60;
      const localOffset = now.getTimezoneOffset();
      const cstTime = new Date(now.getTime() + (localOffset + cstOffset) * 60000);
      const currentHour = cstTime.getHours();
      const currentMinute = cstTime.getMinutes();
      const dayOfWeek = cstTime.getDay();
      const isBusinessDay = dayOfWeek >= 1 && dayOfWeek <= 5;
      const isBeforeCutoff = currentHour < PRODUCTION_CUTOFF_HOUR;

      if (isBusinessDay && isBeforeCutoff) {
        const minutesLeft = (PRODUCTION_CUTOFF_HOUR * 60) - (currentHour * 60 + currentMinute);
        return {hours: Math.floor(minutesLeft / 60), minutes: minutesLeft % 60, isToday: true};
      } else {
        let daysToAdd = 1;
        if (dayOfWeek === 5 && !isBeforeCutoff) daysToAdd = 3;
        if (dayOfWeek === 6) daysToAdd = 2;
        if (dayOfWeek === 0) daysToAdd = 1;
        const nextBusinessDay = new Date(cstTime);
        nextBusinessDay.setDate(nextBusinessDay.getDate() + daysToAdd);
        nextBusinessDay.setHours(PRODUCTION_CUTOFF_HOUR, 0, 0, 0);
        const msLeft = nextBusinessDay.getTime() - cstTime.getTime();
        const totalMinutes = Math.floor(msLeft / 60000);
        return {hours: Math.floor(totalMinutes / 60), minutes: totalMinutes % 60, isToday: false};
      }
    };
    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => setTimeLeft(calculateTimeLeft()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (!timeLeft) return null;
  const isFastTrack = leadTimeDays <= 3;

  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl p-4 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 rounded-full p-2">
          {isFastTrack ? <FaBolt className="w-5 h-5 animate-pulse" /> : <FaClock className="w-5 h-5" />}
        </div>
        <div className="flex-1">
          {timeLeft.isToday ? (
            <p className="font-bold">
              Order within <span className="bg-white/20 px-2 py-0.5 rounded">{timeLeft.hours}h {timeLeft.minutes}m</span> for production to start TODAY!
            </p>
          ) : (
            <p className="font-bold">Order now for production to start {timeLeft.hours < 24 ? 'tomorrow' : 'next business day'}!</p>
          )}
          {isFastTrack && (
            <p className="text-sm text-white/90 flex items-center gap-1 mt-1">
              <HiLightningBolt className="w-4 h-4" /> Fast-Track Production Active
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN SHOPPING FLOW COMPONENT
// =============================================================================
interface ShoppingFlowProps {
  product: Product;
}

export const ShoppingFlow: FC<ShoppingFlowProps> = ({product}) => {
  // Store context
  const {store, isB2B} = useStore();
  const hasTierPricing = useHasFeature('tierPricing');
  const hasArtworkUpload = useHasFeature('artworkUpload');
  const hasQuoteRequests = useHasFeature('quoteRequests');
  const showBulkThreshold = useHasFeature('showBulkThreshold');
  const showProductionCountdown = useHasFeature('showProductionCountdown');

  const bulkThreshold = store.checkout.bulkThreshold || B2B_BULK_THRESHOLD;
  const freeShippingThreshold = store.checkout.freeShippingThreshold;

  // Price tiers
  const sortedPriceGrids = useMemo(
    () => [...product.priceGrids].filter(pg => pg.price > 0).sort((a, b) => a.countFrom - b.countFrom),
    [product.priceGrids]
  );
  const firstTier = sortedPriceGrids[0];
  const minQuantity = firstTier?.countFrom || 1;

  // ==========================================================================
  // STATE
  // ==========================================================================
  const [selectedTier, setSelectedTier] = useState<PriceGrids | null>(firstTier || null);
  const [quantity, setQuantity] = useState<number>(minQuantity);
  const [quantityInput, setQuantityInput] = useState<string>(String(minQuantity));
  const [artworkFiles, setArtworkFiles] = useState<ArtworkFile[]>([]);
  const [sizeBreakdown, setSizeBreakdown] = useState<SizeQuantity[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customizationData, setCustomizationData] = useState<CustomizationData | null>(null);
  const [hoveredPreview, setHoveredPreview] = useState<{view: string; imageUrl: string; logoUrl?: string} | null>(null);

  // ==========================================================================
  // DERIVED STATE
  // ==========================================================================
  const availableColors = useMemo(() => {
    if (!product.productColors) return [];
    return [...product.productColors].sort((a, b) => (a.sequenceNumber ?? 999) - (b.sequenceNumber ?? 999));
  }, [product.productColors]);

  const hasColors = availableColors.length > 0;

  useEffect(() => {
    if (availableColors.length > 0 && !selectedColor) {
      setSelectedColor(availableColors[0].colorName);
    }
  }, [availableColors, selectedColor]);

  const isApparel = useMemo(() => isApparelProduct(product.productName, product.allCategoryNameAndIds || []), [product]);

  const availableSizes = useMemo(() => {
    const extracted = extractSizesFromProduct(product.additionalFieldProductValues || []);
    if (extracted.length === 0 && isApparel) return ['S', 'M', 'L', 'XL', '2XL', '3XL'];
    return extracted;
  }, [product.additionalFieldProductValues, isApparel]);

  const needsSizeBreakdown = isApparel && availableSizes.length > 0;

  const currentUnitPrice = useMemo(() => {
    if (!selectedTier) return 0;
    let applicableTier = selectedTier;
    for (const tier of sortedPriceGrids) {
      if (quantity >= tier.countFrom) applicableTier = tier;
      else break;
    }
    return applicableTier.salePrice && applicableTier.salePrice > 0 ? applicableTier.salePrice : applicableTier.price;
  }, [selectedTier, quantity, sortedPriceGrids]);

  const subtotal = currentUnitPrice * quantity;
  const shippingCost = calculateShipping(quantity, subtotal);
  const totalPrice = subtotal + shippingCost;
  const isFreeShipping = shippingCost === 0;

  const isSizeBreakdownValid = useMemo(() => {
    if (!needsSizeBreakdown) return true;
    const totalSizeQty = sizeBreakdown.reduce((sum, s) => sum + s.quantity, 0);
    return totalSizeQty === quantity;
  }, [needsSizeBreakdown, sizeBreakdown, quantity]);

  const totalSizeQty = sizeBreakdown.reduce((sum, s) => sum + s.quantity, 0);
  const remainingQty = quantity - totalSizeQty;

  const isBulkOrder = showBulkThreshold && bulkThreshold && quantity >= bulkThreshold;
  const leadTimeDays = product.leadTimeDays || 3;

  const hasCustomizationZones = useMemo(() => {
    const productImages = (product as any)?.productImages as ProductImageWithZones[] | undefined;
    if (productImages?.length) {
      return productImages.some(img => img.logoPosition?.enabled || img.numberPosition?.enabled || img.namePosition?.enabled);
    }
    const {defaultLogoPosition, defaultNumberPosition, defaultNamePosition} = product as any;
    return defaultLogoPosition?.enabled || defaultNumberPosition?.enabled || defaultNamePosition?.enabled;
  }, [product]);

  const productImagesForCustomizer = useMemo(() => (product as any)?.productImages as ProductImageWithZones[] | undefined, [product]);

  // Step completion states
  const isStep1Complete = !!(customizationData?.logoDataUrl || artworkFiles.length > 0);
  const isStep2Complete = hasColors ? !!selectedColor : true;
  const isStep3Complete = isSizeBreakdownValid;

  // ==========================================================================
  // HANDLERS
  // ==========================================================================
  const handleTierSelect = useCallback((tier: PriceGrids) => {
    setSelectedTier(tier);
    setQuantity(tier.countFrom);
    setQuantityInput(String(tier.countFrom));
    setError('');
  }, []);

  const handleQuantityChange = useCallback((newQty: number) => {
    if (newQty < minQuantity) return;
    let newTier = sortedPriceGrids[0];
    for (const tier of sortedPriceGrids) {
      if (newQty >= tier.countFrom) newTier = tier;
      else break;
    }
    setSelectedTier(newTier);
    setQuantity(newQty);
    setQuantityInput(String(newQty));
    setError('');
  }, [sortedPriceGrids, minQuantity]);

  const handleSizeBreakdownChange = useCallback((breakdown: SizeQuantity[]) => {
    setSizeBreakdown(breakdown);
  }, []);

  // Distribute evenly across sizes (S, M, L primarily)
  const handleDistributeEvenly = useCallback(() => {
    const primarySizes = ['S', 'M', 'L'].filter(s => availableSizes.includes(s));
    const sizesToUse = primarySizes.length > 0 ? primarySizes : availableSizes.slice(0, 3);

    if (sizesToUse.length === 0) return;

    const perSize = Math.floor(quantity / sizesToUse.length);
    const remainder = quantity % sizesToUse.length;

    const newBreakdown: SizeQuantity[] = sizesToUse.map((size, idx) => ({
      size,
      quantity: perSize + (idx < remainder ? 1 : 0)
    }));

    setSizeBreakdown(newBreakdown);
  }, [quantity, availableSizes]);

  const handleCheckout = async () => {
    setError('');
    if (hasColors && !selectedColor) {
      setError('Please select a color before proceeding.');
      return;
    }
    if (needsSizeBreakdown && !isSizeBreakdownValid) {
      setError('Please complete the size breakdown to match your quantity.');
      return;
    }

    setIsProcessing(true);
    checkoutAnalytics.submitted({
      productId: product.id,
      productName: product.productName,
      quantity,
      total: totalPrice,
      category: product.allCategoryNameAndIds?.[0]?.name,
      color: selectedColor || undefined,
      hasArtwork: artworkFiles.length > 0 || !!customizationData?.logoDataUrl,
      hasSizeBreakdown: sizeBreakdown.length > 0
    });

    if (typeof window !== 'undefined' && (window as any).fbq) {
      const checkoutValue = Math.round(totalPrice * 100) / 100;
      (window as any).fbq('track', 'InitiateCheckout', {
        value: checkoutValue,
        currency: 'USD',
        content_name: product.productName,
        content_category: product.allCategoryNameAndIds?.[0]?.name || 'Promotional Products',
        content_ids: [product.id],
        content_type: 'product',
        contents: [{id: product.id, quantity, item_price: Math.round((totalPrice / quantity) * 100) / 100}],
        num_items: quantity
      });
    }

    try {
      const gclid = getCookie('_gcl_aw')?.split('.').pop() || new URLSearchParams(window.location.search).get('gclid') || undefined;
      const fbp = getCookie('_fbp') || undefined;
      const fbclid = new URLSearchParams(window.location.search).get('fbclid');
      const fbc = getCookie('_fbc') || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined);
      const timestamp = Date.now();

      // Build artwork files array - start with any manually uploaded files
      const allArtworkFiles: Array<{fileUrl: string; fileName: string; fileType?: string; notes?: string; viewType?: string}> = [
        ...artworkFiles.map(f => ({fileUrl: f.fileKey, fileName: f.filename, fileType: f.fileType}))
      ];

      // Upload customization images to S3 if present
      let customizationLogoS3Url: string | undefined;
      let customizationPreviewS3Url: string | undefined;
      const hasCustomization = customizationData?.playerName || customizationData?.playerNumber || customizationData?.logoDataUrl;

      if (hasCustomization) {
        // Build customization notes for artwork files
        const customNotes: string[] = [];
        if (customizationData?.playerName) customNotes.push(`Name: ${customizationData.playerName}`);
        if (customizationData?.playerNumber) customNotes.push(`Number: #${customizationData.playerNumber}`);
        const customizationNotesStr = customNotes.length > 0 ? customNotes.join(', ') : '';

        // Upload customer's logo if provided
        if (customizationData?.logoDataUrl) {
          const logoFileName = `customer_logo_${product.id}_${timestamp}.png`;
          const logoS3Url = await uploadBase64ToS3(customizationData.logoDataUrl, product.id, logoFileName, 'QUOTE');
          if (logoS3Url) {
            customizationLogoS3Url = logoS3Url;
            // Extract just the key from URL for artwork files
            const logoKey = logoS3Url.replace(ASSETS_SERVER_URL, '');
            allArtworkFiles.push({
              fileUrl: logoKey,
              fileName: logoFileName,
              fileType: 'png',
              notes: 'Customer uploaded logo',
              viewType: 'LOGO'
            });
          }
        }

        // Generate and upload design previews for each available view
        const availableViews = customizationData?.availableViews || ['FRONT'];
        for (const viewType of availableViews) {
          // Get product image for this view
          const productImageUrl = customizationData?.viewProductImages?.[viewType];
          const zoneConfig = customizationData?.viewZoneConfigs?.[viewType];

          if (productImageUrl) {
            try {
              // Generate preview using the renderer (handles CORS properly)
              const previewDataUrl = await createPreviewDataUrl({
                canvasSize: 800,
                productImageUrl,
                customization: {
                  playerName: customizationData?.playerName,
                  playerNumber: customizationData?.playerNumber,
                  logoDataUrl: customizationData?.logoDataUrl,
                  fontStyle: customizationData?.fontStyle,
                  userFontColor: customizationData?.userFontColor,
                },
                zoneConfig: zoneConfig ? {
                  name: zoneConfig.name,
                  number: zoneConfig.number,
                  logo: zoneConfig.logo,
                } : null,
                viewType,
              });

              const previewFileName = `design_${viewType.toLowerCase()}_${product.id}_${timestamp}.png`;
              const previewS3Url = await uploadBase64ToS3(previewDataUrl, product.id, previewFileName, 'QUOTE');

              if (previewS3Url) {
                if (viewType === 'FRONT') customizationPreviewS3Url = previewS3Url;
                const previewKey = previewS3Url.replace(ASSETS_SERVER_URL, '');
                allArtworkFiles.push({
                  fileUrl: previewKey,
                  fileName: previewFileName,
                  fileType: 'png',
                  notes: `${customizationNotesStr} - ${viewType} VIEW`,
                  viewType
                });
              }
            } catch (error) {
              console.error(`Failed to generate ${viewType} preview:`, error);
            }
          }
        }
      }

      const payload = {
        productId: product.id,
        quantity,
        selectedColor: selectedColor || undefined,
        artworkFiles: allArtworkFiles,
        artworkStatus: allArtworkFiles.length > 0 ? 'uploaded' : 'pending_email',
        sizeBreakdown: needsSizeBreakdown ? sizeBreakdown : undefined,
        notes: notes || undefined,
        sourceUrl: window.location.href,
        storeSlug: store.slug,
        gclid, fbp, fbc,
        customizationPlayerName: customizationData?.playerName || undefined,
        customizationPlayerNumber: customizationData?.playerNumber || undefined,
        customizationLogoUrl: customizationLogoS3Url || undefined,
        customizationPreviewUrl: customizationPreviewS3Url || undefined
      };

      const response = await axios.post(`${API_BASE_URL}${CheckoutRoutes.createShoppingFlow}`, payload);
      const checkoutUrl = response.data?.payload?.checkoutUrl;

      if (checkoutUrl) {
        checkoutAnalytics.success({
          quoteId: response.data?.payload?.quoteId || '',
          productId: product.id,
          productName: product.productName,
          quantity,
          total: totalPrice,
          category: product.allCategoryNameAndIds?.[0]?.name
        });
        await new Promise(resolve => setTimeout(resolve, 100));
        window.location.href = checkoutUrl;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      console.error('Shopping flow checkout error:', err);
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
  if (!firstTier) return null;

  // ==========================================================================
  // RENDER
  // ==========================================================================
  return (
    <div className="mt-6 space-y-6">
      {/* ================================================================== */}
      {/* STEP 1: CUSTOMIZATION (THE HOOK) */}
      {/* ================================================================== */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <StepHeader step={1} title="Add Your Logo & Customization" isComplete={isStep1Complete} />

        {/* Customization Preview or Upload CTA */}
        {customizationData?.logoDataUrl ? (
          // Logo uploaded via customizer - show preview
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              {/* Thumbnail previews */}
              <div className="flex gap-3 relative">
                {/* Use availableViews if we have valid viewProductImages, otherwise fallback to product.productImages */}
                {(() => {
                  const hasValidViewImages = customizationData.availableViews?.length &&
                    customizationData.viewProductImages &&
                    Object.values(customizationData.viewProductImages).some(v => v);

                  if (hasValidViewImages) {
                    return customizationData.availableViews!.map((view) => {
                      const viewImage = customizationData.viewProductImages?.[view];
                      const logoToShow = (customizationData.useDifferentLogos && view === 'BACK' && customizationData.backLogoDataUrl)
                        ? customizationData.backLogoDataUrl
                        : customizationData.logoDataUrl;
                      if (!viewImage) return null;
                      return (
                        <div key={view} className="text-center">
                          <div
                            className="w-28 h-28 rounded-lg border-2 border-gray-200 bg-gray-50 overflow-hidden relative cursor-zoom-in hover:border-gray-400 transition-all"
                            onMouseEnter={() => setHoveredPreview({view, imageUrl: viewImage, logoUrl: logoToShow || undefined})}
                            onMouseLeave={() => setHoveredPreview(null)}
                          >
                            <img src={viewImage} alt={view} className="w-full h-full object-contain" />
                            {/* Logo overlay - use simple centered position for thumbnails since zone-based CSS positioning doesn't account for object-contain letterboxing */}
                            {logoToShow && (
                              <img
                                src={logoToShow}
                                alt="Logo"
                                className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 object-contain"
                              />
                            )}
                          </div>
                          <span className="text-xs text-gray-500 mt-1 block capitalize">{view.toLowerCase()}</span>
                        </div>
                      );
                    });
                  } else {
                    // Fallback: use product.productImages directly
                    return product.productImages?.slice(0, 2).map((img, idx) => {
                      const imgUrl = img.imageUrl?.startsWith('http') ? img.imageUrl : `${ASSETS_SERVER_URL}${img.imageUrl}`;
                      return (
                        <div key={idx} className="text-center">
                          <div
                            className="w-28 h-28 rounded-lg border-2 border-gray-200 bg-gray-50 overflow-hidden relative cursor-zoom-in hover:border-gray-400 transition-all"
                            onMouseEnter={() => setHoveredPreview({view: idx === 0 ? 'Front' : 'Back', imageUrl: imgUrl, logoUrl: customizationData.logoDataUrl || undefined})}
                            onMouseLeave={() => setHoveredPreview(null)}
                          >
                            <img src={imgUrl} alt={idx === 0 ? 'Front' : 'Back'} className="w-full h-full object-contain" />
                            {customizationData.logoDataUrl && (
                              <img src={customizationData.logoDataUrl} alt="Logo" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 object-contain" />
                            )}
                          </div>
                          <span className="text-xs text-gray-500 mt-1 block">{idx === 0 ? 'Front' : 'Back'}</span>
                        </div>
                      );
                    });
                  }
                })()}

                {/* Hover zoom popup */}
                {hoveredPreview && (
                  <div className="absolute left-0 bottom-full mb-3 z-50 pointer-events-none">
                    <div className="w-72 h-72 rounded-xl border-2 border-gray-300 bg-white shadow-2xl overflow-hidden relative">
                      <img src={hoveredPreview.imageUrl} alt={hoveredPreview.view} className="w-full h-full object-contain" />
                      {/* Logo overlay - centered position for consistent display */}
                      {hoveredPreview.logoUrl && (
                        <img
                          src={hoveredPreview.logoUrl}
                          alt="Logo"
                          className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 w-16 h-16 object-contain"
                        />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gray-900/80 px-3 py-2">
                        <span className="text-sm text-white font-medium capitalize">{hoveredPreview.view.toLowerCase()} view</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1">
                <div className="flex items-center gap-2 text-green-600 font-semibold mb-2">
                  <FaCheckCircle className="w-4 h-4" />
                  <span>Artwork Added</span>
                </div>
                {customizationData.playerName && <p className="text-sm text-gray-700"><span className="font-medium">Name:</span> {customizationData.playerName}</p>}
                {customizationData.playerNumber && <p className="text-sm text-gray-700"><span className="font-medium">Number:</span> #{customizationData.playerNumber}</p>}
                {customizationData.useDifferentLogos && customizationData.backLogoDataUrl && (
                  <p className="text-xs text-gray-500 mt-1">Different logos for front/back</p>
                )}
                <button
                  type="button"
                  onClick={() => setShowCustomizer(true)}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <FaPencilAlt className="w-3.5 h-3.5" />
                  Change or Adjust Artwork
                </button>
              </div>
            </div>
          </div>
        ) : hasCustomizationZones ? (
          // Product has customization zones - show button to open customizer
          <button
            type="button"
            onClick={() => setShowCustomizer(true)}
            disabled={isOutOfStock}
            className="w-full py-5 px-6 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center group-hover:border-gray-400 transition-colors">
              <FaUpload className="w-6 h-6 text-gray-500 group-hover:text-gray-700" />
            </div>
            <span className="text-lg font-semibold text-gray-700">Upload Logo / Add Artwork</span>
            <span className="text-sm text-gray-500">Click to customize your product</span>
          </button>
        ) : (
          // No customization zones - show artwork uploader directly
          <div className="space-y-3">
            {artworkFiles.length > 0 ? (
              // Show uploaded files preview
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-600 font-semibold mb-3">
                  <FaCheckCircle className="w-4 h-4" />
                  <span>{artworkFiles.length} file{artworkFiles.length > 1 ? 's' : ''} uploaded</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {artworkFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded border border-green-200 text-sm">
                      <span className="truncate max-w-[150px]">{file.filename}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-2">Upload your logo or artwork file (PNG, JPG, PDF, AI, EPS)</p>
            )}
            {hasArtworkUpload && (
              <ArtworkUploader
                files={artworkFiles}
                onFilesChange={setArtworkFiles}
                uploadId={product.id}
                uploadType="QUOTE"
                disabled={isOutOfStock}
                maxFiles={5}
              />
            )}
          </div>
        )}

        {/* Special Instructions */}
        <div className="mt-4">
          <label htmlFor="notes" className="text-sm font-medium text-gray-600 mb-1.5 block">
            Special Instructions / Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            disabled={isOutOfStock}
            placeholder="Print placement preferences, Pantone colors, or any other requirements..."
            rows={2}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 focus:border-gray-400 resize-none bg-gray-50"
          />
        </div>
      </div>

      {/* ================================================================== */}
      {/* STEP 2: SELECT SHIRT COLOR */}
      {/* ================================================================== */}
      {hasColors && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <StepHeader step={2} title="Select Shirt Color" isComplete={isStep2Complete} />

          <div className="mb-3">
            <span className="text-sm text-gray-600">
              Color: {selectedColor ? <span className="font-semibold text-gray-900">{selectedColor}</span> : <span className="text-red-500 font-medium">Select a color</span>}
            </span>
          </div>

          <div className="grid gap-2" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))'}}>
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
                    isSelected ? 'border-gray-900 ring-2 ring-gray-300' : 'border-gray-200 hover:border-gray-400'
                  } ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={color.colorName}
                >
                  {imageUrl ? (
                    <div className="relative w-full aspect-square overflow-hidden">
                      <img src={imageUrl} alt={color.colorName} className="w-full h-full object-cover" />
                      <div className={`absolute bottom-0 left-0 right-0 bg-black/70 px-1 py-1 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <span className="text-[10px] text-white font-medium text-center block truncate">{color.colorName}</span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1">
                          <FaCheckCircle className="w-5 h-5 text-green-500 drop-shadow-lg" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative w-full aspect-square">
                      <div className="w-full h-full" style={{backgroundColor: color.colorHex || '#ccc'}} />
                      <div className={`absolute bottom-0 left-0 right-0 bg-black/70 px-1 py-1 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <span className="text-[10px] text-white font-medium text-center block truncate">{color.colorName}</span>
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

      {/* ================================================================== */}
      {/* STEP 3: QUANTITY & SIZE BREAKDOWN */}
      {/* ================================================================== */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <StepHeader step={hasColors ? 3 : 2} title="Choose Quantities & Sizes" isComplete={isStep3Complete} />

        {/* Minimum order notice */}
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800 font-medium">
            Minimum Order: <span className="font-bold">{minQuantity} pieces</span>
          </p>
        </div>

        {/* Tier Selector */}
        {hasTierPricing && (
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Select Quantity Tier (Better pricing at higher quantities)</label>
            <div className="flex flex-wrap gap-2">
              {sortedPriceGrids.map(tier => {
                const price = tier.salePrice && tier.salePrice > 0 ? tier.salePrice : tier.price;
                const isCurrentTier = quantity >= tier.countFrom &&
                  (sortedPriceGrids.indexOf(tier) === sortedPriceGrids.length - 1 || quantity < sortedPriceGrids[sortedPriceGrids.indexOf(tier) + 1]?.countFrom);

                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => handleTierSelect(tier)}
                    disabled={isOutOfStock}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      isCurrentTier
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                    } ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="font-bold">{tier.countFrom}+</div>
                    <div className="text-xs opacity-80">${price.toFixed(2)}/ea</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantity Input */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Exact Quantity</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= minQuantity || isOutOfStock}
              className="w-11 h-11 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl"
            >
              −
            </button>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={quantityInput}
              onChange={e => setQuantityInput(e.target.value.replace(/[^0-9]/g, ''))}
              onBlur={() => {
                const parsed = parseInt(quantityInput, 10);
                const validQty = isNaN(parsed) || parsed < minQuantity ? minQuantity : parsed;
                handleQuantityChange(validQty);
              }}
              onKeyDown={e => e.key === 'Enter' && e.currentTarget.blur()}
              disabled={isOutOfStock}
              className="w-28 h-11 text-center border border-gray-300 rounded-lg font-bold text-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
            />
            <button
              type="button"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={isOutOfStock}
              className="w-11 h-11 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl"
            >
              +
            </button>
            <span className="text-sm text-gray-500">@ ${currentUnitPrice.toFixed(2)} each</span>
          </div>
        </div>

        {/* Size Breakdown */}
        {needsSizeBreakdown && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">Size Breakdown</label>
              <button
                type="button"
                onClick={handleDistributeEvenly}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                <FaBalanceScale className="w-3 h-3" />
                Distribute Evenly (S, M, L)
              </button>
            </div>

            <SizeBreakdown
              availableSizes={availableSizes}
              totalQuantity={quantity}
              onChange={handleSizeBreakdownChange}
              disabled={isOutOfStock}
              autoAssignDefault={false}
            />

            {/* Validation indicator */}
            <div className={`mt-3 p-2 rounded-lg text-sm font-medium ${
              isSizeBreakdownValid
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {isSizeBreakdownValid ? (
                <span className="flex items-center gap-2">
                  <FaCheckCircle className="w-4 h-4" />
                  Complete! {totalSizeQty} / {quantity} sizes matched
                </span>
              ) : (
                <span>{totalSizeQty} / {quantity} assigned ({remainingQty > 0 ? `${remainingQty} remaining` : `${Math.abs(remainingQty)} over`})</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ================================================================== */}
      {/* STEP 4: PRICE & CALLS TO ACTION (THE FINISH LINE) */}
      {/* ================================================================== */}
      <div className="space-y-4">
        {/* Urgency Banner */}
        {showProductionCountdown && <UrgencyCountdown leadTimeDays={leadTimeDays} />}

        {/* Pricing Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{quantity} items × ${currentUnitPrice.toFixed(2)}</span>
              <span className="text-gray-900 font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              {isFreeShipping ? (
                <span className="text-green-600 font-semibold">FREE</span>
              ) : (
                <span className="text-gray-900">${shippingCost.toFixed(2)}</span>
              )}
            </div>
            {!isFreeShipping && subtotal < freeShippingThreshold && (
              <p className="text-xs text-gray-500">Add ${(freeShippingThreshold - subtotal).toFixed(2)} more for free shipping</p>
            )}
            <div className="border-t border-gray-300 pt-2 flex justify-between">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
          )}

          {/* Primary CTA */}
          {isBulkOrder ? (
            // Bulk order - Quote is primary
            <div className="space-y-3">
              <Link
                href={`/request-quote?product=${product.id}&qty=${quantity}`}
                className="w-full min-h-[60px] py-4 px-6 flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-indigo-700"
              >
                <FaClipboardList className="mr-2 h-5 w-5" />
                Get Custom Quote for {quantity} Units
              </Link>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isOutOfStock || isProcessing || !isStep3Complete || (hasColors && !selectedColor)}
                className="w-full py-3 px-4 flex items-center justify-center rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : `Or Buy Now — $${totalPrice.toFixed(2)}`}
              </button>
            </div>
          ) : (
            // Standard order - Buy Now is primary
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isOutOfStock || isProcessing || !isStep3Complete || (hasColors && !selectedColor)}
                className={`w-full min-h-[64px] py-4 px-6 flex items-center justify-center rounded-xl text-white font-bold text-xl transition-all shadow-lg hover:shadow-xl ${
                  isOutOfStock || isProcessing || !isStep3Complete || (hasColors && !selectedColor)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                }`}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <RiShoppingBag4Fill className="mr-3 h-7 w-7" />
                    Buy Now — ${totalPrice.toFixed(2)}
                    {isFreeShipping && <span className="ml-2 text-sm bg-white/20 px-2 py-0.5 rounded">FREE SHIPPING</span>}
                  </>
                )}
              </button>

              {/* Secondary CTA - Quote */}
              {hasQuoteRequests && (
                <Link
                  href={`/request-quote?product=${product.id}&qty=${quantity}`}
                  className="w-full py-3.5 px-4 flex items-center justify-center rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all"
                >
                  <FaClipboardList className="mr-2 h-4 w-4" />
                  Need a custom quote or free mockup instead?
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <FaTruck className="w-4 h-4 text-blue-500" />
            <span>Free Shipping ${freeShippingThreshold}+</span>
          </div>
          {isB2B && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <FaClock className="w-4 h-4 text-orange-500" />
              <span>Proof in 30 Min</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <FaShieldAlt className="w-4 h-4 text-green-500" />
            <span>256-bit SSL</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <FaCheckCircle className="w-4 h-4 text-gray-500" />
            <span>10,000+ Orders</span>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* PRODUCT CUSTOMIZER MODAL */}
      {/* ================================================================== */}
      {showCustomizer && hasCustomizationZones && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-6xl max-h-[95vh] overflow-y-auto">
            <ProductCustomizer
              productType="default"
              baseImageUrl={product.productImages?.[0]?.imageUrl || ''}
              productImages={productImagesForCustomizer}
              productColor={availableColors.find(c => c.colorName === selectedColor)?.colorHex || '#FFFFFF'}
              productColorName={selectedColor || ''}
              initialData={customizationData || undefined}
              onCustomizationChange={setCustomizationData}
              onAddToCart={(data) => {
                setCustomizationData(data || null);
                setShowCustomizer(false);
              }}
              onClose={() => setShowCustomizer(false)}
              defaultLogoPosition={(product as any)?.defaultLogoPosition}
              defaultNumberPosition={(product as any)?.defaultNumberPosition}
              defaultNamePosition={(product as any)?.defaultNamePosition}
            />
          </div>
        </div>
      )}
    </div>
  );
};
