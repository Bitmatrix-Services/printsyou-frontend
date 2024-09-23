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

export const orderRequestSchema = Yup.object({
  billingFullName: Yup.string().required('Please enter name'),
  billingAddressLineOne: Yup.string().required('Please enter address'),
  billingCity: Yup.string().required('Please enter city'),
  billingState: Yup.string().required('Please enter state'),
  billingZipcode: Yup.number().typeError('Zip code must be a number').required('Please enter zip code'),
  billingPhoneNumber: Yup.string().required('Please enter phone number').matches(phoneRegExp, 'invalid format'),
  billingEmailAddress: Yup.string().email().required('Please enter email address'),
  diffBillingAddress: Yup.boolean(),

  shippingFullName: Yup.string().when('diffBillingAddress', {
    is: true,
    then: schema => schema.required('Please enter name')
  }),
  shippingAddressLineOne: Yup.string().when('diffBillingAddress', {
    is: true,
    then: schema => schema.required('Please enter address')
  }),
  shippingCity: Yup.string().when('diffBillingAddress', {
    is: true,
    then: schema => schema.required('Please enter city')
  }),
  shippingState: Yup.string().when('diffBillingAddress', {
    is: true,
    then: schema => schema.required('Please enter state')
  }),
  shippingZipcode: Yup.string().when('diffBillingAddress', {
    is: true,
    then: schema => schema.required('Please enter zip code')
  }),
  shippingPhoneNumber: Yup.string().when('diffBillingAddress', {
    is: true,
    then: schema => schema.required('Please enter phone number').matches(phoneRegExp, 'invalid format')
  }),
  specificationsColor: Yup.string().required('Please enter color'),
  specificationsSize: Yup.string(),
  specificationsImprintColor: Yup.string(),

  termsAndConditions: Yup.boolean().oneOf([true], 'You must agree to the terms')
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
    fullname: Yup.string().when('diffBillingAddress', {
      is: true,
      then: schema => schema.required('Please enter name')
    }),
    company: Yup.string().optional(),
    addressLineOne: Yup.string().when('diffBillingAddress', {
      is: true,
      then: schema => schema.required('Please enter address')
    }),
    addressLineTwo: Yup.string().optional(),
    city: Yup.string().when('diffBillingAddress', {
      is: true,
      then: schema => schema.required('Please enter city')
    }),
    state: Yup.string().when('diffBillingAddress', {
      is: true,
      then: schema => schema.required('Please enter state')
    }),
    zipCode: Yup.string().when('diffBillingAddress', {
      is: true,
      then: schema => schema.required('Please enter zip code')
    }),
    phoneNumber: Yup.string().when('diffBillingAddress', {
      is: true,
      then: schema => schema.required('Please enter phone number').matches(phoneRegExp, 'invalid format')
    })
  }),
  shippingAddressSame: Yup.string(),
  diffBillingAddress: Yup.boolean().optional(),
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
