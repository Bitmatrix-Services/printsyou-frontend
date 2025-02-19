'use client';
import React, {FC, useEffect, useState} from 'react';
import {Container} from '@components/globals/container.component';
import {Category} from '@components/home/home.types';
import {ImageWithFallback} from '@components/globals/Image-with-fallback';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {aosGlobalSetting} from '@utils/constants';
import {listType} from '@utils/util-types';
import {usePathname} from 'next/navigation';

interface INavComponentProps {
  categories: Category[];
}

const navList: listType[] = [
  // {name: 'markets', url: '/how-to-order'},
  // {name: 'shop by', url: '/how-to-order', menuItems: [{name: 'USA only', url: '/'}]},
  {name: 'About Us', url: '/about-us'},
  {name: 'Contact Us', url: '/contact-us'},
  {name: 'blogs', url: '/blog'}
];

export const NavComponent: FC<INavComponentProps> = ({categories}) => {
  const pathname = usePathname();

  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    AOS.init(aosGlobalSetting);
  }, []);

  return (
    <div className="bg-white">
      <Container className="mt-0 lg:mt-5">
        <div aria-label="Top Categories Bar">
          <div className="hidden lg:flex">
            {/* Flyout menus */}
            <div className="hidden lg:block w-full">
              <nav className="flex flex-col justify-center">
                <ul className="flex h-full justify-between items-stretch border-b border-gray-200">
                  <li className={`inline-block flex-grow list-none text-center cursor-pointer pb-4`}>
                    <Link
                      href="/"
                      className={`capitalize relative whitespace-break-spaces z-10 2xl:whitespace-nowrap pb-4 border-b-2 text-[15px] font-semibold text-mute3
                         hover:text-primary-500 hover:border-primary-500 ${pathname === '/' ? 'text-primary-500 border-primary-500' : 'border-transparent'}`}
                    >
                      Home
                    </Link>
                  </li>
                  <li
                    onMouseEnter={() => setIsMenuOpen(true)}
                    onMouseLeave={() => {
                      setIsMenuOpen(false);
                      setHoveredCategory(null);
                    }}
                    className={`inline-block flex-grow list-none text-center cursor-pointer pb-4`}
                  >
                    <Link
                      href={'/categories'}
                      className={`capitalize relative whitespace-break-spaces z-10 2xl:whitespace-nowrap pb-4 border-b-2 text-[15px] font-semibold text-mute3 ${
                        isMenuOpen ? 'text-primary-500 border-primary-500' : 'border-transparent'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Promotional Products
                    </Link>

                    {isMenuOpen && (
                      <div className=" absolute z-50 inset-x-0 top-full text-sm text-gray-500 transition-opacity duration-500 ease-out">
                        <div aria-hidden="true" className="absolute inset-0 top-1/2 bg-white shadow" />
                        <div className="relative bg-white min-h-[22rem] max-h-[22rem]">
                          <Container>
                            <div className="flex flex-row gap-x-4 ml-3 justify-between pt-6">
                              <div data-aos="fade-down" className="max-h-[18rem] overflow-clip columns-5 xl:columns-6">
                                {categories
                                  .sort((a, b) => a.categoryName.localeCompare(b.categoryName))
                                  .map(category => (
                                    <div
                                      className="py-2 text-left"
                                      key={category.id}
                                      onMouseEnter={() => setHoveredCategory(category)}
                                      onMouseLeave={() => setHoveredCategory(null)}
                                    >
                                      <Link
                                        href={`/categories/${category.uniqueCategoryName}`}
                                        onClick={() => {
                                          setIsMenuOpen(false);
                                          setHoveredCategory(null);
                                        }}
                                      >
                                        <span className="font-base text-[15px] text-mute2 capitalize hover:text-primary-500">
                                          {category.categoryName}
                                        </span>
                                      </Link>
                                      <br />
                                    </div>
                                  ))}
                              </div>
                              <div className="w-[18%]">
                                <div className="aspect-h-1 aspect-w-1  overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75 relative">
                                  <ImageWithFallback
                                    width={300}
                                    height={300}
                                    alt={'category'}
                                    src={hoveredCategory?.imageUrl ?? ''}
                                    className="object-cover object-center"
                                  />
                                </div>
                              </div>
                            </div>
                          </Container>
                        </div>
                      </div>
                    )}
                  </li>
                  {navList.map(listItem => (
                    <li
                      key={listItem.name}
                      className={`inline-block flex-grow list-none text-center cursor-pointer pb-4`}
                    >
                      <Link
                        href={listItem.url}
                        className={`capitalize relative whitespace-break-spaces z-10 2xl:whitespace-nowrap pb-4 border-b-2 text-[15px] font-semibold text-mute3
                         hover:text-primary-500 hover:border-primary-500 ${pathname === listItem.url ? 'text-primary-500 border-primary-500' : 'border-transparent'}`}
                      >
                        {listItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
