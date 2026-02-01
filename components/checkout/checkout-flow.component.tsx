'use client';

import React, {FC, useState, Fragment} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {Container} from '@components/globals/container.component';
import {Breadcrumb} from '@components/globals/breadcrumb.component';
import {ReactQueryClientProvider} from '../../app/query-client-provider';
import {useAppSelector} from '../../store/hooks';
import {selectCartRootState} from '../../store/slices/cart/cart.slice';
import {CheckoutStepper} from './checkout-stepper';
import {OrderSummary} from './order-summary';
import {ContactShippingForm} from './contact-shipping-form';
import {ArtworkUploader, ArtworkFile} from './artwork-uploader';
import {FormControlInput} from '@lib/form/form-control-input';
import {FormControlCheckbox} from '@lib/form/form-control-checkbox';
import {CircularLoader} from '@components/globals/circular-loader.component';
import {SuccessModal} from '@components/globals/success-modal.component';
import {stripeCheckoutSchema, StripeCheckoutFormSchemaType} from '@utils/validation-schemas';
import {CheckoutRoutes} from '@utils/routes/be-routes';
import {FaArrowLeft, FaLock} from 'react-icons/fa';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const CheckoutFlowComponent: FC = () => {
  const router = useRouter();
  const cartRoot = useAppSelector(selectCartRootState);

  const [checkoutId] = useState<string>(uuidv4());
  const [artworkFiles, setArtworkFiles] = useState<ArtworkFile[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [modalState, setModalState] = useState<'success' | 'error' | ''>('');
  const [modalMessage, setModalMessage] = useState<string>('');

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

  const cartItems = cartRoot?.cartItems ?? [];
  const hasItems = cartItems.length > 0;

  const handleFormError = (errorData: Record<string, any>) => {
    const firstErrorKey = Object.keys(errorData)[0];
    if (firstErrorKey) {
      const errorElement = document.querySelector(`[name="${firstErrorKey}"]`);
      if (errorElement) {
        const yOffset = -150;
        const yPosition = errorElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({top: yPosition, behavior: 'smooth'});
      }
    }
  };

  const onSubmit = async (data: StripeCheckoutFormSchemaType) => {
    if (!cartRoot?.id) {
      setModalMessage('Your cart is empty. Please add items before checkout.');
      setModalState('error');
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare checkout data
      const checkoutData = {
        cartId: cartRoot.id,
        customerEmail: data.email,
        customerName: `${data.firstName} ${data.lastName}`,
        customerPhone: data.phone || null,
        companyName: data.company || null,
        shippingAddress: {
          addressLine1: data.address,
          addressLine2: data.addressLine2 || null,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode
        },
        specialInstructions: data.specialInstructions || null,
        artworkFiles: artworkFiles,
        successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/checkout/cancel`
      };

      // Create Stripe checkout session
      const response = await axios.post(`${API_BASE_URL}${CheckoutRoutes.createSession}`, checkoutData);

      if (response.data?.payload?.checkoutUrl) {
        // Redirect to Stripe
        window.location.href = response.data.payload.checkoutUrl;
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

  // Empty cart state
  if (!hasItems) {
    return (
      <>
        <Breadcrumb list={[]} prefixTitle="Checkout" />
        <Container>
          <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
            <div className="text-center max-w-md">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-6">
                Looks like you haven&apos;t added any items to your cart yet.
              </p>
              <Link
                href="/"
                className="inline-block px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                Start Shopping
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
        <div className="py-8">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium mb-6"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Cart
          </button>

          {/* Stepper */}
          <CheckoutStepper currentStep="details" />

          <ReactQueryClientProvider>
            <form onSubmit={handleSubmit(onSubmit, handleFormError)}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form Area */}
                <div className="lg:col-span-2 space-y-6">
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
                      Any specific requirements for your order? Let us know here.
                    </p>
                    <FormControlInput
                      name="specialInstructions"
                      inputType="textarea"
                      placeholder="E.g., PMS colors, placement instructions, rush order needs, etc."
                      disabled={isSubmitting || isProcessing}
                      control={control}
                    />
                  </div>

                  {/* Terms & Conditions */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <FormControlCheckbox
                      name="termsAndConditions"
                      label={
                        <Fragment>
                          I have read and agree to PrintsYou{' '}
                          <Link href="/terms-and-conditions" target="_blank" className="text-primary-500 hover:underline">
                            Terms and Conditions
                          </Link>
                        </Fragment>
                      }
                      isRequired={true}
                      disabled={isSubmitting || isProcessing}
                      control={control}
                      errors={errors}
                    />

                    <div className="mt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting || isProcessing}
                        className="w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                      >
                        {isSubmitting || isProcessing ? (
                          <>
                            <CircularLoader />
                            Processing...
                          </>
                        ) : (
                          <>
                            <FaLock className="w-4 h-4" />
                            Continue to Payment (Stripe)
                          </>
                        )}
                      </button>
                      <p className="text-xs text-center text-gray-500 mt-3">
                        You will be redirected to Stripe for secure payment processing.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-4">
                    <OrderSummary />

                    {/* Security badges */}
                    <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaLock className="w-4 h-4 text-green-600" />
                        <span>Secure checkout powered by Stripe</span>
                      </div>
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
