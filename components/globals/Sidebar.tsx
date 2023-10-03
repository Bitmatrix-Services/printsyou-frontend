import React from 'react';
import Link from 'next/link';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import PriceRangeSection from '@components/sections/promotionalProducts/PriceRangeSection';

const categoryList = [
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

const Sidebar = () => {
  const [category, setCategory] = React.useState('');

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

  return (
    <div className="xl:w-64 mb-6 xl:mb-0">
      <div className="lg:w-64 md:w-64 mb-4">
        <div className="xl:pr-4">
          <div
            className={`mb-6 block text-body font-semibold text-sm  capitalize`}
          >
            ITEM CATEGORIES
          </div>
          <ul className="text-sm  product-card__categories">
            {categoryList.map((category, index) => (
              <li key={index} className=" mb-2">
                <Link className={`capitalize text-mute3`} href={category.link}>
                  {category.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="lg:w-64 md:w-64 mb-8">
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
      <div className="lg:w-64 md:w-64 mb-8 border-b border-[#e1e1e1] shadow-none pb-6">
        <div className="flex flex-col md:flex-row xl:flex-col gap-4">
          <div className="flex justify-between">
            <div className="mr-3">
              <h4 className=" text-body font-semibold text-sm font-poppins capitalize ">
                CHANGE CATEGORY
              </h4>
            </div>
            <div>
              <Link href="#" className="text-xs font-medium  text-[#4598ff]">
                View All
              </Link>
            </div>
          </div>
          <div>
            <Box sx={{minWidth: 120}}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">
                  Categories
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={category}
                  label="Categories"
                  onChange={handleCategoryChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>

                  {categoryList?.map((category, index) => (
                    <MenuItem key={index} value={index}>
                      {category.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </div>
        </div>
      </div>
      <div className="lg:w-64 md:w-64 mb-8">
        <PriceRangeSection />
      </div>
    </div>
  );
};

export default Sidebar;
