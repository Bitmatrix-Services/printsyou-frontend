'use client';
import React, {useState} from 'react';
import {AiOutlineMail} from 'react-icons/ai';
import {Container} from '@components/globals/container.component';
import {Breadcrumb} from '@components/globals/breadcrumb.component';
import {SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useMutation} from '@tanstack/react-query';
import axios from 'axios';
import {ContactUsRoutes} from '@utils/routes/be-routes';
import {SuccessModal} from '@components/globals/success-modal.component';
import {ContactUsFormSchemaType, contactUsSchema} from '@utils/validation-schemas';
import {FormControlInput} from '@lib/form/form-control-input';
import {CircularLoader} from '@components/globals/circular-loader.component';
import {ReactQueryClientProvider} from '../app/query-client-provider';

export const ContactUsComponent = () => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<'success' | 'error' | ''>('');

  const {
    control,
    reset,
    handleSubmit,
    formState: {errors, isSubmitting}
  } = useForm<ContactUsFormSchemaType>({
    resolver: yupResolver(contactUsSchema),
    defaultValues: {
      fullName: '',
      emailAddress: '',
      phoneNumber: '',
      subject: '',
      message: ''
    }
  });

  const {mutate} = useMutation({
    mutationFn: (data: ContactUsFormSchemaType) => {
      return axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}${ContactUsRoutes.contactUs}`, data);
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

  return (
    <>
      <Breadcrumb list={[]} prefixTitle="Contact Us" />
      <Container>
        <div className="flex md:flex-row lg:flex-row my-6 md:gap-8 lg:gap-x-32 flex-col-reverse gap-y-4">
          <div className="sm:w-full md:w-[18rem] lg:w-[18rem] h-[22rem] p-6 gap-8 border-2">
            {/*<div className="grid gap-y-4">*/}
            {/*  <div className="flex gap-2 items-center capitalize">*/}
            {/*    <div className="bg-contactButtonColor p-2 rounded-full">*/}
            {/*      <IoCallOutline className="text-white" />*/}
            {/*    </div>*/}
            {/*    <h2 className="font-medium">Call to us</h2>*/}
            {/*  </div>*/}
            {/*  <p className="text-sm">We are available 24/7, 7 days a week.</p>*/}
            {/*  <h3 className="text-sm">Phone: +00000000000</h3>*/}
            {/*</div>*/}

            <div className="text-mute border-t border my-6" />

            <div className="grid gap-y-4">
              <div className="flex gap-2 items-center">
                <div className="bg-contactButtonColor p-2 rounded-full">
                  <AiOutlineMail className="text-white" />
                </div>
                <h2 className="font-medium">Write to us</h2>
              </div>
              <p className="text-sm">Fill out our form and we will contact you within 24 hours.</p>
              <h3 className="text-sm">
                Email: <b>info@printsyou.com</b>
              </h3>
              <h3 className="text-sm">
                Hours of Operations: <b>Monday to Friday / 8:00 AM - 5:00 PM CST</b>
              </h3>
            </div>
          </div>

          <div className="flex flex-col w-full lg:w-auto gap-y-5">
            <div className="text-center capitalize">
              <h1 className="text-2xl font-semibold">Get in touch with us</h1>
              <p className="text-sm mt-2 text-mute2 text-center">
                We’re here to help! Whether you have questions about our products, need assistance with an order, or
                just want to say hello, feel free to reach out. Your satisfaction is our top priority!
              </p>
            </div>
            <ReactQueryClientProvider>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-y-6 mt-7 border-2 p-6">
                  <FormControlInput
                    label="Your Name"
                    name="fullName"
                    isRequired={true}
                    disabled={isSubmitting}
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
                  <FormControlInput
                    label="Phone Number"
                    name="phoneNumber"
                    disabled={isSubmitting}
                    control={control}
                    errors={errors}
                  />
                  <FormControlInput
                    label="Subject"
                    name="subject"
                    isRequired={true}
                    disabled={isSubmitting}
                    control={control}
                    errors={errors}
                  />
                  <FormControlInput
                    label="Message"
                    name="message"
                    isRequired={true}
                    disabled={isSubmitting}
                    control={control}
                    inputType="textarea"
                    errors={errors}
                  />

                  <div className="my-6">
                    <button className="rounded-[4px] py-2 px-14 text-white font-normal bg-primary-500">
                      {isSubmitting ? <CircularLoader /> : 'Submit'}
                    </button>
                  </div>
                </div>
              </form>
            </ReactQueryClientProvider>
          </div>
        </div>
      </Container>
      <SuccessModal
        open={isSuccessModalOpen}
        onClose={setIsSuccessModalOpen}
        title={'Thank You for Reaching Out!'}
        note={`Thank you for subscribing to our newsletter! We're excited to have you with us.`}
      />
    </>
  );
};
