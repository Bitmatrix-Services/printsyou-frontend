import React, {FC, useState} from 'react';
import Container from '@components/globals/Container';
import FormInput from '@components/Form/FormInput';
import {useFormik} from 'formik';
import {ContactUsSchema} from '@utils/validationSchemas';
import {GetServerSidePropsContext} from 'next';
import {http} from 'services/axios.service';
import {Product} from '@store/slices/product/product';
import ImageWithFallback from '@components/ImageWithFallback';
import PageHeader from '@components/globals/PageHeader';
import {CircularProgress} from '@mui/material';
import {NextSeo} from 'next-seo';
import {metaConstants} from '@utils/Constants';

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
        <div className="px-8 pb-8 pt-10">
          {!isSubmitted ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              <div className="flex flex-col md:flex-row pt-3 gap-8 border-t-2 justify-center">
               
                <div className="md:px-32 pt-8">
                  <div className="mb-8">
                    <h3 className="text-3xl mt-5 mb-8  font-semibold capitalize">
                      {product.productName}
                    </h3>
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
              <div className="grid grid-cols-1">
                <div className="xs:flex md:grid ">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="w-full space-y-6">
                      <FormInput
                        type="text"
                        name="fullName"
                        placeHolder="Name*"
                        formik={formik}
                      />
                      <div className="flex flex-col md:flex-row justify-between md:space-x-4">
                        <FormInput
                          type="text"
                          name="emailAddress"
                          placeHolder="Email*"
                          formik={formik}
                        />
                        <FormInput
                          type="text"
                          name="phoneNumber"
                          placeHolder="Phone"
                          formik={formik}
                        />
                      </div>
                      <FormInput
                        type="text"
                        name="subject"
                        placeHolder="Subject*"
                        formik={formik}
                      />
                      <div className="my-6">
                        <FormInput
                          inputType="textarea"
                          type="text"
                          name="message"
                          placeHolder="Message*"
                          formik={formik}
                        />
                      </div>
                      {apiError && (
                        <div className="text-red-500">
                          something went wrong. please try again!
                        </div>
                      )}
                      <button
                        type="submit"
                        className={`w-fit mt-6 hidden md:block ${
                          formik.isSubmitting ? 'py-3' : 'py-5'
                        } px-[9rem] text-sm  font-bold  bg-primary-500 hover:bg-body text-white`}
                      >
                        {formik.isSubmitting ? (
                          <CircularProgress color="inherit" />
                        ) : (
                          'SUBMIT'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-4 mt-6 mb-16">
              <h3 className="text-xl font-bold">
                Thank You For Contacting Us!
              </h3>
              <h6>
                An Identity Links sales rep will be contacting you shortly to
                answer any questions and to provide more information.
              </h6>
              <h6>
                If you need immediate assistance, you may contact us toll free
                at 1-888-282-9507 (Monday-Friday, 8:00 AM - 5:00 PM, CST).
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
