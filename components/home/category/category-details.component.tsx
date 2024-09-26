'use client';
import React, {FC, useState} from 'react';
import {Breadcrumb} from '@components/globals/breadcrumb.component';
import {Category} from '@components/home/home.types';
import {ImageWithFallback} from '@components/globals/Image-with-fallback';
import Link from 'next/link';
import {ProductsSection} from '@components/home/product/products-section.component';
import {notFound} from 'next/navigation';
import CategoriesSidebar from '@components/home/category/categories-sidebar.component';

interface ICategoryDetails {
  category: Category | null;
  siblingCategories: Category[];
}

export const CategoryDetails: FC<ICategoryDetails> = ({category, siblingCategories}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(prevState => !prevState);
  };

  if (!category) notFound();

  return (
    <div>
      <Breadcrumb prefixTitle="Promotional Category" list={category.crumbs ?? []} />
      <div className="w-full max-w-[120rem] mx-auto px-6 md:px-[3rem] tablet:px-[4rem] lg:px-[4rem] xl:px-[8rem] 2xl:px-[10rem] relative">
        <div className="flex flex-col md:flex-row mt-10">
          <div className="hidden lg:block">
            <CategoriesSidebar selectedCategory={category} siblingCategories={siblingCategories} />
          </div>
          <div>
            <section className="bg-secondary-300 bg-opacity-[12%]">
              <div className="md:grid md:grid-cols-12 flex flex-col gap-4 lg:gap-6 px-8">
                <div className="md:col-span-9 py-9">
                  <h1 className="mb-3 text-black font-semibold text-3xl capitalize">
                    {category.prefix && <span>{category.prefix}</span>}
                    {category.categoryName}
                    {category.suffix && <span>{category.suffix}</span>}
                  </h1>
                  <span
                    className={`text-base font-normal text-mute ${isExpanded ? '' : 'see-less-more'}`}
                    dangerouslySetInnerHTML={{
                      __html: category.categoryDescription
                    }}
                  ></span>
                  <span onClick={handleToggle} className="text-blue-500 text-sm font-medium cursor-pointer">
                    {isExpanded ? 'Show Less' : 'Show More'}
                  </span>
                </div>
                {category?.imageUrl && (
                  <div
                    className={`relative hidden md:block md:col-span-3 ${isExpanded ? 'h-full' : 'max-h-[14rem] my-10'}`}
                  >
                    <ImageWithFallback
                      src={category?.imageUrl}
                      alt={category.uniqueCategoryName}
                      className="object-contain"
                      fill
                    />
                  </div>
                )}
              </div>
            </section>
            {category.subCategories?.length > 0 ? (
              <h3 className="my-6 text-black font-semibold text-3xl capitalize">{category.categoryName} Categories</h3>
            ) : null}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 xl:gap-10">
              {(category.subCategories ?? [])?.map(subCategory => (
                <Link
                  href={`/categories/${subCategory.uniqueCategoryName}?page=1&size=20&filter=priceLowToHigh`}
                  className="flex flex-col border p-2"
                  key={subCategory.id}
                >
                  <div className="min-h-56 h-56 max-h-56  relative">
                    <ImageWithFallback
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain md:w-[60%] lg:w-[85%] "
                      fill
                      src={subCategory?.imageUrl}
                      alt={subCategory.categoryName}
                    />
                  </div>
                  <h6 className="text-lg font-normal text-center mt-4">{subCategory.categoryName}</h6>
                </Link>
              ))}
            </div>

            {/*  Sample section*/}
            {/*<section className="bg-primary-500 bg-opacity-[12%] my-8 py-10">*/}
            {/*    <Container>*/}
            {/*        <div className="flex flex-col md:flex-row lg:gap-24 md:gap-12 gap-6">*/}
            {/*            <div className="flex justify-center md:justify-start md:w-1/2">*/}
            {/*                <Image src="/assets/p-b-1.png" alt="" className="w-full h-auto object-contain"/>*/}
            {/*            </div>*/}
            {/*            <div className="flex flex-col justify-center gap-5 md:w-1/2">*/}
            {/*                <h3 className="mb-3 text-black font-extrabold lg:text-4xl md:text-2xl text-2xl capitalize">*/}
            {/*                    Celebrate Achievement with Custom Awards*/}
            {/*                </h3>*/}
            {/*                <p className=" text-mute3 text-lg md:text-xl">*/}
            {/*                    Create personalized gifts that are perfect for birthdays, holidays, and special moments.*/}
            {/*                    From photo*/}
            {/*                    books and custom puzzles to unique keepsakes, our range of personalized gifts will show*/}
            {/*                    your loved ones*/}
            {/*                    how much you care. Celebrate every occasion with a touch of creativity and*/}
            {/*                    thoughtfulness.*/}
            {/*                </p>*/}
            {/*                <button*/}
            {/*                    className="flex justify-start text-lg py-3 px-12 border-2 rounded-full border-primary-400 text-primary-500 w-fit">*/}
            {/*                    Get Started*/}
            {/*                </button>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </Container>*/}
            {/*</section>*/}
            <ProductsSection
              categoryId={category.id}
              categoryName={category.categoryName}
              prefix={category.prefix}
              suffix={category.suffix}
            />
          </div>
        </div>
        <div className=" lg:hidden block ">
          <CategoriesSidebar selectedCategory={category} siblingCategories={siblingCategories} />
        </div>
      </div>
    </div>
  );
};
