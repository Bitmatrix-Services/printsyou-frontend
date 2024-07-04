import React, {FC, useEffect, useState} from 'react';
import Link from 'next/link';
import sanitize from 'sanitize-html';
import {Category} from '@store/slices/category/category';
import PriceRangeSection from '@components/sections/promotionalProducts/PriceRangeSection';
import {useAppDispatch, useAppSelector} from '@store/hooks';
import {
  getSiblingCategories,
  selectCategoryList,
  selectSiblingCategories
} from '@store/slices/category/catgory.slice';
import {Autocomplete, TextField} from '@mui/material';
import {useRouter} from 'next/router';
import Image from 'next/image';

interface SidebarProps {
  selectedCategory: Category;
}

interface CategoryOptions {
  label: string;
  value: string;
}

const Sidebar: FC<SidebarProps> = ({selectedCategory}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const siblingCategories = useAppSelector(selectSiblingCategories);

  const categoryList = useAppSelector(selectCategoryList);

  const [selectedCat, setSelectedCat] = useState<CategoryOptions | null>(null);

  useEffect(() => {
    if (selectedCategory) dispatch(getSiblingCategories(selectedCategory.id));
  }, [selectedCategory]);

  return (
    <div className="xl:w-64 mb-6 xl:mb-0">
      <div className="lg:w-64 md:w-64 mb-4">
        <div className="xl:pr-4">
          {selectedCategory?.subCategories?.length > 0 ? (
            <>
              <div
                className={`mb-6 block text-body font-semibold text-sm  capitalize`}
              >
                ITEM SUB CATEGORIES
              </div>
              <ul className="text-sm grid grid-cols-2 md:grid-cols-1 product-card__categories">
                {[...selectedCategory.subCategories]
                  .sort((a: Category, b: Category) =>
                    a.categoryName.localeCompare(b.categoryName)
                  )
                  .map(category => (
                    <li key={category.id} className="flex items-center mb-2">
                      <Image
                        width={7}
                        height={10}
                        className="relative"
                        src="/assets/icon-bullet-orange.png"
                        alt="bullet"
                      />
                      <Link
                        className={`ml-1 capitalize text-mute3`}
                        href={`/categories/${category.uniqueCategoryName}`}
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: sanitize(category.categoryName).replace(
                              'SYMLINK',
                              ''
                            )
                          }}
                        ></span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </>
          ) : (
            <>
              <div
                className={`mb-6 block text-body font-semibold text-sm  capitalize`}
              >
                ITEM CATEGORIES
              </div>
              <ul className="text-sm grid grid-cols-2 md:grid-cols-1  product-card__categories">
                {[...siblingCategories]
                  ?.sort((a: Category, b: Category) =>
                    a.categoryName.localeCompare(b.categoryName)
                  )
                  .map((category, index) => (
                    <li key={index} className="flex items-center mb-2">
                      <Image
                        width={7}
                        height={10}
                        className="relative"
                        src="/assets/icon-bullet-orange.png"
                        alt="bullet"
                      />
                      <Link
                        className={`ml-1 capitalize text-mute3`}
                        href={`/categories/${category.uniqueCategoryName}`}
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: sanitize(category.categoryName).replace(
                              'SYMLINK',
                              ''
                            )
                          }}
                        ></span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Link
          href="/promotional-products"
          className="text-sm font-medium  text-[#4598ff]"
        >
          View All
        </Link>
      </div>

      <Autocomplete
        className="w-full my-6"
        disablePortal
        value={selectedCat}
        id="all-category-select"
        getOptionLabel={option => option.label}
        options={categoryList?.map(category => {
          return {
            label: category.categoryName,
            value: category.uniqueCategoryName
          };
        })}
        renderInput={params => (
          <TextField {...params} label="Search Category" />
        )}
        onChange={(e, selectedValue: CategoryOptions | null) => {
          if (selectedValue) {
            setSelectedCat(selectedValue);
            router.push(`/categories/${selectedValue.value}`);
          } else {
            setSelectedCat(null);
          }
        }}
      />

      <div className="lg:w-64 md:w-64 mb-8">
        {/*<PriceRangeSection />*/}
      </div>
    </div>
  );
};

export default Sidebar;
