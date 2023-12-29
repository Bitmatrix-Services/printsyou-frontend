import React, {FC, useEffect, useState} from 'react';
import Container from '@components/globals/Container';
import PageHeader from '@components/globals/PageHeader';
import {useFormik} from 'formik';
import {orderRequestSchema} from '@utils/validationSchemas';
import FormHeading from '@components/Form/FormHeading';
import FormDescription from '@components/Form/FormDescription';
import Image from 'next/image';
import FormInput from '@components/Form/FormInput';
import Link from 'next/link';
import {http} from 'services/axios.service';
import {GetServerSidePropsContext} from 'next';
import {Product} from '@store/slices/product/product';
import ImageWithFallback from '@components/ImageWithFallback';
import TootipBlack from '@components/globals/TootipBlack';
import {XMarkIcon} from '@heroicons/react/24/solid';
import {CircularProgress} from '@mui/material';
import {NextSeo} from 'next-seo';
import {metaConstants} from '@utils/Constants';
import sanitizeHtml from 'sanitize-html';

interface OrderRequest {
  product: Product;
}
interface ImageListProps {
  images: File[];
  handleFileRemove: (e: number) => void;
}

const shippingFormFields = [
  {name: 'shippingFullName', placeholder: 'Name*'},
  {name: 'shippingCompany', placeholder: 'Company'},
  {name: 'shippingAddressLineOne', placeholder: 'Address*'},
  {name: 'shippingAddressLineTwo', placeholder: 'Address 2'},
  {name: 'shippingCity', placeholder: 'City*'},
  {name: 'shippingState', placeholder: 'State*'},
  {name: 'shippingZipcode', placeholder: 'Zip Code*'},
  {name: 'shippingPhoneNumber', placeholder: 'Phone*'}
];

const OrderRequest: FC<OrderRequest> = ({product}) => {
  const [minQuantity, setMinQuantity] = useState<number>(0);
  const [salePriceToShow, setSalePriceToShow] = useState<number>(0);
  const [singleItemPrice, setSingleItemPrice] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [minQuantityError, setMinQuantityError] = useState<boolean>(true);
  const [artWorkFiles, setArtWorkFiles] = useState<globalThis.File[]>([]);
  const [apiError, setApiError] = useState<boolean>(false);

  const getInHandDateEst = () => {
    const currentDate = new Date();

    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(currentDate.getDate() + 7);

    return sevenDaysLater.toISOString().split('T')[0];
  };

  const formik = useFormik({
    initialValues: {
      billingFullName: '',
      billingCompany: '',
      billingAddressLineOne: '',
      billingAddressLineTwo: '',
      billingCity: '',
      billingState: '',
      billingZipcode: '',
      billingPhoneNumber: '',
      billingEmailAddress: '',
      specificationsColor: '',
      specificationsSize: '',
      specificationsImprintColor: '',
      saleRepName: '',
      quantityOrdered: 0,
      inHandDate: getInHandDateEst(),
      additionalInformation: '',
      shippingAddressSame: true,
      diffBillingAddress: false,
      shippingFullName: '',
      shippingCompany: '',
      shippingAddressLineOne: '',
      shippingAddressLineTwo: '',
      shippingCity: '',
      shippingState: '',
      shippingZipcode: '',
      shippingPhoneNumber: '',
      newsLetter: false,
      agreeToTerms: false
    },
    validationSchema: orderRequestSchema,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: async (values, action) => {
      try {
        if (values.newsLetter) {
          await http.post('/news-letter', {email: values.billingEmailAddress});
        }
      } catch (error) {
        console.log('error news letter', error);
      }

      try {
        if (minQuantityError) {
          window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
          return;
        }

        setApiError(false);

        let specifications = [
          {
            fieldName: 'Color',
            fieldValue: values.specificationsColor
          }
        ];

        if (values.specificationsSize) {
          specifications.push({
            fieldName: 'Size',
            fieldValue: values.specificationsSize
          });
        }
        if (values.specificationsImprintColor) {
          specifications.push({
            fieldName: 'ImprintColor',
            fieldValue: values.specificationsImprintColor
          });
        }

        let orderData: any = {
          ...values,
          specifications: specifications,
          productId: product.id
        };

        delete orderData.specificationsColor;
        delete orderData.specificationsSize;
        delete orderData.specificationsImprintColor;

        // exclude shipping address details in case of same shipping address
        if (orderData.shippingAddressSame) {
          delete orderData.shippingFullName;
          delete orderData.shippingCompany;
          delete orderData.shippingAddressLineOne;
          delete orderData.shippingAddressLineTwo;
          delete orderData.shippingCity;
          delete orderData.shippingState;
          delete orderData.shippingZipcode;
          delete orderData.shippingPhoneNumber;
        }

        const formData = new FormData();

        Object.entries(orderData).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            formData.append(`specifications`, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        });

        if (artWorkFiles.length) {
          artWorkFiles.forEach((fileItem, index) =>
            formData.append(`artWorkFiles[${index}]`, fileItem)
          );
        }

        await http.post('/order', formData);
        setIsSubmitted(true);
        action.resetForm();
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
      } catch (error) {
        setApiError(true);
        console.log('error', error);
      }
    }
  });

  useEffect(() => {
    let firstOffer = [...product.priceGrids].sort(
      (a, b) => a.countFrom - b.countFrom
    )[0];

    if (firstOffer) {
      setMinQuantity(firstOffer.countFrom);
    }
  }, []);

  const calculatePrices = () => {
    const orderedQuantity = formik.values.quantityOrdered;

    if (orderedQuantity < minQuantity) {
      setMinQuantityError(true);
      return;
    } else {
      setMinQuantityError(false);
    }
    const sortedPriceGrid = [...product.priceGrids].sort(
      (a, b) => a.countFrom - b.countFrom
    );

    let priceRangeObject = sortedPriceGrid.find(
      item => orderedQuantity <= item.countFrom
    );

    const maxPriceRange = sortedPriceGrid[product.priceGrids.length - 1];

    const priceRange = priceRangeObject || maxPriceRange;

    const salePrice = parseFloat(
      (priceRange.price * orderedQuantity).toFixed(2)
    );

    setSalePriceToShow(salePrice);
    setSingleItemPrice(priceRange.price);
  };

  return (
    <>
      <NextSeo title={`Order | ${metaConstants.SITE_NAME}`} />
      <PageHeader pageTitle="Order Request" />
      <Container>
        {!isSubmitted ? (
          <>
            <div className="xs:flex md:grid md:grid-cols-2 mt-6 md:space-x-16">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative min-w-[10rem] h-40 w-40">
                  <ImageWithFallback
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                    className="object-contain"
                    src={product?.productImages?.[0]?.imageUrl}
                    alt="product"
                  />
                </div>
                <div>
                  <h3 className="text-2xl mb-6 sm:text-xl md:text-xl font-bold capitalize">
                    {product?.prefix}{' '}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(product?.productName ?? '', {
                          allowedTags: ['p', 'span', 'td', 'b'],
                          allowedAttributes: {
                            span: ['style'],
                            td: ['style']
                          }
                        })
                      }}
                    ></span>
                  </h3>

                  <h6 className="mb-3 text-sm font-semibold text-body">
                    ITEM#:{' '}
                    <span className="text-primary-500">{product?.sku}</span>
                  </h6>

                  <div className="mt-4 w-full bg-[#f6f7f8] p-3 rounded-xl">
                    <ul className="text-xs text-mute3 font-bold product-card__categories">
                      {product?.additionalRows &&
                        [...product.additionalRows]
                          ?.sort((a, b) => a.sequenceNumber - b.sequenceNumber)
                          .map(row => (
                            <li key={row.id}>
                              <span className="pt-[2px] block">
                                Please add{' '}
                                <span className="text-red-500">
                                  ${row.priceDiff.toFixed(2)}
                                </span>{' '}
                                {row.name}
                              </span>
                            </li>
                          ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex flex-wrap gap-2 justify-between items-center">
                  <div>
                    <FormHeading text="Quantity:" />
                    <div className="flex items-center">
                      <FormInput
                        type="number"
                        name="quantityOrdered"
                        placeHolder="Quantity"
                        formik={formik}
                        handleOnBlur={() => calculatePrices()}
                      />
                      <h4 className="ml-5">x ${singleItemPrice}</h4>
                    </div>
                  </div>
                  <div>
                    <div>
                      <FormHeading text="Sub Total:" />
                    </div>
                    <div>
                      {!minQuantityError ? (
                        <h2 className="text-primary-500 text-2xl font-bold">
                          ${salePriceToShow.toFixed(2)}
                        </h2>
                      ) : (
                        <h2 className="text-red-500 text-2xl font-bold">
                          Min Qty is {minQuantity}
                        </h2>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap justify-between items-center mt-4">
                  <div className="text-red-500 text-xs font-semibold mr-auto">
                    Min Qty is {minQuantity}
                  </div>
                  <div className="text-xs max-w-[25rem]">
                    *Final total including shipping and any additional charges
                    will be sent with the artwork proof after the order is
                    placed.
                  </div>
                </div>
              </div>
            </div>
            <hr className="mt-12 border border-[#eceef1]" />
            <form onSubmit={formik.handleSubmit}>
              <div className="xs:flex md:grid md:grid-cols-2 md:space-x-16">
                <div>
                  <FormHeading text="Billing Information" />
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormInput
                      type="text"
                      name="billingFullName"
                      placeHolder="Name*"
                      formik={formik}
                    />
                    <FormInput
                      type="text"
                      name="billingCompany"
                      placeHolder="Company"
                      formik={formik}
                    />

                    <div className="md:col-span-2">
                      <FormInput
                        type="text"
                        name="billingAddressLineOne"
                        placeHolder="Address*"
                        formik={formik}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <FormInput
                        type="text"
                        name="billingAddressLineTwo"
                        placeHolder="Address 2"
                        formik={formik}
                      />
                    </div>

                    <FormInput
                      type="text"
                      name="billingCity"
                      placeHolder="City*"
                      formik={formik}
                    />
                    <FormInput
                      type="text"
                      inputType="select"
                      name="billingState"
                      placeHolder="State*"
                      formik={formik}
                    />

                    <FormInput
                      type="text"
                      name="billingZipcode"
                      placeHolder="Zip Code*"
                      formik={formik}
                    />
                    <FormInput
                      type="text"
                      name="billingPhoneNumber"
                      placeHolder="Phone*"
                      formik={formik}
                    />

                    <TootipBlack title="Please type the email address you would like us to use for all correspondance for the order process.  This will be where your sales confirmation and artwork proof will be sent to.">
                      <FormInput
                        type="text"
                        name="billingEmailAddress"
                        placeHolder="Email*"
                        formik={formik}
                      />
                    </TootipBlack>
                  </div>
                  <FormHeading text="Shipping Information" />
                  <div className="flex flex-wrap justify-between gap-4 mt-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="shippingAddressSame"
                        name="shippingAddressSame"
                        className="accent-[#f8ab11] rounded-0 min-w-[1.25rem] h-5 w-5 mt-2 sm:mt-0"
                        checked={formik.values.shippingAddressSame}
                        onChange={e => {
                          formik.setFieldValue('diffBillingAddress', false);
                          if (e.target.checked) formik.handleChange(e);
                        }}
                      />
                      <label className="ml-2" htmlFor="shippingAddressSame">
                        Same as my billing address
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="diffBillingAddress"
                        name="diffBillingAddress"
                        className="accent-[#f8ab11] rounded-0 min-[1.25rem] h-5 w-5"
                        checked={formik.values.diffBillingAddress}
                        onChange={e => {
                          formik.setFieldValue('shippingAddressSame', false);
                          if (e.target.checked) formik.handleChange(e);
                        }}
                      />
                      <label className="ml-2" htmlFor="diffBillingAddress">
                        Different shipping address
                      </label>
                    </div>
                  </div>

                  {formik.values.diffBillingAddress && (
                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                      {shippingFormFields.map(field => (
                        <FormInput
                          key={field.name}
                          type="text"
                          inputType={
                            field.name === 'shippingState' ? 'select' : ''
                          }
                          name={field.name}
                          placeHolder={field.placeholder}
                          formik={formik}
                        />
                      ))}
                    </div>
                  )}
                  <FormHeading text="Payment Information" />
                  <FormDescription
                    textArray={[
                      'After submitting your order, Identity Links will follow up with any questions, a confirmation, and an artwork proof. The confirmation will include shipping charges, any applicable taxes, and any additional charges that may be required based on your artwork.',
                      'You have nothing to worry about by submitting your order. The order is not firm until your artwork proof along with the pricing breakdown has been approved and we begin production. The order may be canceled any time before that.',
                      "We do not request payment until we receive approvals, so if you're nervous about placing your order with us, don't be . There will be plenty of communication before we begin production"
                    ]}
                  />
                </div>

                {/* 2nd column */}
                <div>
                  <FormHeading text="Product Details" />
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <TootipBlack title="Please type the color/s of the item you are ordering.  If the item does not have a color code, or it is a full color item, you may enter N/A.">
                      <FormInput
                        type="text"
                        name="specificationsColor"
                        placeHolder="Item Colors*"
                        formik={formik}
                      />
                    </TootipBlack>
                    <TootipBlack title="If the item has different sizes, please enter the size/s that you are ordering.  If the item only comes in one size, you may leave this field blank.">
                      <FormInput
                        type="text"
                        name="specificationsSize"
                        placeHolder="Size"
                        formik={formik}
                      />
                    </TootipBlack>

                    <TootipBlack title="This is not a mandatory field.  If the item has different sizes, please enter the size/s that you are ordering.  If the item only comes in one size, you may leave this field blank">
                      <FormInput
                        type="text"
                        name="specificationsImprintColor"
                        placeHolder="Imprint Color"
                        formik={formik}
                      />
                    </TootipBlack>
                  </div>
                  <FormHeading text="Artwork files" />
                  <FormDescription
                    textArray={[
                      `Click the "Add Files" button to locate the artwork on your computer. Your artwork will automatically begin to upload. We can accept any artwork format you send us. However, we prefer vector format. This is usually .ai or .eps`,
                      `We will send a digital artwork proof for approval once the order is received.`
                    ]}
                  />
                  <label className="w-fit flex group text-sm font-bold bg-[rgb(88,190,170)] hover:bg-primary-500 text-white cursor-pointer">
                    <span className="group-hover:bg-primary-600 bg-[#49c8ae] text-center px-5 py-5 ">
                      <Image
                        height={15}
                        width={15}
                        src="/assets/icon-upload-white.png"
                        alt="file upload"
                      />
                      <input
                        type="file"
                        accept="image/jpeg, image/png"
                        className="hidden"
                        multiple
                        onChange={e => {
                          if (e.target.files?.length) {
                            const fileToUpload = e.target.files[0];
                            setArtWorkFiles(prevState => [
                              ...prevState,
                              fileToUpload
                            ]);
                            e.target.files = null;
                          }
                        }}
                      />
                    </span>
                    <span className="pr-5 pl-3 py-5">ADD FILES...</span>
                  </label>
                  {artWorkFiles.length > 0 && (
                    <ImageList
                      images={artWorkFiles}
                      handleFileRemove={index => {
                        const updatedFiles = artWorkFiles?.filter(
                          (_: File, itemIndex: number) => index !== itemIndex
                        );
                        setArtWorkFiles(updatedFiles);
                      }}
                    />
                  )}
                  <FormHeading text="Additional Information" />
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <TootipBlack title="Use this field to let us know the date you need the order in your hands.   If you do not have a deadline, you may leave this blank.">
                      <FormInput
                        type="date"
                        name="inHandDate"
                        placeHolder="Delivery Date"
                        formik={formik}
                      />
                    </TootipBlack>
                    <TootipBlack title="If there was an Identity Links sales rep who helped you with the order, you may enter their name here.  If not, you may leave this field blank.">
                      <FormInput
                        type="text"
                        name="saleRepName"
                        placeHolder="Sales Rep"
                        formik={formik}
                      />
                    </TootipBlack>
                    <div className="md:col-span-2">
                      <TootipBlack title="Use this field to let us know any additional information you may have in regards to your order.  This includes any drop ship instructions, any added verbage you would like added to the imprint, or any other information you think may be important for us to process your order">
                        <FormInput
                          inputType="textarea"
                          type="text"
                          name="additionalInformation"
                          placeHolder="Additional Information"
                          formik={formik}
                        />
                      </TootipBlack>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="mt-12 border border-[#eceef1]" />
              {apiError && (
                <div className="text-red-500 text-end">
                  something went wrong. please try again!
                </div>
              )}
              <div className="flex flex-wrap gap-3 justify-between">
                <div>
                  <div className="flex items-start sm:items-center space-x-4 mt-6">
                    <input
                      type="checkbox"
                      id="newsLetter"
                      name="newsLetter"
                      className="accent-[#f8ab11] rounded-0 min-w-[1.25rem] h-5 w-5 mt-2 sm:mt-0"
                      checked={formik.values.newsLetter}
                      onChange={formik.handleChange}
                    />
                    <label className="ml-2" htmlFor="newsLetter">
                      Be up to date with our promotions, sign up for our email
                      newsletters now.
                    </label>
                  </div>
                  <div className="flex items-start sm:items-center space-x-4 mt-6">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      className="accent-[#f8ab11] rounded-0 min-w-[1.25rem] h-5 w-5 mt-2 sm:mt-0"
                      checked={formik.values.agreeToTerms}
                      onChange={formik.handleChange}
                    />
                    <label className="ml-2" htmlFor="agreeToTerms">
                      I have Read & Agree To Identity-Links{' '}
                      <Link
                        href="/artwork/all"
                        target="blank"
                        className="text-blue-500"
                      >
                        Terms and Conditions
                      </Link>
                    </label>
                  </div>
                  {formik.touched['agreeToTerms'] &&
                  formik.errors['agreeToTerms'] ? (
                    <p className="text-red-500">
                      {formik.errors['agreeToTerms']}
                    </p>
                  ) : null}
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-fit flex py-5 px-32 text-sm font-bold  bg-primary-500 hover:bg-body text-white"
                  >
                    {formik.isSubmitting ? (
                      <CircularProgress color="inherit" />
                    ) : (
                      'SUBMIT'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-col mt-6 mb-16">
            <h3 className="text-xl font-bold">
              Thank you for placing an order with Identity Links!{' '}
            </h3>
            <div className="pt-4 space-y-4">
              <p>
                If you have placed your order during our regular business hours,
                Monday through Friday from 8 AM to 5 PM CST, you can expect to
                receive a response from one of our dedicated sales associates
                within one hour. Orders placed outside of our regular business
                hours will be processed on the next business day.
              </p>

              <p>
                All orders require artwork to be processed. If you did not
                attach the artwork with your order request, you can simply email
                your artwork to{' '}
                <Link
                  className="text-blue-500"
                  href="mailto:info@identity-links.com"
                >
                  info@identity-links.com
                </Link>
                . One of our sales associates will review your artwork and
                create a digital proof so that you can see how your logo/message
                will look on the product. This will be sent along with a sales
                confirmation of your order.
              </p>

              <p>
                Your order will not be finalized until you have approved the
                artwork and sales order confirmation. Once you have approved
                both, we will email you a credit card authorization form. Simply
                fill it out and email/fax it back to us at your convenience. The
                sooner you complete all of these steps the faster we can place
                your order and begin production of your promotional products.
              </p>

              <p>
                Please do not hesitate to contact us with any questions that you
                have during the order process by email or toll-free at
                888-282-9507.
              </p>
            </div>

            <p className="pt-12">Thank you,</p>
            <span className="mt-0">Identity Links Sales Team</span>
          </div>
        )}
      </Container>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const productId = context.query.item_id;

  const {data} = await http.get(`product/${productId}`);
  const product = data.payload;

  return {props: {product}};
};

export default OrderRequest;

const ImageList: FC<ImageListProps> = React.memo(
  ({images, handleFileRemove}) => {
    return (
      <ul className="mt-6">
        {images?.map((image, index) => (
          <li
            key={index}
            className="flex justify-between items-center border w-full h-14 pl-4 pr-6 rounded-0 focus:outline-none"
          >
            <div className="h-12 w-12 min-w-[7rem] relative">
              <Image
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                fill
                className="object-contain"
                src={URL.createObjectURL(image)}
                alt={image.name}
              />
            </div>
            <div className="text-blue-500 overflow-hidden max-w-xs truncate border p-4">
              {image?.name}
            </div>
            <div>{Math.ceil(image?.size / 1024).toFixed(1)} KB</div>
            <XMarkIcon
              className="h-5 w-5 cursor-pointer"
              onClick={() => handleFileRemove(index)}
            />
          </li>
        ))}
      </ul>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.images === nextProps.images;
  }
);

ImageList.displayName = 'ImageList';
