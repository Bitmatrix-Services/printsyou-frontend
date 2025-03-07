import React, {memo, useMemo} from 'react';
import Link from 'next/link';
import sanitize from 'sanitize-html';
import {Category} from '@components/home/home.types';
import {AiFillCaretRight} from 'react-icons/ai';

interface CategoryListProps {
  selectedCategory?: Category;
  siblingCategories?: Category[];
  allCategories?: Category[];
}

const CategorySection = ({selectedCategory, siblingCategories, allCategories}: CategoryListProps) => {
  const {categories, title} = useMemo(() => {
    if (selectedCategory?.subCategories?.length) {
      return {
        categories: selectedCategory.subCategories,
        title: 'ITEM SUB CATEGORIES'
      };
    }

    if (siblingCategories?.length) {
      return {
        categories: siblingCategories,
        title: 'ITEM CATEGORIES'
      };
    }

    return {
      categories: allCategories || [],
      title: 'ITEM CATEGORIES'
    };
  }, [selectedCategory, siblingCategories, allCategories]);

  return (
    <div className="w-full lg:w-60 mb-4">
      <CategoryList categories={categories} title={title} />
    </div>
  );
};

const CategoryList = memo(({categories, title}: {categories: Category[]; title: string}) => {
  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.categoryName.localeCompare(b.categoryName)),
    [categories]
  );

  return (
    <>
      <div className="mb-6 block text-body font-semibold text-sm capitalize">{title}</div>
      <ul className="text-sm grid grid-cols-2 tablet:gap-x-4 tablet:grid-cols-3 md:grid-cols-3 lg:grid-cols-1">
        {sortedCategories.map(category => (
          <li className="flex mb-2 items-center" key={category.id}>
            <AiFillCaretRight className="text-primary-500" height={12} width={12} />
            <Link
              className="ml-1 capitalize text-mute3 hover:text-primary-500"
              href={`/categories/${category.uniqueCategoryName}`}
            >
              <span dangerouslySetInnerHTML={{__html: sanitize(category.categoryName)}} />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
});

CategoryList.displayName = 'CategoryList';
export default React.memo(CategorySection);
