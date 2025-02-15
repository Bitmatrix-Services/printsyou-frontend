'use client';

import Link from 'next/link';
import Image from 'next/image';
import {FC, useState} from 'react';
import {GiHamburgerMenu} from 'react-icons/gi';
import {IoChatbubblesOutline, IoClose} from 'react-icons/io5';
import {TfiHeadphoneAlt} from 'react-icons/tfi';
import Drawer from '@mui/joy/Drawer';
import {DialogContent} from '@mui/joy';

import {Searchbar} from '@components/globals/searchbar.component';
import {Container} from '@components/globals/container.component';
import {NavComponent} from '@components/globals/cart/nav-component';
import {SidebarCart} from '@components/globals/cart/cart-sidebar.component';
import {Category} from '@components/home/home.types';

interface IHeaderProps {
  categories: Category[];
}

export const Header: FC<IHeaderProps> = ({categories}) => {
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleMenuToggle = () => setMobileMenu(prev => !prev);

  return (
    <>
      {/* Sticky Header */}
      <Container className="sticky top-0 z-50 bg-white shadow-md">
        <header className="flex items-center justify-between p-4 lg:p-6">
          {/* Mobile Menu Icon */}
          <GiHamburgerMenu className="h-6 w-6 text-primary-500 cursor-pointer lg:hidden" onClick={handleMenuToggle} />

          {/* Logo */}
          <Link href="/" className="block">
            <Image
              width={200}
              height={38}
              src="/assets/logo-full.png"
              alt="PrintsYou Logo"
              className="object-contain"
            />
          </Link>

          {/* Search Bar */}
          <div className="flex-1 lg:ml-6">
            <Searchbar />
          </div>

          {/* Chat & Contact */}
          <div className="flex items-center gap-4 ml-5">
            <div
              className="flex items-center gap-1 cursor-pointer hover:text-primary"
              onClick={() => {
                if (typeof window !== undefined && '$chatwoot' in window) {
                  // @ts-ignore
                  window.$chatwoot.toggle();
                }
              }}
            >
              <IoChatbubblesOutline size={22} color="#019ce0" />
              <span className="hidden md:block">Chat with Us</span>
            </div>

            <Link
              href="tel:8882992940"
              className="flex items-center gap-1 hover:text-primary"
              aria-label="Call (888) 299-2940"
            >
              <TfiHeadphoneAlt size={20} color="#019ce0" />
              <span className="hidden md:block">(888) 299-2940</span>
            </Link>
          </div>
        </header>
      </Container>

      {/* Navigation */}
      <NavComponent categories={categories} />

      {/* Mobile Drawer Menu */}
      <Drawer open={mobileMenu} onClose={handleMenuToggle} size="lg">
        <DialogContent sx={{bgcolor: '#303546', color: 'white', width: '100%', height: '100%'}}>
          <div className="flex justify-between items-center p-4">
            <Link href="/" className="bg-white rounded-md">
              <Image
                width={170}
                height={38}
                src="/assets/logo-full.png"
                alt="Mobile Logo"
                className="p-2 object-contain"
              />
            </Link>
            <IoClose className="h-7 w-7 text-white cursor-pointer" onClick={handleMenuToggle} />
          </div>

          {/* Categories */}
          <p className="text-2xl font-medium px-4">Categories:</p>
          <ul className="grid grid-cols-2 gap-4 p-4 text-white">
            {categories.slice(0, 10).map(category => (
              <li key={category.id}>
                <Link
                  href={`/categories/${category.uniqueCategoryName}`}
                  className="hover:text-primary-500 capitalize"
                  onClick={handleMenuToggle}
                >
                  <span dangerouslySetInnerHTML={{__html: category.categoryName}}></span>
                </Link>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Drawer>

      {/* Sidebar Cart */}
      <SidebarCart />
    </>
  );
};
