'use client';
import React, {FC, Fragment} from 'react';
import {Container} from '@components/globals/container.component';
import {Breadcrumb} from '@components/globals/breadcrumb.component';
import {Category} from '@components/home/home.types';
import Accordion from '@mui/joy/Accordion';
import AccordionSummary, {accordionSummaryClasses} from '@mui/joy/AccordionSummary';
import {accordionDetailsClasses, Avatar} from '@mui/joy';
import AccordionGroup from '@mui/joy/AccordionGroup';
import AccordionDetails from '@mui/joy/AccordionDetails';
import Typography from '@mui/joy/Typography';
import ListItemContent from '@mui/joy/ListItemContent';
import {ImageWithFallback} from '@components/globals/Image-with-fallback';
import Link from "next/link";

interface ICategoriesComponent {
  categoryList: Category[];
}

export const CategoriesComponent: FC<ICategoriesComponent> = ({categoryList}) => {
  return (
    <>
      <Breadcrumb list={[]} prefixTitle="All Categories" />
      <div className="bg-white py-8">
        <Container>
          <div className="pt-2 pb-11">
            <h1 className="text-3xl font-bold mb-6 text-center">All Promotional Categories</h1>
            <div className=" flex flex-wrap flex-1 flex-row">
              {categoryList?.length > 0 ? (
                categoryList.map(category => (
                  <div key={category.id} className="basis-[100%] sm:basis-[50%]">
                    <AccordionGroup
                      variant="plain"
                      transition="0.3s"
                      sx={{
                        maxWidth: 700,
                        borderRadius: 'md',
                        [`& .${accordionDetailsClasses.content}.${accordionDetailsClasses.expanded}`]: {
                          paddingBlock: '1rem'
                        },
                        [`& .${accordionSummaryClasses.button}`]: {
                          paddingBlock: '1rem'
                        }
                      }}
                    >
                      <Accordion>
                        <AccordionSummary>
                          <Avatar color="primary">
                            <ImageWithFallback
                              src={category.imageUrl}
                              alt={category.categoryName}
                              className="object-contain"
                              fill
                            />
                          </Avatar>
                          <ListItemContent>
                            <Link href={`/categories/${category.uniqueCategoryName}`}><Typography  sx={{
                                transition: 'color 0.3s',
                                '&:hover': {
                                    color: '#DB0481',
                                },
                            }} level="title-md">{category.categoryName}</Typography></Link>
                            <Typography level="body-sm">{category.metaDescription}</Typography>
                          </ListItemContent>
                        </AccordionSummary>
                        <AccordionDetails>
                          {(category.subCategories ?? []).map(subCategory => (
                            <div className="flex items-center px-5 py-2" key={subCategory.id}>
                              <Avatar color="primary" sx={{marginRight: '1rem'}}>
                                <ImageWithFallback
                                  src={subCategory.imageUrl}
                                  alt={subCategory.categoryName}
                                  className="object-contain"
                                  fill
                                />
                              </Avatar>
                              <ListItemContent>
                                <Typography level="title-md">{subCategory.categoryName}</Typography>
                                <Typography level="body-sm">{subCategory.metaDescription}</Typography>
                              </ListItemContent>
                            </div>
                          ))}
                        </AccordionDetails>
                      </Accordion>
                    </AccordionGroup>
                  </div>
                ))
              ) : (
                <div className="flex justify-center align-center items-center h-[20rem] w-full">
                  No Categories Found
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};
