import React, {Dispatch, FC, SetStateAction} from 'react';
import {ArrowLeftIcon, ArrowRightIcon} from '@heroicons/react/24/solid';

const sortList = [
  {lable: 'Price Low To High', value: 'lowcost'},
  {lable: 'Price High To Low', value: 'highcost'},
  {lable: 'Most Recent First', value: 'desc'},
  {lable: 'Least Recent First', value: 'asc'},
  {lable: 'A to Z', value: 'az'},
  {lable: 'Z to A', value: 'za'}
];

interface PaginationHeaderProps {
  pageNumber: number;
  setPageNumber: Dispatch<SetStateAction<number>>;
  pageSize: number;
  setPageSize: Dispatch<SetStateAction<number>>;
  totalPages: number;
  // sort: number;
  // setSort: void;
}

const PaginationHeader: FC<PaginationHeaderProps> = ({
  pageNumber,
  setPageNumber,
  pageSize,
  setPageSize,
  totalPages
  // sort,
  // setSort
}) => {
  const pagesToShow = Array.from(
    {length: totalPages},
    (_, index) => index + 1
  ).filter(page => page >= pageNumber - 2 && page <= pageNumber + 2);

  return (
    <div id="products-page" className="my-6">
      <div className="list-product">
        <div className="pagination-top paginations">
          <div className="sort-show leftpagnation flex items-center flex-col md:flex-row justify-center">
            <div className="select-sort flex flex-col sm:flex-row gap-4">
              <div className="item sort-by">
                <div className="name">Sort by</div>
                <div className="select">
                  <select name="theme4" className="custom_theme4 outline-none">
                    {sortList.map(item => (
                      <option key={item.value} value={item.value}>
                        {item.lable}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="item show">
                <div className="name">Show</div>
                <div className="select">
                  <select
                    name="theme5"
                    className="custom_theme5 outline-none"
                    value={pageSize}
                    onChange={e => setPageSize(parseInt(e.target.value))}
                  >
                    {[24, 48].map(item => (
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
                  if (pageNumber > 1) setPageNumber(prevState => prevState - 1);
                }}
              >
                <ArrowLeftIcon className="h-4 w-4" />
              </button>
              <div className="numbers flex gap-2">
                {pagesToShow?.map(page => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setPageNumber(page)}
                    className={`item number ${
                      pageNumber === page && 'is-active'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="item next"
                onClick={() => {
                  if (pageNumber < totalPages)
                    setPageNumber(prevState => prevState + 1);
                }}
              >
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginationHeader;
