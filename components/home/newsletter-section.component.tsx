'use client';
import {Container} from '@components/globals/container.component';
import {Button, Stack} from '@mui/joy';
import Input from '@mui/joy/Input';
import {FaArrowRight} from 'react-icons/fa';
import {yupResolver} from '@hookform/resolvers/yup';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {ReactQueryClientProvider} from '../../app/query-client-provider';
import {useMutation} from '@tanstack/react-query';
import axios from 'axios';
import {NewsletterRoutes} from '@utils/routes/be-routes';
import {SuccessModal} from '@components/globals/success-modal.component';
import React, {useState} from 'react';
import {NewsletterFormSchemaType, newsletterSchema} from '@utils/validation-schemas';
import {CircularLoader} from '@components/globals/circular-loader.component';

export const Newsletter = () => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<'success' | 'error' | ''>('');

  const {
    control,
    reset,
    handleSubmit,
    formState: {errors, isSubmitting}
  } = useForm<NewsletterFormSchemaType>({
    resolver: yupResolver(newsletterSchema),
    defaultValues: {email: ''}
  });

  const {mutate} = useMutation({
    mutationFn: (data: NewsletterFormSchemaType) => {
      return axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}${NewsletterRoutes.subscribe}`, data);
    },
    onSuccess: () => {
      setIsSuccessModalOpen('success');
      reset();
    },
    onError: error => {
      setIsSuccessModalOpen('error');
    }
  });

  const onSubmit: SubmitHandler<NewsletterFormSchemaType> = data => {
    mutate(data);
  };

  return (
    <div className="bg-lightGray py-4 mt-6">
      <Container>
        <div className="flex flex-col items-center justify-between gap-7 py-10 md:py-16 text-center">
          <h3 className="font-black text-2xl md:text-4xl lg:text-5xl xl:text-6xl">Create Your Masterpiece</h3>
          <h5 className="font-normal text-xl md:text-xl w-[23rem] md:w-[38rem]">
            Transform your vision into reality with our custom printing services. Anything you imagine, we can print.
          </h5>
          <h6 className="font-bold text-[15px]">Subscribe to Our Newsletter ...and receive latest offers</h6>
          <ReactQueryClientProvider>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack direction="row" spacing={0}>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({field: {onChange, value}}) => (
                    <Input
                      sx={{
                        borderRadius: '3px 0  0 3px',
                        borderColor: '#DB0481',
                        borderWidth: '3px',
                        '& input::placeholder': {
                          color: 'gray'
                        },
                        '&:focus': {
                          borderColor: '#DB0481'
                        }
                      }}
                      placeholder="Enter your email..."
                      variant="outlined"
                      disabled={isSubmitting}
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  sx={{
                    bgcolor: '#DB0481',
                    borderRadius: '0 3px 3px 0',
                    padding: '8px 16px',
                    color: '#fff',
                    '&:hover': {
                      bgcolor: '#DB0497D9'
                    }
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <CircularLoader /> : 'Subscribe'}
                  {!isSubmitting ? (
                    <span className="ml-2">
                      <FaArrowRight />
                    </span>
                  ) : null}
                </Button>
              </Stack>
              {errors.email?.message ? (
                <div className="flex justify-start mt-2">
                  <p className="text-red-600">{errors.email.message}</p>
                </div>
              ) : null}
            </form>
          </ReactQueryClientProvider>
        </div>
      </Container>
      <SuccessModal
        open={isSuccessModalOpen}
        onClose={setIsSuccessModalOpen}
        title="Thank You for Reaching Out!"
        note={`Thank you for subscribing to our newsletter! We're excited to have you with us.`}
      />
    </div>
  );
};
