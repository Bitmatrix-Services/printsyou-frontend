import React, {FC} from 'react';
import Container from '@components/globals/Container';
import FormInput from '@components/Form/FormInput';
import {useFormik} from 'formik';
import {ContactUsSchema} from '@utils/validationSchemas';
import {GetServerSidePropsContext} from 'next';
import {http} from 'services/axios.service';
import {Product} from '@store/slices/product/product';
import ImageWithFallback from '@components/ImageWithFallback';
import PageHeader from '@components/globals/PageHeader';

interface MoreInfoProps {
  product: Product;
}

const MoreInfo: FC<MoreInfoProps> = ({product}) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    },
    validationSchema: ContactUsSchema,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: (values, action) => {
      console.log('Form values', values);
      action.resetForm();
    }
  });

  return (
    <>
      <Container>
        <div className="px-8 pb-8 pt-10">
          <PageHeader pageTitle={'More Info'} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            <div className="flex flex-col md:flex-row pt-3 gap-8 border-t-2">
              <div className="order-first ">
                <div className="md:pt-8 flex ">
                  <ImageWithFallback
                    width={156}
                    height={100}
                    className="object-contain "
                    src={
                      product?.productImages
                        ? `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${product?.productImages[0]?.imageUrl}`
                        : ''
                    }
                    fallbackSrc="/assets/logo.png"
                    alt="product"
                  />
                </div>
              </div>
              <div className=" pt-8">
                <div className="mb-8">
                  <h3 className="text-3xl mt-5 mb-8  font-semibold capitalize">
                    {product.productName}
                  </h3>
                  <h6 className="text-sm font-semibold text-body">
                    ITEM#:{' '}
                    <span className="text-primary-500">{product.sku}</span>
                  </h6>
                </div>

                <div className="mt-2 p-4 w-full bg-[#f6f7f8] rounded-xl">
                  <ul className="text-xs text-mute3 font-bold product-card__categories">
                    {product?.additionalRows &&
                      [...product.additionalRows]
                        ?.sort((a, b) => a.sequenceNumber - b.sequenceNumber)
                        .map(row => (
                          <li key={row.id}>
                            <span className="pt-[2px] block">
                              Please add{' '}
                              <span className="text-red-500">
                                ${row.priceDiff}
                              </span>{' '}
                              {row.name}
                            </span>
                          </li>
                        ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1">
              <div className="xs:flex md:grid ">
                <form onSubmit={formik.handleSubmit}>
                  <div className="w-full space-y-6">
                    <FormInput
                      type="text"
                      name="name"
                      placeHolder="Name"
                      formik={formik}
                    />
                    <div className="flex flex-col md:flex-row justify-between md:space-x-4">
                      <FormInput
                        type="text"
                        name="email"
                        placeHolder="Email"
                        formik={formik}
                      />
                      <FormInput
                        type="text"
                        name="phone"
                        placeHolder="Phone"
                        formik={formik}
                      />
                    </div>
                    <FormInput
                      type="text"
                      name="subject"
                      placeHolder="Subject"
                      formik={formik}
                    />
                    <div className="my-6">
                      <FormInput
                        inputType="textarea"
                        type="text"
                        name="message"
                        placeHolder="Message"
                        formik={formik}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-fit hidden md:block py-6 px-32 text-sm  font-bold  bg-primary-500 hover:bg-body text-white"
                    >
                      SUBMIT
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
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
