import React, {FC, useEffect, useState, useMemo, useCallback, memo} from 'react';
import {notFound, usePathname, useRouter, useSearchParams} from 'next/navigation';
import {EnclosureProduct} from '@components/home/product/product.types';
import {IQueryParams} from '@components/search/search-results-section';
import {ProductCard} from '@components/home/product/product-card.component';
import {Category} from '@components/home/home.types';
import {Skeleton} from '@mui/joy';
import {allowableSearchParams} from '@utils/constants';
import Link from 'next/link';
import {IoIosArrowBack, IoIosArrowForward} from 'react-icons/io';

const FE_URL = process.env.NEXT_PUBLIC_FE_URL?.slice(0, -1);

interface ProductsSectionProps {
    category: Category;
    pagedData: any;
}

const sortList = [
    {label: 'Price: Low to High', value: 'priceLowToHigh'},
    {label: 'Price: High to Low', value: 'priceHighToLow'},
    {label: 'Newest First', value: 'mostRecentLast'},
    {label: 'A to Z', value: 'AToZ'},
    {label: 'Z to A', value: 'ZToA'}
];

export const ProductsSection: FC<ProductsSectionProps> = ({category, pagedData}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [productsByCategory, setProductsByCategory] = useState<EnclosureProduct[]>([]);

    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isPageLoading, setIsPageLoading] = useState<boolean>(true);

    const {page, filter, size}: IQueryParams = Object.fromEntries(
        ['page', 'filter', 'size'].map(param => [param, searchParams.get(param)])
    );

    const currentPage = (page && parseInt(page)) || 1;
    const currentSize = (size && parseInt(size)) || 24;
    const currentSort = filter || 'priceLowToHigh';

    useEffect(() => {
        if (pagedData?.content?.length > 0) {
            setProductsByCategory(pagedData.content);
            setTotalPages(pagedData.totalPages);
            setTotalElements(pagedData.totalElements);
            if (page && parseInt(page) > pagedData.totalPages) notFound();
        } else if (pagedData?.content?.length === 0) {
            setProductsByCategory([]);
            setTotalPages(0);
            setTotalElements(0);
        }
        setIsPageLoading(false);
        setIsLoading(false);
    }, [pagedData, page]);

    const handleQueryUpdate = useCallback((value: string | number, queryName: string) => {
        const currentQuery = getUpdatedQueryParams();
        let updatedQuery = {...currentQuery, [queryName]: value};
        if (queryName === 'size' || queryName === 'filter') {
            updatedQuery.page = '1';
        }
        router.push(`${pathname}?${new URLSearchParams(updatedQuery)}`, {scroll: false});
    }, [pathname, router, searchParams]);

    const getUpdatedQueryParams = useCallback((): Record<string, any> => {
        let updatedQuery: Record<string, any> = {};
        searchParams.forEach((value, key) => {
            if (~allowableSearchParams.indexOf(key)) {
                updatedQuery[key] = value;
            }
        });
        return updatedQuery;
    }, [searchParams]);

    const pagesToShow = useMemo(() => {
        return Array.from({length: totalPages}, (_, index) => index + 1).filter(
            p => p >= currentPage - 2 && p <= currentPage + 2
        );
    }, [currentPage, totalPages]);

    return (
        <section className="bg-white rounded-lg">

            {/* TOP: Sorting & Page Size Controls - Sorting primary, count de-emphasized */}
            {!isPageLoading && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                    {/* Sorting Controls - Primary */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Sort */}
                        <div className="flex items-center gap-2">
                            <label htmlFor="sort-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort by</label>
                            <select
                                id="sort-select"
                                value={currentSort}
                                onChange={(e) => handleQueryUpdate(e.target.value, 'filter')}
                                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white min-w-[160px]"
                            >
                                {sortList.map(item => (
                                    <option key={item.value} value={item.value}>{item.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Page Size */}
                        <div className="flex items-center gap-2">
                            <label htmlFor="size-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">Show</label>
                            <select
                                id="size-select"
                                value={currentSize}
                                onChange={(e) => handleQueryUpdate(e.target.value, 'size')}
                                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                            >
                                <option value="24">24</option>
                                <option value="48">48</option>
                            </select>
                        </div>
                    </div>

                    {/* Product Count - De-emphasized */}
                    <div className="text-xs text-gray-500 order-first sm:order-last">
                        {totalElements} products
                    </div>
                </div>
            )}

            {/* Product Grid - 3 columns on desktop, left-aligned for uneven rows */}
            <div
                id="product-card-container"
                className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-fr"
            >
                {isLoading
                    ? Array.from({length: 12}, (_, index) => (
                        <div key={index} className="relative">
                            <Skeleton
                                sx={{borderRadius: '0.5rem'}}
                                animation="pulse"
                                variant={'rectangular'}
                                height={'400px'}
                                width={'100%'}
                            />
                        </div>
                    ))
                    : productsByCategory?.map((product, index) => (
                        <ProductCard key={product.id} product={product} imagePriority={index < 4} />
                    ))}
            </div>

            {/* BOTTOM: Pagination ONLY (no sorting controls) */}
            {productsByCategory?.length > 0 && !isPageLoading && totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                    <PaginationOnly
                        currentPage={currentPage}
                        totalPages={totalPages}
                        pagesToShow={pagesToShow}
                        onPageChange={(newPage) => handleQueryUpdate(newPage, 'page')}
                        pathname={pathname}
                    />
                </div>
            )}

            {/* No Products Message */}
            {productsByCategory.length <= 0 && !isLoading && (
                <div className="py-16 text-center">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <h4 className="text-lg text-gray-600 font-medium">No Products Found</h4>
                    <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or browse other categories.</p>
                </div>
            )}
        </section>
    );
};

// Pagination-only component (no sorting controls)
interface PaginationOnlyProps {
    currentPage: number;
    totalPages: number;
    pagesToShow: number[];
    onPageChange: (page: number) => void;
    pathname: string;
}

const PaginationOnly: FC<PaginationOnlyProps> = memo(({currentPage, totalPages, pagesToShow, onPageChange, pathname}) => {
    const handlePageClick = (e: React.MouseEvent, page: number) => {
        e.preventDefault();
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
            // Scroll to top of products
            document.getElementById('product-card-container')?.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    };

    return (
        <nav aria-label="Pagination" className="flex items-center gap-1">
            {/* Previous */}
            {currentPage > 1 && (
                <Link
                    href={`${FE_URL}${pathname}?page=${currentPage - 1}`}
                    onClick={(e) => handlePageClick(e, currentPage - 1)}
                    className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                    aria-label="Previous page"
                >
                    <IoIosArrowBack className="w-4 h-4 text-gray-600" />
                </Link>
            )}

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {pagesToShow[0] > 1 && (
                    <>
                        <Link
                            href={`${FE_URL}${pathname}?page=1`}
                            onClick={(e) => handlePageClick(e, 1)}
                            className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
                        >
                            1
                        </Link>
                        {pagesToShow[0] > 2 && (
                            <span className="px-2 text-gray-400">...</span>
                        )}
                    </>
                )}

                {pagesToShow.map(page => (
                    <Link
                        key={page}
                        href={`${FE_URL}${pathname}?page=${page}`}
                        onClick={(e) => handlePageClick(e, page)}
                        className={`flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === page
                                ? 'bg-primary-500 text-white border border-primary-500'
                                : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                        aria-current={currentPage === page ? 'page' : undefined}
                    >
                        {page}
                    </Link>
                ))}

                {pagesToShow[pagesToShow.length - 1] < totalPages && (
                    <>
                        {pagesToShow[pagesToShow.length - 1] < totalPages - 1 && (
                            <span className="px-2 text-gray-400">...</span>
                        )}
                        <Link
                            href={`${FE_URL}${pathname}?page=${totalPages}`}
                            onClick={(e) => handlePageClick(e, totalPages)}
                            className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
                        >
                            {totalPages}
                        </Link>
                    </>
                )}
            </div>

            {/* Next */}
            {currentPage < totalPages && (
                <Link
                    href={`${FE_URL}${pathname}?page=${currentPage + 1}`}
                    onClick={(e) => handlePageClick(e, currentPage + 1)}
                    className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                    aria-label="Next page"
                >
                    <IoIosArrowForward className="w-4 h-4 text-gray-600" />
                </Link>
            )}
        </nav>
    );
});

PaginationOnly.displayName = 'PaginationOnly';
