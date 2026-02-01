'use client';
import React, {ChangeEvent, FC, useState, useEffect, useCallback} from 'react';
import {Container} from '@components/globals/container.component';
import {Breadcrumb} from '@components/globals/breadcrumb.component';
import {FormProvider, SubmitHandler, useForm, Controller} from 'react-hook-form';
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
import {FaWhatsapp, FaCheckCircle, FaFileAlt, FaClock, FaShieldAlt} from 'react-icons/fa';
import {RiMessengerLine} from 'react-icons/ri';
import {MdOutlineUploadFile} from 'react-icons/md';
import {IoClose} from 'react-icons/io5';
import {HiOutlineLightBulb} from 'react-icons/hi';
import {useSearchParams, useRouter} from 'next/navigation';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
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

export interface QuoteItemData {
  type: 'category' | 'product';
  name: string;
  imageUrl: string;
  productId?: string;
}

interface RequestQuoteComponentProps {
  itemData?: QuoteItemData | null;
}

export const RequestQuoteComponent: FC<RequestQuoteComponentProps> = ({itemData}) => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<'success' | 'error' | ''>('');
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

  const {mutate} = useMutation({
    mutationFn: (data: QuoteRequestFormSchemaType) => {
      setLoading(true);
      // Analytics event
      trackEvent('quote_form_submit', {category: data.productCategory, quantity: data.quantity, artworkCount: artWorkFiles.length});
      // Include artwork files in the request
      const requestData = {
        ...data,
        artworkFiles: artWorkFiles
      };
      return axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}${QuoteRequestRoutes.createQuote}`, requestData);
    },
    onSuccess: () => {
      setTimeout(() => {
        setLoading(false);
        setIsSuccessModalOpen('success');
        reset();
      }, 1500);
    },
    onError: () => {
      setTimeout(() => {
        setLoading(false);
        setIsSuccessModalOpen('error');
      }, 1500);
    }
  });

  const onSubmit: SubmitHandler<QuoteRequestFormSchemaType> = data => {
    mutate(data);
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
              Get Your Free Custom Quote
            </h1>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Tell us about your project and we&apos;ll create a personalized quote with a free virtual proof — no payment or commitment required.
            </p>

            {/* Trust Badges Row */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheckCircle className="text-green-500 w-4 h-4" />
                <span>Free Virtual Proof</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaShieldAlt className="text-blue-500 w-4 h-4" />
                <span>No Payment Required</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaClock className="text-primary-500 w-4 h-4" />
                <span>Response Within 24 Hours</span>
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
                      <div className="mb-8 p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-100">
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
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ========== SECTION 1: CONTACT INFORMATION ========== */}
                    <div className="mb-8">
                      <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                        <span className="w-6 h-6 bg-primary-500 text-white rounded-full text-sm flex items-center justify-center">1</span>
                        Contact Information
                      </h2>
                      <p className="text-sm text-gray-500 mb-4 ml-8">We&apos;ll use this to send your quote and proof</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormControlInput
                          label="Your Name"
                          name="fullName"
                          isRequired={true}
                          disabled={isSubmitting}
                          control={control}
                          errors={errors}
                          placeholder="Jane Smith"
                        />

                        <FormControlInput
                          label="Work Email"
                          name="emailAddress"
                          isRequired={true}
                          disabled={isSubmitting}
                          control={control}
                          errors={errors}
                          placeholder="jane@yourcompany.com"
                        />

                        <FormControlInput
                          label="Company / Organization"
                          name="companyName"
                          isRequired={false}
                          disabled={isSubmitting}
                          control={control}
                          errors={errors}
                          placeholder="Acme Corporation"
                        />

                        <MaskInput
                          label="Phone Number"
                          name="phoneNumber"
                          isRequired={false}
                          disabled={isSubmitting}
                          control={control}
                          errors={errors}
                        />
                      </div>
                    </div>

                    {/* ========== SECTION 2: ORDER DETAILS ========== */}
                    <div className="mb-8">
                      <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                        <span className="w-6 h-6 bg-primary-500 text-white rounded-full text-sm flex items-center justify-center">2</span>
                        Order Details
                      </h2>
                      <p className="text-sm text-gray-500 mb-4 ml-8">Help us understand your needs for accurate pricing</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Product/Category - Only show if not pre-filled */}
                        {!itemData?.name && (
                          <FormControlInput
                            label="Product Type"
                            name="productCategory"
                            isRequired={false}
                            disabled={isSubmitting}
                            control={control}
                            errors={errors}
                            placeholder="e.g., Safety Vests, Custom T-Shirts, Pens"
                          />
                        )}

                        {/* Quantity - REQUIRED */}
                        <div className={!itemData?.name ? '' : 'md:col-span-1'}>
                          <FormControlInput
                            label="Estimated Quantity"
                            name="quantity"
                            isRequired={true}
                            disabled={isSubmitting}
                            control={control}
                            fieldType="number"
                            errors={errors}
                            placeholder="e.g., 250"
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            Tip: Higher quantities = lower per-unit cost. We can quote multiple quantities.
                          </p>
                        </div>

                        {/* Need-by Date */}
                        <div className="md:col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            When Do You Need This? <span className="text-gray-400 font-normal">(Optional)</span>
                          </label>
                          <Controller
                            name="needByDate"
                            control={control}
                            render={({field: {onChange, value}}) => (
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  value={value ? dayjs(value) : null}
                                  onChange={date => onChange(date ? date.format('YYYY-MM-DD') : '')}
                                  disabled={isSubmitting}
                                  minDate={dayjs().add(7, 'day')}
                                  slotProps={{
                                    textField: {
                                      fullWidth: true,
                                      size: 'small',
                                      placeholder: 'Select your event or deadline date',
                                      sx: {
                                        '& .MuiOutlinedInput-root': {
                                          borderRadius: '0.5rem',
                                          backgroundColor: 'white'
                                        }
                                      }
                                    }
                                  }}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            Standard production: 2-3 weeks. Rush options available for urgent orders.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ========== SECTION 3: PROJECT DETAILS ========== */}
                    <div className="mb-8">
                      <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                        <span className="w-6 h-6 bg-primary-500 text-white rounded-full text-sm flex items-center justify-center">3</span>
                        Project Details
                      </h2>
                      <p className="text-sm text-gray-500 mb-4 ml-8">The more details you provide, the faster we can prepare your quote</p>

                      {/* Helper prompt */}
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                        <div className="flex gap-3">
                          <HiOutlineLightBulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-amber-800">
                            <p className="font-medium mb-1">Help us quote accurately by including:</p>
                            <ul className="list-disc list-inside text-amber-700 space-y-0.5">
                              <li>Logo placement location (front, back, sleeve, etc.)</li>
                              <li>Size breakdown if known (e.g., 10 S, 20 M, 15 L, 5 XL)</li>
                              <li>Specific colors or Pantone numbers</li>
                              <li>Any special requirements or deadlines</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <FormControlInput
                        label="Project Description"
                        name="notes"
                        isRequired={false}
                        disabled={isSubmitting}
                        control={control}
                        inputType="textarea"
                        errors={errors}
                        placeholder="Example: Need 250 safety vests for our construction crew. Logo on front left chest (about 4 inches) and large logo on back. Company colors are navy blue (Pantone 289C) and white. Need a mix of sizes: 50 M, 100 L, 75 XL, 25 2XL. Event is March 15th - is rush production possible?"
                      />
                    </div>

                    {/* ========== SECTION 4: ARTWORK UPLOAD ========== */}
                    <div className="mb-8">
                      <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                        <span className="w-6 h-6 bg-gray-300 text-white rounded-full text-sm flex items-center justify-center">4</span>
                        Upload Your Artwork
                        <span className="text-sm font-normal text-gray-400 ml-1">(Optional)</span>
                      </h2>
                      <p className="text-sm text-gray-500 mb-4 ml-8">
                        Have your logo ready? Upload it now for a faster, more accurate proof.
                      </p>

                      <div className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg p-6">
                        <div className="text-center">
                          <MdOutlineUploadFile className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                          <label
                            htmlFor="quoteArtworkInput"
                            className="cursor-pointer"
                          >
                            <span className="text-blue-600 font-medium hover:text-blue-700">
                              Click to upload
                            </span>
                            <span className="text-gray-500"> or drag and drop</span>
                            <input
                              id="quoteArtworkInput"
                              type="file"
                              name="quoteArtworkInput"
                              onChange={e => handleFileChange(e)}
                              hidden
                              disabled={isSubmitting}
                            />
                          </label>
                          <p className="text-xs text-gray-500 mt-2">
                            <span className="font-medium">Best formats:</span> AI, EPS, SVG, PDF (vector)
                          </p>
                          <p className="text-xs text-gray-400">
                            Also accepts: PNG, JPG, PSD (300+ DPI recommended)
                          </p>
                        </div>

                        {uploadProgress > 0 && (
                          <div className="mt-4">
                            <LinearProgressWithLabel progress={uploadProgress} />
                          </div>
                        )}

                        {artWorkFiles.length > 0 && (
                          <ul className="mt-4 space-y-2">
                            {artWorkFiles.map((file, index) => (
                              <li key={file.fileKey} className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                                {allowedImageTypes.some(type => type === file.fileType) ? (
                                  <div className="w-10 h-10 flex-shrink-0 overflow-hidden rounded">
                                    <Image
                                      className="object-cover w-full h-full"
                                      width={40}
                                      height={40}
                                      src={`${ASSETS_SERVER_URL}${file.fileKey}`}
                                      alt={file.filename}
                                    />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center">
                                    <FaFileAlt className="text-gray-400" />
                                  </div>
                                )}
                                <div className="flex-grow pl-3 min-w-0">
                                  <span className="text-sm font-medium text-gray-700 truncate block">{file.filename}</span>
                                  <span className="text-xs text-gray-400 uppercase">{file.fileType}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleFileRemove(index)}
                                  className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                >
                                  <IoClose className="w-5 h-5" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}

                        <p className="text-xs text-center text-gray-400 mt-4">
                          Don&apos;t have artwork yet? No problem — we can work with you to create it.
                        </p>
                      </div>
                    </div>

                    {/* ========== SUBMIT BUTTON ========== */}
                    <div className="mt-8">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 px-6 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-lg rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Submitting Your Request...' : 'Get My Free Quote & Proof'}
                      </button>
                      <p className="text-center text-xs text-gray-500 mt-3">
                        No payment required. No obligation. We&apos;ll respond within 1 business day.
                      </p>
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
                    <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">We Review Your Request</p>
                      <p className="text-xs text-gray-500">Our team reviews your details within hours</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Receive Your Free Proof</p>
                      <p className="text-xs text-gray-500">We create a digital mockup of your product</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Approve & Pay Online</p>
                      <p className="text-xs text-gray-500">Review, request changes, or approve to proceed</p>
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
              <li style="margin-bottom: 4px;">Our team will review your project details</li>
              <li style="margin-bottom: 4px;">We'll create a custom quote with pricing</li>
              <li style="margin-bottom: 4px;">You'll receive a free virtual proof to review</li>
              <li>Approve online when you're ready to proceed</li>
            </ol>
            <p style="color: #6B7280; font-size: 14px;">
              <strong>Response time:</strong> Within 1 business day (usually much faster!)
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
