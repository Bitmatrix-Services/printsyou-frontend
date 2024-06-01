import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {Drawer} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Bars3Icon, PhoneIcon, XMarkIcon} from '@heroicons/react/24/solid';
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
import {
  // HeartIcon,
  ShoppingCartIcon
  // UserIcon
} from '@heroicons/react/24/outline';
import TwitterIcon from '@components/icons/TwitterIcon';
import YouTubeIcon from '@components/icons/YouTubeIcon';
import InstagramIcon from '@components/icons/InstagramIcon';
import SidebarCart from './SidebarCart';
import {
  selectCartRootState,
  setSidebarCartOpen
} from '@store/slices/cart/cart.slice';

const Header = () => {
  const dispatch = useAppDispatch();
  const {scrollingUp, scrollValue} = useScrollingUp();

  const cartRoot = useAppSelector(selectCartRootState);
  const [mobileMenu, setMobileMenu] = useState(false);

  const categoryList = useAppSelector(selectCategoryList);

  useEffect(() => {
    dispatch(getAllCategoryList());
  }, []);

  const handleOpen = () => {
    setMobileMenu(true);
  };
  const handleClose = () => {
    setMobileMenu(false);
  };

  return (
    <>
      <div className="py-3 bg-body">
        <Container>
          <div className="flex items-center gap-4">
            <div className="mr-auto">
              <a
                href="tel:+16147952435"
                className="text-sm text-white hover:text-primary-500 flex items-center gap-2"
              >
                <PhoneIcon className="h-5 w-5" />
                <span>+1 614 795-2435</span>
              </a>
            </div>
            <div className="flex items-center gap-3">
              <a
                className="text-white hover:text-primary-500"
                href="http://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon />
              </a>
              <a
                className="text-white hover:text-primary-500"
                href="http://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <YouTubeIcon />
              </a>
              <a
                className="text-white hover:text-primary-500"
                href="http://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>
        </Container>
      </div>
      <header
        className={`${
          scrollingUp ? 'sticky translate-y-0 py-4 lg:py-0' : 'py-4 lg:py-0'
        } z-20 top-0 bg-white transition-transform duration-300`}
      >
        <Container>
          <nav className="flex">
            <div
              className={`flex flex-col lg:flex-row lg:items-center gap-3 flex-1 ${
                scrollValue > 130 ? '' : 'py-4'
              }`}
            >
              <div className="flex">
                <Link href="/" className="block relative mr-auto">
                  <Image
                    width={170}
                    height={38}
                    className="block object-contain object-left"
                    src="/assets/logo.png"
                    alt="logo"
                  />
                </Link>
                <div className="flex lg:hidden items-center gap-3">
                  <ul className="flex h-full items-center gap-3">
                    {/* <li>
                      <button type="button" className="hover:text-primary-500">
                        <HeartIcon className="h-7 w-7" />
                      </button>
                    </li> */}
                    <li>
                      <button
                        type="button"
                        className="hover:text-primary-500 flex items-center gap-5"
                      >
                        <span className="relative">
                          <ShoppingCartIcon
                            className="h-7 w-7"
                            onClick={() => dispatch(setSidebarCartOpen(true))}
                          />
                          <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary-500 text-headingColor text-sm font-semibold">
                            {cartRoot?.cartItems?.length ?? 0}
                          </span>
                        </span>
                      </button>
                    </li>
                  </ul>
                  <button
                    onClick={handleOpen}
                    type="button"
                    className="text-body transition-all duration-300 active:scale-105"
                  >
                    <Bars3Icon className="h-7 w-7" />
                  </button>
                </div>
              </div>
              <div className="flex-1 lg:ml-6 ">
                <SearchBar />
              </div>
              {scrollValue !== undefined && (
                <div
                  className={`ml-10 ${scrollValue > 130 ? 'block' : 'hidden'}`}
                >
                  <DropDownNavMenu
                    title="All Products"
                    className="py-4"
                    subCatList={categoryList}
                  />
                </div>
              )}
            </div>
            <Link
              href="/how-to-order"
              className="hidden lg:flex justify-center items-center ml-4 text-secondary-500"
            >
              <div>HOW TO ORDER</div>
            </Link>
            <div
              className={`hidden lg:block ${
                scrollValue < 130 && 'xl:ml-10'
              } pl-6`}
            >
              <ul className="flex h-full items-center gap-3 xl:gap-8">
                {/* <li>
                  <button type="button" className="hover:text-primary-500">
                    <HeartIcon className="h-7 w-7" />
                  </button>
                </li>
                <li>
                  <button type="button" className="hover:text-primary-500">
                    <UserIcon className="h-7 w-7" />
                  </button>
                </li> */}
                <li>
                  <button type="button" className=" flex items-center gap-5">
                    <span className="relative">
                      <ShoppingCartIcon
                        className="h-7 w-7 hover:text-primary-500"
                        onClick={() => dispatch(setSidebarCartOpen(true))}
                      />
                      <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary-500 text-headingColor text-sm font-semibold">
                        {cartRoot?.cartItems?.length ?? 0}
                      </span>
                    </span>
                    <span className="font-semibold text-xl">$0.00</span>
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </Container>
      </header>
      <nav className="hidden lg:block bg-white border-b border-[#eceef1]">
        <Container>
          <div className="flex">
            <ul className="w-full flex flex-wrap gap-8 ms-10 xl:ms-48 mr-auto">
              <li>
                <DropDownNavMenu
                  title="All Products"
                  subCatList={categoryList}
                />
              </li>
              {categoryList.slice(0, 6).map((item, index) => (
                <li key={`link-${index}`}>
                  <DropDownNavMenu
                    title={item.categoryName}
                    subCatList={item.subCategories}
                  />
                </li>
              ))}
            </ul>
            {/* <Link
              href="#"
              className="text-headingColor hover:opacity-80 text-sm font-semibold flex items-center gap-3 min-w-[10rem]"
            >
              <Image
                width={24}
                height={24}
                src="/assets/track-order-icon.png"
                alt="..."
              />
              <span>Track Your Order</span>
            </Link> */}
          </div>
        </Container>
      </nav>

      {/* mobile view  */}
      <Drawer
        open={mobileMenu}
        onClose={handleClose}
        PaperProps={{
          style: {
            backgroundColor: '#303546',
            color: 'white',
            width: 'full',
            maxWidth: '25rem'
          }
        }}
      >
        <div>
          <fieldset>
            <div className="flex pt-6 pb-4 px-6">
              <Link
                href="/"
                className="block relative mr-auto bg-white rounded-md"
              >
                <Image
                  width={170}
                  height={38}
                  className="p-2 block object-contain object-left"
                  src="/assets/logo.png"
                  alt="logo"
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
            <Accordion
              sx={{backgroundColor: '#303546'}}
              className=" px-2 border-0"
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className="text-white" />}
              >
                <h6 className="text-white text-sm font-semibold uppercase">
                  ALL PRODUCTS
                </h6>
              </AccordionSummary>
              <AccordionDetails>
                <ul className="menu-link grid grid-cols-2 px-3 gap-4">
                  {categoryList.map(category => (
                    <li key={category.id}>
                      <Link
                        className="text-sm text-[#b5b8c1] hover:text-secondary-500"
                        href={`/${category.uniqueCategoryName}`}
                        onClick={() => setMobileMenu(false)}
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
              </AccordionDetails>
            </Accordion>
          </fieldset>
          {categoryList.slice(0, 6).map(category => (
            <fieldset key={category.id} className="border-b border-gray-600">
              <Accordion
                style={{backgroundColor: '#303546'}}
                className=" px-2 border-0"
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon className="text-white" />}
                >
                  <h6 className="text-white text-sm font-semibold uppercase">
                    {category.categoryName}
                  </h6>
                </AccordionSummary>
                <AccordionDetails>
                  <ul className="menu-link grid grid-cols-2 px-3 gap-4">
                    {category.subCategories.map(category => (
                      <li key={category.id}>
                        <Link
                          className="text-sm text-[#b5b8c1] hover:text-secondary-500"
                          href={`/${category.uniqueCategoryName}`}
                          onClick={() => setMobileMenu(false)}
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
                </AccordionDetails>
              </Accordion>
            </fieldset>
          ))}
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
          <fieldset className="px-6">
            <ul className="flex h-full items-center gap-3 xl:gap-8">
              {/* <li>
                <button type="button" className="hover:text-primary-500">
                  <HeartIcon className="h-7 w-7" />
                </button>
              </li>
              <li>
                <button type="button" className="hover:text-primary-500">
                  <UserIcon className="h-7 w-7" />
                </button>
              </li> */}
              <li>
                <button
                  type="button"
                  className=" flex items-center gap-5"
                  onClick={() => dispatch(setSidebarCartOpen(true))}
                >
                  <span className="relative">
                    <ShoppingCartIcon className="h-7 w-7 hover:text-primary-500" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary-500 text-headingColor text-sm font-semibold">
                      {cartRoot?.cartItems?.length ?? 0}
                    </span>
                  </span>
                  <span className="font-semibold text-xl">$0.00</span>
                </button>
              </li>
            </ul>
          </fieldset>
        </div>
      </Drawer>
      <SidebarCart />
    </>
  );
};

export default Header;
