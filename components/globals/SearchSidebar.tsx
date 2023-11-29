import React, {Dispatch, FC, SetStateAction, useState} from 'react';
import Link from 'next/link';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AddIcon from '@mui/icons-material/Add';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {XMarkIcon} from '@heroicons/react/24/solid';
import RemoveIcon from '@mui/icons-material/Remove';
import sanitize from 'sanitize-html';

type searchType = {
  name: string;
  count: number;
};

type categoryType = {
  name: string;
  uCategoryName: string;
  count: number;
};

type filterType = {
  color: string[];
  price: string[];
};
interface SidebarProps {
  byCategory: categoryType[];
  byColor: searchType[];
  byPriceRange: searchType[];
  filters: filterType;
  setFilters: Dispatch<SetStateAction<filterType>>;
}

const SearchSidebar: FC<SidebarProps> = ({
  byCategory,
  byColor,
  byPriceRange,
  filters,
  setFilters
}) => {
  const [priceExpanded, setPriceExpanded] = useState<boolean>(true);
  const [colorExpanded, setColorExpanded] = useState<boolean>(true);
  const [categoryExpanded, setCategoryExpanded] = useState<boolean>(true);

  const handleFilterChange = (
    selectedValue: string,
    type: 'price' | 'color'
  ) => {
    const updateFilters = (currentFilters: string[], filterType: string) => {
      let updatedFilters = [...currentFilters];

      if (updatedFilters.includes(selectedValue)) {
        updatedFilters = updatedFilters.filter(item => item !== selectedValue);
      } else {
        updatedFilters.push(selectedValue);
      }

      setFilters({
        ...filters,
        [filterType]: updatedFilters
      });
    };

    if (type === 'price') {
      updateFilters(filters.price, 'price');
    } else if (type === 'color') {
      updateFilters(filters.color, 'color');
    }
  };

  return (
    <div className="xl:w-64 mb-6 xl:mb-0">
      {(filters.color.length > 0 || filters.price.length > 0) && (
        <div className="lg:w-64 md:w-64 border border-[#edeff2] p-2">
          <h5 className="text-sm">YOUR SELECTIONS</h5>
          {filters.color?.map(color => (
            <div key={color}>
              <div className="flex justify-between items-center mt-3 mb-2">
                <span className="text-xs">
                  Color Family: <strong>{color}</strong>
                </span>
                <span>
                  <XMarkIcon
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => handleFilterChange(color, 'color')}
                  />
                </span>
              </div>
              <hr />
            </div>
          ))}

          {filters.price?.map(price => (
            <div key={price}>
              <div className="flex justify-between items-center mt-3 mb-2">
                <span className="text-xs">
                  Price: <strong>{price}</strong>
                </span>
                <span>
                  <XMarkIcon
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => handleFilterChange(price, 'price')}
                  />
                </span>
              </div>
              <hr />
            </div>
          ))}
          <h5
            className="text-[10px] font-bold cursor-pointer mt-4"
            onClick={() => setFilters({color: [], price: []})}
          >
            Clear All
          </h5>
        </div>
      )}
      {byPriceRange && (
        <div className="lg:w-64 md:w-64 ">
          <Accordion
            expanded={priceExpanded}
            onChange={(_, newExpanded) => setPriceExpanded(newExpanded)}
            className=" shadow-none"
          >
            <AccordionSummary
              expandIcon={priceExpanded ? <RemoveIcon /> : <AddIcon />}
              aria-controls="panel1a-content"
              className="p-0"
            >
              <div className="flex my-1 md:pr-6 items-center">
                <h4 className=" text-body font-semibold text-sm  uppercase ">
                  Price
                </h4>
              </div>
            </AccordionSummary>

            <AccordionDetails className="max-h-64 overflow-y-scroll">
              <FormGroup>
                {byPriceRange?.map(price => (
                  <FormControlLabel
                    key={price.name}
                    control={
                      <Checkbox
                        name={price.name}
                        checked={!!filters?.price?.includes(price.name)}
                        onChange={e =>
                          handleFilterChange(e.target.name, 'price')
                        }
                      />
                    }
                    label={
                      <div>
                        <span>{price.name}</span>
                        <span className="text-xs font-bold text-primary ml-2">
                          ({price.count})
                        </span>
                      </div>
                    }
                    className="border-b-2"
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        </div>
      )}
      {byColor && (
        <div className="lg:w-64 md:w-64">
          <Accordion
            expanded={colorExpanded}
            onChange={(_, newExpanded) => setColorExpanded(newExpanded)}
            className=" shadow-none"
          >
            <AccordionSummary
              expandIcon={colorExpanded ? <RemoveIcon /> : <AddIcon />}
              aria-controls="panel1a-content"
              className="p-0"
            >
              <div className="flex my-1 md:pr-6 items-center">
                <h4 className=" text-body font-semibold text-sm  uppercase ">
                  COLOR FAMILY
                </h4>
              </div>
            </AccordionSummary>

            <AccordionDetails className="max-h-64 overflow-y-scroll">
              <FormGroup>
                {byColor?.map(color => (
                  <FormControlLabel
                    key={color.name}
                    control={
                      <Checkbox
                        name={color.name}
                        checked={!!filters?.color?.includes(color.name)}
                        onChange={e =>
                          handleFilterChange(e.target.name, 'color')
                        }
                      />
                    }
                    label={
                      <div>
                        <span>{color.name}</span>
                        <span className="text-xs font-bold text-primary ml-2">
                          ({color.count})
                        </span>
                      </div>
                    }
                    className="border-b-2"
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        </div>
      )}
      {byCategory && (
        <div className="lg:w-64 md:w-64 mb-8">
          <Accordion
            expanded={categoryExpanded}
            onChange={(_, newExpanded) => setCategoryExpanded(newExpanded)}
            className=" shadow-none"
          >
            <AccordionSummary
              expandIcon={categoryExpanded ? <RemoveIcon /> : <AddIcon />}
              aria-controls="panel1a-content"
              className="p-0"
            >
              <div className="flex my-1 md:pr-6 items-center">
                <h4 className=" text-body font-semibold text-sm  uppercase ">
                  CATEGORY
                </h4>
              </div>
            </AccordionSummary>

            <AccordionDetails className="max-h-64 overflow-y-scroll">
              {byCategory?.map(category => (
                <div
                  key={category.uCategoryName}
                  className="block border-b-2 font-normal mb-2"
                >
                  <span
                    dangerouslySetInnerHTML={{__html: sanitize(category.name)}}
                  ></span>
                  <span className="text-xs font-bold text-primary ml-2">
                    ({category.count})
                  </span>
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default SearchSidebar;
