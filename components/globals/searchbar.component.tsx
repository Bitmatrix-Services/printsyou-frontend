'use client';
import {Box} from '@mui/joy';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {useDebounce} from '../../hooks/useDeboune';
import Input from '@mui/joy/Input';
import {ClickAwayListener} from '@mui/base/ClickAwayListener';
import {Popper} from '@mui/base/Popper';
import Link from 'next/link';
import {ImageWithFallback} from '@components/globals/Image-with-fallback';
import {useRouter} from 'next/navigation';
import {MdArrowForward, MdSearch} from 'react-icons/md';
import * as React from 'react';
import {v4 as uuidv4} from 'uuid';

type ItemType = {
  id: string;
  imageUrl: string;
  name: string;
  uniqueName: string;
};

interface SearchResult {
  categories?: ItemType[];
  products?: ItemType[];
}

export const Searchbar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResult, setSearchResult] = useState<SearchResult>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState<boolean>(false);

  const debouncedValue = useDebounce<string>(searchQuery, 500);

  useEffect(() => {
    if (searchQuery) handleSearch();
  }, [debouncedValue, searchQuery]);

  const handleSearch = async () => {
    try {
      const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/search?query=${searchQuery}`);
      if (data.payload?.categories || data.payload?.products) {
        let result = data.payload;
        setSearchResult(result);
      } else {
        setSearchResult({
          categories: [],
          products: []
        });
      }
      setOpen(true);
    } catch (error) {
      setSearchResult({
        categories: [],
        products: []
      });
    }
  };

  const handleClickAway = () => {
    setOpen(false);
    setSearchResult({
      categories: [],
      products: []
    });
  };

  const handleSeeAllResults = () => {
    if (searchQuery) {
      router.push(`/search-results?keywords=${searchQuery}&filter=priceHighToLow&size=24&page=1`);
      handleClickAway();
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{position: 'relative'}}>
        <Input
          className="py-2"
          placeholder="Search for Categories or Products"
          value={searchQuery}
          onChange={e => {
            setAnchorEl(e.currentTarget);
            setSearchQuery(e.target.value);
          }}
          onFocus={_ => {
            // if (searchQuery) handleSearch();
            // setAnchorEl(event.currentTarget);
          }}
          onKeyDown={({key}) => {
            if (key === 'Enter') {
              handleSeeAllResults();
            }
          }}
          sx={{
            width: '100%',
            borderColor: 'primary.main'
          }}
        />
        <span className="absolute top-0 right-0 text-mute4 p-[0.688rem]">
          <MdSearch className="h-6 w-6" onClick={() => handleSeeAllResults()} />
        </span>
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="bottom-start"
          style={{zIndex: 9999, width: anchorEl?.clientWidth ? anchorEl?.clientWidth + 25 : 0, paddingTop: 9}}
        >
          <div className="search-menu absolute right-3 z-20 w-full overflow-auto bg-white border border-[#ddd] shadow-md p-2 rounded-b-md">
            {searchResult?.categories?.length || searchResult?.products?.length ? (
              <div className="grid grid-cols-2 ">
                {searchResult?.categories && (
                  <fieldset className="col-span-1">
                    <h6 className="mb-3 text-base font-semibold text-primary-500 uppercase">Categories</h6>
                    <ul className="space-y-2">
                      {searchResult.categories.map(category => (
                        <Link
                          className="hover:cursor-pointer"
                          href={`/categories/${category.uniqueName}`}
                          key={uuidv4()}
                          onClick={() =>
                            setTimeout(() => {
                              handleClickAway();
                            }, 500)
                          }
                        >
                          <div className="flex gap-3 justify-start hover:bg-gray-100 p-2 border-t border-[#eee]">
                            <span className="block relative h-12 w-12 min-w-[3rem]">
                              <ImageWithFallback
                                fill
                                className="object-contain"
                                src={category.imageUrl}
                                alt="category"
                              />
                            </span>
                            <span className="font-normal flex text-xs items-center">
                              <b
                                className="underline"
                                dangerouslySetInnerHTML={{
                                  __html: category.name
                                }}
                              ></b>
                            </span>
                          </div>
                        </Link>
                      ))}
                    </ul>
                  </fieldset>
                )}
                {searchResult?.products && (
                  <fieldset className="col-span-1">
                    <h6 className="mb-3 text-base font-semibold text-primary-500 uppercase">Product Matches</h6>
                    <ul className="space-y-2">
                      {searchResult.products.map(product => (
                        <Link
                          className="hover:cursor-pointer"
                          href={`/products/${product.uniqueName}`}
                          key={uuidv4()}
                          onClick={() =>
                            setTimeout(() => {
                              handleClickAway();
                            }, 500)
                          }
                        >
                          <div className="flex gap-3 justify-start hover:bg-gray-100 p-2 border-t border-[#eee]">
                            <span className="block relative h-12 w-12 min-w-[3rem]">
                              <ImageWithFallback fill className="object-contain" src={product.imageUrl} alt="product" />
                            </span>

                            <span className="font-normal flex text-xs items-center">
                              <b
                                className="underline"
                                dangerouslySetInnerHTML={{
                                  __html: product.name
                                }}
                              ></b>
                            </span>
                          </div>
                        </Link>
                      ))}
                    </ul>
                    <h6 className="mb-3 text-base font-semibold text-primary-500  text-end uppercase  cursor-pointer">
                      <div className="flex justify-end" onClick={() => handleSeeAllResults()}>
                        {' '}
                        See All Results <MdArrowForward className=" h-5 w-6" />
                      </div>
                    </h6>
                  </fieldset>
                )}
              </div>
            ) : (
              <fieldset>
                <h6 className="text-base font-semibold text-primary-500 uppercase">No Match Found</h6>
              </fieldset>
            )}
          </div>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};
