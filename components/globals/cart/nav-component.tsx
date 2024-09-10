'use client';
import React, {FC, useState} from 'react';
import {Container} from '@components/globals/container.component';
import {Category} from '@components/home/home.types';
import {ImageWithFallback} from '@components/globals/Image-with-fallback';
import Link from 'next/link';

interface INavComponentProps {
  categories: Category[];
}

export const NavComponent: FC<INavComponentProps> = ({categories}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  return (
    <div className="bg-white">
      <Container>
        <nav aria-label="Top">
          <div className="border-b border-gray-200">
            <div className="flex pt-6 justify-start items-start">
              {/* Flyout menus */}
              <div className="hidden lg:block lg:self-stretch">
                <div className="flex h-full">
                  {categories?.map(category => (
                    <div
                      key={category.id}
                      onMouseEnter={() => setHoveredCategory(category.id)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      <Link
                        href={`/categories/${category.uniqueCategoryName}`}
                        className={`capitalize relative  px-4 z-10 pb-4 flex items-center border-b-2 text-sm font-normal text-mute3 transition-colors duration-200 ease-out ${
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
                          <div className="relative bg-white min-h-[24rem] max-h-[24rem]">
                            <div className="mx-auto max-w-7xl">
                              <div className="grid grid-cols-5 gap-x-4 gap-y-4 py-10">
                                <div className="col-span-4 grid grid-cols-4 gap-x-8 text-sm">
                                  {category.subCategories.map(subCategory => (
                                    <Link
                                      href={`/categories/${subCategory.uniqueCategoryName}`}
                                      key={subCategory.id}
                                      onClick={() => setHoveredCategory(null)}
                                    >
                                      <span className="font-base text-mute2 capitalize hover:text-primary-500">
                                        {subCategory.categoryName}
                                      </span>
                                    </Link>
                                  ))}
                                </div>
                                <div className="col-span-1">
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
                            </div>
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
