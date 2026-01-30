import React, {FC, memo} from 'react';
import {Category} from '@components/home/home.types';
import Link from 'next/link';

interface CategoriesSidebarProps {
    allCategories: Category[];
    selectedCategory: Category;
    siblingCategories: Category[];
}

const CategoriesSidebar: FC<CategoriesSidebarProps> = memo(({
                                                                allCategories,
                                                                selectedCategory,
                                                                siblingCategories
                                                            }) => {
    // Use sibling categories if available, otherwise use all categories
    const categoriesToShow = siblingCategories.length > 0 ? siblingCategories : allCategories;

    return (
        <nav className="space-y-1">
            {categoriesToShow.map((category) => {
                const isActive = category.id === selectedCategory.id;

                return (
                    <Link
                        key={category.id}
                        href={`/categories/${category.uniqueCategoryName}`}
                        className={`
              block px-3 py-2 text-sm font-medium rounded-md transition-colors
              ${isActive
                            ? 'bg-blue-50 text-blue-700 font-semibold'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }
            `}
                    >
                        {category.categoryName}
                    </Link>
                );
            })}
        </nav>
    );
});

CategoriesSidebar.displayName = 'CategoriesSidebar';

export default CategoriesSidebar;