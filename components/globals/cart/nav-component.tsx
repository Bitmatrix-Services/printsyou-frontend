'use client';
import React, {FC, useEffect, useState} from 'react';
import {Container} from '@components/globals/container.component';
import {Category} from '@components/home/home.types';
import {ImageWithFallback} from '@components/globals/Image-with-fallback';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {aosGlobalSetting} from '@utils/constants';

interface INavComponentProps {
  categories: Category[];
}

export const NavComponent: FC<INavComponentProps> = ({categories}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    AOS.init(aosGlobalSetting);
  }, []);

  return (
    <div className="bg-white">
      <Container>
        <div aria-label="Top">
          <div className="flex pt-6">
            {/* Flyout menus */}
            <div className="hidden lg:block w-full">
              <nav className="flex flex-col justify-center">
                <ul className="flex h-full justify-between items-stretch border-b border-gray-200">
                  {categories?.map(category => (
                    <li
                      key={category.id}
                      onMouseEnter={() => setHoveredCategory(category.id)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      className={`inline-block flex-grow list-none text-center cursor-pointer pb-4`}
                    >
                      <Link
                        href={`/categories/${category.uniqueCategoryName}`}
                        className={`capitalize relative whitespace-break-spaces z-10 2xl:whitespace-nowrap pb-4 border-b-2 text-[15px] font-normal text-mute3 ${
                          hoveredCategory === category.id ? 'text-primary-500 border-primary-500' : 'border-transparent'
                        }`}
                        onClick={() => setHoveredCategory(null)}
                      >
                        {category.categoryName}
                      </Link>

                      {hoveredCategory === category.id && (
                        <div className=" absolute z-50 inset-x-0 top-full text-sm text-gray-500 transition-opacity duration-500 ease-out">
                          <div aria-hidden="true" className="absolute inset-0 top-1/2 bg-white shadow" />
                          <div className="relative bg-white min-h-[22rem] max-h-[22rem]">
                            <Container>
                              <div className="flex flex-row gap-x-4 ml-3 justify-between py-6">
                                <div
                                  data-aos="fade-down"
                                  className="max-h-[16rem]"
                                  style={{columnCount: '3', columnFill: 'auto'}}
                                >
                                  {category.subCategories
                                    .sort((a, b) => a.categoryName.localeCompare(b.categoryName))
                                    .slice(0, 36)
                                    .map(subCategory => (
                                      <div className="py-2 text-left" key={subCategory.id}>
                                        <Link
                                          href={`/categories/${subCategory.uniqueCategoryName}`}
                                          onClick={() => setHoveredCategory(null)}
                                        >
                                          <span className="font-base text-[15px] text-mute2 capitalize hover:text-primary-500">
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
