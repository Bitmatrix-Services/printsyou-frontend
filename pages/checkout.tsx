import ImageWithFallback from '@components/ImageWithFallback';
import CartModal from '@components/globals/CartModal';
import {useAppDispatch, useAppSelector} from '@store/hooks';
import {
  removefromcart,
  setIsCartModalOpen
} from '@store/slices/cart/cart.slice';
import React, {FC, useState} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import FormInput from '@components/Form/FormInput';
import {useFormik} from 'formik';
import TootipBlack from '@components/globals/TootipBlack';
import FormHeading from '@components/Form/FormHeading';
import FormDescription from '@components/Form/FormDescription';
import {orderCheckoutSchema} from '@utils/validationSchemas';
import sanitizeHtml from 'sanitize-html';
import {useRouter} from 'next/router';
import {shippingFormFields} from '@utils/Constants';
import {CartItem} from '@store/slices/cart/cart';
import {http} from 'services/axios.service';

const Checkout: FC = () => {
  const cartItems = useAppSelector(state => state.cart.cartItems);
  const [openModalForItem, setOpenModalForItem] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const findProduct = cartItems.find(
    item => item.product.id === openModalForItem
  )?.product;
  const openModal = (productId: string) => {
    setOpenModalForItem(productId);
    dispatch(setIsCartModalOpen(true));
  };

  const calculateTotalCartPrice = () => {
    let totalPrice = 0;
    cartItems.forEach(item => {
      totalPrice += Number(item.totalPrice);
    });
    return totalPrice.toFixed(2);
  };

  const initialValues = {
    billingFullName: '',
    billingCompany: '',
    billingAddressLineOne: '',
    billingAddressLineTwo: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingPhoneNumber: '',
    billingEmailAddress: '',

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

    inHandDate: new Date(),
    saleRepName: '',
    additionalInformation: '',

    newsLetter: false,
    agreeToTerms: false
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: orderCheckoutSchema,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: async (values, action) => {
      try {
        // await http.post('/order', {...values, productId: product.id});
        console.log('values', {...values});
        setIsSubmitted(true);
        action.resetForm();
      } catch (error) {
        console.log('error', error);
      }
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

  const handleRemoveItem = async (item: CartItem) => {
    try {
     
      await http.put(`/cart/remove`, undefined, {
        params: {cartItemId: item.product.id, cartId: getCartId()}
      });
      dispatch(removefromcart({productId: item.product.id}));
    } catch {}
  };

  return (
    <div>
      <div className="px-8 lg:px-16 pt-8">
        <button
          className="block py-4 px-10 text-xs tracking-[3.5px] font-bold w-fit btn-outline-3"
          onClick={handleBackButtonClick}
        >
          Back Continue Shopping
        </button>
      </div>
      <div
        className={
          cartItems.length > 0
            ? ' flex-col grid md:grid-cols-2 lg:flex-row w-full justify-between px-8 lg:px-16 py-0 gap-6 lg:gap-4'
            : 'grid grid-cols-1 px-8 lg:px-16 py-0 gap-6 lg:gap-4'
        }
      >
        <div>
          {cartItems.length > 0 ? (
            <div className="px-4">
              <FormHeading text="Products in Cart" />
              {cartItems.map(item => (
                <div key={item.product.id}>
                  <div
                    onClick={() => openModal(item.product.id)}
                    className="cursor-pointer py-4"
                  >
                    <TootipBlack title="Modify Item in Cart">
                      <div className="text-black mb-2">
                        Item#:
                        <span className="text-yellow-500">
                          {item.product.sku}
                        </span>
                      </div>
                      <div className="flex items-center px-4 py-2 shadow-sm hover:bg-[#fbfbfb] hover:shadow-md transition-all duration-100">
                        <div>
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
                            src={item?.product.productImages?.[0]?.imageUrl}
                            alt="Product"
                          />
                        </div>

                        <div className="ml-4 flex-grow">
                          <h3
                            className="text-sm lg:text-base font-semibold"
                            dangerouslySetInnerHTML={{
                              __html: sanitizeHtml(item.product.productName)
                            }}
                          ></h3>
                          <div className="flex items-center justify-between mt-2 text-sm min-w-max">
                            <div className="flex items-center">
                              <span className="">
                                Qty: {item.itemsQuantity || 0}
                              </span>
                              <CloseIcon className="w-4 h-4" />
                              <span>${item.calculatePriceForQuantity}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="font-semibold mr-4 text-sm lg:text-base">
                            ${item.totalPrice}
                          </div>
                          <div
                            onClick={() => handleRemoveItem(item)}
                            className="text-red-500 cursor-pointer"
                          >
                            <CloseIcon className="w-6 h-6" />
                          </div>
                        </div>
                      </div>
                    </TootipBlack>
                  </div>
                </div>
              ))}
              <div>
                <hr className="border-t border-gray-300 my-4" />
                <div className="flex justify-between items-center px-2 py-2">
                  <h2 className="text-lg">Total Price:</h2>
                  <h2 className="text-lg font-bold">
                    ${calculateTotalCartPrice()}
                  </h2>
                </div>
                <div className="text-xs my-4">
                  *Final total including shipping and any additional charges
                  will be sent with the artwork proof after the order is placed.
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center w-full items-center my-8">
              <h1 className="my-4 font-bold text-3xl text-primary">
                No product Found!
              </h1>
            </div>
          )}
        </div>
        {/* Form */}
        {cartItems.length > 0 && (
          <div className="w-full px-4">
            <form onSubmit={formik.handleSubmit}>
              <FormHeading text="Billing Information" />
              <div className="grid md:grid-cols-2 gap-6">
                <FormInput
                  type="text"
                  name="billingFullName"
                  label="Name"
                  placeHolder="Name"
                  formik={formik}
                />
                <FormInput
                  type="text"
                  name="billingCompany"
                  label="Company"
                  placeHolder="Company"
                  formik={formik}
                />

                <div className="md:col-span-2">
                  <FormInput
                    type="text"
                    name="billingAddressLineOne"
                    label="Address"
                    placeHolder="Address"
                    formik={formik}
                  />
                </div>
                <div className="md:col-span-2">
                  <FormInput
                    type="text"
                    name="billingAddressLineTwo"
                    label="Address 2"
                    placeHolder="Address 2"
                    formik={formik}
                  />
                </div>

                <FormInput
                  type="text"
                  name="billingCity"
                  label="City"
                  placeHolder="City"
                  formik={formik}
                />
                <FormInput
                  type="text"
                  name="billingState"
                  label="State"
                  placeHolder="State"
                  formik={formik}
                />

                <FormInput
                  type="text"
                  name="billingZipCode"
                  label="Zip Code"
                  placeHolder="Zip Code"
                  formik={formik}
                />
                <FormInput
                  type="text"
                  name="billingPhoneNumber"
                  label="Phone"
                  placeHolder="Phone"
                  formik={formik}
                />

                <TootipBlack title="Please type the email address you would like us to use for all correspondance for the order process.  This will be where your sales confirmation and artwork proof will be sent to.">
                  <FormInput
                    type="text"
                    name="billingEmailAddress"
                    label="Email"
                    placeHolder="Email"
                    formik={formik}
                  />
                </TootipBlack>
              </div>
              <FormHeading text="Shipping Information" />
              <div className="flex justify-between space-x-4 mt-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="shippingAddressSame"
                    name="shippingAddressSame"
                    className="accent-[#f8ab11] rounded-0 min-w-[1.25rem] h-5 w-5"
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
                      name={field.name}
                      label={field.label}
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
              <FormHeading text="Additional Information" />
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <TootipBlack title="Use this field to let us know the date you need the order in your hands.   If you do not have a deadline, you may leave this blank.">
                  <FormInput
                    type="date"
                    name="inHandDate"
                    placeHolder="Delivery Date"
                    label="Delivery Date"
                    formik={formik}
                  />
                </TootipBlack>
                <TootipBlack title="If there was an Identity Links sales rep who helped you with the order, you may enter their name here.  If not, you may leave this field blank.">
                  <FormInput
                    type="text"
                    name="saleRepName"
                    placeHolder="Sales Rep"
                    label="Sales Rep"
                    formik={formik}
                  />
                </TootipBlack>
                <div className="md:col-span-2">
                  <TootipBlack title="Use this field to let us know any additional information you may have in regards to your order.  This includes any drop ship instructions, any added verbage you would like added to the imprint, or any other information you think may be important for us to process your order">
                    <FormInput
                      inputType="textarea"
                      type="text"
                      name="additionalInformation"
                      label="Additional Information"
                      placeHolder="Additional Information"
                      formik={formik}
                    />
                  </TootipBlack>
                </div>
              </div>
              <hr className="mt-12 border border-[#eceef1]" />
              <div className="flex justify-between">
                <div>
                  <div className="flex space-x-4 mt-6">
                    <input
                      type="checkbox"
                      id="newsLetter"
                      name="newsLetter"
                      className="accent-[#f8ab11] rounded-0"
                      checked={formik.values.newsLetter}
                      onChange={formik.handleChange}
                    />
                    <label className="ml-2" htmlFor="newsLetter">
                      Be up to date with our promotions, sign up for our email
                      newsletters now.
                    </label>
                  </div>
                  <div className="flex space-x-4 mt-6">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      className="accent-[#f8ab11] rounded-0"
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
                </div>
              </div>
              <div className="my-6 flex w-full justify-center items-center">
                <button
                  type="submit"
                  className="w-full py-5 px-32 text-sm font-bold  bg-primary-500 hover:bg-body text-white"
                >
                  SUBMIT
                </button>
              </div>
            </form>
          </div>
        )}

        {openModalForItem && findProduct && (
          <CartModal product={findProduct} addToCartText="Update" />
        )}
      </div>
    </div>
  );
};

export default Checkout;
