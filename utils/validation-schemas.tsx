import {boolean, InferType, number, object, ref, string} from 'yup';

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
  location: string().notRequired(),
  minQty: number().optional()
});

export type NewsletterFormSchemaType = InferType<typeof newsletterSchema>;
export type ContactUsFormSchemaType = InferType<typeof contactUsSchema>;
export type OrderFormSchemaType = InferType<typeof orderCheckoutSchema>;
export type OrderNowFormSchemaType = InferType<typeof orderNowSchema>;
