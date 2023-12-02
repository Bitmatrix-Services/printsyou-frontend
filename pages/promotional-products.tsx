import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';

import PageHeader from '@components/globals/PageHeader';
import Container from '@components/globals/Container';
import {useAppSelector} from '@store/hooks';
import {selectCategoryList} from '@store/slices/category/catgory.slice';
import sanitize from 'sanitize-html';
import {NextSeo} from 'next-seo';
import {metaConstants} from '@utils/Constants';

const ViewAllCategories = () => {
  const categoryList = useAppSelector(selectCategoryList);
  return (
    <>
      <NextSeo title={`Categories | ${metaConstants.SITE_NAME}`} />
      <PageHeader pageTitle={'Promotional Products Categories'} />
      <Container>
        <div className="py-12">
          <div className=" flex flex-wrap flex-1 flex-row gap-3">
            {categoryList?.map(category => (
              <div key={category.id} className=" basis-[100%] sm:basis-[48%]">
                <Accordion className="border border-[#e1e1e1] shadow-none">
                  <AccordionSummary
                    expandIcon={<AddIcon />}
                    aria-controls="panel1a-content"
                    id={`${category.id}-header`}
                  >
                    <div className="flex my-1 md:pr-6 items-center">
                      <h4 className="text-[16px] text-[#303541] font-bold capitalize">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: sanitize(category.categoryName)
                          }}
                        ></span>
                      </h4>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ul className="block text-sm  product-card__categories pl-8">
                      {category?.subCategories?.map(subCat => (
                        <li key={subCat.id} className=" mb-2">
                          <Link
                            className={`capitalize text-mute3`}
                            href={subCat.uniqueCategoryName}
                          >
                            <span
                              dangerouslySetInnerHTML={{
                                __html: sanitize(subCat.categoryName)
                              }}
                            ></span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionDetails>
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
};

export default ViewAllCategories;
