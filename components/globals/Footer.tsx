import React, {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import sanitizeHtml from 'sanitize-html';
import Container from './Container';
import {ArrowLongRightIcon} from '@heroicons/react/24/solid';
import {useAppSelector} from '@store/hooks';
import {selectCategoryList} from '@store/slices/category/catgory.slice';
import {http} from 'services/axios.service';
import {useFormik} from 'formik';
import {EmailSchema} from '@utils/validationSchemas';
import {CircularProgress} from '@mui/material';

const identityShop = [
  {name: 'All Products', url: '/'},
  {name: 'About Us', url: '/about_us'},
  {name: 'Testimonials', url: '/'},
  {name: 'Contact Us', url: '/contact_us'}
];
const customerHelp = [
  {name: 'Artwork', url: '/artwork'},
  {name: 'How To Order', url: '/how-to-order'},
  {name: 'FAQs', url: '/faq'},
  {name: 'Additional Information', url: '/'}
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
    <footer className="bg-white footer pt-10 lg:pt-15">
      <Container>
        <div className="xl:flex xl:flex-row gap-6 lg:gap-8">
          <div className="xl:w-64 mb-6 xl:mb-0">
            <div className="lg:w-80 md:w-80 mb-8">
              <div className="xl:w-56 lg:w-52 lg:h-20 md:w-52 h-20 relative">
                <Image
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fill
                  className="block object-contain object-left"
                  src="/assets/logo.png"
                  alt=""
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row xl:flex-col gap-4">
              <div className="flex">
                <div className="max-w-[1.25rem] w-[1.25rem] h-[1.25rem] relative mr-3">
                  <Image
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                    src="/assets/icon-location.png"
                    alt="..."
                  />
                </div>
                <div>
                  <h6 className="text-base font-semibold leading-5">
                    Identity-Links, Inc.
                  </h6>
                  <h5 className="text-sm text-mute">
                    6211 W. Howard Street Niles, IL 60714
                  </h5>
                </div>
              </div>
              <div className="flex items-center">
                <div className="max-w-[1.25rem] w-[1.25rem] h-[1.25rem] relative mr-3">
                  <Image
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                    src="/assets/icon-phone-2-black.png"
                    alt="..."
                  />
                </div>
                <div className="text-base font-semibold">(888) 282 9507</div>
              </div>
              <div className="flex items-center">
                <div className="max-w-[1.25rem] w-[1.25rem] h-[1.25rem] relative mr-3">
                  <Image
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                    src="/assets/icon-fax.png"
                    alt="..."
                  />
                </div>
                <div className="text-base font-semibold">(847) 329 9797</div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-6 sm:gap-8">
              <form
                className="relative sm:col-span-2"
                onSubmit={formik.handleSubmit}
              >
                <input
                  className="block border w-full h-16 pl-4 pr-16 rounded-sm text-sm"
                  placeholder="Enter your email to stay up to date with our promotions..."
                  type="text"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />

                <button
                  type="submit"
                  className="absolute top-1/2 -translate-y-1/2 right-4"
                >
                  {!formik.isSubmitting ? (
                    <ArrowLongRightIcon className="h-10 w-10" />
                  ) : (
                    <CircularProgress color="warning" />
                  )}
                </button>
                {(formik.touched.email && formik.errors.email) || emailError ? (
                  <p className="text-red-500">
                    {formik.errors.email ?? emailError}
                  </p>
                ) : null}
              </form>
              <div className="flex gap-2">
                <a
                  href="https://www.facebook.com/identitylinksinc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block min-w-[2rem] w-8 h-8 relative"
                >
                  <Image
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                    className="block h-full w-full"
                    src="/assets/icon-social-facebook.png"
                    alt="Facebook"
                  />
                </a>
                <a
                  href="https://twitter.com/IdentityLinks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block min-w-[2rem] w-8 h-8 relative"
                >
                  <Image
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                    className="block h-full w-full"
                    src="/assets/icon-social-twitter.png"
                    alt="Twitter"
                  />
                </a>
                <a
                  href="https://www.pinterest.com/identitylinks/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block min-w-[2rem] w-8 h-8 relative"
                >
                  <Image
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                    className="block h-full w-full"
                    src="/assets/icon-social-pinterest.png"
                    alt="Pinterest"
                  />
                </a>
                <a
                  href="https://www.instagram.com/identitylinks/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block min-w-[2rem] w-8 h-8 relative"
                >
                  <Image
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                    className="block h-full w-full"
                    src="/assets/icon-social-instagram.png"
                    alt="Instagram"
                  />
                </a>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-6 sm:mt-8">
              <div className="sm:col-span-2">
                <h3 className="text-base font-bold title-line">
                  ALL CATEGORIES
                </h3>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
                  {categoryList.map(category => (
                    <Link
                      href={`/${category.uniqueCategoryName}`}
                      className="block text-sm hover:text-primary-500 text-mute"
                      key={category.id}
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(category.categoryName)
                      }}
                    ></Link>
                  ))}
                </div>
              </div>
              <div className="mt-8 lg:mt-0">
                <div>
                  <h3 className="text-base font-bold title-line">
                    IDENTITY SHOP
                  </h3>
                  <div className="space-y-4">
                    {identityShop.map(linkItem => (
                      <Link
                        href={linkItem.url}
                        className="block text-sm hover:text-primary-500 text-mute"
                        key={linkItem.name}
                      >
                        {linkItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-base mt-8 font-bold title-line">
                    CUSTOMER HELP
                  </h3>
                  <div className="space-y-4">
                    {customerHelp.map(linkItem => (
                      <Link
                        href={linkItem.url}
                        className="block text-sm hover:text-primary-500 text-mute"
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
        </div>
      </Container>
      <hr className="mt-12 border border-[#eceef1]" />
      <Container>
        <div className="flex flex-wrap gap-3 justify-between items-center py-6">
          <div className="text-sm">
            Copyright © 2023 IdentityLinks, Inc. All rights reserved.
          </div>
          <div className="flex justify-center items-center gap-x-6 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
            <span className="w-11 h-11 relative">
              <Image
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                fill
                src="/assets/icon-payment-visa.png"
                alt="..."
              />
            </span>

            <span className="w-11 h-11 relative">
              <Image
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                fill
                src="/assets/icon-payment-america-express.png"
                alt="..."
              />
            </span>
            <span className="w-11 h-11 relative">
              <Image
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                fill
                src="/assets/icon-payment-mastercard.png"
                alt="..."
              />
            </span>
          </div>
          {/* </div> */}
          <div>
            <span className="w-40 h-8 block relative">
              <Image
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                fill
                src="/assets/bbb-logo.png"
                alt="..."
              />
            </span>
          </div>
        </div>
      </Container>
      <hr
        className="h-1 w-full"
        style={{backgroundImage: 'url(/assets/bg-line-top-banner.jpg)'}}
      />
    </footer>
  );
};

export default Footer;
