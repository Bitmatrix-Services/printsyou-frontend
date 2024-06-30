import React, {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import sanitizeHtml from 'sanitize-html';
import Container from './Container';
import {useAppSelector} from '@store/hooks';
import {selectCategoryList} from '@store/slices/category/catgory.slice';
import {http} from 'services/axios.service';
import {useFormik} from 'formik';
import {EmailSchema} from '@utils/validationSchemas';
import {CircularLoader} from '@components/globals/CircularLoader';

const quickLinks = [
  // {name: 'All Products', url: '/'},
  {name: 'About Us', url: '/about-us'},
  // {name: 'Testimonials', url: '/additional-information/testimonials'},
  {name: 'Contact Us', url: '/contact-us'},
  {name: 'Terms & Conditions', url: '/terms-and-conditions'}
];

const customerCareLink = [
  // {name: 'Artwork', url: '/additional-information/artwork'},
  {name: 'How To Order', url: '/how-to-order'}
  // {name: 'FAQs', url: '/faq'},
  // {name: 'Additional Information', url: '/additional-information/overview'}
];

export const social = [
  {
    name: 'Facebook',
    href: '#',
    icon: (
      props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
    ) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
          clipRule="evenodd"
        />
      </svg>
    )
  },
  {
    name: 'Instagram',
    href: '#',
    icon: (
      props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
    ) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
          clipRule="evenodd"
        />
      </svg>
    )
  },
  {
    name: 'X',
    href: '#',
    icon: (
      props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
    ) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
      </svg>
    )
  }
];

const Footer = () => {
  const categoryList = useAppSelector(selectCategoryList);
  const [emailError, setEmailError] = useState('');

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: EmailSchema,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: async (values, action) => {
      try {
        setEmailError('');
        await http.post('/news-letter', {email: values.email});
        action.resetForm();
      } catch (error) {
        setEmailError('something went wrong. please try again later');
      }
    }
  });

  return (
    <footer className="footer">
      <div className="bg-primary-500 py-6">
        <Container>
          <div className="flex flex-wrap items-center gap-6 xl:gap-12">
            <div className="flex items-center gap-4">
              <Image
                className="hidden sm:block"
                style={{minWidth: 42}}
                width={42}
                height={42}
                src="/assets/send-icon.png"
                alt="send-icon"
              />
              <p className="text-headingColor text-lg font-light">
                Subscribe to Our Newsletter ...and receive{' '}
                <b className="font-semibold">$20 coupon for first shopping</b>
              </p>
            </div>
            <div className="flex-1">
              <form onSubmit={formik.handleSubmit}>
                <div className="flex">
                  <input
                    className="block border w-full px-6 py-3 rounded-l-full text-base font-normal"
                    placeholder="Enter your email address..."
                    type="text"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />

                  <button
                    type="submit"
                    className="font-normal text-base bg-secondary-500 text-white px-6 rounded-r-full"
                  >
                    {!formik.isSubmitting ? (
                      'Subscribe'
                    ) : (
                      <div className="flex items-center gap-2">
                        Subscribe
                        <CircularLoader size={24} />
                      </div>
                    )}
                  </button>
                </div>
                {(formik.touched.email && formik.errors.email) || emailError ? (
                  <div className="mt-3 pl-4 text-sm text-red-500">
                    {formik.errors.email ?? emailError}
                  </div>
                ) : null}
              </form>
            </div>
          </div>
        </Container>
      </div>
      <div className="bg-grey pt-4">
        <Container>
          <div className="xl:flex xl:flex-row gap-6 lg:gap-8">
            <div className="xl:w-64 mb-6 xl:mb-0">
              <div className="mb-4">
                <div className="w-44 h-20 relative">
                  <Image
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                    className="block object-contain object-left"
                    src="/assets/logo.png"
                    alt="..."
                  />
                </div>
              </div>
              {/*<div className="mb-8">*/}
              {/*  <span className="text-sm text-headingColor font-light">*/}
              {/*    Got Questions ? Call us 24/7!*/}
              {/*  </span>*/}
              {/*  <a*/}
              {/*    href="tel:"*/}
              {/*    className="block text-headingColor text-[1.375rem] hover:text-opacity-80"*/}
              {/*  >*/}
              {/*    */}
              {/*  </a>*/}
              {/*</div>*/}
              {/*<div>*/}
              {/*  <h6 className="mb-2 text-sm font-bold text-headingColor">*/}
              {/*    Contact Info*/}
              {/*  </h6>*/}
              {/*  <p className="text-sm font-medium text-[#888]">*/}
              {/*    12 example road example abc house 32 street #11*/}
              {/*  </p>*/}
              <div className="mt-6 flex space-x-6">
                {social.map(item => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">{item.name}</span>
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  </a>
                ))}
              </div>
              {/*</div>*/}
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 mt-6 sm:mt-8">
                <div className="col order-1">
                  <div>
                    <h3 className="mb-8 text-base font-semibold text-headingColor">
                      Quick Links
                    </h3>
                    <div className="space-y-4">
                      {quickLinks.map(linkItem => (
                        <Link
                          href={linkItem.url}
                          className="block text-sm hover:text-secondary-500 text-mute"
                          key={linkItem.name}
                        >
                          {linkItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col order-3 lg:order-2 sm:col-span-2 lg:col-span-3">
                  <h3 className="mb-8 text-base font-semibold text-headingColor">
                    Find It Fast
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
                    {categoryList.map(category => (
                      <Link
                        href={`/categories/${category.uniqueCategoryName}`}
                        className="block text-sm hover:text-secondary-500 text-mute"
                        key={category.id}
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(category.categoryName)
                        }}
                      ></Link>
                    ))}
                  </div>
                </div>
                <div className="col order-2 lg:order-3">
                  <h3 className="mb-8 text-base font-semibold text-headingColor">
                    Customer Care
                  </h3>
                  <div className="space-y-4">
                    {customerCareLink.map(linkItem => (
                      <Link
                        href={linkItem.url}
                        className="block text-sm hover:text-secondary-500 text-mute"
                        key={linkItem.name}
                      >
                        {linkItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <div className="bg-body mt-12">
        <Container>
          <div className="flex flex-wrap gap-3 items-center py-4">
            <div className="text-sm text-white mr-auto">
              © <b className="font-bold">Prints</b>you - All Rights Reserved
            </div>
            <div className="flex justify-center items-center gap-x-6">
              <span className="w-9 h-9 relative">
                <Image
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fill
                  src="/assets/icon-payment-visa.png"
                  alt="..."
                />
              </span>

              <span className="w-9 h-9 relative">
                <Image
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fill
                  src="/assets/icon-payment-america-express.png"
                  alt="..."
                />
              </span>
              <span className="w-9 h-9 relative">
                <Image
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fill
                  src="/assets/icon-payment-mastercard.png"
                  alt="..."
                />
              </span>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
