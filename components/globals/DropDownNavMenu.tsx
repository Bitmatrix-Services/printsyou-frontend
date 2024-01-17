import React, {useState} from 'react';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import Link from 'next/link';
import sanitizeHtml from 'sanitize-html';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Container from './Container';
import {useAppSelector} from '@store/hooks';
import {selectCategoryList} from '@store/slices/category/catgory.slice';

export const DropDownNavMenu = ({className}: {className?: any}) => {
  const categoryList = useAppSelector(selectCategoryList);
  const [showList, setShowList] = useState(false);

  return (
    <div
      className={`megamenu ${className} ${showList && 'show'} hidden md:block`}
      onMouseLeave={() => setShowList(false)}
    >
      <button
        type="button"
        onMouseEnter={() => setShowList(true)}
        className="megamenu-button p-4 relative transition-all duration-300 text-secondary-500 hover:text-white after:transition-all after:duration-300 after:absolute after:left-0 after:bottom-0 after:w-full after:h-0 after:bg-secondary-500 hover:after:h-full"
      >
        <div className="relative z-10 flex items-center gap-3">
          <span className="text-sm font-semibold capitalize">All Products</span>
          <ExpandMoreIcon className="h-6 w-6" />
        </div>
      </button>
      <div className="megamenu-inner">
        <Container>
          <ul className="menu-link columns-5 space-y-4">
            {categoryList?.map(category => (
              <li key={category.id} onClick={() => setShowList(false)}>
                <Link
                  className="flex text-sm text-mute hover:text-body transition-all duration-150 group"
                  href={`/${category.uniqueCategoryName}`}
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(category.categoryName)
                    }}
                  ></span>
                  <span className="ml-1 transition-all duration-150 opacity-0 group-hover:opacity-100">
                    <TrendingFlatIcon />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </div>
  );
};
