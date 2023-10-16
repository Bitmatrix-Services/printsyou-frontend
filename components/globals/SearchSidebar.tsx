import React, {FC} from 'react';
import Link from 'next/link';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AddIcon from '@mui/icons-material/Add';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import RemoveIcon from '@mui/icons-material/Remove';
import {Category} from '@store/slices/category/category';

interface SidebarProps {
  selectedCategory: Category;
}

const SearchSidebar: FC<SidebarProps> = ({selectedCategory}) => {
  const [priceExpanded, setPriceExpanded] = React.useState<string | false>(
    'pricePanel'
  );
  const handlePriceChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setPriceExpanded(newExpanded ? panel : false);
    };
  const [colorExpanded, setColorExpanded] = React.useState<string | false>(
    'colorPanel'
  );
  const handleColorChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setColorExpanded(newExpanded ? panel : false);
    };
  const [categoryExpanded, setCategoryExpanded] = React.useState<
    string | false
  >('categoryPanel');
  const handleCategoryChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setCategoryExpanded(newExpanded ? panel : false);
    };
  return (
    <div className="xl:w-64 mb-6 xl:mb-0">
      {selectedCategory?.subCategories?.length > 0 && (
        <>
          <div className="lg:w-64 md:w-64 ">
            <Accordion
              expanded={priceExpanded === 'pricePanel'}
              onChange={handlePriceChange('pricePanel')}
              className=" shadow-none"
            >
              <AccordionSummary
                expandIcon={
                  priceExpanded === 'pricePanel' ? <RemoveIcon /> : <AddIcon />
                }
                aria-controls="panel1a-content"
                id={`1header`}
                className="p-0"
              >
                <div className="flex my-1 md:pr-6 items-center">
                  <h4 className=" text-body font-semibold text-sm  uppercase ">
                    Price
                  </h4>
                </div>
              </AccordionSummary>

              <AccordionDetails>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="$0.50 to $1.00"
                    className="border-b-2"
                  />
                  <FormControlLabel
                    required
                    control={<Checkbox />}
                    label="$0.50 to $1.00"
                    className="border-b-2"
                  />
                  <FormControlLabel
                    control={<Checkbox />}
                    label="$0.50 to $1.00"
                    className="border-b-2"
                  />
                </FormGroup>
              </AccordionDetails>
            </Accordion>
          </div>
          <div className="lg:w-64 md:w-64">
            <Accordion
              expanded={colorExpanded === 'colorPanel'}
              onChange={handleColorChange('colorPanel')}
              className=" shadow-none"
            >
              <AccordionSummary
                expandIcon={
                  colorExpanded === 'colorPanel' ? <RemoveIcon /> : <AddIcon />
                }
                aria-controls="panel1a-content"
                id={`1header`}
                className="p-0"
              >
                <div className="flex my-1 md:pr-6 items-center">
                  <h4 className=" text-body font-semibold text-sm  uppercase ">
                    COLOR FAMILY
                  </h4>
                </div>
              </AccordionSummary>

              <AccordionDetails>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Black"
                    className="border-b-2"
                  />
                  <FormControlLabel
                    required
                    control={<Checkbox />}
                    label="Blue"
                    className="border-b-2"
                  />
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Brown"
                    className="border-b-2"
                  />
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Gray"
                    className="border-b-2"
                  />
                  <FormControlLabel
                    required
                    control={<Checkbox />}
                    label="Green"
                    className="border-b-2"
                  />
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Orange"
                    className="border-b-2"
                  />
                </FormGroup>
              </AccordionDetails>
            </Accordion>
          </div>
          <div className="lg:w-64 md:w-64 mb-8">
            <Accordion
              expanded={categoryExpanded === 'categoryPanel'}
              onChange={handleCategoryChange('categoryPanel')}
              className=" shadow-none"
            >
              <AccordionSummary
                expandIcon={
                  categoryExpanded === 'categoryPanel' ? (
                    <RemoveIcon />
                  ) : (
                    <AddIcon />
                  )
                }
                aria-controls="panel1a-content"
                id={`1header`}
                className="p-0"
              >
                <div className="flex my-1 md:pr-6 items-center">
                  <h4 className=" text-body font-semibold text-sm  uppercase ">
                    CATEGORY
                  </h4>
                </div>
              </AccordionSummary>

              <AccordionDetails>
                <Link className="block border-b-2 font-normal mb-2" href="#">
                  desktop-office
                </Link>
                <Link className="block border-b-2 font-normal mb-2" href="#">
                  electronics
                </Link>
                <Link className="block border-b-2 font-normal mb-2" href="#">
                  keychains
                </Link>
                <Link className="block border-b-2 font-normal mb-2" href="#">
                  kids
                </Link>
              </AccordionDetails>
            </Accordion>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchSidebar;
