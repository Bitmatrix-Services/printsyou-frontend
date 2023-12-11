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

  agreeToTerms: Yup.boolean().oneOf([true], 'You must agree to the terms')
});
