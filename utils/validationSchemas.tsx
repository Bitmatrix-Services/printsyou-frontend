import * as Yup from 'yup';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const ContactUsSchema = Yup.object({
  fullName: Yup.string().min(2).max(25).required('Please enter your Name'),
  emailAddress: Yup.string().email().required('Please enter your Email'),
  phoneNumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
  subject: Yup.string().min(5).max(55).required('Please enter Subject'),
  message: Yup.string().min(7).max(100).required('Please enter Message')
});

export const orderRequestSchema = Yup.object({
  name: Yup.string().min(2).max(25).required('Please enter your Name'),
  address: Yup.string().required('Please enter your Address'),
  city: Yup.string().required('Please enter City'),
  state: Yup.string().required('Please enter State'),
  zip: Yup.string().required('Please enter Zip Code'),
  phone: Yup.string()
    .required('Please enter Zip Code')
    .matches(phoneRegExp, 'Phone number is not valid'),
  email: Yup.string().email().required('Please enter your Email')
});
