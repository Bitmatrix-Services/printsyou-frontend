'use client';
import React, {FC, Fragment, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import axios, {AxiosResponse} from 'axios';
import {v4 as uuidv4} from 'uuid';
import {orderCheckoutSchema, OrderFormSchemaType} from '@utils/validation-schemas';
import {ImageWithFallback} from '@components/globals/Image-with-fallback';
import {shippingFormFields} from '@utils/constants';
import {RadioGroup} from '@mui/joy';
import {IoClose} from 'react-icons/io5';
import {SuccessModal} from '@components/globals/success-modal.component';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useMutation} from '@tanstack/react-query';
import {FormControlInput} from '@lib/form/form-control-input';
import {Container} from '@components/globals/container.component';
import {FormControlCheckbox} from '@lib/form/form-control-checkbox';
import Radio from '@mui/joy/Radio';
import {MdClose, MdModeEdit} from 'react-icons/md';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {FormControlSelect} from '@lib/form/form-control-select';
import {CircularLoader} from '@components/globals/circular-loader.component';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {selectCartRootState, setCartState, setCartStateForModal} from '../store/slices/cart/cart.slice';
import {CartItemUpdated, CartRoot} from '../store/slices/cart/cart';
import {ReactQueryClientProvider} from '../app/query-client-provider';
import {Breadcrumb} from '@components/globals/breadcrumb.component';
import dayjs from 'dayjs';
import {FormHeading} from '@components/globals/cart/add-to-cart-modal.component';

export const CheckoutComponent: FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const cartRoot = useAppSelector(selectCartRootState);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<'success' | 'error' | ''>('');
  const [apiError, setApiError] = useState<boolean>(false);

  const getInHandDateEst = () => {
    const currentDay = new Date();
    return currentDay.toISOString().split('T')[0];
  };

  const {
    control,
    reset,
    handleSubmit,
    formState: {errors, isSubmitting},
    watch
  } = useForm<OrderFormSchemaType>({
    resolver: yupResolver(orderCheckoutSchema),
    defaultValues: {
      billingAddress: {
        fullname: '',
        company: '',
        addressLineOne: '',
        addressLineTwo: '',
        city: '',
        state: '',
        zipCode: '',
        phoneNumber: ''
      },
      shippingAddress: {
        fullname: '',
        company: '',
        addressLineOne: '',
        addressLineTwo: '',
        city: '',
        state: '',
        zipCode: '',
        phoneNumber: ''
      },
      emailAddress: '',

      shippingAddressSame: 'shippingAddressSame',

      inHandDate: getInHandDateEst(),
      salesRep: '',
      additionalInformation: '',

      newsLetter: false,
      termsAndConditions: false
    }
  });

  const {mutate} = useMutation({
    mutationFn: (data: OrderFormSchemaType) => {
      setApiError(false);
      let orderData: any = {
        ...data,
        shippingAddressSame: data.shippingAddressSame === 'shippingAddressSame',
        cartId: cartRoot?.id
      };

      delete orderData.newsLetter;
      delete orderData.termsAndConditions;
      return axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/create-order`, orderData);
    },
    onSuccess: () => {
      setIsSuccessModalOpen('success');
      let newRandId = uuidv4();
      localStorage.setItem('cartId', newRandId);
      dispatch(
        setCartState({
          id: newRandId,
          totalCartPrice: 0,
          cartItems: [],
          additionalCartPrice: 0
        })
      );
      reset();
    },
    onError: () => {
      setIsSuccessModalOpen('success');
      setApiError(true);
    }
  });

  const handleBackButtonClick = () => {
    router.back();
  };

  const getCartId = () => {
    let cartId;
    try {
      cartId = localStorage.getItem('cartId');
    } catch (error) {}
    return cartId;
  };

  const handleRemoveItem = async (item: CartItemUpdated) => {
    const cartId = getCartId();
    try {
      axios
        .put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/remove`, undefined, {
          params: {cartItemId: item.id, cartId: cartId}
        })
        .then(() => axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/${cartId}`))
        .then((response: AxiosResponse) => {
          dispatch(setCartState(response.data.payload as CartRoot));
        });
    } catch {}
  };

  const onSubmit: SubmitHandler<OrderFormSchemaType> = data => {
    mutate(data);
  };

  const handleUpdateItem = async (item: CartItemUpdated) => {
    try {
      const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/${item.productId}`);
      const selectedProduct = data.payload;
      dispatch(
        setCartStateForModal({
          selectedProduct: structuredClone(selectedProduct),
          open: true,
          selectedItem: item,
          cartMode: 'update'
        })
      );
    } catch (e) {}
  };

  if (cartRoot && cartRoot?.cartItems?.length <= 0) {
    router.push('/');
  }

  return (
    <>
      <Breadcrumb list={[]} prefixTitle="Checkout" />
      <Container>
        <div className="pt-8">
          <button
            className="block py-4 text-base tracking-[3.5px] font-bold w-fit text-secondary-500"
            onClick={handleBackButtonClick}
          >
            Back Continue Shopping
          </button>
        </div>
        <ReactQueryClientProvider>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              className={
                (cartRoot?.cartItems ?? []).length > 0
                  ? ' flex-col grid md:grid-cols-2 lg:flex-row w-full justify-between py-0 gap-6 lg:gap-20'
                  : 'grid grid-cols-1 py-0 gap-6 lg:gap-4'
              }
            >
              {/* Form */}
              {(cartRoot?.cartItems ?? []).length > 0 ? (
                <>
                  <div className="w-full">
                    <FormHeading text="Billing Information" />
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormControlInput
                        label="Your Name"
                        name="billingAddress.fullname"
                        isRequired={true}
                        disabled={isSubmitting}
                        control={control}
                        errors={errors}
                      />
                      <FormControlInput
                        label="Company"
                        name="billingAddress.company"
                        disabled={isSubmitting}
                        control={control}
                      />

                      <div className="md:col-span-2">
                        <FormControlInput
                          name="billingAddress.addressLineOne"
                          label="Address"
                          isRequired={true}
                          disabled={isSubmitting}
                          control={control}
                          errors={errors}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <FormControlInput
                          name="billingAddress.addressLineTwo"
                          label="Address 2"
                          disabled={isSubmitting}
                          control={control}
                        />
                      </div>
                      <FormControlInput
                        name="billingAddress.city"
                        label="City"
                        isRequired={true}
                        disabled={isSubmitting}
                        control={control}
                        errors={errors}
                      />

                      <FormControlSelect
                        name="billingAddress.state"
                        label="State"
                        isRequired={true}
                        disabled={isSubmitting}
                        control={control}
                        errors={errors}
                      />

                      <FormControlInput
                        name="billingAddress.zipCode"
                        label="Zip Code"
                        isRequired={true}
                        disabled={isSubmitting}
                        control={control}
                        errors={errors}
                      />

                      <FormControlInput
                        name="billingAddress.phoneNumber"
                        label="Phone"
                        isRequired={true}
                        disabled={isSubmitting}
                        control={control}
                        errors={errors}
                      />
                      <div className="md:col-span-2">
                        <FormControlInput
                          name="emailAddress"
                          label="Email"
                          isRequired={true}
                          disabled={isSubmitting}
                          control={control}
                          errors={errors}
                        />
                      </div>
                    </div>
                    <FormHeading text="Shipping Information" />
                    <div className="flex flex-col gap-2">
                      <Controller
                        name="shippingAddressSame"
                        control={control}
                        render={({field: {onChange, value}}) => (
                          <RadioGroup value={value} onChange={onChange}>
                            <Radio
                              value="shippingAddressSame"
                              label="Same as my billing address"
                              variant="outlined"
                              checked={value === 'shippingAddressSame'}
                            />

                            <Radio
                              value="diffBillingAddress"
                              label="Different shipping address"
                              variant="outlined"
                              checked={value === 'diffBillingAddress'}
                            />
                          </RadioGroup>
                        )}
                      />
                    </div>
                    {watch('shippingAddressSame') === 'diffBillingAddress' && (
                      <div className="grid md:grid-cols-2 gap-6 mt-6">
                        {shippingFormFields.map(field =>
                          field.label === 'State' ? (
                            <FormControlSelect
                              key={uuidv4()}
                              name={field.name}
                              label={field.label}
                              isRequired={field.required}
                              disabled={isSubmitting}
                              control={control}
                              errors={errors}
                            />
                          ) : (
                            <FormControlInput
                              key={uuidv4()}
                              name={field.name}
                              label={field.label}
                              isRequired={true}
                              disabled={isSubmitting}
                              control={control}
                              errors={errors}
                            />
                          )
                        )}
                      </div>
                    )}
                    <FormHeading text="Payment Information" />

                    <ul className="list-disc ml-4">
                      <li className=" text-[14px] mb-2">
                        After submitting your order, PrintsYou will follow up with any questions, a confirmation, and an
                        artwork proof. The confirmation will include shipping charges, any applicable taxes, and any
                        additional charges that may be required based on your artwork.
                      </li>
                      <li className=" text-[14px] mb-2">
                        You have nothing to worry about by submitting your order. The order is not firm until your
                        artwork proof along with the pricing breakdown has been approved and we begin production. The
                        order may be canceled any time before that.
                      </li>
                      <li className=" text-[14px] mb-2">
                        {`We do not request payment until we receive approvals, so if you're nervous about placing your order with us, don't be . There will be plenty of communication before we begin production.`}
                      </li>
                    </ul>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="p-4 border-2">
                      <FormHeading text="Products in Cart" />
                      {(cartRoot?.cartItems ?? []).map(item => (
                        <div key={uuidv4()}>
                          <div className="flex items-center p-4">
                            <div className="relative">
                              <ImageWithFallback
                                style={{
                                  position: 'relative',
                                  width: '100%',
                                  minHeight: '100px',
                                  maxHeight: '100px',
                                  objectFit: 'contain',
                                  borderRadius: '8px'
                                }}
                                width={100}
                                height={100}
                                src={item?.imageUrl}
                                alt="Product"
                              />
                            </div>

                            <div className="ml-4 flex-grow">
                              <div className="text-black mb-2">
                                Item#:
                                <span className="text-yellow-500">{item.sku}</span>
                              </div>
                              <h3
                                className="text-sm lg:text-base font-semibold"
                                dangerouslySetInnerHTML={{
                                  __html: item.productName
                                }}
                              ></h3>
                              <div className="flex items-center justify-between mt-2 text-sm min-w-max">
                                <div className="flex items-center gap-3">
                                  <div className="flex">
                                    <span className="">Qty: {item.qtyRequested || 0}</span>
                                    <IoClose className="w-4 h-4" />
                                    <span>${item.priceQuotedPerItem}</span>
                                  </div>
                                  <div className="font-semibold text-sm lg:text-base">
                                    ${item.itemTotalPrice.toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div
                                onClick={e => {
                                  handleUpdateItem(item);
                                  e.stopPropagation();
                                }}
                                className="cursor-pointer hover:text-red-600"
                              >
                                <MdModeEdit className="w-5 h-5" />
                              </div>

                              <div
                                onClick={e => {
                                  handleRemoveItem(item);
                                  e.stopPropagation();
                                }}
                                className="cursor-pointer hover:text-red-600"
                              >
                                <MdClose className="w-6 h-6" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div>
                        <hr className="my-4 border border-black-100" />
                        <div className="flex justify-evenly items-center">
                          <h2 className="text-lg">Total Price:</h2>
                          <h2 className="text-lg font-bold">${cartRoot?.totalCartPrice.toFixed(2)}</h2>
                        </div>
                        <div className="text-xs mt-3">
                          *Final total including shipping and any additional charges will be sent with the artwork proof
                          after the order is placed.
                        </div>
                      </div>
                    </div>

                    {/* additional info section*/}
                    <div className="p-4 border-2">
                      <FormHeading text="Additional Information" />
                      <div className="grid md:grid-cols-2 gap-6">
                        <Controller
                          name="inHandDate"
                          control={control}
                          render={({field: {onChange, value}}) => (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                value={value ? dayjs(value) : null}
                                onChange={date => onChange(date ? date.format('YYYY-MM-DD') : '')}
                              />
                            </LocalizationProvider>
                          )}
                        />

                        <FormControlInput
                          name="salesRep"
                          placeholder="Sales Rep Name"
                          disabled={isSubmitting}
                          control={control}
                        />

                        <div className="md:col-span-2">
                          <FormControlInput
                            inputType="textarea"
                            name="additionalInformation"
                            placeholder="Additional Information"
                            disabled={isSubmitting}
                            control={control}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between gap-2 flex-col mt-4">
                        <FormControlCheckbox
                          name="newsLetter"
                          label="Be up to date with our promotions, sign up for our email newsletters
                                                now."
                          disabled={isSubmitting}
                          control={control}
                        />
                        <FormControlCheckbox
                          name="termsAndConditions"
                          label={
                            <Fragment>
                              I have read & agree to PrintsYou{' '}
                              <Link href="/terms-and-conditions" target="blank" className="text-blue-500">
                                Terms and Conditions
                              </Link>
                            </Fragment>
                          }
                          isRequired={true}
                          disabled={isSubmitting}
                          control={control}
                          errors={errors}
                        />
                      </div>
                      {apiError ? (
                        <div className="text-red-500 pt-4 text-center">Something went wrong, Please try again!</div>
                      ) : null}
                      <div className="my-6 flex w-full justify-center items-center">
                        <button
                          type="submit"
                          className="w-full py-5 px-32 text-sm font-bold  bg-primary-500 hover:bg-secondary-500 text-white"
                        >
                          {isSubmitting ? <CircularLoader /> : 'SUBMIT'}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex justify-center w-full items-center my-8">
                  <h2 className="my-4 font-bold text-3xl text-primary">No product Found!</h2>
                </div>
              )}
            </div>
          </form>
        </ReactQueryClientProvider>

        <SuccessModal
          open={isSuccessModalOpen}
          onClose={() => {
            handleBackButtonClick();
            setIsSuccessModalOpen('');
            setApiError(false);
          }}
          title="Thank you for placing an order with PrintsYou!"
          note={` Your order will not be finalized until you have approved the
                  artwork and sales order confirmation. Once you have approved
                  both, we will email you a credit card authorization form.
                  Simply fill it out and email/fax it back to us at your
                  convenience. The sooner you complete all of these steps the
                  faster we can place your order and begin production of your
                  promotional products.`}
        />
      </Container>
    </>
  );
};
