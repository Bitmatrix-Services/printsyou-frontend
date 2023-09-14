import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

const PriceRangeSection = () => {
  const [expanded, setExpanded] = React.useState<string | false>('panel1');
  const [value, setValue] = React.useState<number[]>([20, 37]);
  const [value1, setValue1] = React.useState(20);
  const [value2, setValue2] = React.useState(37);

  const handleChange = (event: Event, newValue: number | number[]) => {
    const newvalue1 = newValue as number[];
    setValue1(newvalue1[0]);
    setValue2(newvalue1[1]);
    setValue(newValue as number[]);
  };
  const handleChange1 =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  return (
    <>
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange1('panel1')}
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
              getAriaLabel={() => 'Temperature range'}
              value={value}
              onChange={handleChange}
              valueLabelDisplay="auto"
            />

            <div className="flex justify-between align-middle content-center text-sm">
              <div className="flex flex-1 justify-center text-center text-[#303541] font-semibold border-[1px] leading-9 border-[#e8eff1]">
                <span>${value1}</span>
              </div>
              <div className="mx-[10px] my-auto text-[#686d79]">To</div>
              <div className="flex flex-1 justify-center text-center text-[#303541] font-semibold border-[1px] leading-9 border-[#e8eff1]">
                <span>${value2}</span>
              </div>
            </div>
            <div className="mt-4">
              <button className="w-full  py-2 text-base font-bold  bg-primary-500 hover:bg-body text-white">
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
