import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {Drawer} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/solid';
import sanitizeHtml from 'sanitize-html';

import {useAppDispatch, useAppSelector} from '@store/hooks';
import SearchBar from '@components/inputs/SearchBar';
import Container from './Container';
import {
  getAllCategoryList,
  selectCategoryList
} from '@store/slices/category/catgory.slice';
import {useScrollingUp} from 'hooks/useScrolllingUp';
import {DropDownNavMenu} from './DropDownNavMenu';

const links = [
  {color: '#dd6c99', text: 'About us', href: '/about-us'},
  {
    color: '#58c6f1',
    text: 'How to order',
    href: '/how-to-order'
  },
  {color: '#8fc23f', text: 'Specials', href: '/specials'},
  {color: '#9a605c', text: 'Faq', href: '/faq'},
  {color: '#1f8b95', text: 'Artwork', href: '/artwork'},
  {color: '#b658a2', text: 'Contact us', href: '/contact-us'}
];

const Header = () => {
  const dispatch = useAppDispatch();
  const {scrollingUp, scrollValue} = useScrollingUp();

  const [mobileMenu, setMobileMenu] = useState(false);

  const categoryList = useAppSelector(selectCategoryList);

  useEffect(() => {
    dispatch(getAllCategoryList());
  });

  const handleOpen = () => {
    setMobileMenu(true);
  };
  const handleClose = () => {
    setMobileMenu(false);
  };

  return (
    <>
      <hr
        className="h-1 w-full"
        style={{backgroundImage: 'url(/assets/bg-line-top-banner.jpg)'}}
      />
      <div className="py-5 bg-body" />
      <header
        className={`${
          scrollingUp ? 'sticky' : ''
        } z-20 top-0 bg-white border-b border-[#eceef1] main-header`}
      >
        <div className="max-w-[100rem] mx-auto px-4 md:px-8 relative">
          <nav className="flex">
            <div
              className={`flex flex-col lg:flex-row gap-3 flex-1 ${
                scrollValue > 100 ? 'pt-4' : 'py-4'
              }`}
            >
              <div className="flex">
                <Link href="/" className="w-44 h-11 block relative mr-auto">
                  <Image
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                    className="block object-contain object-left"
                    src="/assets/logo.png"
                    alt=""
                  />
                </Link>
                <div className="flex lg:hidden items-center gap-3">
                  <a
                    href="tel: 8882829507"
                    className="h-full flex items-center"
                  >
                    <div className="w-7 h-7 relative mr-5">
                      <Image
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        fill
                        src="/assets/phone.png"
                        alt="..."
                      />
                    </div>
                  </a>
                  <button
                    onClick={handleOpen}
                    type="button"
                    className="text-body transition-all duration-300 active:scale-105"
                  >
                    <Bars3Icon className="h-7 w-7" />
                  </button>
                </div>
              </div>
              <div className="flex-1 lg:ml-6 mr-16">
                <SearchBar />
              </div>
              {scrollingUp && scrollValue > 100 && (
                <div className="ml-10">
                  <DropDownNavMenu />
                </div>
              )}
            </div>
            <div
              className={`hidden lg:block ${
                scrollValue < 100 && 'xl:ml-28'
              } pl-6 border-l border-[#eceef1]`}
            >
              <a
                href="tel: 8882829507"
                className="h-full flex items-center gap-3"
              >
                <div className="w-9 h-9 relative">
                  <Image
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                    src="/assets/phone.png"
                    alt="..."
                  />
                </div>
                <div className="phone-number">
                  <div className="text-primary text-[0.625rem] font-bold uppercase">
                    TOLL FREE NUMBER
                  </div>
                  <div className="text-xl font-bold text-black hover:text-primary-500">
                    (888) 282 95055
                  </div>
                </div>
              </a>
            </div>
          </nav>
        </div>
      </header>
      <nav className="hidden lg:block bg-white border-b border-[#eceef1]">
        <Container>
          <div className="flex">
            <DropDownNavMenu />

            <ul className="w-full flex flex-wrap justify-between gap-8 xl:gap-12 ms-10 xl:ms-20">
              {links.map((link, index) => (
                <li key={`link-${index}`}>
                  <Link
                    href={link.href}
                    className={`nav-link text-body hover:text-[${link.color}] after:bg-[${link.color}]`}
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </nav>

      {/* mobile view  */}
      <Drawer
        open={mobileMenu}
        onClose={handleClose}
        classes={{paper: 'bg-[#303546] text-white w-full max-w-[25rem]'}}
      >
        <div>
          <fieldset>
            <div className="flex pt-6 pb-4 px-6">
              <Link
                href="/"
                className="w-44 h-11 block relative mr-auto invert"
              >
                <Image
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fill
                  className="block object-contain object-left"
                  src="/assets/logo.png"
                  alt=""
                />
              </Link>
              <button
                onClick={handleClose}
                type="button"
                className="text-white"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </fieldset>
          <fieldset className="border-b border-gray-600">
            <Accordion className="bg-[#303546] px-2 border-0">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className="text-white" />}
              >
                <h6 className="text-white text-sm font-semibold uppercase">
                  ALL PRODUCTS
                </h6>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  <ul className="menu-link grid grid-cols-2 px-3 gap-4">
                    {categoryList.map(category => (
                      <li key={category.id}>
                        <Link
                          className="text-sm text-[#b5b8c1] hover:text-primary-500"
                          href={`/${category.uniqueCategoryName}`}
                        >
                          <span
                            dangerouslySetInnerHTML={{
                              __html: sanitizeHtml(category.categoryName)
                            }}
                          ></span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <ul className="menu-link grid grid-cols-2 gap-4 text-sm text-[#b5b8c1]">
                    {categoryList.map(category => (
                      <li key={category.id}>
                        <a
                          href={`/${category.uniqueCategoryName}`}
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(category.categoryName)
                          }}
                        ></a>
                      </li>
                    ))}
                  </ul>
                </div>
              </AccordionDetails>
            </Accordion>
          </fieldset>
          <figure className="p-6">
            <ul className="grid grid-cols-2 gap-6">
              {links.map((link, index) => (
                <li key={`link-${index}`}>
                  <Link
                    href={link.href}
                    className={`nav-link text-white hover:text-primary-500`}
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </figure>
          <fieldset className="p-6">
            <div className="flex gap-1">
              <a href="tel: 8882829507" className="p-3 w-full bg-[#3f4553]">
                <div className="w-6 h-6 mx-auto relative">
                  <Image
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                    src="/assets/icon-chat.png"
                    alt="..."
                  />
                </div>
              </a>
              <a href="tel: 8882829507" className="p-3 w-full bg-[#3f4553]">
                <div className="w-6 h-6 mx-auto relative">
                  <Image
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                    src="/assets/icon-phone.png"
                    alt="..."
                  />
                </div>
              </a>
            </div>
          </fieldset>
        </div>
      </Drawer>
    </>
  );
};

export default Header;
