'use client';

import React, {FC, useState, useEffect, useMemo, Fragment} from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
import {FaArrowLeft, FaLock, FaCheckCircle, FaShieldAlt, FaClock} from 'react-icons/fa';
import {HiMinus, HiPlus} from 'react-icons/hi';
import {SizeBreakdown, SizeQuantity, extractSizesFromProduct, isApparelProduct} from './size-breakdown.component';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ASSETS_SERVER_URL = process.env.NEXT_PUBLIC_ASSETS_SERVER_URL || 'https://printsyouassets.s3.amazonaws.com/';

interface PriceGrid {
  id: string;
  countFrom: number;
  countTo: number;
  price: number;
  salePrice?: number;
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
}

export const DirectCheckoutComponent: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('product_id');

  const [checkoutId] = useState<string>(uuidv4());
  const [quantity, setQuantity] = useState<number>(0);
  const [artworkFiles, setArtworkFiles] = useState<ArtworkFile[]>([]);
  const [sizeBreakdown, setSizeBreakdown] = useState<SizeQuantity[]>([]);
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

  // Set initial quantity from minimum in price grid
  useEffect(() => {
    if (product?.priceGrids?.length) {
      const sortedPrices = [...product.priceGrids].sort((a, b) => a.countFrom - b.countFrom);
      const minQty = sortedPrices[0]?.countFrom || 10;
      setQuantity(minQty);
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
      specialInstructions: '',
      termsAndConditions: false
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
      return {unitPrice: 0, subtotal: 0, setupFee: product?.setupFee || 0, total: 0};
    }

    const sortedPrices = [...product.priceGrids].sort((a, b) => a.countFrom - b.countFrom);

    // Find applicable price tier
    let applicablePrice = sortedPrices[sortedPrices.length - 1]; // Default to highest tier
    for (const tier of sortedPrices) {
      if (quantity >= tier.countFrom && quantity <= tier.countTo) {
        applicablePrice = tier;
        break;
      }
    }

    const unitPrice = applicablePrice?.salePrice || applicablePrice?.price || 0;
    const subtotal = unitPrice * quantity;
    const setupFee = product?.setupFee || 0;
    const total = subtotal + setupFee;

    return {unitPrice, subtotal, setupFee, total};
  }, [product, quantity]);

  // Get min/max quantity
  const quantityLimits = useMemo(() => {
    if (!product?.priceGrids?.length) return {min: 10, max: 10000};
    const sortedPrices = [...product.priceGrids].sort((a, b) => a.countFrom - b.countFrom);
    return {
      min: sortedPrices[0]?.countFrom || 10,
      max: sortedPrices[sortedPrices.length - 1]?.countTo || 10000
    };
  }, [product]);

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= quantityLimits.min && newQty <= quantityLimits.max) {
      setQuantity(newQty);
    }
  };

  const handleQuantityInput = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= quantityLimits.min && numValue <= quantityLimits.max) {
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

    if (quantity < quantityLimits.min) {
      setModalMessage(`Minimum quantity is ${quantityLimits.min} units.`);
      setModalState('error');
      return;
    }

    // Validate size breakdown for apparel products
    if (showSizeBreakdown && !isSizeBreakdownValid) {
      setModalMessage('Please complete the size breakdown. Total must equal your order quantity.');
      setModalState('error');
      return;
    }

    setIsProcessing(true);

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
        quotedAmount: pricing.total,
        // Pricing breakdown
        unitPrice: pricing.unitPrice,
        setupFee: pricing.setupFee,
        shippingFee: 0, // Shipping calculated after proof
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
        // Size breakdown for apparel
        sizeBreakdown: showSizeBreakdown ? sizeBreakdown : null
      };

      // Create the quote request first
      const quoteResponse = await axios.post(`${API_BASE_URL}${QuoteRequestRoutes.createQuote}`, quoteRequestData);
      const quoteRequestId = quoteResponse.data?.payload?.id;

      if (!quoteRequestId) {
        throw new Error('Failed to create order request');
      }

      // Step 2: Create Stripe checkout session
      const checkoutData = {
        quoteRequestId: quoteRequestId,
        successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/checkout/cancel`
      };

      const checkoutResponse = await axios.post(`${API_BASE_URL}${CheckoutRoutes.createSession}`, checkoutData);

      if (checkoutResponse.data?.payload?.checkoutUrl) {
        // Redirect to Stripe
        window.location.href = checkoutResponse.data.payload.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      setModalMessage(
        error.response?.data?.message || 'Failed to create checkout session. Please try again.'
      );
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

  // Validate size breakdown total matches quantity
  const sizeBreakdownTotal = useMemo(() => {
    return sizeBreakdown.reduce((sum, item) => sum + item.quantity, 0);
  }, [sizeBreakdown]);

  const isSizeBreakdownValid = !showSizeBreakdown || sizeBreakdownTotal === quantity;

  // Loading state
  if (isLoadingProduct) {
    return (
      <>
        <Breadcrumb list={[]} prefixTitle="Checkout" />
        <Container>
          <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
            <CircularLoader />
            <p className="text-gray-600 mt-4">Loading product...</p>
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
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium mb-6"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Product
          </button>

          <ReactQueryClientProvider>
            <form onSubmit={handleSubmit(onSubmit, handleFormError)}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form Area */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Product Summary Card */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Order</h2>
                    <div className="flex gap-4">
                      {productImage && (
                        <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border">
                          <Image
                            src={`${ASSETS_SERVER_URL}${productImage}`}
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
                          <label className="text-sm font-medium text-gray-700 block mb-2">Quantity</label>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(-10)}
                              disabled={quantity <= quantityLimits.min}
                              className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <HiMinus className="w-4 h-4" />
                            </button>
                            <input
                              type="number"
                              value={quantity}
                              onChange={(e) => handleQuantityInput(e.target.value)}
                              min={quantityLimits.min}
                              max={quantityLimits.max}
                              className="w-24 h-10 text-center border border-gray-300 rounded-lg font-medium"
                            />
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(10)}
                              disabled={quantity >= quantityLimits.max}
                              className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <HiPlus className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Min: {quantityLimits.min} units
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Size Breakdown for Apparel */}
                  {showSizeBreakdown && (
                    <SizeBreakdown
                      availableSizes={availableSizes}
                      totalQuantity={quantity}
                      onChange={setSizeBreakdown}
                      disabled={isSubmitting || isProcessing}
                    />
                  )}

                  {/* Contact & Shipping Form */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <ContactShippingForm control={control} errors={errors} disabled={isSubmitting || isProcessing} />
                  </div>

                  {/* Artwork Upload Section */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Artwork</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Upload your logo or design files. We accept all formats, but prefer vector files (.ai, .eps, .svg).
                      We&apos;ll send a digital proof for your approval before production.
                    </p>
                    <ArtworkUploader
                      files={artworkFiles}
                      onFilesChange={setArtworkFiles}
                      uploadId={checkoutId}
                      uploadType="CART"
                      disabled={isSubmitting || isProcessing}
                    />
                  </div>

                  {/* Special Instructions */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Special Instructions</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Any specific requirements? Logo placement, colors, size breakdown, etc.
                    </p>
                    <FormControlInput
                      name="specialInstructions"
                      inputType="textarea"
                      placeholder="E.g., Logo on front left chest (4 inches), company colors are navy blue and white. Sizes: 10 S, 20 M, 15 L, 5 XL..."
                      disabled={isSubmitting || isProcessing}
                      control={control}
                    />
                  </div>

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
                      className="w-full mt-4 py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {isSubmitting || isProcessing ? (
                        <>
                          <CircularLoader />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaLock className="w-4 h-4" />
                          Pay ${pricing.total.toFixed(2)} with Stripe
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
                        <div className="flex justify-between text-gray-500">
                          <span>Shipping</span>
                          <span>Calculated after proof</span>
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
                        className="w-full mt-4 py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                      >
                        {isSubmitting || isProcessing ? (
                          <>
                            <CircularLoader />
                            Processing...
                          </>
                        ) : (
                          <>
                            <FaLock className="w-4 h-4" />
                            Pay ${pricing.total.toFixed(2)}
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
