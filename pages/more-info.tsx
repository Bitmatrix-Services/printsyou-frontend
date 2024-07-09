import React, {FC, useState} from 'react';
import Container from '@components/globals/Container';
import FormInput from '@components/Form/FormInput';
import {useFormik} from 'formik';
import {ContactUsSchema} from '@utils/validationSchemas';
import {GetServerSidePropsContext} from 'next';
import {http} from 'services/axios.service';
import {Product} from '@store/slices/product/product';
import ImageWithFallback from '@components/globals/ImageWithFallback';
import PageHeader from '@components/globals/PageHeader';
import {NextSeo} from 'next-seo';
import {metaConstants} from '@utils/Constants';
import {DocumentCheckIcon} from '@heroicons/react/24/outline';
import {CircularLoader} from '@components/globals/CircularLoader';

interface MoreInfoProps {
  product: Product;
}

const MoreInfo: FC<MoreInfoProps> = ({product}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiError, setApiError] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      fullName: '',
      emailAddress: '',
      phoneNumber: '',
      subject: '',
      message: ''
    },
    validationSchema: ContactUsSchema,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: async (values, action) => {
      try {
        setApiError(false);
        await http.post('/more-info', {...values, productId: product.id});
        setIsSubmitted(true);
        action.resetForm();
      } catch (error) {
        setApiError(true);
        console.log('error', error);
      }
    }
  });

  return (
    <>
      <NextSeo
        title={`Request Info | ${product.productName} | ${metaConstants.SITE_NAME}`}
      />
      <PageHeader pageTitle={'More Info'} />
      <Container>
        <div className="px-8 pb-8 pt-10 ">
          {!isSubmitted ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t-2 mt-10">
              <div className="flex flex-col md:flex-row pt-3 gap-8 justify-center">
                <div className="md:px-32 ">
                  <div className="mb-8">
                    <h2 className="text-2xl mt-5 mb-8  font-semibold capitalize">
                      {product.productName}
                    </h2>
                    <h6 className="text-sm font-semibold text-body">
                      ITEM#:{' '}
                      <span className="text-primary-500">{product.sku}</span>
                    </h6>
                  </div>
                  <div className="order-first ">
                    <div className="md:pt-2 flex ">
                      <ImageWithFallback
                        width={300}
                        height={100}
                        className="object-contain "
                        src={product?.productImages?.[0]?.imageUrl}
                        alt="product"
                      />
                    </div>
                  </div>
                  {product?.additionalRows.length > 0 && (
                    <div className="mt-2 p-4 w-full bg-[#f6f7f8] rounded-xl">
                      <ul className="text-xs text-mute3 font-bold product-card__categories">
                        {[...product.additionalRows]
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
                  )}
                </div>
              </div>
              <div className="pt-[2rem]">
                <form onSubmit={formik.handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <FormInput
                      type="text"
                      name="fullName"
                      required={true}
                      label="Name"
                      placeHolder="Name"
                      formik={formik}
                    />
                    <FormInput
                      type="text"
                      label="Email"
                      name="emailAddress"
                      required={true}
                      placeHolder="Email"
                      formik={formik}
                    />
                    <FormInput
                      type="text"
                      label="Phone Number"
                      name="phoneNumber"
                      placeHolder="Phone"
                      formik={formik}
                    />
                    <FormInput
                      type="text"
                      label="Subject"
                      name="subject"
                      required={true}
                      placeHolder="Subject"
                      formik={formik}
                    />
                    <div className=" sm:col-span-2">
                      <FormInput
                        inputType="textarea"
                        type="text"
                        label="Message"
                        required={true}
                        name="message"
                        placeHolder="Message"
                        formik={formik}
                      />
                    </div>
                    {apiError && (
                      <div className="text-red-500 sm:col-span-2">
                        something went wrong. please try again!
                      </div>
                    )}
                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        className={`w-full flex text-center justify-center items-center ${
                          formik.isSubmitting ? 'py-3' : 'py-5'
                        } px-[9rem] py-4 btn-primary`}
                      >
                        {!formik.isSubmitting ? (
                          <DocumentCheckIcon className="h-5 w-5 mr-2" />
                        ) : null}
                        {formik.isSubmitting ? <CircularLoader /> : 'SUBMIT'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-4 mt-6 mb-16">
              <h3 className="text-xl font-bold">
                Thank You For Contacting Us!
              </h3>
              <h6>
                A PrintsYou sales rep will be contacting you shortly to answer
                any questions and to provide more information.
              </h6>
              <h6>
                If you need immediate assistance, you may contact us at
                info@printsyou.com.
              </h6>
            </div>
          )}
        </div>
      </Container>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const productId = context.query?.item_id;

  const {data} = await http.get(`product/${productId}`);
  const product = data.payload;

  return {props: {product}};
};

export default MoreInfo;
