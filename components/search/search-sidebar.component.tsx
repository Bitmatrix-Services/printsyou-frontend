'use client';
import React, {Dispatch, FC, SetStateAction, useState} from 'react';
import Accordion from '@mui/joy/Accordion';
import AccordionSummary from '@mui/joy/AccordionSummary';
import AccordionDetails from '@mui/joy/AccordionDetails';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {getMinMaxRange} from '@utils/utils';
import {Checkbox, FormControl, FormLabel, Stack} from '@mui/joy';
import {IoRemove} from 'react-icons/io5';
import {IQueryParams} from '@components/search/search-results-section';
import {allowableSearchParams} from '@utils/constants';
import {setFilterSidebarOpen} from '../../store/slices/cart/cart.slice';
import {useAppDispatch} from '../../store/hooks';

type searchType = {
  name: string;
  count: number;
};

export type CategoryType = {
  name: string;
  ucategoryName: string;
  count: number;
};

type filterType = {
  price: string[];
};

interface SidebarProps {
  byCategory: CategoryType[];
  byColor: searchType[];
  byPriceRange: searchType[];
  filters: filterType;
  setFilters: Dispatch<SetStateAction<filterType>>;
  isMobileMenu?: boolean;
}

export const SearchSidebar: FC<SidebarProps> = ({
  byCategory,
  byColor,
  byPriceRange,
  filters,
  setFilters,
  isMobileMenu
}) => {
  const router = useRouter();
  const disptach = useAppDispatch();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const {colors, category}: IQueryParams = Object.fromEntries(
    allowableSearchParams.map(param => [param, searchParams.get(param)])
  );

  const [priceExpanded, setPriceExpanded] = useState<boolean>(true);
  const [colorExpanded, setColorExpanded] = useState<boolean>(true);
  const [categoryExpanded, setCategoryExpanded] = useState<boolean>(true);

  const handleFilterChange = (selectedValue: string, type: 'price' | 'colors') => {
    const updateColorFilters = (currentFilters: string | undefined, filterType: string) => {
      let updatedFilters = currentFilters ? currentFilters.split(',') : [];

      if (updatedFilters.includes(selectedValue)) {
        updatedFilters = updatedFilters.filter(item => item !== selectedValue);
      } else {
        updatedFilters.push(selectedValue);
      }

      let updatedQuery = getUpdatedQueryParams();

      if (updatedFilters.length > 0) {
        updatedQuery = {
          ...updatedQuery,
          [filterType]: updatedFilters.join(','),
          page: '1'
        };
      } else {
        delete updatedQuery.colors;
      }

      const updatedParams = new URLSearchParams(updatedQuery);
      router.push(`${pathname}?${updatedParams.toString()}`);
    };

    const updatePriceFilters = (currentFilters: string[], filterType: string) => {
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

      let updatedQuery = getUpdatedQueryParams();

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
            ...updatedQuery,
            minPrice: `${min}`,
            maxPrice: `${max}`,
            page: '1'
          };
        }
      } else {
        delete updatedQuery.maxPrice;
        delete updatedQuery.minPrice;
      }

      const updatedParams = new URLSearchParams(updatedQuery);
      router.push(`${pathname}?${updatedParams.toString()}`);
    };

    if (type === 'price') {
      updatePriceFilters(filters.price, 'price');
    } else if (type === 'colors') {
      updateColorFilters(colors, 'colors');
    }

    if (isMobileMenu) {
      disptach(setFilterSidebarOpen(false));
    }
  };

  const getUpdatedQueryParams = (): Record<string, any> => {
    let updatedQuery: Record<string, any> = {};

    searchParams.forEach((value, key) => {
      if (~allowableSearchParams.indexOf(key)) {
        updatedQuery[key] = value;
      }
    });

    return updatedQuery;
  };

  const handleClearAllFilters = () => {
    let updatedQuery = getUpdatedQueryParams();
    delete updatedQuery.category;
    delete updatedQuery.minPrice;
    delete updatedQuery.maxPrice;
    delete updatedQuery.colors;
    updatedQuery.page = '1';
    setFilters({price: []});
    router.push(`${pathname}?${new URLSearchParams(updatedQuery)}`);

    if (isMobileMenu) {
      disptach(setFilterSidebarOpen(false));
    }
  };

  return (
    <div className="xl:w-64 mb-6 xl:mb-0">
      {(colors || filters.price.length > 0 || category) && (
        <div className="lg:w-64 md:w-64 border border-[#edeff2] p-2 ">
          <h5 className="text-sm">YOUR SELECTIONS</h5>
          {colors &&
            colors.split(',')?.map((color: any) => (
              <div key={color.name}>
                <div className="flex justify-between items-center mt-3 mb-2">
                  <span className="text-xs">
                    Color Family: <strong className="capitalize">{color}</strong>
                  </span>
                  <span>
                    <IoRemove
                      className="h-4 w-4 cursor-pointer hover:text-primary-500"
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
                  <IoRemove
                    className="h-4 w-4 cursor-pointer hover:text-primary-500"
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
                  Category: <strong>{byCategory.find(item => item.ucategoryName === category)?.name}</strong>
                </span>
                <span>
                  <IoRemove
                    className="h-4 w-4 cursor-pointer hover:text-primary-500"
                    onClick={() => {
                      const updatedQuery = getUpdatedQueryParams();

                      updatedQuery.page = '1';
                      delete updatedQuery.category;
                      router.push(`${pathname}?${new URLSearchParams(updatedQuery)}`);
                    }}
                  />
                </span>
              </div>
              <hr />
            </div>
          )}
          <div className="text-[12px] font-bold mt-4">
            <div className="cursor-pointer hover:text-primary-500" onClick={() => handleClearAllFilters()}>
              Clear All
            </div>
          </div>
        </div>
      )}
      {byPriceRange?.length > 0 && (
        <div className="lg:w-64 md:w-64 my-8">
          <Accordion
            expanded={priceExpanded}
            onChange={(_: any, newExpanded: boolean) => setPriceExpanded(newExpanded)}
            className=" shadow-none"
          >
            <AccordionSummary>
              <div className="flex my-1 md:pr-6 items-center">
                <h4 className=" text-body font-semibold text-sm  uppercase ">Price</h4>
              </div>
            </AccordionSummary>

            <AccordionDetails className="max-h-64 overflow-y-auto">
              {byPriceRange?.map(price => (
                <FormControl className="block border-b-2 font-normal" key={`${price.name}${price.count}`}>
                  <Stack direction="row" alignItems="center" spacing={1} marginTop={1} marginBottom={1}>
                    <Checkbox
                      size="md"
                      name={price.name}
                      checked={!!filters?.price?.includes(price.name)}
                      onChange={e => handleFilterChange(e.target.name, 'price')}
                    />
                    <FormLabel>
                      <div>
                        <span>{price.name}</span>
                        <span className="text-xs font-bold text-primary-500 ml-2">({price.count})</span>
                      </div>
                    </FormLabel>
                  </Stack>
                </FormControl>
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
      )}
      {byColor?.length > 0 && (
        <div className="lg:w-64 md:w-64 my-8">
          <Accordion
            expanded={colorExpanded}
            onChange={(_: any, newExpanded: boolean) => setColorExpanded(newExpanded)}
            className="shadow-none"
          >
            <AccordionSummary>
              <div className="flex my-1 md:pr-6 items-center">
                <h4 className=" text-body font-semibold text-sm  uppercase ">COLOR FAMILY</h4>
              </div>
            </AccordionSummary>

            <AccordionDetails className="max-h-64 overflow-y-auto">
              {byColor?.map(color => (
                <FormControl key={color.count} className="block border-b-2 font-normal">
                  <Stack direction="row" alignItems="center" spacing={1} marginTop={1} marginBottom={1}>
                    <Checkbox
                      name={color.name}
                      checked={!!colors?.includes(color.name)}
                      onChange={e => handleFilterChange(e.target.name, 'colors')}
                    />
                    <FormLabel>
                      <div>
                        <span className="capitalize">{color.name}</span>
                        <span className="text-xs font-semibold text-primary-500 ml-2">({color.count})</span>
                      </div>
                    </FormLabel>
                  </Stack>
                </FormControl>
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
      )}
      {byCategory?.length > 0 && !category && (
        <div className="lg:w-64 md:w-64 my-8">
          <Accordion
            expanded={categoryExpanded}
            onChange={(_: any, newExpanded: boolean) => setCategoryExpanded(newExpanded)}
            className=" shadow-none"
          >
            <AccordionSummary>
              <div className="flex my-1 md:pr-6 items-center">
                <h4 className=" text-body font-semibold text-sm  uppercase ">CATEGORY</h4>
              </div>
            </AccordionSummary>

            <AccordionDetails className="max-h-64 overflow-y-auto">
              {byCategory?.map(catItem => (
                <FormControl key={catItem.ucategoryName} className="block border-b-2 font-normal">
                  <Stack direction="row" alignItems="center" spacing={1} marginTop={1} marginBottom={1}>
                    <div
                      className="block font-normal cursor-pointer"
                      onClick={() => {
                        let updatedQuery = getUpdatedQueryParams();
                        updatedQuery = {
                          ...updatedQuery,
                          category: catItem.ucategoryName,
                          page: '1'
                        };
                        router.push(`${pathname}?${new URLSearchParams(updatedQuery)}`);
                        if (isMobileMenu) {
                          disptach(setFilterSidebarOpen(false));
                        }
                      }}
                    >
                      <FormLabel className="cursor-pointer">
                        <span dangerouslySetInnerHTML={{__html: catItem.name}}></span>
                        <span className="text-xs font-semibold text-primary-500 ml-2">({catItem.count})</span>
                      </FormLabel>
                    </div>
                  </Stack>
                </FormControl>
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
      )}
    </div>
  );
};
