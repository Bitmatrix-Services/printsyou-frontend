'use client';
import React, {FC, useState, useEffect, useCallback} from 'react';
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
import {FaWhatsapp} from 'react-icons/fa';
import {RiMessengerLine} from 'react-icons/ri';
import {useSearchParams} from 'next/navigation';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Image from 'next/image';

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
  const searchParams = useSearchParams();

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

  // Update source URL when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setValue('sourceUrl', document.referrer || window.location.href);
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
      trackEvent('quote_form_submit', {category: data.productCategory, quantity: data.quantity});
      return axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}${QuoteRequestRoutes.createQuote}`, data);
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

  // Analytics helper
  const trackEvent = useCallback((eventName: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, params);
    }
    // Console log for development
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
        <div className="max-w-4xl mx-auto py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Request a Quote</h1>
            <p className="text-gray-600 mt-2">Get a personalized quote for your custom printing needs.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <ReactQueryClientProvider>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <UserInfoCapture emailField="emailAddress" nameField="fullName" />

                    {/* Product/Category Image Card */}
                    {itemData?.name && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start gap-5">
                          {itemData.imageUrl && (
                            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-gray-200 shadow-sm">
                              <Image
                                src={`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${itemData.imageUrl}`}
                                alt={itemData.name}
                                fill
                                className="object-contain p-2"
                                sizes="(max-width: 768px) 128px, 160px"
                              />
                            </div>
                          )}
                          <div className="pt-2">
                            <p className="text-sm text-gray-500 mb-1">
                              {itemData.type === 'product' ? 'Requesting quote for product:' : 'Requesting quote for category:'}
                            </p>
                            <h3 className="font-semibold text-gray-900 text-lg md:text-xl">{itemData.name}</h3>
                            {itemData.type === 'product' && (
                              <p className="text-xs text-gray-400 mt-1">Fill out the form below for a personalized quote</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name - Required */}
                      <FormControlInput
                        label="Your Name"
                        name="fullName"
                        isRequired={true}
                        disabled={isSubmitting}
                        control={control}
                        errors={errors}
                        placeholder="John Smith"
                      />

                      {/* Email - Required */}
                      <FormControlInput
                        label="Email Address"
                        name="emailAddress"
                        isRequired={true}
                        disabled={isSubmitting}
                        control={control}
                        errors={errors}
                        placeholder="john@company.com"
                      />

                      {/* Company - Optional */}
                      <FormControlInput
                        label="Company Name"
                        name="companyName"
                        isRequired={false}
                        disabled={isSubmitting}
                        control={control}
                        errors={errors}
                        placeholder="Acme Corp (optional)"
                      />

                      {/* Phone - Optional */}
                      <MaskInput
                        label="Phone Number"
                        name="phoneNumber"
                        isRequired={false}
                        disabled={isSubmitting}
                        control={control}
                        errors={errors}
                      />

                      {/* Product Category */}
                      <FormControlInput
                        label="Product Category"
                        name="productCategory"
                        isRequired={false}
                        disabled={isSubmitting}
                        control={control}
                        errors={errors}
                        placeholder="e.g., T-Shirts, Pens, Bags"
                      />

                      {/* Quantity */}
                      <FormControlInput
                        label="Estimated Quantity"
                        name="quantity"
                        isRequired={false}
                        disabled={isSubmitting}
                        control={control}
                        fieldType="number"
                        errors={errors}
                        placeholder="e.g., 500"
                      />

                      {/* Need-by Date - Optional */}
                      <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Need-by Date
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
                                minDate={dayjs()}
                                slotProps={{
                                  textField: {
                                    fullWidth: true,
                                    size: 'small',
                                    placeholder: 'Select date (optional)',
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
                      </div>
                    </div>

                    {/* Notes - Full Width */}
                    <div className="mt-6">
                      <FormControlInput
                        label="Project Details / Notes"
                        name="notes"
                        isRequired={false}
                        disabled={isSubmitting}
                        control={control}
                        inputType="textarea"
                        errors={errors}
                        placeholder="Tell us about your project, customization needs, colors, logo requirements, etc."
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Submitting...' : 'Get My Free Quote'}
                      </button>
                    </div>
                  </form>
                </FormProvider>
              </ReactQueryClientProvider>
            </div>

            {/* Sidebar - Contact Options */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-4">
                <h2 className="font-bold text-gray-900 mb-4">Need Help Faster?</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Reach out directly via chat for quick assistance.
                </p>

                {/* WhatsApp */}
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

                {/* Messenger */}
                <a
                  href={getMessengerLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleMessengerClick}
                  className="flex items-center gap-3 w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors mb-6"
                >
                  <RiMessengerLine className="w-5 h-5" />
                  Message on Facebook
                </a>

                {/* Contact Info */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-900 text-sm mb-3">Or Contact Us</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Email:</strong> info@printsyou.com
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Phone:</strong> (469) 434-7035
                  </p>
                  <p className="text-sm text-gray-500 mt-4">
                    Mon - Fri: 8:00 AM - 5:00 PM CST
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <SuccessModal
        open={isSuccessModalOpen}
        onClose={setIsSuccessModalOpen}
        title={'Thank You for Your Quote Request!'}
        note={`We've received your request and will get back to you within 24 hours with a personalized quote. Check your email for confirmation.`}
      />
    </>
  );
};
