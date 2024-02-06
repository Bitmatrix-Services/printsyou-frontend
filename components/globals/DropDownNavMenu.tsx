import React, {FC, useState} from 'react';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import Link from 'next/link';
import sanitizeHtml from 'sanitize-html';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Container from './Container';
import {Category} from '@store/slices/category/category';

interface DropDownNavMenuProps {
  subCatList: Category[];
  className?: string;
  title: string;
}

export const DropDownNavMenu: FC<DropDownNavMenuProps> = ({
  title,
  className,
  subCatList
}) => {
  const [showList, setShowList] = useState<boolean>(false);

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
        <div className="relative z-10 flex items-center">
          <span className="text-sm font-semibold capitalize">{title}</span>
          <ExpandMoreIcon className="h-6 w-6" />
        </div>
      </button>
      <div className="megamenu-inner">
        <Container>
          <ul className="menu-link columns-5 space-y-4">
            {subCatList?.map(category => (
              <li key={category.id} onClick={() => setShowList(false)}>
                <Link
                  className="flex text-sm text-mute hover:text-secondary-500 transition-all duration-150 group"
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
