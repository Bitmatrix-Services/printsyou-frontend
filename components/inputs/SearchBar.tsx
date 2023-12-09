import React, {useEffect, useState} from 'react';
import {http} from 'services/axios.service';
import ImageWithFallback from '@components/ImageWithFallback';
import Link from 'next/link';
import sanitize from 'sanitize-html';
import {useRouter} from 'next/router';
import {useDebounce} from 'hooks/useDeboune';

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

const SearchBar = () => {
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
      <div className="w-full flex">
        <input
          type="search"
          name="search"
          className="border border-[#eceef1] outline-none rounded-none py-4 px-4 text-sm flex-1"
          placeholder="Search entire store here..."
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
        <div
          onClick={() =>
            router.push(
              `/search_results?keywords=${searchQuery}&filter=priceHighToLow&size=24&page=1`
            )
          }
          className="py-4 px-12 bg-primary-500 hover:bg-body text-white bg-center bg-no-repeat transition-all duration-300"
          style={{
            backgroundImage: 'url("/assets/icon-search-white.png")',
            backgroundSize: '20px auto'
          }}
        />
      </div>

      {searchQuery && showResults === 'data found' && (
        <div className="search-menu absolute z-20 w-full overflow-auto top-14 left-0 bg-white border border-[#ddd] shadow-md p-2 rounded-b-md">
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
                      <div className="flex gap-3 hover:bg-gray-100 p-2 border-t border-[#eee]">
                        <span className="block relative h-28 w-28 min-w-[7rem]">
                          <ImageWithFallback
                            fill
                            className="object-contain"
                            src={category.imageUrl}
                            alt="category"
                          />
                        </span>
                        <span className="font-normal text-xs">
                          <b
                            className="underline"
                            dangerouslySetInnerHTML={{
                              __html: sanitize(category.name)
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
                      <div className="flex gap-3 hover:bg-gray-100 p-2 border-t border-[#eee]">
                        <span className="block relative h-12 w-12 min-w-[3rem]">
                          <ImageWithFallback
                            fill
                            className="object-contain"
                            src={product.imageUrl}
                            alt="product"
                          />
                        </span>
                        <span className="font-normal text-xs">
                          <b
                            className="underline"
                            dangerouslySetInnerHTML={{
                              __html: sanitize(product.name)
                            }}
                          ></b>
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
