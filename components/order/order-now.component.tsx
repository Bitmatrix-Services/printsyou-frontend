'use client';
import React, {ChangeEvent, FC, useEffect, useMemo, useState} from 'react';
import {notFound, useRouter} from 'next/navigation';
import axios, {AxiosResponse} from 'axios';
import {OrderNowFormSchemaType, orderNowSchema} from '@utils/validation-schemas';
import {ImageWithFallback} from '@components/globals/Image-with-fallback';
import {shippingFormFields, statesList} from '@utils/constants';
import {Radio, RadioGroup} from '@mui/joy';
import {IoClose} from 'react-icons/io5';
import {SuccessModal} from '@components/globals/success-modal.component';
import {Controller, FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useMutation} from '@tanstack/react-query';
import {FormControlInput} from '@lib/form/form-control-input';
import {Container} from '@components/globals/container.component';
import {FormControlCheckbox} from '@lib/form/form-control-checkbox';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {FormControlSelect} from '@lib/form/form-control-select';
import {CircularLoader} from '@components/globals/circular-loader.component';
import {Breadcrumb} from '@components/globals/breadcrumb.component';
import dayjs from 'dayjs';
import {FormDescription, FormHeading} from '@components/globals/cart/add-to-cart-modal.component';
import {MaskInput} from '@lib/form/mask-input.component';
import {Decoration, Locations, PriceGrids, Product} from '@components/home/product/product.types';
import {ReactQueryClientProvider} from '../../app/query-client-provider';
import Image from 'next/image';
import {LinearProgressWithLabel} from '@components/globals/linear-progress-with-label.component';
import {File as CartItemFile} from '../../store/slices/cart/cart';
import {CustomProduct, UploadedFileType} from '@components/globals/cart/cart-types';
import {v4 as uuidv4} from 'uuid';
import Option from '@mui/joy/Option';
import {MdOutlineFileDownload} from 'react-icons/md';
import {UserInfoCapture} from '@components/user-info-capture';
import {LoaderWithBackdrop} from '@components/globals/loader-with-backdrop.component';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ASSETS_SERVER_URL = process.env.ASSETS_SERVER_URL || 'https://printsyouassets.s3.amazonaws.com/';

interface IOrderNowComponentProps {
  selectedProduct: Product | null;
}

const allowedImageTypes = ['jpeg', 'png', 'webp', 'gif', 'avif', 'svg+xml'];

export const OrderNowComponent: FC<IOrderNowComponentProps> = ({selectedProduct}) => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<'success' | 'error' | ''>('');
  const [apiError, setApiError] = useState<boolean>(false);
  const [priceTypes, setPriceTypes] = useState<string[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [artWorkFiles, setArtWorkFiles] = useState<CartItemFile[]>([]);
  const [product, setProduct] = useState<CustomProduct>({
    id: '',
    sku: '',
    productName: '',
    priceGrids: [],
    sortedPrices: [],
    groupedByPricing: {},
    priceTypeExists: false
  });
  const [locations, setLocations] = useState<Locations[]>([]);
  const [availableDecorationTypes, setAvailableDecorationTypes] = useState<Decoration[]>([]);

  if (!selectedProduct) notFound();

  const getLocations = async () => {
    try {
      const {data} = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/fetchLocations/${selectedProduct.id}`
      );
      setLocations(data.payload);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getInHandDateEst = () => {
    const currentDay = new Date();
    return currentDay.toISOString().split('T')[0];
  };

  const methods = useForm<OrderNowFormSchemaType>({
    resolver: yupResolver(orderNowSchema),
    defaultValues: {
      billingAddress: {
        fullname: '',
        company: '',
        addressLineOne: '',
        addressLineTwo: '',
        city: '',
        state: 'NONE',
        zipCode: '',
        phoneNumber: ''
      },
      shippingAddress: {
        fullname: '',
        company: '',
        addressLineOne: '',
        addressLineTwo: '',
        city: '',
        state: 'NONE',
        zipCode: '',
        phoneNumber: '',
        shippingAddressSame: true
      },
      emailAddress: '',
      inHandDate: getInHandDateEst(),
      salesRep: '',
      additionalInformation: '',
      newsLetter: false,
      termsAndConditions: false,
      itemQty: 0,
      imprintColor: undefined,
      itemColor: undefined,
      size: undefined,
      selectedPriceType: null,
      location: null,
      minQty: 0
    }
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: {errors, isSubmitting},
    watch,
    setValue,
    trigger,
    getValues
  } = methods;

  useEffect(() => {
    const strings: string[] = [];
    product.priceGrids.forEach(item => {
      if (strings.indexOf(item.priceType) === -1 && item.priceType !== null && item.priceType !== '') {
        strings.push(item.priceType);
      }
    });
    setPriceTypes(strings);
    if (availableDecorationTypes) {
      setValue('selectedPriceType', availableDecorationTypes[0]?.name);
    } else if (strings.length > 0) {
      setValue('selectedPriceType', strings[0]);
    }
    if (locations?.length > 0 && !watch('location')) {
      setValue('location', locations[0]?.id);
    }
  }, [product.priceGrids, selectedProduct, locations]);

  useEffect(() => {
    if (!locations?.length) return;

    const selectedLocation = locations.find(item => item.id === getValues('location'));
    setAvailableDecorationTypes(
      selectedLocation?.decorations.sort((a, b) => a.name.localeCompare(b.name)) ??
        locations[0].decorations.sort((a, b) => a.name.localeCompare(b.name))
    );
  }, [watch('location'), locations]);

  useEffect(() => {
    if (selectedProduct) {
      getLocations();

      // adding a new item to the cart
      const priceTypeExists = selectedProduct.priceGrids.some((item: {priceType: any}) => item.priceType);
      const priceTypesGroups: Record<string, PriceGrids[]> = {};
      if (priceTypeExists) {
        selectedProduct.priceGrids.forEach((item: PriceGrids) => {
          if (!(item.priceType in priceTypesGroups)) {
            priceTypesGroups[item.priceType] = [];
          }
          priceTypesGroups[item.priceType].push(item);
        });

        Object.keys(priceTypesGroups).forEach(itemKey => {
          priceTypesGroups[itemKey] = priceTypesGroups[itemKey].sort((a, b) => a.countFrom - b.countFrom);
        });
      }

      const productState = {
        id: selectedProduct.id,
        sku: selectedProduct.sku,
        productName: selectedProduct.productName,
        priceGrids: selectedProduct.priceGrids,
        sortedPrices: [...selectedProduct.priceGrids].sort((a, b) => a.countFrom - b.countFrom),
        groupedByPricing: priceTypesGroups,
        priceTypeExists
      };
      setProduct(productState);
      setValue('minQty', productState.sortedPrices[0].countFrom);
    }
  }, [selectedProduct]);

  const {mutate} = useMutation({
    mutationFn: async (data: OrderNowFormSchemaType) => {
      setLoading(true);
      window.scrollTo({
        top: window.innerHeight / 2,
        left: 0,
        behavior: 'smooth'
      });

      const cartId = getCartId();
      setApiError(false);

      const cartData = {
        productId: product.id,
        qtyRequested: data.itemQty,
        priceType: data.selectedPriceType,
        specs: [
          {
            fieldName: 'Item Color',
            fieldValue: data.itemColor
          },
          {
            fieldName: 'Imprint Colors',
            fieldValue: data.imprintColor
          },
          {
            fieldName: 'Size',
            fieldValue: data.size
          }
        ],
        files: artWorkFiles
      };
      cartData.specs = cartData.specs
        .filter(spec => spec.fieldValue !== '' && spec.fieldValue !== null && spec.fieldValue !== undefined)
        .map(spec => ({
          fieldName: spec.fieldName,
          fieldValue: spec.fieldValue
        }));

      // add to cart first
      await axios
        .post(`${API_BASE_URL}/cart/add?cartId=${cartId}`, cartData)
        .then((_: AxiosResponse) => {})
        .catch(() => {});

      // creating order
      let orderData: any = {
        ...data,
        shippingAddressSame: data.shippingAddress.shippingAddressSame,
        cartId: cartId
      };
      delete orderData.newsLetter;
      delete orderData.shippingAddress.shippingAddressSame;
      delete orderData.termsAndConditions;
      delete orderData.itemQty;
      delete orderData.imprintColor;
      delete orderData.itemColor;
      delete orderData.size;
      delete orderData.selectedPriceType;
      delete orderData.minQty;

      //@ts-ignore
      gtag_report_conversion('https://printsyou.com/order-now');

      return axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/create-order`, orderData);
    },
    onSuccess: () => {
      setTimeout(() => {
        setLoading(false);
        setIsSuccessModalOpen('success');
        localStorage.removeItem('orderId');
        reset();
      }, 2000);
    },
    onError: () => {
      setTimeout(() => {
        setLoading(false);
        setIsSuccessModalOpen('error');
        setApiError(true);
      }, 2000);
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

  const onSubmit: SubmitHandler<OrderNowFormSchemaType> = data => {
    mutate(data);
  };

  const calculatedPrice = useMemo(() => {
    const quantity = getValues('itemQty');
    if (quantity === 0 || !product?.priceGrids || !product.sortedPrices) {
      return 0;
    }

    const priceGridsFinalSelected = product.priceTypeExists
      ? product.groupedByPricing[getValues('selectedPriceType') as string]
      : product.sortedPrices;

    const priceGrid = priceGridsFinalSelected.find(
      (grid, index) =>
        quantity >= grid.countFrom &&
        (index === priceGridsFinalSelected.length - 1 || quantity < priceGridsFinalSelected[index + 1].countFrom)
    );

    return priceGrid ? (priceGrid.salePrice > 0 ? priceGrid.salePrice : priceGrid.price) : 0;
  }, [watch('itemQty'), watch('selectedPriceType'), priceTypes]);

  const setupFee = useMemo(() => {
    const selectedPriceType = getValues('selectedPriceType');
    const setupCharge = availableDecorationTypes
      .find(item => item.name === selectedPriceType)
      ?.charges?.find(charge => charge.type === 'SETUP');

    return setupCharge?.chargePrices?.[0]?.price || 0;
  }, [watch('itemQty'), watch('selectedPriceType'), watch('location')]);

  const getCartId = () => {
    let cartId;
    try {
      cartId = localStorage.getItem('orderId');
      if (!cartId) {
        cartId = uuidv4();
        localStorage.setItem('orderId', cartId);
      }
      return cartId;
    } catch (error) {}
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

  return (
    <>
      <Breadcrumb list={[]} prefixTitle="Order Now" />
      <Container>
        <div className="pt-8"></div>

        <LoaderWithBackdrop loading={loading} />

        <ReactQueryClientProvider>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit, handleFormError)}>
              <UserInfoCapture emailField="emailAddress" nameField="billingAddress.fullName" />
              <div
                className={
                  'flex-col grid tablet:grid-cols-1 md:grid-cols-2 lg:flex-row w-full justify-between py-0 gap-6 lg:gap-20'
                }
              >
                {/* mobile only view */}
                <div className="tablet:block md:hidden block p-4 border-2">
                  <div>
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
                          src={
                            selectedProduct?.productImages.sort((a, b) => a.sequenceNumber - b.sequenceNumber)[0]
                              .imageUrl
                          }
                          alt="Product"
                        />
                      </div>

                      <div className="ml-4 flex-grow">
                        <div className="text-black mb-2">
                          Item#:
                          <span className="text-primary">{product?.sku}</span>
                        </div>
                        <h3
                          className="text-sm lg:text-base font-semibold"
                          dangerouslySetInnerHTML={{
                            __html: product?.productName
                          }}
                        ></h3>
                      </div>
                    </div>

                    {selectedProduct.outOfStock ? (
                      <div className="flex justify-start items-center text-black">
                        Note: <span className="text-yellow-500 ml-1">This item is out of stock.</span>
                      </div>
                    ) : null}

                    <div className="hidden md:block">
                      {locations?.length > 0 ? <FormHeading text="Locations" /> : null}
                      <div className="flex items-center flex-wrap">
                        {locations?.length > 0 ? (
                          <>
                            <div className="flex justify-start items-center flex-wrap gap-4">
                              {locations.map(location => (
                                <div
                                  key={location.id}
                                  className={`px-3 py-2 cursor-pointer text-sm border rounded-md ${watch('location') === location.id ? 'border-green-400 bg-green-200' : 'border-gray-400 bg-gray-100'}`}
                                  onClick={() => {
                                    setValue('location', location.id);
                                  }}
                                >
                                  {location.locationName}
                                </div>
                              ))}
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>

                    <div>
                      <div className="hidden md:grid grid-cols-3">
                        <div className="col-span-2">
                          {availableDecorationTypes?.length > 0 ? (
                            <>
                              <FormHeading text="Decoration Types" />
                              <div className="flex justify-start items-center flex-wrap gap-6 mb-5">
                                {availableDecorationTypes.map(row => (
                                  <div
                                    key={row.id}
                                    className={`px-3 py-2 cursor-pointer text-sm border rounded-md ${watch('selectedPriceType') === row.name ? 'border-green-400 bg-green-200' : 'border-gray-400 bg-gray-100'}`}
                                    onClick={() => setValue('selectedPriceType', row.name)}
                                  >
                                    {row.name}
                                  </div>
                                ))}
                              </div>
                            </>
                          ) : null}

                          <div className="flex justify-between items-center gap-8">
                            <FormControlInput
                              fieldType="number"
                              name="itemQty"
                              label="Quantity"
                              isRequired={true}
                              disabled={isSubmitting}
                              control={control}
                              errors={errors}
                              onBlur={() => trigger('itemQty')}
                              onFocus={e => e.target.select()}
                            />
                          </div>
                        </div>

                        <div className="col-span-1">
                          <div className="flex flex-col">
                            <div className="flex justify-end">
                              <FormHeading text="Sub Total" />
                            </div>
                            {watch('itemQty') < product?.sortedPrices[0]?.countFrom ? (
                              <h2 className="text-red-500 text-lg lg:text-2xl font-bold flex justify-end items-center">
                                Min Qty is {product.sortedPrices[0].countFrom}
                              </h2>
                            ) : (
                              <h2 className="text-primary-500 text-2xl font-bold flex justify-end items-center">
                                $
                                {(getValues('itemQty') ? getValues('itemQty') * calculatedPrice + setupFee : 0).toFixed(
                                  2
                                )}
                              </h2>
                            )}
                          </div>
                        </div>
                      </div>

                      {/*  quantity pricing mobile view*/}

                      <div className="md:hidden">
                        {locations?.length > 0 ? <FormHeading text="Locations" /> : null}
                        <div className="flex items-center flex-wrap">
                          {locations?.length > 0 ? (
                            <>
                              <div className="flex justify-start items-center flex-wrap gap-4">
                                {locations.map(location => (
                                  <div
                                    key={location.id}
                                    className={`px-3 py-2 cursor-pointer text-sm border rounded-md ${watch('location') === location.id ? 'border-green-400 bg-green-200' : 'border-gray-400 bg-gray-100'}`}
                                    onClick={() => setValue('location', location.id)}
                                  >
                                    {location.locationName}
                                  </div>
                                ))}
                              </div>
                            </>
                          ) : null}
                        </div>
                      </div>

                      <div className="md:hidden">
                        {availableDecorationTypes?.length > 0 ? (
                          <>
                            <FormHeading text="Decoration Types" />
                            <div className="flex justify-start items-center flex-wrap gap-2">
                              {availableDecorationTypes.map(row => (
                                <div
                                  key={row.id}
                                  className={`px-3 py-2 cursor-pointer text-sm border rounded-md ${watch('selectedPriceType') === row.name ? 'border-green-400 bg-green-200' : 'border-gray-400 bg-gray-100'}`}
                                  onClick={() => setValue('selectedPriceType', row.name)}
                                >
                                  {row.name}
                                </div>
                              ))}
                            </div>
                          </>
                        ) : null}
                        <div className="flex my-3">
                          <FormControlInput
                            fieldType="number"
                            name="itemQty"
                            label="Quantity"
                            isRequired={true}
                            disabled={isSubmitting}
                            control={control}
                            errors={errors}
                            onBlur={() => trigger('itemQty')}
                            onFocus={e => e.target.select()}
                          />
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <h4 className="my-3 text-lg font-semibold capitalize ">Sub Total</h4>
                          <div className="">
                            {watch('itemQty') < product?.sortedPrices[0]?.countFrom ? (
                              <h5 className="text-red-500 text-lg lg:text-2xl font-bold">
                                Min Qty is {product?.sortedPrices[0].countFrom}
                              </h5>
                            ) : (
                              <h5 className="text-primary-500 text-2xl font-bold">
                                $
                                {(getValues('itemQty') ? getValues('itemQty') * calculatedPrice + setupFee : 0).toFixed(
                                  2
                                )}
                              </h5>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-2 justify-between mt-4">
                        <div className="text-xs">
                          *Final total including shipping and any additional charges will be sent with the artwork proof
                          after the order is placed.
                        </div>

                        <hr className="my-4 border border-black-100" />
                      </div>

                      <div>
                        <FormHeading text="Product Details" />
                        <div className="grid md:grid-cols-2 gap-6 ">
                          <div className="relative">
                            <FormControlInput
                              name="itemColor"
                              label="Item Color (optional)"
                              isRequired={false}
                              disabled={isSubmitting}
                              control={control}
                              errors={errors}
                            />
                          </div>
                          <div className="relative">
                            <FormControlInput
                              name="imprintColor"
                              label="Imprint Color (optional)"
                              isRequired={false}
                              disabled={isSubmitting}
                              control={control}
                              errors={errors}
                            />
                          </div>
                          <div className="relative">
                            <FormControlInput
                              name="size"
                              label="Size (optional)"
                              isRequired={false}
                              disabled={isSubmitting}
                              control={control}
                              errors={errors}
                            />
                          </div>
                        </div>
                      </div>
                      <FormHeading text="Artwork files" />
                      <FormDescription
                        textArray={[
                          `Click the "Add Files" button to locate the artwork on your computer. Your artwork will automatically begin to upload. We can accept any artwork format you send us. However, we prefer vector format. This is usually .ai or .eps`,
                          `We will send a digital artwork proof for approval once the order is received.`
                        ]}
                      />
                      <div>
                        <label
                          htmlFor="fileInput"
                          className="py-2 px-2 flex w-full lg:w-1/2 2xl:w-1/3 items-center justify-center cursor-pointer rounded-md border-2 border-primary-500 text-primary-500 hover:bg-primary-600 hover:text-white capitalize"
                        >
                          <input
                            id="fileInput"
                            type="file"
                            name="fileInput"
                            multiple
                            onChange={e => handleFileChange(e)}
                            hidden
                          />
                          Upload design <MdOutlineFileDownload className="w-6 h-6 ml-3" />
                        </label>
                      </div>
                      <ul>
                        {artWorkFiles.map((file, index) => (
                          <li key={file.fileKey} className="flex items-center pt-4 rounded-lg">
                            {allowedImageTypes.some(type => type === file.fileType) ? (
                              <div className="w-12 h-12 flex-shrink-0 overflow-hidden ">
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
                                state: 'NONE',
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
                      You have nothing to worry about by submitting your order. The order is not firm until your artwork
                      proof along with the pricing breakdown has been approved and we begin production. The order may be
                      canceled any time before that.
                    </li>
                    <li className=" text-[14px] mb-2">
                      {`We do not request payment until we receive approvals, so if you're nervous about placing your order with us, don't be . There will be plenty of communication before we begin production.`}
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col gap-3">
                  {/*  hidden on mobile screen */}
                  <div className="hidden tablet:hidden md:block p-4 border-2">
                    <div>
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
                            src={
                              selectedProduct?.productImages.sort((a, b) => a.sequenceNumber - b.sequenceNumber)[0]
                                .imageUrl
                            }
                            alt="Product"
                          />
                        </div>

                        <div className="ml-4 flex-grow">
                          <div className="text-black mb-2">
                            Item#:
                            <span className="text-primary">{product?.sku}</span>
                          </div>
                          <h3
                            className="text-sm lg:text-base font-semibold"
                            dangerouslySetInnerHTML={{
                              __html: product?.productName
                            }}
                          ></h3>
                        </div>
                      </div>

                      {selectedProduct.outOfStock ? (
                        <div className="flex justify-start items-center text-black">
                          Note: <span className="text-yellow-500 ml-1">This item is out of stock.</span>
                        </div>
                      ) : null}

                      <div>
                        {locations?.length > 0 ? <FormHeading text="Locations" /> : null}
                        <div className="flex items-center flex-wrap">
                          {locations.length > 0 ? (
                            <>
                              <div className="flex justify-start items-center flex-wrap gap-4">
                                {locations.map(location => (
                                  <div
                                    key={location.id}
                                    className={`px-3 py-2 cursor-pointer text-sm border rounded-md ${watch('location') === location.id ? 'border-green-400 bg-green-200' : 'border-gray-400 bg-gray-100'}`}
                                    onClick={() => setValue('location', location.id)}
                                  >
                                    {location.locationName}
                                  </div>
                                ))}
                              </div>
                            </>
                          ) : null}
                        </div>
                      </div>

                      <div>
                        <div className="hidden tablet:grid md:grid grid-cols-3">
                          <div className="col-span-2">
                            {availableDecorationTypes?.length > 0 ? (
                              <>
                                <FormHeading text="Decoration Types" />
                                <div className="flex justify-start items-center flex-wrap gap-4 mb-5">
                                  {availableDecorationTypes.map(row => (
                                    <div
                                      key={row.id}
                                      className={`px-3 py-2 cursor-pointer text-sm border rounded-md ${watch('selectedPriceType') === row.name ? 'border-green-400 bg-green-200' : 'border-gray-400 bg-gray-100'}`}
                                      onClick={() => setValue('selectedPriceType', row.name)}
                                    >
                                      {row.name}
                                    </div>
                                  ))}
                                </div>
                              </>
                            ) : null}

                            <div
                              className={`${priceTypes.length > 0 ? 'col-span-1 flex justify-between items-center gap-8' : 'grid col-span-2'} `}
                            >
                              <FormControlInput
                                fieldType="number"
                                name="itemQty"
                                label="Quantity"
                                isRequired={true}
                                disabled={isSubmitting}
                                control={control}
                                errors={errors}
                                onBlur={() => trigger('itemQty')}
                                onFocus={e => e.target.select()}
                              />
                            </div>
                          </div>

                          <div className="col-span-1">
                            <div className="flex flex-col">
                              <div className="flex justify-end">
                                <FormHeading text="Sub Total" />
                              </div>
                              {watch('itemQty') < product?.sortedPrices[0]?.countFrom ? (
                                <h2 className="text-red-500 text-lg lg:text-2xl text-end font-bold flex justify-end items-center">
                                  Min Qty is {product.sortedPrices[0].countFrom}
                                </h2>
                              ) : (
                                <h2 className="text-primary-500 text-2xl font-bold flex justify-end items-center">
                                  $
                                  {(getValues('itemQty')
                                    ? getValues('itemQty') * calculatedPrice + setupFee
                                    : 0
                                  ).toFixed(2)}
                                </h2>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-2 justify-between mt-4">
                          <div className="text-xs">
                            *Final total including shipping and any additional charges will be sent with the artwork
                            proof after the order is placed.
                          </div>

                          <hr className="my-4 border border-black-100" />
                        </div>

                        <div>
                          <FormHeading text="Product Details" />
                          <div className="grid md:grid-cols-2 gap-6 ">
                            <div className="relative">
                              <FormControlInput
                                name="itemColor"
                                label="Item Color (optional)"
                                isRequired={false}
                                disabled={isSubmitting}
                                control={control}
                                errors={errors}
                              />
                            </div>
                            <div className="relative">
                              <FormControlInput
                                name="imprintColor"
                                label="Imprint Color (optional)"
                                isRequired={false}
                                disabled={isSubmitting}
                                control={control}
                                errors={errors}
                              />
                            </div>
                            <div className="relative">
                              <FormControlInput
                                name="size"
                                label="Size (optional)"
                                isRequired={false}
                                disabled={isSubmitting}
                                control={control}
                                errors={errors}
                              />
                            </div>
                          </div>
                        </div>
                        <FormHeading text="Artwork files" />
                        <FormDescription
                          textArray={[
                            `Click the "Add Files" button to locate the artwork on your computer. Your artwork will automatically begin to upload. We can accept any artwork format you send us. However, we prefer vector format. This is usually .ai or .eps`,
                            `We will send a digital artwork proof for approval once the order is received.`
                          ]}
                        />
                        <div>
                          <label
                            htmlFor="fileInput"
                            className="py-2 px-2 flex w-full lg:w-1/2 2xl:w-1/3 items-center justify-center cursor-pointer rounded-md border-2 border-primary-500 text-primary-500  hover:bg-primary-600 hover:text-white capitalize"
                          >
                            <input
                              id="fileInput"
                              type="file"
                              name="fileInput"
                              multiple
                              onChange={e => handleFileChange(e)}
                              hidden
                            />
                            Upload design <MdOutlineFileDownload className="w-6 h-6 ml-3" />
                          </label>
                        </div>
                        <ul>
                          {artWorkFiles.map((file, index) => (
                            <li key={file.fileKey} className="flex items-center pt-4 rounded-lg">
                              {allowedImageTypes.some(type => type === file.fileType) ? (
                                <div className="w-12 h-12 flex-shrink-0 overflow-hidden ">
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
                              sx={{
                                borderRadius: '3px 3px  3px 3px',
                                borderColor: '#CDD7E1',
                                maxHeight: '10px',
                                '&:focus': {
                                  borderColor: '#019ce0'
                                }
                              }}
                              slotProps={{
                                textField: {
                                  sx: {
                                    '& .MuiInputBase-input': {
                                      height: '11px'
                                    }
                                  }
                                }
                              }}
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
                        name="textNotifications"
                        label={'I have read & agree to Text Notification Consent.'}
                        disabled={isSubmitting}
                        control={control}
                        linkUrl={'/text-consent'}
                        linkTitle={'Text Notification Consent'}
                      />
                      <FormControlCheckbox
                        name="termsAndConditions"
                        label="I have read & agree to PrintsYou terms and conditions."
                        isRequired={true}
                        disabled={isSubmitting}
                        control={control}
                        errors={errors}
                        linkUrl={'/terms-and-conditions'}
                        linkTitle={'Terms and Conditions'}
                      />
                    </div>
                    {apiError ? (
                      <div className="text-red-500 pt-4 text-center">Something went wrong, Please try again!</div>
                    ) : null}
                    <div className="my-6 flex w-full justify-center items-center">
                      <button
                        type="submit"
                        className={`w-full py-5 px-32 text-sm font-bold ${selectedProduct.outOfStock ? 'border-mute4 bg-mute4 pointer-events-none' : 'bg-primary hover:bg-primary-400'} text-white`}
                      >
                        {isSubmitting ? <CircularLoader /> : 'SUBMIT'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </FormProvider>
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
