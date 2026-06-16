'use client';

import React, {FC, useState, useEffect, useMemo, Fragment} from 'react';
import Link from 'next/link';
import {ImageWithFallback} from '@components/globals/Image-with-fallback';
import {useSearchParams, useRouter} from 'next/navigation';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useQuery} from '@tanstack/react-query';
import {Container} from '@components/globals/container.component';
import {Breadcrumb} from '@components/globals/breadcrumb.component';
import {ReactQueryClientProvider} from '../../app/query-client-provider';
import {ContactShippingForm} from './contact-shipping-form';
import {ArtworkUploader, ArtworkFile} from './artwork-uploader';
import {FormControlInput} from '@lib/form/form-control-input';
import {FormControlCheckbox} from '@lib/form/form-control-checkbox';
import {CircularLoader} from '@components/globals/circular-loader.component';
import {SuccessModal} from '@components/globals/success-modal.component';
import {stripeCheckoutSchema, StripeCheckoutFormSchemaType} from '@utils/validation-schemas';
import {CheckoutRoutes, ProductRoutes, QuoteRequestRoutes} from '@utils/routes/be-routes';
import {getEnhancedConversionsData} from '@utils/google-ads-tracking';
import {FaArrowLeft, FaLock, FaCheckCircle, FaShieldAlt, FaClock} from 'react-icons/fa';
import {HiMinus, HiPlus} from 'react-icons/hi';
import {SizeBreakdown, SizeQuantity, extractSizesFromProduct, isApparelProduct} from './size-breakdown.component';
import {checkoutAnalytics, identifyUser} from '@utils/analytics';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ASSETS_SERVER_URL = process.env.NEXT_PUBLIC_ASSETS_SERVER_URL || 'https://printsyouassets.s3.amazonaws.com/';

interface PriceGrid {
  id: string;
  countFrom: number;
  countTo: number;
  price: number;
  salePrice?: number;
}

interface ProductColor {
  id: string;
  colorName: string;
  colorHex?: string;
  coloredProductImage?: string;
}

interface Product {
  id: string;
  productName: string;
  metaDescription?: string;
  sku: string;
  productImages: Array<{imageUrl: string; sequenceNumber: number}>;
  priceGrids: PriceGrid[];
  setupFee?: number;
  additionalFieldProductValues?: Array<{fieldName: string; fieldValue: string}>;
  allCategoryNameAndIds?: Array<{id: string; name: string}>;
  productColors?: ProductColor[];
}

// Shipping configuration - moved outside component for stable reference
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
    {maxQty: Infinity, fee: 29.99}
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

export const DirectCheckoutComponent: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('product_id');
  const initialQuantity = searchParams.get('quantity');
  const initialNotes = searchParams.get('notes');
  const initialSizesParam = searchParams.get('sizes');
  const proofParam = searchParams.get('proof');

  // Parse sizes query param (format: "S:5,M:10,L:8")
  const initialSizes = useMemo(() => {
    if (!initialSizesParam) return undefined;
    try {
      const sizes: Record<string, number> = {};
      initialSizesParam.split(',').forEach(pair => {
        const [size, qty] = pair.split(':');
        if (size && qty) {
          const quantity = parseInt(qty.trim(), 10);
          if (!isNaN(quantity) && quantity > 0) {
            sizes[size.trim().toUpperCase()] = quantity;
          }
        }
      });
      return Object.keys(sizes).length > 0 ? sizes : undefined;
    } catch {
      return undefined;
    }
  }, [initialSizesParam]);

  // Parse proof URLs (can be comma-separated for multiple proofs)
  const proofImages = useMemo(() => {
    if (!proofParam) return [];
    return proofParam.split(',').map(url => url.trim()).filter(url => url.length > 0);
  }, [proofParam]);

  const [checkoutId] = useState<string>(uuidv4());
  const [quantity, setQuantity] = useState<number>(0);
  const [artworkFiles, setArtworkFiles] = useState<ArtworkFile[]>([]);
  const [sizeBreakdown, setSizeBreakdown] = useState<SizeQuantity[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [modalState, setModalState] = useState<'success' | 'error' | 'warning' | 'info' | ''>('');
  const [modalMessage, setModalMessage] = useState<string>('');

  // Fetch product data
  const {data: product, isLoading: isLoadingProduct, error: productError} = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}${ProductRoutes.ProductById}/${productId}`);
      return response.data?.payload;
    },
    enabled: !!productId
  });

  // Set initial quantity from query param or minimum in price grid
  useEffect(() => {
    if (product?.priceGrids?.length) {
      const sortedPrices = [...product.priceGrids].sort((a, b) => a.countFrom - b.countFrom);
      // Allow minimum of 1 for Google Merchant Center compliance (single item purchase)
      const minQty = Math.max(1, sortedPrices[0]?.countFrom || 1);
      const maxQty = sortedPrices[sortedPrices.length - 1]?.countTo || 10000;

      // Use query param quantity if provided and valid
      if (initialQuantity) {
        const parsedQty = parseInt(initialQuantity, 10);
        if (!isNaN(parsedQty) && parsedQty >= 1 && parsedQty <= maxQty) {
          setQuantity(parsedQty);
          return;
        }
      }
      // Default to minimum quantity (at least 1 for bot-friendly checkout)
      setQuantity(minQty);
    }
  }, [product, initialQuantity]);

  // Track checkout started when product loads
  useEffect(() => {
    if (product) {
      const category = product.allCategoryNameAndIds?.[0]?.name;
      checkoutAnalytics.started({
        productId: product.id,
        productName: product.productName,
        productSku: product.sku,
        category,
        source: 'direct_checkout'
      });
    }
  }, [product]);

  const methods = useForm<StripeCheckoutFormSchemaType>({
    resolver: yupResolver(stripeCheckoutSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      company: '',
      address: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      specialInstructions: initialNotes || '',
      // Default to true for Google Merchant Center bot-friendly checkout
      termsAndConditions: true
    }
  });

  const {
    control,
    handleSubmit,
    formState: {errors, isSubmitting}
  } = methods;

  // Calculate pricing based on quantity
  const pricing = useMemo(() => {
    if (!product?.priceGrids?.length || quantity <= 0) {
      return {unitPrice: 0, subtotal: 0, setupFee: product?.setupFee || 0, shippingFee: 0, total: 0, freeShipping: false};
    }

    const sortedPrices = [...product.priceGrids].sort((a, b) => a.countFrom - b.countFrom);

    // Find the correct price tier for the entered quantity
    // Iterate through tiers (sorted by countFrom ascending) and find the highest tier where quantity >= countFrom
    let applicablePrice = sortedPrices[0]; // Default to first (lowest quantity = highest price) tier
    for (let i = 0; i < sortedPrices.length; i++) {
      const tier = sortedPrices[i];
      if (quantity >= tier.countFrom) {
        applicablePrice = tier;
      } else {
        break;
      }
    }

    const unitPrice = applicablePrice?.salePrice || applicablePrice?.price || 0;
    const subtotal = unitPrice * quantity;
    const setupFee = product?.setupFee || 0;
    const shippingFee = calculateShipping(quantity, subtotal);
    const freeShipping = subtotal >= SHIPPING_CONFIG.freeShippingThreshold;
    const total = subtotal + setupFee + shippingFee;

    return {unitPrice, subtotal, setupFee, shippingFee, freeShipping, total};
  }, [product, quantity]);

  // Get min/max quantity - allow minimum of 1 for Google Merchant Center compliance
  const quantityLimits = useMemo(() => {
    if (!product?.priceGrids?.length) return {min: 1, max: 10000};
    const sortedPrices = [...product.priceGrids].sort((a, b) => a.countFrom - b.countFrom);
    return {
      // Allow minimum of 1 for bot-friendly checkout (single item purchase)
      min: Math.max(1, sortedPrices[0]?.countFrom || 1),
      max: sortedPrices[sortedPrices.length - 1]?.countTo || 10000
    };
  }, [product]);

  const [quantityInput, setQuantityInput] = useState<string>('');

  // Sync quantityInput with quantity state
  useEffect(() => {
    setQuantityInput(quantity.toString());
  }, [quantity]);

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= quantityLimits.min && newQty <= quantityLimits.max) {
      setQuantity(newQty);
    }
  };

  const handleQuantityInput = (value: string) => {
    // Allow typing any number (including empty for clearing), filter non-numeric
    setQuantityInput(value.replace(/[^0-9]/g, ''));
  };

  const handleQuantityBlur = () => {
    const numValue = parseInt(quantityInput, 10);
    if (isNaN(numValue) || numValue < quantityLimits.min) {
      // Reset to minimum if invalid or below min
      setQuantity(quantityLimits.min);
    } else if (numValue > quantityLimits.max) {
      // Cap at maximum
      setQuantity(quantityLimits.max);
    } else {
      setQuantity(numValue);
    }
  };

  const handleFormError = (errorData: Record<string, any>) => {
    const firstErrorKey = Object.keys(errorData)[0];
    if (firstErrorKey) {
      const errorElement = document.querySelector(`[name="${firstErrorKey}"]`) as HTMLElement;
      if (errorElement) {
        const yOffset = -150;
        const yPosition = errorElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({top: yPosition, behavior: 'smooth'});

        // Focus the element after scrolling
        setTimeout(() => {
          errorElement.focus();
        }, 500);
      }
    }
  };

  const onSubmit = async (data: StripeCheckoutFormSchemaType) => {
    if (!product?.id) {
      setModalMessage('Product not found. Please try again.');
      setModalState('error');
      return;
    }

    if (quantity < 1) {
      setModalMessage('Please select at least 1 unit.');
      setModalState('error');
      return;
    }

    // For size breakdown: if not valid, auto-assign to default size M (bot-friendly)
    // This ensures checkout is never blocked by size assignment
    let finalSizeBreakdown = sizeBreakdown;
    if (showSizeBreakdown && !isSizeBreakdownValid) {
      // Auto-assign all quantity to default size M
      const defaultSize = availableSizes.includes('M') ? 'M' : availableSizes[0] || 'M';
      finalSizeBreakdown = [{ size: defaultSize, quantity: quantity }];
    }

    setIsProcessing(true);

    // Track checkout submitted
    const category = product.allCategoryNameAndIds?.[0]?.name;
    checkoutAnalytics.submitted({
      productId: product.id,
      productName: product.productName,
      quantity,
      total: pricing.total,
      category,
      color: selectedColor || undefined,
      hasArtwork: artworkFiles.length > 0,
      hasSizeBreakdown: showSizeBreakdown && finalSizeBreakdown.length > 0
    });

    // Identify user in PostHog for tracking
    identifyUser(data.email, {
      name: `${data.firstName} ${data.lastName}`,
      phone: data.phone || undefined,
      company: data.company || undefined,
      first_checkout_product: product.productName,
      first_checkout_category: category
    });

    // Fire Meta Pixel InitiateCheckout event with properly formatted value
    if (typeof window !== 'undefined' && (window as any).fbq) {
      const checkoutValue = Math.round(pricing.total * 100) / 100; // Ensure 2 decimal places
      (window as any).fbq('track', 'InitiateCheckout', {
        value: checkoutValue,
        currency: 'USD',
        content_name: product.productName,
        content_category: category || 'Promotional Products',
        content_ids: [product.id],
        content_type: 'product',
        contents: [{
          id: product.id,
          quantity: quantity,
          item_price: Math.round(pricing.unitPrice * 100) / 100
        }],
        num_items: quantity
      });
      console.log('[Meta Pixel] InitiateCheckout fired:', { value: checkoutValue, product: product.productName, quantity });
    }

    try {
      // Step 1: Create a quote request with product details
      const quoteRequestData = {
        fullName: `${data.firstName} ${data.lastName}`,
        emailAddress: data.email,
        phoneNumber: data.phone || null,
        companyName: data.company || null,
        productCategory: product.productName,
        quantity: quantity,
        notes: data.specialInstructions || null,
        source: 'order-now',
        sourceUrl: window.location.href,
        // Direct checkout fields
        productId: product.id,
        productSku: product.sku,
        productName: product.productName,
        selectedColor: selectedColor || null,
        quotedAmount: pricing.total,
        // Pricing breakdown
        unitPrice: pricing.unitPrice,
        setupFee: pricing.setupFee,
        shippingFee: pricing.shippingFee,
        shippingAddress: {
          addressLine1: data.address,
          addressLine2: data.addressLine2 || null,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode
        },
        artworkFiles: artworkFiles.map(f => ({
          filename: f.filename,
          fileType: f.fileType,
          fileKey: f.fileKey
        })),
        // Size breakdown for apparel (uses auto-assigned default if user didn't complete)
        sizeBreakdown: showSizeBreakdown ? finalSizeBreakdown : null,
        // Pre-approved proof from checkout link (customer already reviewed and accepted)
        approvedProofUrls: proofImages.length > 0 ? proofImages : null
      };

      // Create the quote request first
      const quoteResponse = await axios.post(`${API_BASE_URL}${QuoteRequestRoutes.createQuote}`, quoteRequestData, {
        headers: {
          'Content-Type': 'application/json',
          'X-Store-Id': 'default-printsyou-store'
        }
      });
      const quoteRequestId = quoteResponse.data?.payload?.id;

      if (!quoteRequestId) {
        throw new Error('Failed to create order request');
      }

      // Track checkout success (quote created, proceeding to payment)
      checkoutAnalytics.success({
        quoteId: quoteRequestId,
        productId: product.id,
        productName: product.productName,
        quantity,
        total: pricing.total,
        category
      });

      // Step 2: Create Stripe checkout session
      const checkoutData = {
        quoteRequestId: quoteRequestId,
        successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/checkout/cancel`,
        // Enhanced Conversions data for Google Ads
        ...getEnhancedConversionsData()
      };

      const checkoutResponse = await axios.post(`${API_BASE_URL}${CheckoutRoutes.createSession}`, checkoutData, {
        headers: {
          'Content-Type': 'application/json',
          'X-Store-Id': 'default-printsyou-store'
        }
      });

      if (checkoutResponse.data?.payload?.checkoutUrl) {
        // Small delay to ensure analytics events are sent before redirect
        await new Promise(resolve => setTimeout(resolve, 100));
        // Redirect to Stripe
        window.location.href = checkoutResponse.data.payload.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create checkout session. Please try again.';

      // Track checkout error
      checkoutAnalytics.error({
        productId: product.id,
        errorMessage,
        step: 'checkout_submission'
      });

      setModalMessage(errorMessage);
      setModalState('error');
      setIsProcessing(false);
    }
  };

  // Get primary product image
  const productImage = useMemo(() => {
    if (!product?.productImages?.length) return null;
    const sorted = [...product.productImages].sort((a, b) => a.sequenceNumber - b.sequenceNumber);
    return sorted[0]?.imageUrl;
  }, [product]);

  // Check if product is apparel with sizes
  const isApparel = useMemo(() => {
    if (!product) return false;
    return isApparelProduct(product.productName, product.allCategoryNameAndIds || []);
  }, [product]);

  const availableSizes = useMemo(() => {
    if (!product?.additionalFieldProductValues) {
      // If it's apparel but no sizes defined, use default sizes
      if (isApparel) {
        return ['S', 'M', 'L', 'XL', '2XL', '3XL'];
      }
      return [];
    }
    const extracted = extractSizesFromProduct(product.additionalFieldProductValues);
    // If it's apparel but no sizes found, use default sizes
    if (extracted.length === 0 && isApparel) {
      return ['S', 'M', 'L', 'XL', '2XL', '3XL'];
    }
    return extracted;
  }, [product, isApparel]);

  const showSizeBreakdown = useMemo(() => {
    // Show size breakdown for any apparel product
    return isApparel && availableSizes.length > 0;
  }, [isApparel, availableSizes]);

  // Extract available colors from product data (full objects with images)
  const availableColorObjects = useMemo(() => {
    if (!product) return [];

    // First check productColors array - keep full objects
    if (product.productColors && product.productColors.length > 0) {
      return product.productColors;
    }

    // Fallback to additionalFieldProductValues - create basic color objects
    if (product.additionalFieldProductValues) {
      const colorsField = product.additionalFieldProductValues.find(
        item => item.fieldName.toLowerCase() === 'colors available' || item.fieldName.toLowerCase() === 'color available'
      );
      if (colorsField?.fieldValue) {
        // Strip HTML and split by comma
        const colorsText = colorsField.fieldValue.replace(/<\/?[^>]+(>|$)/g, '');
        return colorsText
          .replace(' or ', ', ')
          .replace('.', '')
          .split(',')
          .map((color, index) => ({
            id: `color-${index}`,
            colorName: color.trim(),
            colorHex: undefined,
            coloredProductImage: undefined
          }))
          .filter(c => c.colorName.length > 0);
      }
    }

    return [];
  }, [product]);

  
  // Validate size breakdown total matches quantity
  const sizeBreakdownTotal = useMemo(() => {
    return sizeBreakdown.reduce((sum, item) => sum + item.quantity, 0);
  }, [sizeBreakdown]);

  const isSizeBreakdownValid = !showSizeBreakdown || sizeBreakdownTotal === quantity;

  // Loading state - show skeleton form structure for bot accessibility
  if (isLoadingProduct) {
    return (
      <>
        <Breadcrumb list={[]} prefixTitle="Checkout" />
        <Container>
          <div className="py-8 max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Secure Checkout</h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Skeleton form structure visible to bots */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded col-span-2"></div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  {/* Payment button placeholder - always visible */}
                  <button
                    type="button"
                    disabled
                    aria-label="Loading checkout"
                    className="w-full mt-6 py-4 px-6 bg-gray-300 text-gray-500 font-semibold rounded-lg flex items-center justify-center gap-3"
                  >
                    <CircularLoader />
                    Loading...
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </>
    );
  }

  // No product found
  if (!productId || productError || !product) {
    return (
      <>
        <Breadcrumb list={[]} prefixTitle="Checkout" />
        <Container>
          <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
            <div className="text-center max-w-md">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
              <p className="text-gray-600 mb-6">
                The product you&apos;re looking for doesn&apos;t exist or may have been removed.
              </p>
              <Link
                href="/"
                className="inline-block px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <Breadcrumb list={[]} prefixTitle="Checkout" />
      <Container>
        <div className="py-8 max-w-6xl mx-auto">
          {/* Header with trust badges */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Secure Checkout</h1>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheckCircle className="text-green-500 w-4 h-4" />
                <span>Free Virtual Proof</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaShieldAlt className="text-blue-500 w-4 h-4" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaClock className="text-primary-500 w-4 h-4" />
                <span>Proof Within 24 Hours</span>
              </div>
            </div>
          </div>

          {/* Back button */}
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back to product page"
            className="flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium mb-6"
          >
            <FaArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Product</span>
          </button>

          <ReactQueryClientProvider>
            <form
              onSubmit={handleSubmit(onSubmit, handleFormError)}
              aria-label="Checkout form"
              noValidate
              autoComplete="on"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form Area */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Product Summary Card */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Order</h2>
                    <div className="flex gap-4">
                      {productImage && (
                        <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border">
                          <ImageWithFallback
                            src={productImage}
                            alt={product.productName}
                            width={128}
                            height={128}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>
                      )}
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-900" dangerouslySetInnerHTML={{__html: product.productName}} />
                        <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>

                        {/* Quantity Selector */}
                        <div className="mt-4">
                          <label htmlFor="quantity-input" className="text-sm font-medium text-gray-700 block mb-2">Quantity</label>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(-10)}
                              disabled={quantity <= quantityLimits.min}
                              aria-label="Decrease quantity by 10"
                              className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <HiMinus className="w-4 h-4" aria-hidden="true" />
                            </button>
                            <input
                              id="quantity-input"
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={quantityInput}
                              onChange={(e) => handleQuantityInput(e.target.value)}
                              onBlur={handleQuantityBlur}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.currentTarget.blur();
                                }
                              }}
                              aria-label="Order quantity"
                              className="w-24 h-10 text-center border border-gray-300 rounded-lg font-medium"
                            />
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(10)}
                              disabled={quantity >= quantityLimits.max}
                              aria-label="Increase quantity by 10"
                              className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <HiPlus className="w-4 h-4" aria-hidden="true" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Min: {quantityLimits.min} units
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Virtual Proof Section - Only shown when proof URL is provided */}
                  {proofImages.length > 0 && (
                    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <FaCheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Your Virtual Proof</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Here&apos;s your custom design proof. Review it carefully before completing your order.
                      </p>
                      <div className={`grid gap-4 ${proofImages.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                        {proofImages.map((proofUrl, index) => (
                          <div key={index} className="relative bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                            <a href={proofUrl} target="_blank" rel="noopener noreferrer" className="block">
                              <img
                                src={proofUrl}
                                alt={`Virtual Proof ${proofImages.length > 1 ? index + 1 : ''}`}
                                className="w-full h-auto object-contain max-h-96"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/assets/logo-full.png';
                                }}
                              />
                            </a>
                            <div className="absolute top-2 right-2">
                              <a
                                href={proofUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white/90 hover:bg-white text-gray-700 text-xs px-2 py-1 rounded shadow flex items-center gap-1"
                              >
                                View Full Size
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-3 text-center">
                        Click image to view full size. By proceeding with payment, you approve this proof.
                      </p>
                    </div>
                  )}

                  {/* Size Breakdown for Apparel */}
                  {showSizeBreakdown && (
                    <SizeBreakdown
                      availableSizes={availableSizes}
                      totalQuantity={quantity}
                      onChange={setSizeBreakdown}
                      disabled={isSubmitting || isProcessing}
                      initialSizes={initialSizes}
                    />
                  )}

                  {/* Color Selection with Product Images */}
                  {availableColorObjects.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Color: {selectedColor ? <span className="text-green-600">{selectedColor}</span> : <span className="text-gray-500">Select a color</span>}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Choose the color for your product. This is the base color of the item (not the imprint/logo color).
                      </p>
                      {/* Grid with auto-fit: wraps to multiple rows, min 80px per item */}
                      <div className="grid gap-2" style={{
                        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))'
                      }}>
                        {availableColorObjects.map((color) => {
                          const isSelected = selectedColor === color.colorName;
                          const colorImagePath = color.coloredProductImage;
                          const imageUrl = colorImagePath ? `${ASSETS_SERVER_URL}${colorImagePath}` : null;

                          return (
                            <button
                              key={color.id}
                              type="button"
                              onClick={() => {
                                setSelectedColor(color.colorName);
                                if (product) {
                                  checkoutAnalytics.colorSelected({
                                    productId: product.id,
                                    color: color.colorName
                                  });
                                }
                              }}
                              disabled={isSubmitting || isProcessing}
                              className={`group relative rounded-lg border-2 transition-all overflow-hidden ${
                                isSelected
                                  ? 'border-green-600 ring-2 ring-green-200'
                                  : 'border-gray-200 hover:border-gray-400'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
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
                                    style={{backgroundColor: color.colorHex || '#e5e7eb'}}
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
                      {!selectedColor && (
                        <p className="text-xs text-amber-600 mt-3">
                          If you don&apos;t select a color, please specify it in the notes below or we&apos;ll contact you.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Notes & Color Selection - Placed right after Size Breakdown (Optional) */}
                  <div className={`border rounded-lg p-6 ${proofImages.length > 0 ? 'bg-gray-50 border-gray-200' : 'bg-yellow-50 border-yellow-200'}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {proofImages.length > 0 ? 'Additional Notes' : 'Notes & Color'} <span className="text-sm font-normal text-gray-500">(Optional)</span>
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {proofImages.length > 0 ? (
                        <>Any additional instructions or comments about your order.</>
                      ) : (
                        <>Specify the <strong>color</strong> of your product (e.g., vest color, shirt color),
                        logo placement, imprint colors, and any other special requirements. You can also provide this info later via email.</>
                      )}
                    </p>
                    <FormControlInput
                      name="specialInstructions"
                      inputType="textarea"
                      placeholder={proofImages.length > 0
                        ? "Any additional notes or special requests..."
                        : "E.g., Vest color: Lime Green, Logo on front left chest (4 inches), imprint color: black. Company name on back..."
                      }
                      disabled={isSubmitting || isProcessing}
                      control={control}
                    />
                  </div>

                  {/* Contact & Shipping Form */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <ContactShippingForm control={control} errors={errors} disabled={isSubmitting || isProcessing} />
                  </div>

                  {/* Artwork Upload Section - Hidden when proof is already provided */}
                  {proofImages.length === 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Artwork <span className="text-sm font-normal text-gray-500">(Optional)</span></h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Upload your logo or design files. We accept all formats, but prefer vector files (.ai, .eps, .svg).
                        We&apos;ll send a digital proof for your approval before production.
                        <span className="block mt-1 text-gray-500">You can also email your artwork to us after placing your order.</span>
                      </p>
                      <ArtworkUploader
                        files={artworkFiles}
                        onFilesChange={(files) => {
                          setArtworkFiles(files);
                          // Track artwork upload when files are added
                          if (files.length > artworkFiles.length && product) {
                            checkoutAnalytics.artworkUploaded({
                              productId: product.id,
                              fileCount: files.length,
                              fileTypes: files.map(f => f.fileType || 'unknown')
                            });
                          }
                        }}
                        uploadId={checkoutId}
                        uploadType="CART"
                        disabled={isSubmitting || isProcessing}
                      />
                    </div>
                  )}

                  {/* Terms & Submit (Mobile) */}
                  <div className="lg:hidden bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div>
                      <div className="flex items-center flex-wrap">
                        <FormControlCheckbox
                          name="termsAndConditions"
                          label={
                            <span className="inline">
                              I agree to PrintsYou{' '}
                              <Link
                                href="/terms-and-conditions"
                                target="_blank"
                                className="text-primary-500 hover:underline"
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}
                              >
                                Terms and Conditions
                              </Link>
                            </span>
                          }
                          isRequired={true}
                          disabled={isSubmitting || isProcessing}
                          control={control}
                          errors={errors}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || isProcessing}
                      aria-label={`Pay ${pricing.total.toFixed(2)} dollars securely with Stripe`}
                      aria-busy={isSubmitting || isProcessing}
                      className="w-full mt-4 py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {isSubmitting || isProcessing ? (
                        <>
                          <CircularLoader />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <FaLock className="w-4 h-4" aria-hidden="true" />
                          <span>Pay ${pricing.total.toFixed(2)} with Stripe</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-4 space-y-4">
                    {/* Pricing Summary */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Unit Price</span>
                          <span className="font-medium">${pricing.unitPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Quantity</span>
                          <span className="font-medium">{quantity} units</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">${pricing.subtotal.toFixed(2)}</span>
                        </div>
                        {pricing.setupFee > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Setup Fee</span>
                            <span className="font-medium">${pricing.setupFee.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          {pricing.freeShipping ? (
                            <span className="font-medium text-green-600">FREE</span>
                          ) : (
                            <span className="font-medium">${pricing.shippingFee.toFixed(2)}</span>
                          )}
                        </div>
                        <hr className="my-3" />
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span className="text-green-600">${pricing.total.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Price tier info */}
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">
                          <strong>Tip:</strong> Order more to save! Pricing updates based on quantity.
                          {!pricing.freeShipping && pricing.subtotal > 0 && (
                            <span className="block mt-1">
                              Add ${(500 - pricing.subtotal).toFixed(2)} more for FREE shipping!
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Terms & Submit (Desktop) */}
                    <div className="hidden lg:block bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center flex-wrap">
                        <FormControlCheckbox
                          name="termsAndConditions"
                          label={
                            <span className="inline">
                              I agree to PrintsYou{' '}
                              <Link
                                href="/terms-and-conditions"
                                target="_blank"
                                className="text-primary-500 hover:underline"
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}
                              >
                                Terms and Conditions
                              </Link>
                            </span>
                          }
                          isRequired={true}
                          disabled={isSubmitting || isProcessing}
                          control={control}
                          errors={errors}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || isProcessing}
                        aria-label={`Pay ${pricing.total.toFixed(2)} dollars securely with Stripe`}
                        aria-busy={isSubmitting || isProcessing}
                        className="w-full mt-4 py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                      >
                        {isSubmitting || isProcessing ? (
                          <>
                            <CircularLoader />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <FaLock className="w-4 h-4" aria-hidden="true" />
                            <span>Pay ${pricing.total.toFixed(2)}</span>
                          </>
                        )}
                      </button>
                      <p className="text-xs text-center text-gray-500 mt-3">
                        Secure payment via Stripe
                      </p>
                    </div>

                    {/* Security badge */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaLock className="w-4 h-4 text-green-600" />
                        <span>256-bit SSL encrypted checkout</span>
                      </div>
                    </div>

                    {/* What happens next */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-3">What Happens Next?</h4>
                      {proofImages.length > 0 ? (
                        <ol className="text-sm text-gray-600 space-y-2">
                          <li className="flex gap-2">
                            <span className="font-bold text-green-500">✓</span>
                            <span className="text-green-700">Your proof is ready above</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-bold text-primary-500">1.</span>
                            Complete secure payment
                          </li>
                          <li className="flex gap-2">
                            <span className="font-bold text-primary-500">2.</span>
                            Production begins immediately
                          </li>
                          <li className="flex gap-2">
                            <span className="font-bold text-primary-500">3.</span>
                            Shipping & delivery
                          </li>
                        </ol>
                      ) : (
                        <ol className="text-sm text-gray-600 space-y-2">
                          <li className="flex gap-2">
                            <span className="font-bold text-primary-500">1.</span>
                            Complete secure payment
                          </li>
                          <li className="flex gap-2">
                            <span className="font-bold text-primary-500">2.</span>
                            We create your digital proof
                          </li>
                          <li className="flex gap-2">
                            <span className="font-bold text-primary-500">3.</span>
                            Review & approve your proof
                          </li>
                          <li className="flex gap-2">
                            <span className="font-bold text-primary-500">4.</span>
                            Production & shipping
                          </li>
                        </ol>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </ReactQueryClientProvider>
        </div>
      </Container>

      <SuccessModal
        open={modalState}
        onClose={() => setModalState('')}
        title={modalState === 'error' ? 'Checkout Error' : 'Success'}
        note={modalMessage}
      />
    </>
  );
};
