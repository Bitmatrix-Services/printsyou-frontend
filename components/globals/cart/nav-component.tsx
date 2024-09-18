'use client';
import React, {FC, useEffect, useState} from 'react';
import {Container} from '@components/globals/container.component';
import {Category} from '@components/home/home.types';
import {ImageWithFallback} from '@components/globals/Image-with-fallback';
import Link from 'next/link';
import {v4 as uuidv4} from 'uuid';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {aosGlobalSetting} from '@utils/constants';

interface INavComponentProps {
  categories: Category[];
}

export const NavComponent: FC<INavComponentProps> = ({categories}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [displayedCategories, setDisplayedCategories] = useState<Category[]>(categories);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1900) {
        setDisplayedCategories(categories.slice(0, 10));
      } else if (window.innerWidth >= 1770) {
        setDisplayedCategories(categories.slice(0, 9));
      } else if (window.innerWidth >= 1520) {
        setDisplayedCategories(categories.slice(0, 8));
      } else if (window.innerWidth >= 1200) {
        setDisplayedCategories(categories.slice(0, 7));
      } else if (window.innerWidth >= 1150) {
        setDisplayedCategories(categories.slice(0, 6));
      } else {
        setDisplayedCategories(categories.slice(0, 6));
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [categories]);

  useEffect(() => {
    AOS.init(aosGlobalSetting);
  }, []);

  return (
    <div className="bg-white">
      <Container>
        <nav aria-label="Top">
          <div className="border-b border-gray-200">
            <div className="flex pt-6">
              {/* Flyout menus */}
              <div className="hidden lg:block w-full">
                <div className="flex h-full justify-between items-center">
                  {categories?.map(category => (
                    <div
                      key={uuidv4()}
                      onMouseEnter={() => setHoveredCategory(category.id)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      className="inline-block text-center flex-1"
                    >
                      <Link
                        href={`/categories/${category.uniqueCategoryName}`}
                        className={`capitalize relative whitespace-break-spaces 2xl:whitespace-nowrap z-10 border-b-2 text-sm font-normal text-mute3 transition-colors duration-200 ease-out ${
                          hoveredCategory === category.id
                            ? 'text-primary-500 border-primary-500'
                            : 'hover:text-gray-800 border-transparent'
                        }`}
                        onClick={() => setHoveredCategory(null)}
                      >
                        {category.categoryName}
                      </Link>

                      {hoveredCategory === category.id && (
                        <div className=" absolute z-50 inset-x-0 top-full text-sm text-gray-500 transition-opacity duration-500 ease-out">
                          {/* Presentational element used to render the bottom shadow */}
                          <div aria-hidden="true" className="absolute inset-0 top-1/2 bg-white shadow" />
                          <div className="relative bg-white min-h-[22rem] max-h-[22rem]">
                            <Container>
                              <div className="flex flex-row gap-x-4 ml-3 justify-between py-11">
                                <div
                                  data-aos="fade-down"
                                  className="text-sm max-h-[16rem]"
                                  style={{columnCount: '3', columnFill: 'auto'}}
                                >
                                  {category.subCategories
                                    .sort((a, b) => a.categoryName.localeCompare(b.categoryName))
                                    .slice(0, 36)
                                    .map(subCategory => (
                                      <div className="py-1 text-left" key={uuidv4()}>
                                        <Link
                                          href={`/categories/${subCategory.uniqueCategoryName}`}
                                          onClick={() => setHoveredCategory(null)}
                                        >
                                          <span className="font-base text-mute2 capitalize hover:text-primary-500">
                                            {subCategory.categoryName}
                                          </span>
                                        </Link>
                                        <br />
                                      </div>
                                    ))}
                                </div>
                                <div className="w-[20%]">
                                  <div className="aspect-h-1 aspect-w-1  overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75 relative">
                                    <ImageWithFallback
                                      width={300}
                                      height={300}
                                      alt={'category'}
                                      src={category.imageUrl}
                                      className="object-cover object-center"
                                    />
                                  </div>
                                </div>
                              </div>
                            </Container>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </Container>
    </div>
  );
};
