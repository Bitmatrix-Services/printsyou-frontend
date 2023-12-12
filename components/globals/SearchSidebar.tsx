import React, {FC, useState, Dispatch, SetStateAction} from 'react';
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
import {useRouter} from 'next/router';
import {getMinMaxRange} from '@utils/utils';

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
  const router = useRouter();
  const {colors, category}: any = router.query;

  const [priceExpanded, setPriceExpanded] = useState<boolean>(true);
  const [colorExpanded, setColorExpanded] = useState<boolean>(true);
  const [categoryExpanded, setCategoryExpanded] = useState<boolean>(true);

  const handleFilterChange = (
    selectedValue: string,
    type: 'price' | 'colors'
  ) => {
    const updateColorFilters = (
      currentFilters: string | undefined,
      filterType: string
    ) => {
      let updatedFilters = currentFilters ? currentFilters.split(',') : [];

      if (updatedFilters.includes(selectedValue)) {
        updatedFilters = updatedFilters.filter(item => item !== selectedValue);
      } else {
        updatedFilters.push(selectedValue);
      }

      const currentQuery = router.query;
      let updatedQuery = currentQuery;
      if (updatedFilters.length > 0) {
        updatedQuery = {
          ...currentQuery,
          [filterType]: updatedFilters.join(','),
          page: '1'
        };
      } else {
        delete updatedQuery.colors;
      }

      router.push({
        pathname: router.pathname,
        query: updatedQuery
      });
    };

    const updatePriceFilters = (
      currentFilters: string[],
      filterType: string
    ) => {
      let updatedFilters = [...currentFilters];

      if (updatedFilters.includes(selectedValue)) {
        updatedFilters = updatedFilters.filter(item => item !== selectedValue);
      } else {
        updatedFilters.push(selectedValue);
      }

      // update local state
      setFilters({
        ...filters,
        [filterType]: updatedFilters
      });

      // update query params
      const currentQuery = router.query;
      let updatedQuery = currentQuery;
      if (updatedFilters && updatedFilters.length > 0) {
        const result = getMinMaxRange(updatedFilters);
        if (result.length) {
          let max = Number.NEGATIVE_INFINITY;
          let min = Number.POSITIVE_INFINITY;
          result.forEach(item => {
            max = Math.max(max, item.maxValue);
            min = Math.min(min, item.minValue);
          });

          updatedQuery = {
            ...currentQuery,
            minPrice: `${min}`,
            maxPrice: `${max}`,
            page: '1'
          };
        }
      } else {
        delete updatedQuery.maxPrice;
        delete updatedQuery.minPrice;
      }
      router.push({
        pathname: router.pathname,
        query: updatedQuery
      });
    };

    if (type === 'price') {
      updatePriceFilters(filters.price, 'price');
    } else if (type === 'colors') {
      updateColorFilters(colors, 'colors');
    }
  };

  return (
    <div className="xl:w-64 mb-6 xl:mb-0">
      {(colors || filters.price.length > 0 || category) && (
        <div className="lg:w-64 md:w-64 border border-[#edeff2] p-2">
          <h5 className="text-sm">YOUR SELECTIONS</h5>
          {colors &&
            colors.split(',')?.map((color: any) => (
              <div key={color}>
                <div className="flex justify-between items-center mt-3 mb-2">
                  <span className="text-xs">
                    Color Family: <strong>{color}</strong>
                  </span>
                  <span>
                    <XMarkIcon
                      className="h-4 w-4 cursor-pointer"
                      onClick={() => handleFilterChange(color, 'colors')}
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
          {category && (
            <div>
              <div className="flex justify-between items-center mt-3 mb-2">
                <span className="text-xs">
                  Category:{' '}
                  <strong>
                    {
                      byCategory.find(item => item.uCategoryName === category)
                        ?.name
                    }
                  </strong>
                </span>
                <span>
                  <XMarkIcon
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => {
                      let updatedQuery = {...router.query};
                      updatedQuery.page = '1';
                      delete updatedQuery.category;
                      router.push({
                        pathname: router.pathname,
                        query: updatedQuery
                      });
                    }}
                  />
                </span>
              </div>
              <hr />
            </div>
          )}
          <h5
            className="text-[10px] font-bold cursor-pointer mt-4"
            onClick={() => {
              let updatedQuery = {...router.query};
              delete updatedQuery.category;
              delete updatedQuery.minPrice;
              delete updatedQuery.maxPrice;
              delete updatedQuery.colors;
              updatedQuery.page = '1';
              router.push({
                pathname: router.pathname,
                query: updatedQuery
              });
            }}
          >
            Clear All
          </h5>
        </div>
      )}
      {byPriceRange?.length > 0 && (
        <div className="lg:w-64 md:w-64 mb-8">
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

            <AccordionDetails className="max-h-64 overflow-y-auto">
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
      {byColor?.length > 0 && (
        <div className="lg:w-64 md:w-64 mb-8">
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

            <AccordionDetails className="max-h-64 overflow-y-auto">
              <FormGroup>
                {byColor?.map(color => (
                  <FormControlLabel
                    key={color.name}
                    control={
                      <Checkbox
                        name={color.name}
                        checked={!!colors?.includes(color.name)}
                        onChange={e =>
                          handleFilterChange(e.target.name, 'colors')
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
      {byCategory?.length > 0 && !category && (
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

            <AccordionDetails className="max-h-64 overflow-y-auto">
              {byCategory?.map(category => (
                <div
                  key={category.uCategoryName}
                  className="block border-b-2 font-normal mb-2 cursor-pointer"
                  onClick={() => {
                    const currentQuery = router.query;
                    let updatedQuery = {
                      ...currentQuery,
                      category: category.uCategoryName,
                      page: '1'
                    };

                    router.push({
                      pathname: router.pathname,
                      query: updatedQuery
                    });
                  }}
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
