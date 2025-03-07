'use client';
import React, {FC, memo, Suspense, useCallback, useState} from 'react';
import {Breadcrumb} from '@components/globals/breadcrumb.component';
import {Category} from '@components/home/home.types';
import {ImageWithFallback} from '@components/globals/Image-with-fallback';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import CategoriesSidebar from '@components/home/category/categories-sidebar.component';
import dynamic from 'next/dynamic';

interface ICategoryDetails {
  allCategories: Category[];
  category: Category | null;
  siblingCategories: Category[];
  pagedData: any;
}

const ProductSectionSkeleton = <div className="h-160 animate-pulse bg-gray-100 rounded-lg mt-20" />;

const ProductsSection = dynamic(
  () => import('@components/home/product/products-section.component').then(mod => mod.ProductsSection),
  {
    ssr: false,
    loading: () => ProductSectionSkeleton
  }
);

export const CategoryDetails: FC<ICategoryDetails> = memo(({allCategories, pagedData, category, siblingCategories}) => {
  if (!category) notFound();

  return (
    <div>
      <Breadcrumb prefixTitle="Promotional Categories" list={category.crumbs ?? []} />
      <div className="w-full max-w-[120rem] mx-auto px-3 md:px-[3rem] tablet:px-[4rem] lg:px-[4rem] xl:px-[8rem] 2xl:px-[10rem] relative">
        <div className="flex flex-col md:flex-row mt-10 gap-8">
          <div className="hidden lg:block">
            <CategoriesSidebar
              allCategories={allCategories}
              selectedCategory={category}
              siblingCategories={siblingCategories}
            />
          </div>

          <div className="flex-1">
            <CategoryHeader category={category} />

            {category.subCategories?.length > 0 && (
              <>
                <h3 className="my-6 text-black font-semibold text-3xl capitalize">
                  {category.categoryName} Categories
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                  {category.subCategories.map((subCategory, index) => (
                    <SubCategoryItem key={subCategory.id} subCategory={subCategory} priority={index >= 3} />
                  ))}
                </div>
              </>
            )}

            <Suspense fallback={ProductSectionSkeleton}>
              <ProductsSection category={category} pagedData={pagedData} />
            </Suspense>
          </div>
        </div>

        <Suspense fallback={<div className="h-80 animate-pulse bg-gray-100 mt-8" />}>
          <div className="block lg:hidden">
            <CategoriesSidebar
              allCategories={allCategories}
              selectedCategory={category}
              siblingCategories={siblingCategories}
            />
          </div>
        </Suspense>
      </div>
    </div>
  );
});
CategoryDetails.displayName = 'CategoryDetails';

const SubCategoryItem = memo(({subCategory, priority}: {subCategory: Category; priority: boolean}) => (
  <Link
    href={`/categories/${subCategory.uniqueCategoryName}`}
    className="flex flex-col border p-2"
    key={subCategory.id}
  >
    <div className="relative aspect-square">
      <ImageWithFallback
        className="object-contain"
        width={290}
        height={170}
        src={subCategory?.imageUrl}
        alt={subCategory.categoryName}
        priority={priority}
      />
    </div>
    <h6 className="text-lg font-normal text-center mt-4">{subCategory.categoryName}</h6>
  </Link>
));
SubCategoryItem.displayName = 'SubCategoryItem';

const CategoryHeader = memo(({category}: {category: Category}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpansion = useCallback(() => setIsExpanded(prev => !prev), []);

  return (
    <section>
      <div className="md:grid md:grid-cols-12 flex flex-col gap-2 md:gap-6 lg:gap-6">
        <div className="md:col-span-9">
          <h1 className="mb-3 text-black font-semibold text-3xl capitalize">
            {category.prefix && <span>{category.prefix}</span>}
            {category.categoryName}
            {category.suffix && <span>{category.suffix}</span>}
          </h1>
          <div>
            <div
              className={`text-base font-normal text-mute ${isExpanded ? '' : 'line-clamp-3'}`}
              dangerouslySetInnerHTML={{__html: category.categoryDescription}}
            />
            <button onClick={toggleExpansion} className="text-blue-500 text-sm font-medium mt-1">
              {isExpanded ? 'Show Less' : 'Show More'}
            </button>
          </div>
        </div>
        {category?.imageUrl ? (
          <div className={`relative hidden md:flex md:col-span-3 ${isExpanded ? 'h-full' : 'max-h-[14rem]'}`}>
            <ImageWithFallback
              src={category?.imageUrl}
              alt={category.uniqueCategoryName}
              className="object-contain"
              width={isExpanded ? 400 : 150}
              height={isExpanded ? 100 : 200}
              priority={true}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
});
CategoryHeader.displayName = 'CategoryHeader';
