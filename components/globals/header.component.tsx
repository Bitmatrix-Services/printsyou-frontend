'use client';
import {MdEmail} from 'react-icons/md';
import Link from 'next/link';
import Image from 'next/image';
import {RiShoppingBagFill} from 'react-icons/ri';
import {Searchbar} from '@components/globals/searchbar.component';
import {Container} from '@components/globals/container.component';
import {NavComponent} from '@components/globals/cart/nav-component';
import {Category} from '@components/home/home.types';
import {FC, useState} from 'react';
import {GiHamburgerMenu} from 'react-icons/gi';
import Drawer from '@mui/joy/Drawer';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionSummary from '@mui/joy/AccordionSummary';
import {IoClose} from 'react-icons/io5';
import {Sheet} from '@mui/joy';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {selectCartRootState, setSidebarCartOpen} from '../../store/slices/cart/cart.slice';
import {SidebarCart} from '@components/globals/cart/cart-sidebar.component';

interface IHeaderProps {
  categories: Category[];
}

const links = [
  {name: 'how to order', url: '/how-to-order'},
  {name: 'Contact Us', url: '/contact-us'},
  {name: 'About Us', url: '/about-us'},
  {name: 'Terms & Conditions', url: '/terms-and-conditions'},
  {name: 'blogs', url: '/blog'}
];

export const Header: FC<IHeaderProps> = ({categories}) => {
  const dispatch = useAppDispatch();
  const cartRoot = useAppSelector(selectCartRootState);
  const [mobileMenu, setMobileMenu] = useState<boolean>(false);

  const handleMenuClose = () => {
    setMobileMenu(false);
  };

  return (
    <>
      <div className="bg-primary-500 bg-opacity-[12%]">
        <div className="flex items-center gap-2">
          <div className="mr-auto"></div>
          <Link
            href="mailto: info@printsyou.com"
            className="flex items-center justify-end bg-primary-500/10 py-2 px-4 gap-1 mr-10"
          >
            <MdEmail size={16} /> <span>info@printsyou.com</span>
          </Link>
        </div>
      </div>
      <Container className="pt-6 md:pt-0 translate-y-0 sticky bg-white top-0 z-50 transition-transform duration-800">
        <header className="flex items-center md:p-6">
          {/*  mobile view*/}
          <div className={`lg:hidden flex flex-col gap-3 flex-1`}>
            <div className="flex justify-between items-center">
              <div>
                <GiHamburgerMenu
                  className="h-6 w-6 text-primary-500 cursor-pointer hover:text-primary-700"
                  onClick={() => setMobileMenu(true)}
                />
              </div>
              <div>
                <Link href="/" className="block relative mr-auto">
                  <Image width={200} height={38} className="object-contain" src="/assets/logo-full.png" alt="logo" />
                </Link>
              </div>
              <div>
                <ul className="flex h-full items-center gap-5 ">
                  {/*<li>*/}
                  {/*  <Link href="/wishlist">*/}
                  {/*    <FaRegHeart className="h-6 w-6 text-primary-500 cursor-pointer hover:text-primary-700" />*/}
                  {/*  </Link>*/}
                  {/*</li>*/}
                  <li className="relative" onClick={() => dispatch(setSidebarCartOpen(true))}>
                    <RiShoppingBagFill className="h-6 w-6 text-primary-500 cursor-pointer hover:text-primary-700" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 text-center rounded-full bg-secondary-500 text-white text-sm font-semibold">
                      {cartRoot?.cartItems?.length ?? 0}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex-1 lg:ml-6">
              <Searchbar />
            </div>
          </div>
          {/*  mobile view end */}

          {/*  lg screen view */}
          <div className={`hidden lg:flex items-center gap-3 flex-1`}>
            <div className="flex justify-between">
              <Link href="/" className="block relative mr-auto">
                <Image width={200} height={38} className="object-contain" src="/assets/logo-full.png" alt="logo" />
              </Link>
            </div>
            <div className="flex-1 lg:ml-6">
              <Searchbar />
            </div>
          </div>

          <Link
            href="/how-to-order"
            className="hidden lg:flex justify-center items-center ml-4 border border-primary-700 py-1 px-4 rounded-full text-primary-700 hover:text-primary-500 hover:border-primary-500"
          >
            <div className="capitalize">how to order</div>
          </Link>

          <div className="hidden lg:block pl-6 items-center">
            <ul className="flex h-full items-center gap-3 xl:gap-8">
              {/*<li>*/}
              {/*  <Link href="/wishlist">*/}
              {/*    <FaRegHeart className="h-6 w-6 text-primary-500 cursor-pointer hover:text-primary-700" />*/}
              {/*  </Link>*/}
              {/*</li>*/}
              <li className="relative" onClick={() => dispatch(setSidebarCartOpen(true))}>
                <RiShoppingBagFill className="h-6 w-6 text-primary-500 cursor-pointer hover:text-primary-700" />
                <span className="absolute -top-2 -right-2 w-5 h-5 text-center rounded-full bg-secondary-500 text-white text-sm font-semibold">
                  {cartRoot?.cartItems?.length ?? 0}
                </span>
              </li>
            </ul>
          </div>
        </header>
      </Container>

      <NavComponent categories={categories.slice(0, 8)} />

      {/* mobile view  */}
      {mobileMenu ? (
        <Drawer open={mobileMenu} onClose={handleMenuClose} size="lg">
          <Sheet
            sx={{
              bgcolor: '#303546',
              color: 'white',
              width: '100%',
              maxWidth: '25rem',
              height: '100%'
            }}
          >
            <fieldset>
              <div className="flex pt-6 pb-4 px-6">
                <Link href="/" className="block relative mr-auto bg-white rounded-md">
                  <Image
                    width={170}
                    height={38}
                    className="p-2 block object-contain object-left"
                    src="/assets/logo-full.png"
                    alt="logo-mobile"
                  />
                </Link>
                <button onClick={handleMenuClose} type="button" className="text-white">
                  <IoClose className="h-7 w-7 text-white" />
                </button>
              </div>
            </fieldset>
            <fieldset className="border-b border-gray-600">
              <Accordion sx={{backgroundColor: '#303546'}} className=" px-2 border-0">
                <AccordionSummary>
                  <h6 className="text-white text-base font-semibold capitalize">all categories</h6>
                </AccordionSummary>
                <AccordionDetails sx={{color: 'white'}}>
                  <ul className="menu-link grid grid-cols-2 px-3 gap-4 py-4">
                    {categories.slice(0, 6).map(category => (
                      <li key={category.id}>
                        <Link
                          className="text-white hover:text-primary-500 capitalize"
                          href={`/categories/${category.uniqueCategoryName}?page=1&size=20&filter=priceLowToHigh`}
                          onClick={handleMenuClose}
                        >
                          <span
                            dangerouslySetInnerHTML={{
                              __html: category.categoryName
                            }}
                          ></span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionDetails>
              </Accordion>
            </fieldset>
            <fieldset className="p-6">
              <ul className="grid grid-cols-2 gap-6">
                {links.map(link => (
                  <li key={link.name}>
                    <Link
                      href={link.url}
                      onClick={handleMenuClose}
                      className={`nav-link text-white hover:text-primary-500 capitalize`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </fieldset>
            <fieldset className="p-6">
              <div className="flex gap-1">
                <a href="mailto: info@printsyou.com" className="p-3 w-full bg-[#3f4553]">
                  <div className="w-6 h-6 mx-auto relative">
                    <MdEmail />
                  </div>
                </a>
              </div>
            </fieldset>
          </Sheet>
        </Drawer>
      ) : null}
      <SidebarCart />
    </>
  );
};
