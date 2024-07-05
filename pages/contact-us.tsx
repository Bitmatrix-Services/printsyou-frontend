import React, {useState} from 'react';
import PageHeader from '@components/globals/PageHeader';
import Container from '@components/globals/Container';
import {useFormik} from 'formik';
import {ContactUsSchema} from '@utils/validationSchemas';
import FormInput from '@components/Form/FormInput';
import {NextSeo} from 'next-seo';
import {metaConstants} from '@utils/Constants';
import {http} from 'services/axios.service';
import {DocumentCheckIcon} from '@heroicons/react/24/outline';
import {CircularLoader} from '@components/globals/CircularLoader';

function ContactUs() {
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
    //// By disabling validation onChange and onBlur formik will validate on submit.
    onSubmit: async (values, action) => {
      try {
        setApiError(false);
        await http.post('/contact_us', values);
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
      <NextSeo title={`Contact Us | ${metaConstants.SITE_NAME}`} />
      <PageHeader pageTitle="Contact Us" />
      <Container>
        {!isSubmitted ? (
          <div className="xs:flex md:grid md:grid-cols-4 py-8 md:py-16">
            <div></div>
            <form onSubmit={formik.handleSubmit} className="col-span-2">
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
            {/*<iframe*/}
            {/*  className="custom-map w-full h-full pl-6"*/}
            {/*  src=""*/}
            {/*/>*/}
          </div>
        ) : (
          <div className="flex flex-col space-y-4 mt-6 mb-16">
            <h3 className="text-xl font-bold">Thank You For Contacting Us!</h3>
            <h6>
              An PrintsYou sales rep will be contacting you shortly to answer
              any questions and to provide more information.
            </h6>
            <h6>
              If you need immediate assistance, you may contact us at
              info@printsyou.com
            </h6>
          </div>
        )}
      </Container>
    </>
  );
}

export default ContactUs;
