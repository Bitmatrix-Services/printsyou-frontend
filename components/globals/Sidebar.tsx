import React, {FC} from 'react';
import Link from 'next/link';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AddIcon from '@mui/icons-material/Add';
import sanitize from 'sanitize-html';

import PriceRangeSection from '@components/sections/promotionalProducts/PriceRangeSection';
import {Category} from '@store/slices/category/category';

interface SidebarProps {
  selectedCategory: Category;
}

const Sidebar: FC<SidebarProps> = ({selectedCategory}) => {
  return (
    <div className="xl:w-64 mb-6 xl:mb-0">
      {selectedCategory?.subCategories?.length > 0 && (
        <>
          <div className="lg:w-64 md:w-64 mb-4">
            <div className="xl:pr-4">
              <>
                <div
                  className={`mb-6 block text-body font-semibold text-sm  capitalize`}
                >
                  ITEM CATEGORIES
                </div>
                <ul className="text-sm  product-card__categories">
                  {selectedCategory.subCategories.map((category, index) => (
                    <li key={index} className=" mb-2">
                      <Link
                        className={`capitalize text-mute3`}
                        href={category.uniqueCategoryName}
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: sanitize(category.categoryName)
                          }}
                        ></span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            </div>
          </div>

          {/* <div className="lg:w-64 md:w-64 mb-8">
            <Accordion className="border-b border-[#e1e1e1] shadow-none">
              <AccordionSummary
                expandIcon={<AddIcon />}
                aria-controls="panel1a-content"
                id={`1header`}
                className="p-0"
              >
                <div className="flex my-1 md:pr-6 items-center">
                  <h4 className=" text-body font-semibold text-sm  capitalize ">
                    View Sub Categories
                  </h4>
                </div>
              </AccordionSummary>

              <AccordionDetails>
                <ul className="block text-sm  product-card__categories">
                  {selectedCategory.subCategories?.map((category, index) => (
                    <li key={index} className=" mb-2">
                      <Link
                        className={`capitalize text-mute3`}
                        href={category.uniqueCategoryName}
                      >
                        {category.categoryName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionDetails>
            </Accordion>
          </div> */}
          <div className="flex justify-center">
            <Link
              href="/promotional-products"
              className="text-sm font-medium  text-[#4598ff]"
            >
              View All
            </Link>
          </div>
        </>
      )}
      {/* <div className="lg:w-64 md:w-64 mb-8">
        <PriceRangeSection />
      </div> */}
    </div>
  );
};

export default Sidebar;
