import React from 'react';

import PageHeader from '@components/globals/PageHeader';
import Container from '@components/globals/Container';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';

const categoryList = [
  'Appreal',
  'Awards',
  'Bags',
  'Calendars',
  'Candy Jars',
  'Car and Truck',
  'Clipboards',
  'Clocks & Watches',
  'Desktop & Office',
  'Displays and Signage',
  'Drinkware',
  'EMT / EMS',
  'Environmentally Friendly',
  'Events and Holidays',
  'Foam',
  'Food & Snack',
  'Health & Safety',
  'Home & Garden',
  'Keychains',
  'Kids',
  'Lanyards & Badges',
  'Light Up and Sound',
  'Made In the USA',
  'Magnets',
  'Mouse Pads',
  'Outdoor Items',
  'Padfolios & Journals',
  'Paper Products',
  'Pens, Pencils, & More',
  'Personal Care',
  'Pet Products',
  'Professions',
  'School',
  'Shapes',
  'Sports',
  'Sticky Notes',
  'Stress Relievers',
  'Technology & Mobile',
  'Tools & Flashlights',
  'Towels',
  'Trade Show',
  'Travel & Luggage',
  'Umbrellas'
];
const subCategoryList = [
  {title: 'Aprons', link: '#'},
  {title: 'Belts and Suspenders', link: '#'},
  {title: 'Footwear', link: '#'},
  {title: 'Gloves', link: '#'},
  {title: "Hats N' Caps", link: '#'},
  {title: 'Patches', link: '#'},
  {title: 'Ponchos', link: '#'},
  {title: 'Robes', link: '#'},
  {title: 'Safety', link: '#'},
  {title: 'Scarves', link: '#'}
];

const ViewAllCategories = () => {
  return (
    <>
      <PageHeader pageTitle={'Promotional Products Categories'} />
      <Container>
        <div className="py-12">
          <div className=" flex flex-wrap flex-1 flex-row gap-3">
            {categoryList.map((category, index) => (
              <div key={index} className=" basis-[100%] sm:basis-[48%]">
                <Accordion className="border border-[#e1e1e1] shadow-none">
                  <AccordionSummary
                    expandIcon={<AddIcon />}
                    aria-controls="panel1a-content"
                    id={`${index}-header`}
                    className=""
                  >
                    <div className="flex my-1 md:pr-6 items-center">
                      <h4 className="text-[16px] text-[#303541] font-bold capitalize">
                        {category}
                      </h4>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ul className="block text-sm  product-card__categories pl-8">
                      {subCategoryList.map((category, index) => (
                        <li key={index} className=" mb-2">
                          <Link
                            className={`capitalize text-mute3`}
                            href={category.link}
                          >
                            {category.title}
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
