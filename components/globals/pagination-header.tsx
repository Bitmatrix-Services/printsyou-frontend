import React, {FC, memo, useCallback, useMemo} from 'react';
import {IoIosArrowBack, IoIosArrowForward} from 'react-icons/io';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

const FE_URL = process.env.NEXT_PUBLIC_FE_URL?.slice(0, -1);

interface SortOption {
  label: string;
  value: string;
}

const sortList: SortOption[] = [
  {label: 'Price Low To High', value: 'priceLowToHigh'},
  {label: 'Price High To Low', value: 'priceHighToLow'},
  {label: 'Most Recent First', value: 'mostRecentLast'},
  {label: 'Least Recent First', value: 'mostRecentFirst'},
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

const PaginationHeader: FC<PaginationHeaderProps> = memo(
  ({pageNumber, setPageNumber, pageSize, setPageSize, totalPages, sort, setSort}) => {
    const pathname = usePathname();

    const pagesToShow = useMemo(
      () =>
        Array.from({length: totalPages}, (_, index) => index + 1).filter(
          page => page >= pageNumber - 2 && page <= pageNumber + 2
        ),
      [pageNumber, totalPages]
    );

    const handlePageChange = useCallback(
      (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
          setPageNumber(newPage);
        }
      },
      [totalPages, setPageNumber]
    );

    const SortOptions = useMemo(
      () =>
        sortList.map(item => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        )),
      []
    );

    const PageSizeOptions = useMemo(
      () =>
        [20, 40].map(item => (
          <option key={item} value={item}>
            {item}
          </option>
        )),
      []
    );

    const PaginationArrow = memo(({direction}: {direction: 'prev' | 'next'}) => {
      const isPrev = direction === 'prev';
      const targetPage = isPrev ? pageNumber - 1 : pageNumber + 1;
      const disabled = isPrev ? pageNumber === 1 : pageNumber === totalPages;

      return (
        <Link
          href={`${FE_URL}${pathname}?page=${targetPage}`}
          className={`item ${direction} ${disabled ? 'disabled-pointer' : ''}`}
          onClick={e => {
            e.preventDefault();
            !disabled && handlePageChange(targetPage);
          }}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
        >
          {isPrev ? <IoIosArrowBack className="h-4 w-4" /> : <IoIosArrowForward className="h-4 w-4" />}
        </Link>
      );
    });
    PaginationArrow.displayName = 'PaginationArrow';
    return (
      <div className="products-page my-6">
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
                      className="outline-none"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        setSort(e.target.value);
                      }}
                    >
                      {SortOptions}
                    </select>
                  </div>
                </div>
                <div className="item show">
                  <div className="name">Show</div>
                  <div className="select pr-1">
                    <select
                      name="theme5"
                      className="outline-none"
                      value={pageSize}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        setPageSize(Number(e.target.value));
                      }}
                    >
                      {PageSizeOptions}
                    </select>
                  </div>
                  <div className="per">per page</div>
                </div>
              </div>
              <div className="paging flex gap-2">
                {pageNumber !== 1 ? <PaginationArrow direction="prev" /> : null}
                <div className="numbers flex gap-2">
                  {pagesToShow.map(page => (
                    <Link
                      key={page}
                      href={`${FE_URL}${pathname}?page=${page}`}
                      onClick={e => {
                        e.preventDefault();
                        handlePageChange(page);
                      }}
                      className={`item number ${pageNumber === page ? 'is-active' : ''}`}
                      aria-current={pageNumber === page ? 'page' : undefined}
                    >
                      {page}
                    </Link>
                  ))}
                </div>
                {pageNumber !== totalPages ? <PaginationArrow direction="next" /> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PaginationHeader.displayName = 'PaginationHeader';

export default PaginationHeader;
