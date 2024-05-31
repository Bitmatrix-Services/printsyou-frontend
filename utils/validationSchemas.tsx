import * as Yup from 'yup';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const ContactUsSchema = Yup.object({
  fullName: Yup.string().required('Please enter your Name'),
  emailAddress: Yup.string().email().required('Please enter your Email'),
  phoneNumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
  subject: Yup.string().required('Please enter Subject'),
  message: Yup.string().required('Please enter Message')
});

export const orderRequestSchema = Yup.object({
  billingFullName: Yup.string().required('Please enter name'),
  billingAddressLineOne: Yup.string().required('Please enter address'),
  billingCity: Yup.string().required('Please enter city'),
  billingState: Yup.string().required('Please enter state'),
  billingZipcode: Yup.number()
    .typeError('Zip code must be a number')
    .required('Please enter zip code'),
  billingPhoneNumber: Yup.string()
    .required('Please enter phone number')
    .matches(phoneRegExp, 'invalid format'),
  billingEmailAddress: Yup.string().email().required('Please enter email'),
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
    then: schema =>
      schema
        .required('Please enter phone number')
        .matches(phoneRegExp, 'invalid format')
  }),
  specificationsColor: Yup.string().required('Please enter color'),
  specificationsSize: Yup.string(),
  specificationsImprintColor: Yup.string(),

  termsAndConditions: Yup.boolean().oneOf([true], 'You must agree to the terms')
});

export const EmailSchema = Yup.object({
  email: Yup.string().email().required('please enter your email')
});

export const orderCheckoutSchema = Yup.object().shape({
  billingAddress: Yup.object().shape({
    fullname: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(25, 'Name must be at most 25 characters')
      .required('Please enter your Name'),
    addressLineOne: Yup.string().required('Please enter your address'),
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
    addressLineOne: Yup.string().when('diffBillingAddress', {
      is: true,
      then: schema => schema.required('Please enter address')
    }),
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
      then: schema =>
        schema
          .required('Please enter phone number')
          .matches(phoneRegExp, 'invalid format')
    })
  }),

  emailAddress: Yup.string()
    .email('Email is not valid')
    .required('Please enter your email'),
  termsAndConditions: Yup.boolean().oneOf([true], 'You must agree to the terms')
});
