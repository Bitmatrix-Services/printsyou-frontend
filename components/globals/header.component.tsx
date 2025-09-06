'use client';
import Link from 'next/link';
import Image from 'next/image';
import {Searchbar} from '@components/globals/searchbar.component';
import {Container} from '@components/globals/container.component';
import {NavComponent} from '@components/globals/cart/nav-component';
import {Category} from '@components/home/home.types';
import {FC, useState} from 'react';
import {GiHamburgerMenu} from 'react-icons/gi';
import Drawer from '@mui/joy/Drawer';
import {IoChatbubblesOutline, IoClose} from 'react-icons/io5';
import {DialogContent} from '@mui/joy';
import {TfiHeadphoneAlt} from 'react-icons/tfi';

interface IHeaderProps {
  categories: Category[];
}

export const Header: FC<IHeaderProps> = ({categories}) => {
  const [mobileMenu, setMobileMenu] = useState<boolean>(false);

  const handleMenuClose = () => {
    setMobileMenu(false);
  };

  return (
    <>
      <Container className="pt-6 md:pt-0 translate-y-0 sticky bg-white top-0 z-50 transition-transform duration-800 shadow-md">
        <header className="flex items-center md:p-6">
          {/*  mobile view*/}
          <div className={`lg:hidden flex flex-col gap-3 flex-1 pb-2`}>
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
              <div className="flex items-center gap-5 md:gap-2">
                <div
                  className="flex items-center gap-1 font-semibold hover:text-primary hover:cursor-pointer"
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

                <div className="">
                  <Link href="tel:4694347035">
                    <div className="flex items-center gap-1 font-semibold hover:text-primary ">
                      <TfiHeadphoneAlt size={20} color="#019ce0" />
                      <span className="hidden md:block">(469) 434-7035</span>
                    </div>
                  </Link>
                </div>
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

          <div
            className="hidden lg:flex items-center justify-center py-1 lg:py-2 px-12 lg:px-4 gap-1 hover:cursor-pointer"
            onClick={() => {
              if (typeof window !== undefined && '$chatwoot' in window) {
                // @ts-ignore
                window.$chatwoot.toggle();
              }
            }}
          >
            <div className="flex flex-col lg:flex-row items-center gap-1 font-semibold hover:text-primary">
              <IoChatbubblesOutline size={22} color="#019ce0" />
              <span>Chat with Us</span>
            </div>
          </div>

          <Link href="tel:4694347035" className="hidden lg:flex items-center justify-end gap-1">
            <div className="flex flex-col lg:flex-row items-center gap-1 font-semibold hover:text-primary">
              <TfiHeadphoneAlt size={20} color="#019ce0" />
              <span>(469) 434-7035</span>
            </div>
          </Link>
        </header>
      </Container>

      <NavComponent categories={categories} />

      {/* mobile view  */}
      {mobileMenu ? (
        <Drawer open={mobileMenu} onClose={handleMenuClose} size="lg">
          <DialogContent
            sx={{
              bgcolor: '#303546',
              color: 'white',
              width: '100%',
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
            <p className="text-2xl font-medium pl-4">Categories:</p>
            <fieldset className="border-b border-gray-600">
              <div style={{backgroundColor: '#303546'}} className=" px-2 border-0">
                <ul className="menu-link grid grid-cols-2 px-3 gap-4 py-4 text-white">
                  {categories
                    .sort((a, b) => a.categoryName.toLowerCase().localeCompare(b.categoryName.toLowerCase()))
                    .map(category => (
                      <li key={category.id}>
                        <Link
                          className="text-white hover:text-primary-500 capitalize"
                          href={`/categories/${category.uniqueCategoryName}`}
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
              </div>
            </fieldset>
          </DialogContent>
        </Drawer>
      ) : null}
      {/*<SidebarCart />*/}
    </>
  );
};
