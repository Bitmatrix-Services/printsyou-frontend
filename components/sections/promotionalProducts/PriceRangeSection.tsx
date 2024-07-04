import React, {useState} from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import {useRouter} from 'next/router';

const PriceRangeSection = () => {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | false>('panel1');
  const [priceRangeFilter, setPriceRangeFilter] = useState<number[]>([0, 500]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setPriceRangeFilter(newValue as number[]);
  };

  const setPriceRange = () => {
    let value = '/categories/' + (router.query.uniqueCategoryName as string[]).join('/');
    const filter = new URLSearchParams(
      `page=1&minPrice=${priceRangeFilter[0]}&maxPrice=${priceRangeFilter[1]}`
    );
    value += '?' + filter.toString();
    router.push(value, undefined, {
      shallow: true
    });
  };

  return (
    <>
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={(_, newExpanded: boolean) => {
          setExpanded(newExpanded ? 'panel1' : false);
        }}
        className="border-b border-[#e1e1e1] shadow-none"
      >
        <AccordionSummary
          expandIcon={expanded === 'panel1' ? <RemoveIcon /> : <AddIcon />}
          aria-controls="panel1a-content"
          id={`1header`}
          className="p-0"
        >
          <div className="flex my-1 md:pr-6 items-center">
            <h4 className=" text-body font-semibold text-sm  capitalize ">
              Price Range
            </h4>
          </div>
        </AccordionSummary>

        <AccordionDetails>
          <Box>
            <Slider
              getAriaLabel={() => 'Price Range'}
              value={priceRangeFilter}
              min={0}
              max={500}
              onChange={handleChange}
              valueLabelDisplay="auto"
            />

            <div className="flex justify-between align-middle content-center text-sm">
              <div className="flex flex-1 justify-center text-center text-[#303541] font-semibold border-[1px] leading-9 border-[#e8eff1]">
                <span>${priceRangeFilter[0]}</span>
              </div>
              <div className="mx-[10px] my-auto text-[#686d79]">To</div>
              <div className="flex flex-1 justify-center text-center text-[#303541] font-semibold border-[1px] leading-9 border-[#e8eff1]">
                <span>${priceRangeFilter[1]}</span>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => setPriceRange()}
                className="w-full  py-2 text-base font-bold  bg-primary-500 hover:bg-body text-white"
              >
                Set price range
              </button>
            </div>
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default PriceRangeSection;
