import React, {FC, Fragment} from 'react';
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

interface OrderRequest {
  product: Product;
}

const OrderRequest: FC<OrderRequest> = ({product}) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      company: '',
      address: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      email: '',
      color: '',
      size: '',
      imprintColor: '',
      itemColor: '',
      salesRep: '',
      additionalInfo: '',
      sameBillingAddress: true,
      diffBillingAddress: false,
      billingName: '',
      billingCompany: '',
      billingAddress: '',
      billingAddress2: '',
      billingCity: '',
      billingState: '',
      billingZip: '',
      billingPhone: '',
      newsLetter: false,
      agreeToTerms: false
    },
    validationSchema: orderRequestSchema,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: (values, action) => {
      console.log('Form values', values);
      action.resetForm();
    }
  });

  console.log('product', product);

  return (
    <Fragment>
      <PageHeader pageTitle="Order Request" />
      <Container>
        <div className="xs:flex md:grid md:grid-cols-2 space-x-16">
          <div className="mt-4 ">
            <h3 className="text-2xl mb-6 sm:text-xl md:text-xl font-bold capitalize">
              {product?.prefix} {product?.productName}
            </h3>

            <h6 className="mb-3 text-sm font-semibold text-body">
              ITEM#: <span className="text-primary-500">{product?.sku}</span>
            </h6>

            <div className="mt-4 p-4 w-full bg-greyLight rounded-xl">
              <ul className="text-xs text-mute3 font-bold product-card__categories">
                {product?.additionalRows &&
                  [...product.additionalRows]
                    ?.sort((a, b) => a.sequenceNumber - b.sequenceNumber)
                    .map(row => (
                      <li key={row.id}>
                        <span className="pt-[2px] block">
                          Please add{' '}
                          <span className="text-red-500">${row.priceDiff}</span>{' '}
                          {row.name}
                        </span>
                      </li>
                    ))}
              </ul>
            </div>
          </div>
        </div>
        <hr className="mt-12 border border-[#eceef1]" />
        <form onSubmit={formik.handleSubmit}>
          <div className="xs:flex md:grid md:grid-cols-2 space-x-16">
            <div>
              <FormHeading text="Billing Information" />
              <div className="flex justify-between space-x-4  mt-6 ">
                <div className="w-[100%]">
                  <FormInput
                    type="text"
                    name="name"
                    placeHolder="Name"
                    formik={formik}
                  />
                </div>
                <div className="w-[100%]">
                  <FormInput
                    type="text"
                    name="company"
                    placeHolder="Company"
                    formik={formik}
                  />
                </div>
              </div>

              <div className="flex justify-between space-x-4 mt-6">
                <FormInput
                  type="text"
                  name="address"
                  placeHolder="Address"
                  formik={formik}
                />
              </div>

              <div className="flex justify-between space-x-4 mt-6">
                <FormInput
                  type="text"
                  name="address2"
                  placeHolder="Address 2"
                  formik={formik}
                />
              </div>

              <div className="flex justify-between space-x-4 mt-6">
                <div className="w-[100%] ">
                  <FormInput
                    type="text"
                    name="city"
                    placeHolder="City"
                    formik={formik}
                  />
                </div>
                <div className="w-[100%] ">
                  <FormInput
                    type="text"
                    name="state"
                    placeHolder="State"
                    formik={formik}
                  />
                </div>
              </div>

              <div className="flex justify-between space-x-4 mt-6">
                <div className="w-[100%] ">
                  <FormInput
                    type="text"
                    name="zip"
                    placeHolder="Zip Code"
                    formik={formik}
                  />
                </div>
                <div className="w-[100%] ">
                  <FormInput
                    type="text"
                    name="phone"
                    placeHolder="Phone"
                    formik={formik}
                  />
                </div>
              </div>

              <div className="flex justify-between space-x-4 mt-6">
                <div className="w-[100%] ">
                  <FormInput
                    type="text"
                    name="email"
                    tooltip="Please type the email address you would like us to use for all correspondance for the order process.  This will be where your sales confirmation and artwork proof will be sent to."
                    placeHolder="Email"
                    formik={formik}
                  />
                </div>
                <div className="w-[100%] "></div>
              </div>
              <FormHeading text="Shipping Information" />
              <div className="flex justify-between space-x-4 mt-6">
                <div className="w-[100%] ">
                  <input
                    type="checkbox"
                    id="sameBillingAddress"
                    name="sameBillingAddress"
                    className="accent-[#f8ab11] rounded-none"
                    checked={formik.values.sameBillingAddress}
                    onChange={e => {
                      formik.setFieldValue('diffBillingAddress', false);
                      if (e.target.checked) formik.handleChange(e);
                    }}
                  />
                  <label className="ml-2" htmlFor="sameBillingAddress">
                    Same as my billing address
                  </label>
                </div>
                <div className="w-[100%] ">
                  <input
                    type="checkbox"
                    id="diffBillingAddress"
                    name="diffBillingAddress"
                    className="accent-[#f8ab11] rounded-none"
                    checked={formik.values.diffBillingAddress}
                    onChange={e => {
                      formik.setFieldValue('sameBillingAddress', false);
                      if (e.target.checked) formik.handleChange(e);
                    }}
                  />
                  <label className="ml-2" htmlFor="diffBillingAddress">
                    Different shipping address
                  </label>
                </div>
              </div>

              {formik.values.diffBillingAddress && (
                <>
                  <div className="flex justify-between space-x-4  mt-6 ">
                    <div className="w-[100%]">
                      <FormInput
                        type="text"
                        name="billingName"
                        placeHolder="Name"
                        formik={formik}
                      />
                    </div>
                    <div className="w-[100%]">
                      <FormInput
                        type="text"
                        name="billingCompany"
                        placeHolder="Company"
                        formik={formik}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between space-x-4 mt-6">
                    <FormInput
                      type="text"
                      name="billingAddress"
                      placeHolder="Address"
                      formik={formik}
                    />
                  </div>

                  <div className="flex justify-between space-x-4 mt-6">
                    <FormInput
                      type="text"
                      name="billingAddress2"
                      placeHolder="Address 2"
                      formik={formik}
                    />
                  </div>

                  <div className="flex justify-between space-x-4 mt-6">
                    <div className="w-[100%] ">
                      <FormInput
                        type="text"
                        name="billingCity"
                        placeHolder="City"
                        formik={formik}
                      />
                    </div>
                    <div className="w-[100%] ">
                      <FormInput
                        type="text"
                        name="billingState"
                        placeHolder="State"
                        formik={formik}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between space-x-4 mt-6">
                    <div className="w-[100%] ">
                      <FormInput
                        type="text"
                        name="billingZip"
                        placeHolder="Zip Code"
                        formik={formik}
                      />
                    </div>
                    <div className="w-[100%] ">
                      <FormInput
                        type="text"
                        name="billingPhone"
                        placeHolder="Phone"
                        formik={formik}
                      />
                    </div>
                  </div>
                </>
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
              <div className="flex justify-between space-x-4  mt-6 ">
                <div className="w-[100%]">
                  <FormInput
                    type="text"
                    name="color"
                    placeHolder="Color"
                    formik={formik}
                  />
                </div>
                <div className="w-[100%]">
                  <FormInput
                    type="text"
                    name="size"
                    placeHolder="Size"
                    formik={formik}
                  />
                </div>
              </div>

              <div className="flex justify-between space-x-4 mt-6">
                <FormInput
                  type="text"
                  name="imprintColor"
                  placeHolder="Imprint Color"
                  formik={formik}
                />
              </div>
              <FormHeading text="Artwork files" />
              <FormDescription
                textArray={[
                  `Click the "Add Files" button to locate the artwork on your computer. Your artwork will automatically begin to upload. We can accept any artwork format you send us. However, we prefer vector format. This is usually .ai or .eps`,
                  `We will send a digital artwork proof for approval once the order is received.`
                ]}
              />
              <div className="w-fit flex py-5 px-10 text-sm font-bold  bg-[#58beaa] hover:bg-primary-500 text-white">
                <span className="bg-[#49c8ae] text-center">
                  <Image
                    height={15}
                    width={15}
                    src="/assets/icon-upload-white.png"
                    alt="..."
                  />
                </span>
                <span className="">ADD FILES...</span>
              </div>
              <FormHeading text="Additional Information" />
              <div className="flex justify-between space-x-4  mt-6 ">
                <div className="w-[100%]">
                  <FormInput
                    type="date"
                    name="deliveryDate"
                    placeHolder="Delivery Date"
                    formik={formik}
                  />
                </div>
                <div className="w-[100%]">
                  <FormInput
                    type="text"
                    name="salesRep"
                    placeHolder="Sales Rep"
                    formik={formik}
                  />
                </div>
              </div>

              <div className="flex justify-between space-x-4 mt-6">
                <FormInput
                  inputType="textarea"
                  type="text"
                  name="additionalInfo"
                  placeHolder="Additional Information"
                  formik={formik}
                />
              </div>
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
                  className="accent-[#f8ab11] rounded-none"
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
                  className="accent-[#f8ab11] rounded-none"
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
            <div className="mt-6">
              <button
                type="submit"
                className="w-fit flex py-5 px-32 text-sm font-bold  bg-primary-500 hover:bg-body text-white"
              >
                SUBMIT
              </button>
            </div>
          </div>
        </form>
      </Container>
    </Fragment>
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
