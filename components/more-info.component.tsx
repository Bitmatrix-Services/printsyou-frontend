'use client';
import React, {FC, useState} from 'react';
import {Container} from '@components/globals/container.component';
import {Breadcrumb} from '@components/globals/breadcrumb.component';
import {FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useMutation} from '@tanstack/react-query';
import axios from 'axios';
import {MoreInfoRoutes} from '@utils/routes/be-routes';
import {SuccessModal} from '@components/globals/success-modal.component';
import {ContactUsFormSchemaType, contactUsSchema} from '@utils/validation-schemas';
import {FormControlInput} from '@lib/form/form-control-input';
import {ReactQueryClientProvider} from '../app/query-client-provider';
import {Product} from '@components/home/product/product.types';
import {ImageWithFallback} from '@components/globals/Image-with-fallback';
import {CircularLoader} from '@components/globals/circular-loader.component';
import {notFound} from 'next/navigation';
import {MaskInput} from '@lib/form/mask-input.component';
import {UserInfoCapture} from '@components/user-info-capture';

interface IMoreInfoComponent {
  product: Product | null;
}

export const MoreInfoComponent: FC<IMoreInfoComponent> = ({product}) => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<'success' | 'error' | ''>('');

  const methods = useForm<ContactUsFormSchemaType>({
    resolver: yupResolver(contactUsSchema),
    defaultValues: {
      fullName: '',
      emailAddress: '',
      phoneNumber: '',
      subject: '',
      message: ''
    }
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: {errors, isSubmitting}
  } = methods;

  const {mutate} = useMutation({
    mutationFn: (data: ContactUsFormSchemaType) => {
      return axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}${MoreInfoRoutes.moreInfo}`, {
        ...data,
        productId: product?.id
      });
    },
    onSuccess: () => {
      setIsSuccessModalOpen('success');
      reset();
    },
    onError: () => {
      setIsSuccessModalOpen('error');
    }
  });

  const onSubmit: SubmitHandler<ContactUsFormSchemaType> = data => {
    mutate(data);
  };

  if (!product) notFound();

  return (
    <>
      <Breadcrumb list={[]} prefixTitle="Request More Info" />
      <Container>
        <div className="px-8 pb-8 pt-10 ">
          <div className="flex flex-col  md:px-32">
            <h2 className="text-xl font-semibold text-mute3">
              Have questions? Request more information about this product, We will get back to you promptly!
            </h2>
            <h2 className="text-2xl mt-3 mb-4 font-semibold capitalize">{product.productName}</h2>
            <h6 className="text-sm font-semibold text-body">
              ITEM#: <span className="text-primary-500">{product.sku}</span>
            </h6>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            <div className="flex flex-col md:flex-row pt-3 gap-8 justify-center">
              <div className="md:px-32 ">
                <div className="order-first ">
                  <div className="md:pt-2 flex justify-center relative">
                    <ImageWithFallback
                      width={400}
                      height={100}
                      className="object-contain "
                      src={product?.productImages?.[0]?.imageUrl}
                      alt="product"
                    />
                  </div>
                </div>
                {product?.additionalRows.length > 0 && (
                  <div className="mt-2 p-4 w-full bg-[#f6f7f8] rounded-xl">
                    <ul className="text-xs text-mute3">
                      {[...product.additionalRows]
                        ?.sort((a, b) => a.sequenceNumber - b.sequenceNumber)
                        .map(row => (
                          <li key={row.id}>
                            <span className="pt-[2px] block">
                              <span className="text-mute3 font-base">{row.name}</span>
                              <span className="text-primary-500 ml-2 font-semibold">${row.priceDiff.toFixed(2)}</span>
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="pt-[2rem]">
              <ReactQueryClientProvider>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <UserInfoCapture emailField="emailAddress" nameField="fullName" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <FormControlInput
                        label="Your Name"
                        name="fullName"
                        disabled={isSubmitting}
                        isRequired={true}
                        control={control}
                        errors={errors}
                      />
                      <FormControlInput
                        label="Email Address"
                        name="emailAddress"
                        isRequired={true}
                        disabled={isSubmitting}
                        control={control}
                        errors={errors}
                      />
                      <MaskInput
                        label="Phone Number"
                        name="phoneNumber"
                        isRequired={false}
                        disabled={isSubmitting}
                        control={control}
                        errors={errors}
                      />

                      <FormControlInput
                        label="Subject"
                        name="subject"
                        isRequired={false}
                        disabled={isSubmitting}
                        control={control}
                        errors={errors}
                      />

                      <div className=" sm:col-span-2">
                        <FormControlInput
                          label="Message"
                          name="message"
                          isRequired={true}
                          disabled={isSubmitting}
                          control={control}
                          inputType="textarea"
                          errors={errors}
                        />
                      </div>
                      <div>
                        <button className="rounded-[4px] py-2 px-14 text-white font-normal bg-primary-500">
                          {isSubmitting ? <CircularLoader /> : 'Submit'}
                        </button>
                      </div>
                    </div>
                  </form>
                </FormProvider>
              </ReactQueryClientProvider>
            </div>
          </div>
        </div>
      </Container>
      <SuccessModal
        open={isSuccessModalOpen}
        onClose={setIsSuccessModalOpen}
        title="Thank You for Reaching Out!"
        note={`Thank you for taking interest! Our team will review your query and get back to you shortly.`}
      />
    </>
  );
};
