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
  const debouncedValue = useDebounce<string>(searchQuery, 500);

  useEffect(() => {
    if (searchQuery) handleSearch();
  }, [debouncedValue]);

  const handleSearch = async () => {
    const {data} = await http.get(`search?query=${searchQuery}`);
    if (data.payload?.categories.length || data.payload?.products.length) {
      let result = data.payload;
      setSearchResult(result);
    } else {
      setSearchResult({});
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
              setSearchResult({});
            }, 500)
          }
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={({key}) => {
            if (key === 'Enter') {
              router.push(`/search_results?keywords=${searchQuery}`);
            }
          }}
        />
        <Link
          href={`/search_results?keywords=${searchQuery}`}
          className="py-4 px-12 bg-primary-500 hover:bg-body text-white bg-center bg-no-repeat transition-all duration-300"
          style={{
            backgroundImage: 'url("/assets/icon-search-white.png")',
            backgroundSize: '20px auto'
          }}
        />
      </div>
      {searchResult && Object.keys(searchResult)?.length !== 0 && (
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
                          setSearchResult({});
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
                          setSearchResult({});
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
    </div>
  );
};

export default SearchBar;
