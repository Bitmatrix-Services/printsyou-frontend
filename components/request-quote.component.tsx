'use client';
import React, {ChangeEvent, FC, useState, useEffect, useCallback} from 'react';
import {Container} from '@components/globals/container.component';
import {Breadcrumb} from '@components/globals/breadcrumb.component';
import {FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useMutation} from '@tanstack/react-query';
import axios from 'axios';
import {QuoteRequestRoutes} from '@utils/routes/be-routes';
import {SuccessModal} from '@components/globals/success-modal.component';
import {QuoteRequestFormSchemaType, quoteRequestSchema} from '@utils/validation-schemas';
import {FormControlInput} from '@lib/form/form-control-input';
import {MaskInput} from '@lib/form/mask-input.component';
import {ReactQueryClientProvider} from '../app/query-client-provider';
import {UserInfoCapture} from '@components/user-info-capture';
import {LoaderWithBackdrop} from '@components/globals/loader-with-backdrop.component';
import {FaWhatsapp, FaCheckCircle, FaFileAlt, FaShieldAlt, FaBolt} from 'react-icons/fa';
import {RiMessengerLine} from 'react-icons/ri';
import {MdOutlineUploadFile} from 'react-icons/md';
import {IoClose} from 'react-icons/io5';
import {useSearchParams, useRouter} from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {v4 as uuidv4} from 'uuid';
import {LinearProgressWithLabel} from '@components/globals/linear-progress-with-label.component';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ASSETS_SERVER_URL = process.env.ASSETS_SERVER_URL || 'https://printsyouassets.s3.amazonaws.com/';
const allowedImageTypes = ['jpeg', 'png', 'webp', 'gif', 'avif', 'svg+xml'];

interface ArtworkFile {
  filename: string;
  fileType: string;
  fileKey: string;
}

// Company contact info
const WHATSAPP_NUMBER = '14694347035';
const MESSENGER_PAGE_ID = 'printsyoupromo';

// Helper to get cookie value by name
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

export interface QuoteItemData {
  type: 'category' | 'product';
  name: string;
  imageUrl: string;
  productId?: string;
  uniqueProductName?: string;
}

interface RequestQuoteComponentProps {
  itemData?: QuoteItemData | null;
}

export const RequestQuoteComponent: FC<RequestQuoteComponentProps> = ({itemData}) => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<'success' | 'error' | 'warning' | 'info' | ''>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [artWorkFiles, setArtWorkFiles] = useState<ArtworkFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [quoteId] = useState<string>(uuidv4());
  const [referrerUrl, setReferrerUrl] = useState<string>('');
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get pre-filled category/product from URL or props
  const categoryParam = searchParams.get('category');
  const productParam = searchParams.get('product');
  const itemName = itemData?.name || categoryParam || '';

  const methods = useForm<QuoteRequestFormSchemaType>({
    resolver: yupResolver(quoteRequestSchema),
    defaultValues: {
      fullName: '',
      emailAddress: '',
      phoneNumber: '',
      companyName: '',
      productCategory: itemName,
      quantity: undefined,
      notes: '',
      needByDate: '',
      source: 'website',
      sourceUrl: typeof window !== 'undefined' ? window.location.href : ''
    }
  });

  const {
    control,
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: {errors, isSubmitting}
  } = methods;

  // Update source URL when component mounts and capture referrer for redirect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const referer = document.referrer;
      setValue('sourceUrl', referer || window.location.href);

      // Store referrer URL for redirect after form submission
      // Only store if it's from our site (not external)
      if (referer && referer.includes(window.location.hostname)) {
        setReferrerUrl(referer);
      }

      if (itemData?.type === 'product' || productParam) {
        setValue('source', 'product_page');
      } else if (itemData?.type === 'category' || categoryParam) {
        setValue('source', 'category_page');
      }
    }
  }, [setValue, itemData, categoryParam, productParam]);

  // Fire Meta Pixel Lead event with deduplication and advanced matching
  const fireMetaPixelLead = useCallback((
    eventId: string,
    productCategory: string,
    quantity?: number,
    userData?: { email?: string; phone?: string; firstName?: string; lastName?: string }
  ) => {
    if (typeof window === 'undefined') {
      console.warn('[Meta Pixel] Window not available');
      return false;
    }

    const fbq = (window as any).fbq;

    if (!fbq) {
      console.warn('[Meta Pixel] fbq not loaded - check if Meta Pixel is installed');
      return false;
    }

    // Estimate lead value based on quantity
    // Using average unit price of $5 as conservative estimate for promotional products
    const estimatedUnitPrice = 5;
    // Ensure value is always at least $10 (Meta requires valid price > 0)
    const estimatedValue = Math.max(10, quantity && quantity > 0 ? quantity * estimatedUnitPrice : 50);

    try {
      // Set advanced matching user data if available
      // Meta will automatically hash this data (email, phone, names)
      if (userData && (userData.email || userData.phone)) {
        const advancedMatchingData: Record<string, string> = {};
        if (userData.email) advancedMatchingData.em = userData.email.toLowerCase().trim();
        if (userData.phone) advancedMatchingData.ph = userData.phone.replace(/\D/g, ''); // Remove non-digits
        if (userData.firstName) advancedMatchingData.fn = userData.firstName.toLowerCase().trim();
        if (userData.lastName) advancedMatchingData.ln = userData.lastName.toLowerCase().trim();

        // Re-init with advanced matching data
        fbq('init', '850875120645150', advancedMatchingData);
        console.log('[Meta Pixel] Advanced matching data set:', Object.keys(advancedMatchingData));
      }

      fbq('track', 'Lead', {
        content_name: productCategory || 'Quote Request',
        content_category: 'Quote Request',
        value: estimatedValue,
        currency: 'USD'
      }, {eventID: eventId});

      console.log('[Meta Pixel] Lead event fired successfully', {
        eventID: eventId,
        content_name: productCategory,
        estimated_value: estimatedValue,
        quantity: quantity,
        hasAdvancedMatching: !!(userData?.email || userData?.phone),
        timestamp: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('[Meta Pixel] Error firing Lead event:', error);
      return false;
    }
  }, []);

  const {mutate} = useMutation({
    mutationFn: (data: QuoteRequestFormSchemaType & {metaEventId: string; fbc: string | null; fbp: string | null}) => {
      setLoading(true);

      // Analytics event
      trackEvent('quote_form_submit', {
        category: data.productCategory,
        quantity: data.quantity,
        artworkCount: artWorkFiles.length,
        metaEventId: data.metaEventId
      });

      // Include artwork files, meta event ID, and Facebook cookies for CAPI
      const requestData = {
        ...data,
        artworkFiles: artWorkFiles,
        metaEventId: data.metaEventId, // Server uses this for CAPI deduplication
        fbc: data.fbc,  // Facebook Click ID for attribution
        fbp: data.fbp   // Facebook Browser ID for matching
      };

      return axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}${QuoteRequestRoutes.createQuote}`, requestData);
    },
    onSuccess: (response, variables) => {
      console.log('[Quote] Form submitted successfully', {
        metaEventId: variables.metaEventId,
        responseId: response?.data?.payload?.id || response?.data?.id
      });

      setTimeout(() => {
        setLoading(false);
        setIsSuccessModalOpen('success');
        reset();
        // Add query param for Meta conversion tracking
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('submitted', 'true');
        router.replace(currentUrl.pathname + currentUrl.search, {scroll: false});
      }, 1500);
    },
    onError: (error, variables) => {
      console.error('[Quote] Form submission failed', {
        metaEventId: variables.metaEventId,
        error
      });

      setTimeout(() => {
        setLoading(false);
        setIsSuccessModalOpen('error');
      }, 1500);
    }
  });

  const onSubmit: SubmitHandler<QuoteRequestFormSchemaType> = data => {
    // Generate unique event ID for Meta deduplication BEFORE any API calls
    const metaEventId = uuidv4();

    // Compute the SAME productCategory value for both Pixel and CAPI to ensure matching
    const resolvedProductCategory = data.productCategory || itemName || 'Quote Request';

    // Capture Facebook cookies for Conversions API event matching
    const fbc = getCookie('_fbc');
    const fbp = getCookie('_fbp');

    console.log('[Meta Dedup] Starting submission with eventId:', metaEventId, 'fbc:', fbc ? 'present' : 'missing', 'fbp:', fbp ? 'present' : 'missing');

    // Extract first and last name from fullName
    const nameParts = data.fullName?.trim().split(' ') || [];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // STEP 1: Fire browser pixel FIRST with the event ID, quantity, and user data for advanced matching
    const pixelFired = fireMetaPixelLead(metaEventId, resolvedProductCategory, data.quantity, {
      email: data.emailAddress,
      phone: data.phoneNumber,
      firstName,
      lastName
    });
    console.log('[Meta Dedup] Browser pixel fired:', pixelFired, 'quantity:', data.quantity, 'hasUserData:', !!(data.emailAddress || data.phoneNumber));

    // STEP 2: Send to server with SAME event ID, Facebook cookies, and resolved productCategory for CAPI
    mutate({
      ...data,
      productCategory: resolvedProductCategory, // Use same resolved value as Pixel
      metaEventId,
      fbc,
      fbp
    });
  };

  // Scroll to first error on form validation failure
  const onInvalid = useCallback((errors: Record<string, any>) => {
    // Get the first error field name
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      // Find the input element by name attribute
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
      if (errorElement) {
        // Scroll to the element with some offset for better visibility
        const elementRect = errorElement.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const offset = 120; // Account for fixed headers

        window.scrollTo({
          top: absoluteElementTop - offset,
          behavior: 'smooth'
        });

        // Focus the element after scrolling
        setTimeout(() => {
          errorElement.focus();
        }, 500);
      }
    }
  }, []);

  // Analytics helper
  const trackEvent = useCallback((eventName: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, params);
    }
    console.log('[Analytics]', eventName, params);
  }, []);

  // Generate WhatsApp link with pre-filled message
  const getWhatsAppLink = useCallback(() => {
    const item = watch('productCategory') || itemName || 'your products';
    const quantity = watch('quantity');
    const message = `Hi, I'm interested in getting a quote for ${item}${quantity ? ` (quantity: ${quantity})` : ''}. Can you help me?`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }, [watch, itemName]);

  // Generate Messenger link
  const getMessengerLink = useCallback(() => {
    return `https://m.me/${MESSENGER_PAGE_ID}`;
  }, []);

  const handleWhatsAppClick = useCallback(() => {
    trackEvent('whatsapp_click', {source: 'quote_page', category: watch('productCategory')});
  }, [trackEvent, watch]);

  const handleMessengerClick = useCallback(() => {
    trackEvent('messenger_click', {source: 'quote_page', category: watch('productCategory')});
  }, [trackEvent, watch]);

  // Artwork upload functions
  const handleFileUpload = async (file: File) => {
    const data = {
      type: 'QUOTE',
      fileName: file.name,
      id: quoteId
    };

    try {
      const res = await axios.get(`${API_BASE_URL}/s3/signedUrl`, {params: data});
      await axios.put(res.data.payload.url, file, {
        onUploadProgress: event => {
          const percent = Math.floor((event.loaded / (event.total as number)) * 100);
          setUploadProgress(percent);
          if (percent === 100) {
            setTimeout(() => setUploadProgress(0), 2000);
          }
        }
      });
      return res;
    } catch (error) {
      setUploadProgress(0);
      console.error('Error uploading file:', error);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;

    if (selectedFiles && selectedFiles.length > 0) {
      try {
        const uploadedFileResponse = await handleFileUpload(selectedFiles[0]);
        const uploadedFile = uploadedFileResponse?.data.payload;

        if (uploadedFile?.url && uploadedFile?.objectKey) {
          const newFile: ArtworkFile = {
            filename: selectedFiles[0].name,
            fileType: selectedFiles[0].type.split('/').pop() || '',
            fileKey: uploadedFile.objectKey
          };

          setArtWorkFiles(prevFiles => [...prevFiles, newFile]);
        }
      } catch (error) {
        console.error('Error handling file upload:', error);
      } finally {
        setUploadProgress(0);
        e.target.value = '';
      }
    }
  };

  const handleFileRemove = (index: number) => {
    setArtWorkFiles(prevFiles => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Request a Quote - PrintsYou',
            description: 'Get a free quote for custom promotional products. Fast response, competitive pricing.',
            url: `${process.env.NEXT_PUBLIC_FE_URL}request-quote`,
            mainEntity: {
              '@type': 'Service',
              name: 'Custom Quote Service',
              provider: {
                '@type': 'Organization',
                name: 'PrintsYou',
                url: 'https://printsyou.com'
              }
            }
          })
        }}
      />
      <Breadcrumb list={[]} prefixTitle="Request a Quote" />
      <Container>
        <LoaderWithBackdrop loading={loading} />
        <div className="max-w-5xl mx-auto py-8">
          {/* ========== HEADER WITH VALUE PROPOSITION ========== */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {itemName ? `Custom ${itemName} — Free Quote in 30 Minutes` : 'Custom Promotional Products — Free Quote in 30 Minutes'}
            </h1>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Tell us what you need. We&apos;ll send a detailed quote with a free virtual proof showing your logo — usually within 30 minutes during business hours.
            </p>

            {/* Trust Badges Row */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaBolt className="text-amber-500 w-4 h-4" />
                <span>Quote in ~30 Min</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheckCircle className="text-green-500 w-4 h-4" />
                <span>Free Virtual Proof</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaShieldAlt className="text-blue-500 w-4 h-4" />
                <span>No Payment Required</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ========== MAIN FORM SECTION ========== */}
            <div className="lg:col-span-2">
              <ReactQueryClientProvider>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
                    <UserInfoCapture emailField="emailAddress" nameField="fullName" />

                    {/* ========== PRODUCT CONTEXT CARD ========== */}
                    {itemData?.name && (
                      <Link
                        href={itemData.type === 'product' && itemData.uniqueProductName ? `/products/${itemData.uniqueProductName}` : '#'}
                        className={`block mb-8 p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-100 ${itemData.type === 'product' && itemData.uniqueProductName ? 'cursor-pointer hover:border-primary-300 hover:shadow-md transition-all' : ''}`}
                        onClick={e => {
                          if (!(itemData.type === 'product' && itemData.uniqueProductName)) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <div className="flex items-start gap-5">
                          {itemData.imageUrl && (
                            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-gray-200 shadow-sm">
                              <Image
                                src={`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${itemData.imageUrl}`}
                                alt={itemData.name}
                                fill
                                className="object-contain p-2"
                                sizes="(max-width: 768px) 96px, 128px"
                              />
                            </div>
                          )}
                          <div className="pt-1">
                            <p className="text-xs text-primary-600 font-medium uppercase tracking-wide mb-1">
                              {itemData.type === 'product' ? 'Requesting Quote For' : 'Selected Category'}
                            </p>
                            <h3 className="font-bold text-gray-900 text-lg md:text-xl">{itemData.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Complete the form below and we&apos;ll prepare your custom quote
                            </p>
                            {itemData.type === 'product' && itemData.uniqueProductName && (
                              <p className="text-xs text-primary-500 mt-2 font-medium">
                                Click to view product details →
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    )}

                    {/* ========== MINIMAL FORM LAYOUT ========== */}

                    {/* Row 1: Name + Quantity (get commitment early) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <FormControlInput
                        label="Your Name"
                        name="fullName"
                        isRequired={true}
                        disabled={isSubmitting}
                        control={control}
                        errors={errors}
                        placeholder="Jane Smith"
                      />

                      <div>
                        <FormControlInput
                          label="Estimated Quantity"
                          name="quantity"
                          isRequired={true}
                          disabled={isSubmitting}
                          control={control}
                          fieldType="number"
                          errors={errors}
                          placeholder="How many do you need?"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Not sure yet? Enter your best estimate — we can adjust later.
                        </p>
                      </div>
                    </div>

                    {/* Row 2: Email + Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                      <FormControlInput
                        label="Work Email"
                        name="emailAddress"
                        isRequired={true}
                        disabled={isSubmitting}
                        control={control}
                        errors={errors}
                        placeholder="jane@yourcompany.com"
                      />

                      <MaskInput
                        label="Phone Number (Optional)"
                        name="phoneNumber"
                        isRequired={false}
                        disabled={isSubmitting}
                        control={control}
                        errors={errors}
                      />
                    </div>

                    {/* Personalization & Project Details */}
                    <div className="mb-6">
                      <FormControlInput
                        label="What Would You Like Printed?"
                        name="notes"
                        isRequired={false}
                        disabled={isSubmitting}
                        control={control}
                        inputType="textarea"
                        errors={errors}
                        placeholder="e.g., Company logo on front left chest, 'ABC Company 2026' text on back, size breakdown, colors, deadline..."
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Don&apos;t have a logo yet? No problem — just describe what you want and we&apos;ll help.
                      </p>
                    </div>

                    {/* Artwork Upload - Compact */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Artwork <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                        <div className="flex items-center justify-center gap-3">
                          <MdOutlineUploadFile className="w-6 h-6 text-gray-400" />
                          <label htmlFor="quoteArtworkInput" className="cursor-pointer">
                            <span className="text-primary-600 font-medium hover:text-primary-700">
                              Click to upload
                            </span>
                            <span className="text-gray-500 text-sm"> — AI, EPS, SVG, PDF, PNG, JPG</span>
                            <input
                              id="quoteArtworkInput"
                              type="file"
                              name="quoteArtworkInput"
                              onChange={e => handleFileChange(e)}
                              hidden
                              disabled={isSubmitting}
                            />
                          </label>
                        </div>

                        {uploadProgress > 0 && (
                          <div className="mt-3">
                            <LinearProgressWithLabel progress={uploadProgress} />
                          </div>
                        )}

                        {artWorkFiles.length > 0 && (
                          <ul className="mt-3 space-y-2">
                            {artWorkFiles.map((file, index) => (
                              <li key={file.fileKey} className="flex items-center p-2 bg-white rounded border border-gray-200">
                                {allowedImageTypes.some(type => type === file.fileType) ? (
                                  <div className="w-8 h-8 flex-shrink-0 overflow-hidden rounded">
                                    <Image
                                      className="object-cover w-full h-full"
                                      width={32}
                                      height={32}
                                      src={`${ASSETS_SERVER_URL}${file.fileKey}`}
                                      alt={file.filename}
                                    />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center">
                                    <FaFileAlt className="text-gray-400 text-sm" />
                                  </div>
                                )}
                                <span className="flex-grow pl-2 text-sm text-gray-700 truncate">{file.filename}</span>
                                <button
                                  type="button"
                                  onClick={() => handleFileRemove(index)}
                                  className="ml-2 p-1 text-red-500 hover:text-red-700 rounded"
                                >
                                  <IoClose className="w-4 h-4" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* Hidden fields for product context */}
                    {!itemData?.name && (
                      <input type="hidden" {...methods.register('productCategory')} />
                    )}

                    {/* ========== SUBMIT BUTTON ========== */}
                    <div className="mt-8">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 px-6 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-lg rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Submitting Your Request...' : 'Get My Free Quote & Proof →'}
                      </button>
                      <div className="text-center text-xs text-gray-500 mt-3 space-y-1">
                        <p className="flex items-center justify-center gap-1">
                          <FaBolt className="text-amber-500 w-3 h-3" />
                          Response within 30 minutes during office hours
                        </p>
                        <p>🔒 No payment info needed · No obligation</p>
                      </div>
                    </div>
                  </form>
                </FormProvider>
              </ReactQueryClientProvider>
            </div>

            {/* ========== SIDEBAR ========== */}
            <div className="lg:col-span-1">
              {/* What Happens Next Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
                <h3 className="font-bold text-gray-900 mb-4">What Happens Next?</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Quote + Proof in ~30 Min</p>
                      <p className="text-xs text-gray-500">During office hours (Mon–Fri, 8am–5pm CST)</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Review Your Virtual Proof</p>
                      <p className="text-xs text-gray-500">See your logo on the product before committing</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Approve & Pay Online</p>
                      <p className="text-xs text-gray-500">Request changes or approve when ready</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">We Produce & Ship</p>
                      <p className="text-xs text-gray-500">Quality production with tracking updates</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Contact Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 sticky top-4">
                <h3 className="font-bold text-gray-900 mb-3">Need Help Faster?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  For urgent orders or complex questions, reach out directly:
                </p>

                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                  className="flex items-center gap-3 w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors mb-3"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  Chat on WhatsApp
                </a>

                <a
                  href={getMessengerLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleMessengerClick}
                  className="flex items-center gap-3 w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors mb-4"
                >
                  <RiMessengerLine className="w-5 h-5" />
                  Message on Facebook
                </a>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Email:</strong> orders@printsyou.com
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Phone:</strong> (469) 434-7035
                  </p>
                  <p className="text-xs text-gray-400">
                    Mon – Fri: 8:00 AM – 5:00 PM CST
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* ========== SUCCESS MODAL WITH DETAILED NEXT STEPS ========== */}
      <SuccessModal
        open={isSuccessModalOpen}
        onClose={setIsSuccessModalOpen}
        title="Quote Request Received!"
        htmlNote={`
          <div style="text-align: left;">
            <p style="margin-bottom: 16px; color: #4B5563;">
              Thank you! We've received your request and a confirmation email is on its way.
            </p>
            <p style="font-weight: 600; color: #1F2937; margin-bottom: 8px;">Here's what happens next:</p>
            <ol style="color: #4B5563; padding-left: 20px; margin-bottom: 16px;">
              <li style="margin-bottom: 4px;">We'll review your project details</li>
              <li style="margin-bottom: 4px;">You'll receive a quote + free virtual proof</li>
              <li style="margin-bottom: 4px;">Review the mockup showing your logo on the product</li>
              <li>Approve online when you're ready to proceed</li>
            </ol>
            <p style="color: #6B7280; font-size: 14px;">
              <strong>⚡ Response time:</strong> ~30 minutes during office hours (Mon–Fri, 8am–5pm CST)
            </p>
          </div>
        `}
        buttonText="Continue Browsing"
        onButtonClick={() => {
          if (referrerUrl) {
            router.push(referrerUrl);
          } else {
            router.push('/');
          }
        }}
      />
    </>
  );
};
