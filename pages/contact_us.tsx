import React, {useState} from 'react';
import PageHeader from '@components/globals/PageHeader';
import Container from '@components/globals/Container';
import {useFormik} from 'formik';
import {ContactUsSchema} from '@utils/validationSchemas';
import FormInput from '@components/Form/FormInput';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

function ContactUs() {
  const [isSubmitted, setIsSubmitted] = useState(false);

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
        await axios.post('/contact_us', values);
        setIsSubmitted(true);
        action.resetForm();
      } catch (error) {
        console.log('error', error);
      }
    }
  });
  return (
    <div>
      <PageHeader pageTitle="Contact Us" />
      <Container>
        {!isSubmitted ? (
          <div className="xs:flex md:grid md:grid-cols-2 pt-8">
            <form className="w-full pr-6" onSubmit={formik.handleSubmit}>
              <div className="w-full space-y-6">
                <FormInput
                  type="text"
                  name="fullName"
                  placeHolder="Full Name"
                  formik={formik}
                />
                <div className="flex flex-col md:flex-row justify-between md:space-x-4">
                  <FormInput
                    type="text"
                    name="emailAddress"
                    placeHolder="Email"
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
              </div>

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
            </form>
            <iframe
              className="custom-map w-full h-full pl-6"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2964.1479667071944!2d-87.78585458441495!3d42.018558064591296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880fc8d799d677fb%3A0xa65daeb86f4aae92!2sIdentity-Links%20-%20Promotional%20Products!5e0!3m2!1sen!2sus!4v1624371789928!5m2!1sen!2sus"
            />
          </div>
        ) : (
          <div className="flex flex-col space-y-4 mt-6 mb-16">
            <h3 className="text-xl font-bold">Thank You For Contacting Us!</h3>
            <h6>
              An Identity Links sales rep will be contacting you shortly to
              answer any questions and to provide more information.
            </h6>
            <h6>
              If you need immediate assistance, you may contact us toll free at
              1-888-282-9507 (Monday-Friday, 8:00 AM - 5:00 PM, CST).
            </h6>
          </div>
        )}
      </Container>
    </div>
  );
}

export default ContactUs;
