import React, {Fragment, useEffect, useState} from 'react';
import {http} from 'services/axios.service';
import ImageWithFallback from '@components/ImageWithFallback';
import Link from 'next/link';
import sanitize from 'sanitize-html';
import {useRouter} from 'next/router';
import {useDebounce} from 'hooks/useDeboune';
import SearchIcon from '@components/icons/SearchIcon';
import {Listbox, Transition} from '@headlessui/react';
import {ChevronUpDownIcon} from '@heroicons/react/20/solid';

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

const defaultCategories = [
  {id: 1, name: 'All Categories'},
  {id: 2, name: 'Accessories'},
  {id: 3, name: 'Technology'},
  {id: 4, name: 'Mobile phones and Tablets'},
  {id: 5, name: 'Calendars'},
  {id: 6, name: 'Drinkware'},
  {id: 7, name: 'Outdoor'},
  {id: 8, name: 'Pet Items'},
  {id: 9, name: 'Writing'}
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const SearchBar = () => {
  const [selectedCategory, setSelectedCategory] = useState(
    defaultCategories[0]
  );
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult>();
  const [showResults, setShowResults] = useState<string>('');
  const debouncedValue = useDebounce<string>(searchQuery, 500);

  useEffect(() => {
    if (searchQuery) handleSearch();
  }, [debouncedValue, searchQuery]);

  const handleSearch = async () => {
    try {
      const {data} = await http.get(`search?query=${searchQuery}`);
      if (data.payload?.categories.length || data.payload?.products.length) {
        let result = data.payload;
        setSearchResult(result);
        setShowResults('data found');
      } else {
        setSearchResult({});
        setShowResults('no data');
      }
    } catch (error) {
      setSearchResult({});
      setShowResults('no data');
    }
  };

  return (
    <div className="w-full relative">
      <div className="w-full flex outline-none rounded-full">
        <input
          type="search"
          name="search"
          className="border border-r-0 border-gray-300 hover:border-primary-500 focus:border-primary-500 outline-none placeholder:font-normal placeholder:text-[#999] rounded-s-full py-2 pl-8 pr-4 text-sm flex-1"
          placeholder="Search for Products..."
          value={searchQuery}
          onBlur={() =>
            setTimeout(() => {
              setShowResults('');
            }, 500)
          }
          onFocus={e => {
            if (e.target.value) {
              handleSearch();
            }
          }}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={({key}) => {
            if (key === 'Enter' && searchQuery) {
              router.push(
                `/search_results?keywords=${searchQuery}&filter=priceHighToLow&size=24&page=1`
              );
              setShowResults('');
            }
          }}
        />
        {/* <div className="hidden sm:block">
          <Listbox value={selectedCategory} onChange={setSelectedCategory}>
            {({open}) => (
              <>
                <div className="relative">
                  <Listbox.Button className="relative w-full cursor-default py-3.5 pl-3 pr-10 border border-gray-300 hover:border-primary-500 text-left text-headingColor text-sm">
                    <span className="block truncate">
                      {selectedCategory.name}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-headingColor"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full custom-scrollbar overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {defaultCategories.map(person => (
                        <Listbox.Option
                          key={person.id}
                          className={({active}) =>
                            classNames(
                              active
                                ? 'bg-secondary-500 text-white'
                                : 'text-gray-900',
                              'relative cursor-default select-none py-2 px-4'
                            )
                          }
                          value={person}
                        >
                          {({selected: selectedCategory}) => (
                            <>
                              <span
                                className={classNames(
                                  selectedCategory
                                    ? 'font-semibold'
                                    : 'font-normal',
                                  'block truncate'
                                )}
                              >
                                {person.name}
                              </span>
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
        </div> */}
        <button
          type="button"
          onClick={() => {
            if (searchQuery)
              router.push(
                `/search_results?keywords=${searchQuery}&filter=priceHighToLow&size=24&page=1`
              );
          }}
          className="py-2 px-2 md:px-6 rounded-e-full bg-primary-500 hover:bg-black hover:text-primary-500 text-black bg-center bg-no-repeat transition-all duration-300"
        >
          <SearchIcon />
        </button>
      </div>

      {searchQuery && showResults === 'data found' && (
        <div className="search-menu absolute z-20 w-[92.2%] overflow-auto top-14 left-[1.3rem] bg-white border border-[#ddd] shadow-md p-2 rounded-b-md">
          <div className="space-y-3">
            {searchResult?.categories && (
              <fieldset>
                <h6 className="mb-3 text-base font-semibold text-primary-500 uppercase">
                  Category
                </h6>
                <ul className="space-y-2">
                  {searchResult.categories.map(category => (
                    <Link
                      className="hover:cursor-pointer"
                      href={category.uniqueName}
                      key={category.id}
                      onClick={() =>
                        setTimeout(() => {
                          setShowResults('');
                        }, 500)
                      }
                    >
                      <div className="flex gap-3 justify-between hover:bg-gray-100 p-2 border-t border-[#eee]">
                        <span className="font-normal text-xs">
                          <b
                            className="underline"
                            dangerouslySetInnerHTML={{
                              __html: sanitize(category.name)
                            }}
                          ></b>
                        </span>
                        <span className="block relative h-28 w-28 min-w-[7rem]">
                          <ImageWithFallback
                            fill
                            className="object-contain"
                            src={category.imageUrl}
                            alt="category"
                          />
                        </span>
                      </div>
                    </Link>
                  ))}
                </ul>
              </fieldset>
            )}
            {searchResult?.products && (
              <fieldset>
                <h6 className="mb-3 text-base font-semibold text-primary-500 uppercase">
                  Product Matches
                </h6>
                <ul className="space-y-2">
                  {searchResult.products.map(product => (
                    <Link
                      className="hover:cursor-pointer"
                      href={`/products/${product.uniqueName}`}
                      key={product.id}
                      onClick={() =>
                        setTimeout(() => {
                          setShowResults('');
                        }, 500)
                      }
                    >
                      <div className="flex gap-3 justify-between hover:bg-gray-100 p-2 border-t border-[#eee]">
                        <span className="font-normal text-xs">
                          <b
                            className="underline"
                            dangerouslySetInnerHTML={{
                              __html: sanitize(product.name)
                            }}
                          ></b>
                        </span>
                        <span className="block relative h-12 w-12 min-w-[3rem]">
                          <ImageWithFallback
                            fill
                            className="object-contain"
                            src={product.imageUrl}
                            alt="product"
                          />
                        </span>
                      </div>
                    </Link>
                  ))}
                </ul>
              </fieldset>
            )}
            {/* <fieldset>
              <h6 className="mb-3 text-base font-semibold text-primary-500 uppercase">
                Popular Searches
              </h6>
              <ul className="space-y-2">
                {populars.map(name => (
                  <li key={name}>
                    <div className="flex gap-3 hover:bg-gray-100 p-2 border-t border-[#eee]">
                      <span className="font-normal text-xs">
                        <b className="underline">{name}</b>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </fieldset> */}
          </div>
        </div>
      )}
      {searchQuery && showResults === 'no data' && (
        <div className="search-menu absolute z-20 w-full overflow-auto top-14 left-0 bg-white border border-[#ddd] shadow-md p-2 rounded-b-md">
          <fieldset>
            <h6 className="text-base font-semibold text-primary-500 uppercase">
              No Match Found
            </h6>
          </fieldset>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
