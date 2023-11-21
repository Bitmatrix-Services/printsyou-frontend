import React, {useState, useEffect} from 'react';
import Container from '@components/globals/Container';
import {http} from 'services/axios.service';
import SearchSidebar from '@components/globals/SearchSidebar';
import SearchResultsSection from '@components/sections/searchResults/SearchResultsSection';
import {useRouter} from 'next/router';
import {Product} from '@store/slices/product/product';

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
  color: string[];
  price: string[];
};

const CategoryDetails = () => {
  const router = useRouter();

  const [filters, setFilters] = useState<filterType>({
    color: [],
    price: []
  });

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(24);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sort, setSort] = useState<string>('priceLowToHigh');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProdcuts] = useState<number>(1);
  const [priceRangeData, setPriceRangeData] = useState<searchType[]>([]);
  const [colorsData, setColorsRangeData] = useState<searchType[]>([]);
  const [categoryData, setCategoryData] = useState<categoryType[]>([]);

  useEffect(() => {
    if (router.query.keywords) handleSearch();
  }, [pageNumber, pageSize, sort, router.query.keywords]);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const {data} = await http.get(
        `search-result?query=${router.query.keywords}&page=${pageNumber}&size=${pageSize}&filter=${sort}`
      );
      const searchResults = data.payload;
      setProducts(searchResults.products.content);
      setTotalPages(searchResults.products.totalPages);
      setTotalProdcuts(searchResults.products.totalElements);
      setPriceRangeData(searchResults.byPriceRange);
      setColorsRangeData(searchResults.byColors);
      setCategoryData(searchResults.byCategory);
    } catch (error) {
      console.log('error.message', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <div className="bg-white footer pt-8">
        <Container>
          <div className="flex flex-col md:flex-row gap-3 lg:gap-8">
            <SearchSidebar
              byPriceRange={priceRangeData}
              byColor={colorsData}
              byCategory={categoryData}
              filters={filters}
              setFilters={setFilters}
            />
            <SearchResultsSection
              products={products}
              totalProducts={totalProducts}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              pageSize={pageSize}
              setPageSize={setPageSize}
              totalPages={totalPages}
              sort={sort}
              setSort={setSort}
              isLoading={isLoading}
            />
          </div>
        </Container>
      </div>
    </main>
  );
};

export default CategoryDetails;
