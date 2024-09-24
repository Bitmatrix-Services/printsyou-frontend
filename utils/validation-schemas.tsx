import * as Yup from 'yup';
import {InferType} from 'yup';

const phoneRegExp = /^(?:\s*|\+?[1-9]{1,4}[-\s]?(\([0-9]{2,3}\)[-\s]?|[0-9]{2,4}[-\s]?)*[0-9]{3,4}[-\s]?[0-9]{3,4})$/;

export const contactUsSchema = Yup.object({
  fullName: Yup.string().required('Please enter your n'),
  emailAddress: Yup.string().email().required('Please enter your email address'),
  phoneNumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
  subject: Yup.string().required('Please enter subject'),
  message: Yup.string().required('Please enter message')
});

export const newsletterSchema = Yup.object({
  email: Yup.string().email().required('please enter your email address')
});

export const orderCheckoutSchema = Yup.object().shape({
  billingAddress: Yup.object().shape({
    fullname: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(25, 'Name must be at most 25 characters')
      .required('Please enter your Name'),
    company: Yup.string().optional(),
    addressLineOne: Yup.string().required('Please enter your address'),
    addressLineTwo: Yup.string().optional(),
    city: Yup.string().required('Please enter city'),
    state: Yup.string().required('Please enter state'),
    zipCode: Yup.string().required('Please enter zip code'),
    phoneNumber: Yup.string()
      .required('Please enter your phone number')
      .matches(phoneRegExp, 'Phone number is not valid')
  }),

  shippingAddress: Yup.object().shape({
    fullname: Yup.string().when('shippingAddressSame', {
      is: false,
      then: schema => schema.required('Please enter name'),
      otherwise: schema => schema.nullable()
    }),
    company: Yup.string().optional(),
    addressLineOne: Yup.string().when('shippingAddressSame', {
      is: false,
      then: schema => schema.required('Please enter address'),
      otherwise: schema => schema.nullable()
    }),
    addressLineTwo: Yup.string().optional(),
    city: Yup.string().when('shippingAddressSame', {
      is: false,
      then: schema => schema.required('Please enter city'),
      otherwise: schema => schema.nullable()
    }),
    state: Yup.string().when('shippingAddressSame', {
      is: false,
      then: schema => schema.required('Please enter state')
      // otherwise: schema => schema.nullable()
    }),
    zipCode: Yup.string().when('shippingAddressSame', {
      is: false,
      then: schema => schema.required('Please enter zip code'),
      otherwise: schema => schema.nullable()
    }),
    phoneNumber: Yup.string().when('shippingAddressSame', {
      is: false,
      then: schema => schema.required('Please enter phone number').matches(phoneRegExp, 'invalid format'),
      otherwise: schema => schema.nullable()
    })
  }),
  shippingAddressSame: Yup.boolean(),
  inHandDate: Yup.string().optional(),
  salesRep: Yup.string().optional(),
  additionalInformation: Yup.string().optional(),
  newsLetter: Yup.boolean().optional(),
  emailAddress: Yup.string().email('Email is not valid').required('Please enter your email address'),
  termsAndConditions: Yup.boolean().oneOf([true], 'You must agree to the terms')
});

export type NewsletterFormSchemaType = InferType<typeof newsletterSchema>;
export type ContactUsFormSchemaType = InferType<typeof contactUsSchema>;
export type OrderFormSchemaType = InferType<typeof orderCheckoutSchema>;
