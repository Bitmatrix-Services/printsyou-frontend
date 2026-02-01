'use client';
import React, {ChangeEvent, FC, Fragment, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import axios, {AxiosResponse} from 'axios';
import {v4 as uuidv4} from 'uuid';
import {orderCheckoutSchema, OrderFormSchemaType} from '@utils/validation-schemas';
import {ImageWithFallback} from '@components/globals/Image-with-fallback';
import {shippingFormFields, statesList} from '@utils/constants';
import {Radio, RadioGroup} from '@mui/joy';
import {IoClose} from 'react-icons/io5';
import {SuccessModal} from '@components/globals/success-modal.component';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useMutation} from '@tanstack/react-query';
import {FormControlInput} from '@lib/form/form-control-input';
import {Container} from '@components/globals/container.component';
import {FormControlCheckbox} from '@lib/form/form-control-checkbox';
import {MdClose, MdModeEdit, MdOutlineFileDownload} from 'react-icons/md';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {FormControlSelect} from '@lib/form/form-control-select';
import {CircularLoader} from '@components/globals/circular-loader.component';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {selectCartRootState, setCartState, setCartStateForModal} from '../store/slices/cart/cart.slice';
import {CartItemUpdated, CartRoot, File as CartItemFile} from '../store/slices/cart/cart';
import {ReactQueryClientProvider} from '../app/query-client-provider';
import {Breadcrumb} from '@components/globals/breadcrumb.component';
import dayjs from 'dayjs';
import {FormHeading, FormDescription} from '@components/globals/cart/add-to-cart-modal.component';
import {MaskInput} from '@lib/form/mask-input.component';
import Option from '@mui/joy/Option';
import {LinearProgressWithLabel} from '@components/globals/linear-progress-with-label.component';
import Image from 'next/image';
import {UploadedFileType} from '@components/globals/cart/cart-types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ASSETS_SERVER_URL = process.env.ASSETS_SERVER_URL || 'https://printsyouassets.s3.amazonaws.com/';
const allowedImageTypes = ['jpeg', 'png', 'webp', 'gif', 'avif', 'svg+xml'];

export const CheckoutComponent: FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const cartRoot = useAppSelector(selectCartRootState);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<'success' | 'error' | 'warning' | 'info' | ''>('');
  const [apiError, setApiError] = useState<boolean>(false);
  const [artWorkFiles, setArtWorkFiles] = useState<CartItemFile[]>([]);
  const [progress, setProgress] = useState<number>(0);

  const getInHandDateEst = () => {
    const currentDay = new Date();
    return currentDay.toISOString().split('T')[0];
  };

  const methods = useForm<OrderFormSchemaType>({
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
        phoneNumber: '',
        shippingAddressSame: true
      },
      emailAddress: '',
      inHandDate: getInHandDateEst(),
      salesRep: '',
      additionalInformation: '',
      newsLetter: false,
      termsAndConditions: false
    }
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: {errors, isSubmitting},
    watch,
    setValue
  } = methods;

  const {mutate} = useMutation({
    mutationFn: (data: OrderFormSchemaType) => {
      setApiError(false);
      let orderData: any = {
        ...data,
        shippingAddressSame: data.shippingAddress.shippingAddressSame,
        cartId: cartRoot?.id,
        artworkFiles: artWorkFiles
      };

      delete orderData.newsLetter;
      delete orderData.shippingAddress.shippingAddressSame;
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
      setIsSuccessModalOpen('error');
      setApiError(true);
    }
  });

  const handleFormError = (errorData: Record<string, any>) => {
    const firstErrorKey = getFirstErrorKey(errorData);
    if (firstErrorKey) {
      const errorElement = document.querySelector(`[name="${firstErrorKey}`);
      if (errorElement) {
        const yOffset = -150;
        const yPosition = errorElement.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({top: yPosition, behavior: 'smooth'});
      }
    }
  };

  const getFirstErrorKey = (errorData: Record<string, any>): string | null => {
    for (const key in errorData) {
      if (typeof errorData[key] === 'object' && errorData[key] !== null) {
        for (const nestedKey in errorData[key]) {
          let keyValue = `${key}.${nestedKey}`;
          if (keyValue.includes('.message')) return keyValue.split('.')[0];
          else return keyValue;
        }
      } else {
        if (key.includes('.message')) return key.split('.')[0];
      }
    }
    return null;
  };

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

  const handleFileUpload = async (file: File) => {
    let data = {
      type: 'CART',
      fileName: file.name,
      id: getCartId()
    };

    try {
      const res = await axios.get(`${API_BASE_URL}/s3/signedUrl`, {params: data});
      await axios.put(res.data.payload.url, file, {
        onUploadProgress: event => {
          const percent = Math.floor((event.loaded / (event.total as number)) * 100);
          setProgress(percent);
          if (percent === 100) {
            setTimeout(() => setProgress(0), 2000);
          }
        }
      });
      return res;
    } catch (error) {
      setProgress(0);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;

    if (selectedFiles && selectedFiles.length > 0) {
      try {
        const uploadedFileResponse = await handleFileUpload(selectedFiles[0]);
        const uploadedFile = uploadedFileResponse?.data.payload as UploadedFileType;

        if (uploadedFile?.url && uploadedFile?.objectKey) {
          const newFile = {
            filename: selectedFiles[0].name,
            fileType: selectedFiles[0].type.split('/').pop() || '',
            fileKey: uploadedFile.objectKey
          };

          setArtWorkFiles(prevArtWorkFiles => [...prevArtWorkFiles, newFile]);
        }
      } catch (error) {
        console.error('Error handling file upload:', error);
      } finally {
        setProgress(0);
      }
    }
  };

  const handleFileRemove = (index: number) => {
    setArtWorkFiles(prevArtWorkFiles => {
      const updatedFiles = [...prevArtWorkFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
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

  return (
    <>
      <Breadcrumb list={[]} prefixTitle="Checkout" />
      <Container>
        <div className="pt-8">
          <button
            className="block py-4 text-base tracking-[3.5px] font-bold w-fit text-primary-500"
            onClick={handleBackButtonClick}
          >
            Back Continue Shopping
          </button>
        </div>
        <ReactQueryClientProvider>
          <form onSubmit={handleSubmit(onSubmit, handleFormError)}>
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
                  {/* for mobile only */}
                  <div className="block md:hidden p-4 border-2">
                    <FormHeading text="Products in Cart" />
                    {(cartRoot?.cartItems ?? []).map(item => (
                      <div key={item.id}>
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
                      >
                        {statesList.map(state => (
                          <Option key={state.name} value={state.value}>
                            {state.name}
                          </Option>
                        ))}
                      </FormControlSelect>

                      <FormControlInput
                        name="billingAddress.zipCode"
                        label="Zip Code"
                        isRequired={true}
                        disabled={isSubmitting}
                        control={control}
                        errors={errors}
                      />
                      <MaskInput
                        name="billingAddress.phoneNumber"
                        label="Phone"
                        isRequired={false}
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
                        name="shippingAddress.shippingAddressSame"
                        control={control}
                        render={({field: {onChange, value, ...otherProps}}) => (
                          <RadioGroup
                            value={value}
                            {...otherProps}
                            onChange={e => {
                              onChange(e.target.value === 'true');
                              if (e.target.value === 'true') {
                                setValue('shippingAddress', {
                                  fullname: '',
                                  company: '',
                                  addressLineOne: '',
                                  addressLineTwo: '',
                                  city: '',
                                  state: '',
                                  zipCode: '',
                                  phoneNumber: '',
                                  shippingAddressSame: true
                                });
                              }
                            }}
                          >
                            <Radio
                              value="true"
                              label="Same as my billing address"
                              variant="outlined"
                              checked={value === true}
                            />
                            <Radio
                              value="false"
                              label="Different shipping address"
                              variant="outlined"
                              checked={value === false}
                            />
                          </RadioGroup>
                        )}
                      />
                    </div>
                    {!watch('shippingAddress.shippingAddressSame') && (
                      <div className="grid md:grid-cols-2 gap-6 mt-6">
                        {shippingFormFields.map(field =>
                          field.label === 'State' ? (
                            <FormControlSelect
                              key={field.name}
                              name={field.name}
                              label={field.label}
                              isRequired={field.required}
                              disabled={isSubmitting}
                              control={control}
                              errors={errors}
                            >
                              {statesList.map(state => (
                                <Option key={state.name} value={state.value}>
                                  {state.name}
                                </Option>
                              ))}
                            </FormControlSelect>
                          ) : field.label === 'Phone' ? (
                            <MaskInput
                              key={field.name}
                              name={field.name}
                              label={field.label}
                              isRequired={field.required}
                              disabled={isSubmitting}
                              control={control}
                              errors={errors}
                            />
                          ) : (
                            <FormControlInput
                              key={field.name}
                              name={field.name}
                              label={field.label}
                              isRequired={field.required}
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
                    {/* hidden on mobile */}
                    <div className="hidden md:block p-4 border-2">
                      <FormHeading text="Products in Cart" />
                      {(cartRoot?.cartItems ?? []).map(item => (
                        <div key={item.id}>
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

                    {/* Artwork Upload Section */}
                    <div className="p-4 border-2">
                      <FormHeading text="Artwork Files" />
                      <FormDescription
                        textArray={[
                          `Click the "Upload Design" button to locate the artwork on your computer. Your artwork will automatically begin to upload. We can accept any artwork format you send us. However, we prefer vector format. This is usually .ai or .eps`,
                          `We will send a digital artwork proof for approval once the order is received.`
                        ]}
                      />
                      <div>
                        <label
                          htmlFor="artworkFileInput"
                          className="py-2 px-4 flex w-full lg:w-1/2 2xl:w-1/3 items-center justify-center cursor-pointer rounded-md border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white capitalize"
                        >
                          <input
                            id="artworkFileInput"
                            type="file"
                            name="artworkFileInput"
                            multiple
                            onChange={e => handleFileChange(e)}
                            hidden
                          />
                          Upload Design <MdOutlineFileDownload className="w-6 h-6 ml-3" />
                        </label>
                      </div>
                      <ul>
                        {artWorkFiles.map((file, index) => (
                          <li key={file.fileKey} className="flex items-center pt-4 rounded-lg">
                            {allowedImageTypes.some(type => type === file.fileType) ? (
                              <div className="w-12 h-12 flex-shrink-0 overflow-hidden">
                                <Image
                                  className="object-cover w-full h-full rounded-sm"
                                  width={100}
                                  height={100}
                                  src={`${ASSETS_SERVER_URL}${file.fileKey}`}
                                  alt={file.filename}
                                />
                              </div>
                            ) : null}
                            <div className="flex-grow pl-4">
                              <span className="text-sm lg:text-base font-semibold break-all">{file.filename}</span>
                            </div>
                            <IoClose
                              onClick={e => {
                                handleFileRemove(index);
                                e.stopPropagation();
                              }}
                              className="text-red-600 w-6 h-6 cursor-pointer"
                            />
                          </li>
                        ))}
                      </ul>
                      {progress > 0 ? <LinearProgressWithLabel progress={progress} /> : null}
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
                                name="inHandDate"
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
                        <FormControlCheckbox
                          name="textNotification"
                          label="I agree to receive text notifications about my order, including updates and special offers. Message and data rates may apply. I understand that this consent is not required to make a purchase. I can opt out at any time by replying 'STOP' or emailing info@printsyou.com"
                          disabled={isSubmitting}
                          control={control}
                          isRequired={false}
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
                <div className="flex flex-col justify-center w-full items-center my-8">
                  <h2 className="my-4 font-bold text-3xl text-primary">Your Cart is Empty!</h2>
                  <div className=" text-xl">Looks like you have not added any items to your cart yet.</div>
                  <div className="my-4">
                    <Link href="/" className="underline text-blue-500">
                      Shop more...
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </form>
        </ReactQueryClientProvider>

        <SuccessModal
          open={isSuccessModalOpen}
          onClose={() => {
            if (isSuccessModalOpen === 'success') {
              router.push('/');
            }
            setIsSuccessModalOpen('');
            setApiError(false);
          }}
          title="Thank you for placing an order with PrintsYou!"
          htmlNote={`<p>If you submit a request during our business hours (Monday to Friday, 9 AM - 5 PM CST), you'll hear back from a sales associate within 24 hours. Requests placed outside of these hours will be processed the next business day.</p>
<br/>
<p>To complete your order, we need your artwork. If it wasn't attached to your request, simply reply to the email with your artwork. A sales associate will review it and send a digital proof along with your order confirmation.</p>
<br/>
<p>Once you approve the artwork and sales confirmation, we'll send an invoice and a secure payment link. Complete the payment, and your order will move to production quickly.</p>
<br/>
<p>Feel free to reach out with any questions during the process.</p>`}
        />
      </Container>
    </>
  );
};
