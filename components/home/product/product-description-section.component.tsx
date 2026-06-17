'use client';
import * as React from 'react';
import {Dispatch, FC, Fragment, SetStateAction, useMemo, useState, useCallback} from 'react';
import {useRouter} from 'next/navigation';
import {PricingTable} from '@components/home/product/pricing-table.component';
import {ShoppingFlow} from '@components/home/product/shopping-flow.component';
import {ProductCustomizer} from '@components/home/product/product-customizer.component';
import Link from 'next/link';
import {Product, productColors, ProductImage, ProductImageWithZones, CustomizationData} from '@components/home/product/product.types';
import {colorNameToHex, extractColorsArray, getColorsWithHex} from '@utils/utils';
import {RiShoppingBag4Fill, RiFileList3Line} from 'react-icons/ri';
import {FaWhatsapp, FaTruck, FaClock, FaShieldAlt, FaCheckCircle, FaMagic} from 'react-icons/fa';
import {Chip} from '@mui/joy';
import {ColorSwatch} from '@components/home/product/color-swatch.component';

// WhatsApp number for direct contact
const WHATSAPP_NUMBER = '14694347035';

interface ProductDescriptionComponent {
  product: Product;
  handleScroll?: () => void;
  setImages: Dispatch<SetStateAction<ProductImage[]>>;
  images: ProductImage[];
  relatedProductsLink?: boolean;
}

export const ProductDescriptionComponent: FC<ProductDescriptionComponent> = ({
  product,
  handleScroll,
  images,
  setImages,
  relatedProductsLink
}) => {
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customizationData, setCustomizationData] = useState<CustomizationData | null>(null);

  // Check if product has customization zones configured
  const hasCustomizationZones = useMemo(() => {
    const productImages = (product as any)?.productImages as ProductImageWithZones[] | undefined;

    // Debug logging
    if (typeof window !== 'undefined') {
      console.log('🔍 Product Customization Check:');
      console.log('  - Product Images:', productImages?.length || 0);
      productImages?.forEach((img, i) => {
        console.log(`  - Image ${i}:`, {
          url: img.imageUrl?.substring(0, 50),
          logoPosition: img.logoPosition,
          numberPosition: img.numberPosition,
          namePosition: img.namePosition
        });
      });
    }

    if (productImages && productImages.length > 0) {
      const hasZones = productImages.some(img =>
        (img.logoPosition?.enabled) ||
        (img.numberPosition?.enabled) ||
        (img.namePosition?.enabled)
      );
      console.log('  - Has Image Zones:', hasZones);
      return hasZones;
    }
    const defaultLogo = (product as any)?.defaultLogoPosition;
    const defaultNumber = (product as any)?.defaultNumberPosition;
    const defaultName = (product as any)?.defaultNamePosition;
    const hasDefaultZones = defaultLogo?.enabled || defaultNumber?.enabled || defaultName?.enabled;
    console.log('  - Has Default Zones:', hasDefaultZones);
    return hasDefaultZones;
  }, [product]);

  const productImagesForCustomizer = useMemo(() => {
    return (product as any)?.productImages as ProductImageWithZones[] | undefined;
  }, [product]);

  const router = useRouter();

  // Handle checkout with customization data
  const handleCheckout = useCallback(() => {
    if (customizationData) {
      // Store customization data in sessionStorage for checkout page
      sessionStorage.setItem(`customization_${product.id}`, JSON.stringify(customizationData));
    }
    router.push(`/checkout?product_id=${product.id}`);
  }, [customizationData, product.id, router]);

  // Handle quote request with customization data
  const handleQuoteRequest = useCallback(() => {
    if (customizationData) {
      sessionStorage.setItem(`customization_${product.id}`, JSON.stringify(customizationData));
    }
    router.push(`/request-quote?product=${product.id}`);
  }, [customizationData, product.id, router]);

  const productColors = useMemo(() => {
    const colorsFromAdditionalFields = extractColorsArray(product.additionalFieldProductValues).map(color =>
      colorNameToHex(color)
    );

    let finalColors = [...colorsFromAdditionalFields, ...product.productColors];

    const uniqueColors = new Map(finalColors.map((color: productColors) => [color?.colorName.toLowerCase(), color]));
    return Array.from(uniqueColors.values())
      .map(getColorsWithHex)
      .filter(color => color?.colorName);
  }, [product.productColors, product.additionalFieldProductValues]);

  const isOutOfStock = useMemo(() => Boolean(product.outOfStock), [product.outOfStock]);

  const handleColorSelect = (color: productColors | null) => {
    if (!color?.coloredProductImage) return;

    const updatedImages = images.filter(img => img.imageUrl !== color.coloredProductImage);
    const newImg: ProductImage = {imageUrl: color.coloredProductImage, sequenceNumber: 0};

    setImages(selectedColor === color.colorName ? updatedImages : [newImg, ...updatedImages]);
    setSelectedColor(color.colorName);
  };

  const scrollToRelatedProducts = () => {
    const relatedProducts = document.getElementById('related-products');
    if (!relatedProducts) return;

    setTimeout(() => {
      window.scrollTo({
        top: relatedProducts.getBoundingClientRect().top + window.pageYOffset - 180,
        behavior: 'smooth'
      });
    }, 100);
  };

  return (
    <div className="flex flex-col">
      {/* Product Title */}
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 capitalize leading-tight">
        <span dangerouslySetInnerHTML={{__html: product?.productName ?? ''}} />
      </h1>

      {/* Meta description */}
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">
        {product.metaDescription}
        {/* See Details - only show for non-Shopping Flow products (they have details in left column) */}
        {handleScroll && !product.shoppingFlowEnabled && (
          <>
            {' '}
            <button
              className="text-primary-500 hover:text-primary-600 underline underline-offset-2"
              onClick={handleScroll}
            >
              See Details
            </button>
          </>
        )}
      </p>

      {isOutOfStock && (
        <div className="flex items-center mt-3 gap-2">
          <Chip size="sm" color="danger" variant="solid">
            Out of Stock
          </Chip>
          {relatedProductsLink && (
            <button
              className="text-sm text-primary-500 hover:text-primary-600 underline"
              onClick={scrollToRelatedProducts}
            >
              Checkout Related Products
            </button>
          )}
        </div>
      )}

      {/* Product Colors - Only show when shopping flow is disabled (shopping flow has its own color selector) */}
      {productColors.length > 0 && !product.shoppingFlowEnabled && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            {selectedColor ? (
              <>Colors: <span className="font-semibold text-gray-900">{selectedColor}</span></>
            ) : (
              'Colors:'
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {productColors.map(color => (
              <ColorSwatch
                key={color?.colorName}
                color={color}
                selectedColor={selectedColor}
                onSelect={() => color?.coloredProductImage && handleColorSelect(color)}
              />
            ))}
          </div>
        </div>
      )}

      {/* =====================================================
          CTA SECTION - Primary conversion area
          Goal: Guide users to Buy Now (primary) or Get Quote (secondary)
          ===================================================== */}
      {product.shoppingFlowEnabled ? (
        /* Shopping Flow UI - E-commerce style checkout for Google Merchant Center compliance */
        <ShoppingFlow product={product} />
      ) : (
        /* Standard CTA Buttons */
        <div className="mt-6 space-y-4">
          {/* Personalize Button - Show only if product has customization zones */}
          {hasCustomizationZones && (
            <div>
              <button
                type="button"
                onClick={() => setShowCustomizer(true)}
                disabled={isOutOfStock}
                className={`w-full py-3 px-4 flex items-center justify-center rounded-lg border-2 font-semibold text-sm transition-all ${
                  customizationData
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 hover:from-purple-100 hover:to-indigo-100'
                } ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FaMagic className="mr-2 h-5 w-5" />
                {customizationData ? (
                  <>
                    <span>Customized</span>
                    {customizationData.additionalCharges && customizationData.additionalCharges > 0 && (
                      <span className="ml-1 text-xs">(+${customizationData.additionalCharges.toFixed(2)})</span>
                    )}
                    <span className="ml-2 text-xs underline">Edit</span>
                  </>
                ) : (
                  'Personalize with Name/Number/Logo'
                )}
              </button>

              {/* Customization Preview - Show if any customization exists */}
              {customizationData && (customizationData.playerName || customizationData.playerNumber || customizationData.logoDataUrl) && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs font-semibold text-green-700 mb-2">Your Personalization:</p>
                  <div className="flex items-center gap-3">
                    {customizationData.previewDataUrl && (
                      <img
                        src={customizationData.previewDataUrl}
                        alt="Customization preview"
                        className="w-20 h-20 object-contain rounded border border-gray-300 bg-white"
                      />
                    )}
                    <div className="flex-1 text-sm text-gray-700">
                      {customizationData.playerName && (
                        <p><span className="font-medium">Name:</span> {customizationData.playerName}</p>
                      )}
                      {customizationData.playerNumber && (
                        <p><span className="font-medium">Number:</span> #{customizationData.playerNumber}</p>
                      )}
                      {customizationData.logoDataUrl && (
                        <div className="flex items-center gap-2 mt-1">
                          <img src={customizationData.logoDataUrl} alt="Logo" className="w-8 h-8 object-contain rounded" />
                          <span className="text-green-600 font-medium">Logo added</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Primary & Secondary CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* PRIMARY CTA: Buy Now - Most prominent */}
            {(product.orderType === 'CHECKOUT' || product.orderType === 'BOTH') && (
              <div className="flex-1">
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isOutOfStock}
                  className={`w-full py-4 px-6 flex items-center justify-center rounded-lg text-white font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl ${
                    isOutOfStock
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  Buy Now
                  <RiShoppingBag4Fill className="ml-2 h-5 w-5" />
                </button>
                <p className="text-xs text-gray-500 text-center mt-1.5">
                  Fast checkout for ready-to-order customers
                </p>
              </div>
            )}

            {/* SECONDARY CTA: Get Quote - For bulk/custom orders */}
            {(product.orderType === 'QUOTE_ONLY' || product.orderType === 'BOTH' || !product.orderType) && (
              <div className="flex-1">
                <button
                  type="button"
                  onClick={handleQuoteRequest}
                  className={`w-full py-4 px-6 flex items-center justify-center rounded-lg font-semibold transition-all duration-200 ${
                    product.orderType === 'QUOTE_ONLY' || !product.orderType
                      ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg hover:shadow-xl text-lg'
                      : 'bg-white border-2 border-green-600 text-green-600 hover:bg-green-50'
                  }`}
                >
                  Get Free Quote + Mockup
                  <RiFileList3Line className="ml-2 h-5 w-5" />
                </button>
                <p className="text-xs text-gray-500 text-center mt-1.5">
                  Best for bulk orders & custom requirements
                </p>
              </div>
            )}
          </div>

          {/* WhatsApp CTA - Secondary contact option */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi! I'm interested in ${encodeURIComponent(product.productName)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-6 flex items-center justify-center rounded-lg border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-medium transition-all duration-200"
          >
            <FaWhatsapp className="mr-2 h-5 w-5" />
            Chat on WhatsApp
          </a>

          {/* =====================================================
              TRUST INDICATORS - Build confidence near CTAs
              ===================================================== */}
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
      )}

      {/* Pricing Table */}
      <PricingTable product={product} />

      {/* Setup/Additional Fees */}
      {product.additionalRows.length > 0 && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <ul className={`text-sm text-gray-600 space-y-1 ${isExpanded ? '' : 'max-h-[3rem] overflow-hidden'}`}>
            {product.additionalRows
              .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
              .map(row => (
                <li key={`${row.id}${row.name}`} className="flex items-center justify-between">
                  <span className="text-gray-600">{row.name}</span>
                  <span className="text-primary-500 font-semibold">${row.priceDiff.toFixed(2)}</span>
                </li>
              ))}
          </ul>
          {product.additionalRows.length > 2 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary-500 text-sm font-medium mt-2 hover:underline"
            >
              {isExpanded ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
      )}

      {/* Product Customizer Modal */}
      {showCustomizer && hasCustomizationZones && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-6xl max-h-[95vh] overflow-y-auto">
            <ProductCustomizer
              productType="default"
              baseImageUrl={product.productImages?.[0]?.imageUrl || ''}
              productImages={productImagesForCustomizer}
              productColor={productColors.find(c => c?.colorName === selectedColor)?.colorHex || '#FFFFFF'}
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
