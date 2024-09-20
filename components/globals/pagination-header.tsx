import React, {FC} from 'react';
import {IoIosArrowBack, IoIosArrowForward} from 'react-icons/io';

const sortList = [
  {label: 'Price Low To High', value: 'priceLowToHigh'},
  {label: 'Price High To Low', value: 'mostRecentFirst'},
  {label: 'Most Recent First', value: 'priceHighToLow'},
  {label: 'Least Recent First', value: 'mostRecentLast'},
  {label: 'A to Z', value: 'AToZ'},
  {label: 'Z to A', value: 'ZToA'}
];

interface PaginationHeaderProps {
  pageNumber: number;
  setPageNumber: (_: number) => void;
  pageSize: number;
  setPageSize: (_: number) => void;
  totalPages: number;
  sort: string;
  setSort: (_: string) => void;
}

const PaginationHeader: FC<PaginationHeaderProps> = ({
  pageNumber,
  setPageNumber,
  pageSize,
  setPageSize,
  totalPages,
  sort,
  setSort
}) => {
  const pagesToShow = Array.from({length: totalPages}, (_, index) => index + 1).filter(
    page => pageNumber >= page - 2 && pageNumber <= page + 2
  );
  return (
    <div id="products-page" className="my-6">
      <div className="list-product">
        <div className="pagination-top paginations">
          <div className="sort-show leftpagnation flex items-center flex-col md:flex-row justify-center">
            <div className="select-sort flex flex-col sm:flex-row gap-4">
              <div className="item sort-by">
                <div className="name">Sort by</div>
                <div className="select pr-1">
                  <select
                    name="theme4"
                    value={sort}
                    className="custom_theme4 outline-none"
                    onChange={e => setSort(e.target.value)}
                  >
                    {sortList.map(item => (
                      <option key={item.label} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="item show">
                <div className="name">Show</div>
                <div className="select pr-1">
                  <select
                    name="theme5"
                    className="custom_theme5 outline-none"
                    value={pageSize}
                    onChange={e => setPageSize(parseInt(e.target.value))}
                  >
                    {[20, 40].map(item => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="per">per page</div>
              </div>
            </div>
            <div className="paging flex gap-2">
              <button
                type="button"
                className="item prev"
                onClick={() => {
                  if (pageNumber > 1) setPageNumber(pageNumber - 1);
                }}
              >
                <IoIosArrowBack className="h-4 w-4" />
              </button>
              <div className="numbers flex gap-2">
                {pagesToShow?.map(page => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setPageNumber(page)}
                    className={`item number ${pageNumber == page && 'is-active'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="item next"
                onClick={() => {
                  if (pageNumber < totalPages) setPageNumber(pageNumber + 1);
                }}
              >
                <IoIosArrowForward className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginationHeader;
