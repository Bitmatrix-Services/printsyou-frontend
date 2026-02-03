import {array, boolean, InferType, number, object, ref, string} from 'yup';

export const contactUsSchema = object({
  fullName: string().required('Please enter your name'),
  emailAddress: string().email().required('Please enter your email address'),
  phoneNumber: string().nullable(),
  subject: string().nullable(),
  message: string().required('Please enter message')
});

export const newsletterSchema = object({
  email: string().email().required('please enter your email address')
});

export const orderCheckoutSchema = object({
  billingAddress: object({
    fullname: string()
      .min(2, 'Name must be at least 2 characters')
      .max(25, 'Name must be at most 25 characters')
      .required('Please enter your Name'),
    company: string().optional(),
    addressLineOne: string().required('Please enter your address'),
    addressLineTwo: string().optional(),
    city: string().required('Please enter city'),
    state: string().required('Please enter state'),
    zipCode: string().required('Please enter zip code'),
    phoneNumber: string().nullable()
  }),

  shippingAddress: object({
    shippingAddressSame: boolean().default(true).required(),
    fullname: string().when('shippingAddressSame', {
      is: false,
      then: schema => schema.required('Please enter name'),
      otherwise: schema => schema.nullable()
    }),
    company: string().optional(),
    addressLineOne: string().when('shippingAddressSame', {
      is: false,
      then: schema => schema.required('Please enter address'),
      otherwise: schema => schema.nullable()
    }),
    addressLineTwo: string().optional(),
    city: string().when('shippingAddressSame', {
      is: false,
      then: schema => schema.required('Please enter city'),
      otherwise: schema => schema.nullable()
    }),
    state: string().when('shippingAddressSame', {
      is: false,
      then: schema => schema.required('Please enter state')
      // otherwise: schema => schema.nullable()
    }),
    zipCode: string().when('shippingAddressSame', {
      is: false,
      then: schema => schema.required('Please enter zip code'),
      otherwise: schema => schema.nullable()
    }),
    phoneNumber: string().nullable()
  }),

  inHandDate: string().optional(),
  salesRep: string().optional(),
  additionalInformation: string().optional(),
  newsLetter: boolean().optional(),
  emailAddress: string().email('Email is not valid').required('Please enter your email address'),
  termsAndConditions: boolean().oneOf([true], 'You must agree to the terms')
});

export const orderNowSchema = object({
  billingAddress: object({
    fullname: string()
      .min(2, 'Name must be at least 2 characters')
      .max(25, 'Name must be at most 25 characters')
      .required('Please enter your Name'),
    company: string().optional(),
    addressLineOne: string().required('Please enter your address'),
    addressLineTwo: string().optional(),
    city: string().required('Please enter city'),
    state: string().required('Please enter state'),
    zipCode: string().required('Please enter zip code'),
    phoneNumber: string().nullable()
  }),

  inHandDate: string().optional(),
  salesRep: string().optional(),
  additionalInformation: string().optional(),
  newsLetter: boolean().optional(),
  emailAddress: string().email('Email is not valid').required('Please enter your email address'),
  termsAndConditions: boolean().oneOf([true], 'You must agree to the our terms and conditions'),

  imprintColor: string().notRequired(),
  itemColor: string().notRequired(),
  size: string().notRequired(),
  itemQty: number()
    .transform((_, value) => (value === '' ? 0 : +value))
    .required()
    .positive()
    .min(ref('minQty'), 'Quantity must be greater than or equal to minimum quantity'),
  selectedPriceType: string().notRequired(),
  location: array().notRequired(),
  minQty: number().optional()
});

export const quoteRequestSchema = object({
  fullName: string().required('Please enter your name'),
  emailAddress: string().email('Please enter a valid email').required('Please enter your email address'),
  phoneNumber: string().nullable(),
  companyName: string().nullable(),
  productCategory: string().nullable(),
  quantity: number()
    .transform((_, value) => (value === '' || value === undefined || value === null ? undefined : +value))
    .min(1, 'Quantity must be at least 1')
    .nullable(),
  notes: string().nullable(),
  needByDate: string().nullable(),
  source: string().nullable(),
  sourceUrl: string().nullable()
});

export const stripeCheckoutSchema = object({
  email: string().email('Please enter a valid email').required('Please enter your email address'),
  firstName: string()
    .min(1, 'First name is required')
    .max(50, 'First name must be at most 50 characters')
    .required('Please enter your first name'),
  lastName: string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be at most 50 characters')
    .required('Please enter your last name'),
  phone: string().nullable(),
  company: string().nullable(),
  address: string().required('Please enter your address'),
  addressLine2: string().nullable(),
  city: string().required('Please enter city'),
  state: string().required('Please select state'),
  zipCode: string().required('Please enter zip code'),
  specialInstructions: string().nullable(),
  termsAndConditions: boolean().oneOf([true], 'You must agree to the terms and conditions')
});

export const shippingAddressSchema = object({
  phoneNumber: string().required('Please enter your phone number'),
  shippingAddressLine1: string().required('Please enter your street address'),
  shippingAddressLine2: string().nullable(),
  shippingCity: string().required('Please enter your city'),
  shippingState: string().required('Please select your state'),
  shippingZipCode: string().required('Please enter your zip code')
});

export type NewsletterFormSchemaType = InferType<typeof newsletterSchema>;
export type ContactUsFormSchemaType = InferType<typeof contactUsSchema>;
export type OrderFormSchemaType = InferType<typeof orderCheckoutSchema>;
export type OrderNowFormSchemaType = InferType<typeof orderNowSchema>;
export type QuoteRequestFormSchemaType = InferType<typeof quoteRequestSchema>;
export type StripeCheckoutFormSchemaType = InferType<typeof stripeCheckoutSchema>;
export type ShippingAddressFormSchemaType = InferType<typeof shippingAddressSchema>;
