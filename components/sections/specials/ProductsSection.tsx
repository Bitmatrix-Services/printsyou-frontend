import React, {FC, useEffect, useState} from 'react';
import {FeaturedProductCard} from '../../cards/FeaturedProductCard';
import {http} from 'services/axios.service';
import {Product} from '@store/slices/product/product';
import PaginationHeader from '@components/globals/PaginationHeader';
import {useRouter} from 'next/router';
import {CircularLoader} from '@components/globals/CircularLoader';

interface ProductsSectionProps {
  isModal?: boolean;
  isContainer: boolean;
  categoryId: string;
}

const ProductsSection: FC<ProductsSectionProps> = ({
  isModal,
  isContainer,
  categoryId
}) => {
  const router = useRouter();
  const {minPrice, maxPrice, page}: any = router.query;

  const [productsByCategory, setProductsByCategory] = useState<Product[]>([]);

  const [pageSize, setPageSize] = useState<number>(24);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sort, setSort] = useState('priceLowToHigh');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);

  useEffect(() => {
    if (categoryId) getProductByCategory();
  }, [categoryId, pageSize, sort, minPrice, maxPrice, page]);

  const getProductByCategory = async () => {
    try {
      setIsLoading(true);
      let query = `product/byCategory/${categoryId}?&size=${pageSize}&filter=${sort}&minPrice=0&maxPrice=10000`;
      if (maxPrice && minPrice) {
        query += `&minPrice=${minPrice}&maxPrice=${maxPrice}`;
      }
      if (page) {
        query += `&page=${page}`;
      }
      const {data} = await http.get(query);

      if (data.payload.content.length > 0) {
        setProductsByCategory(data.payload.content);
        setTotalPages(data.payload.totalPages);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsPageLoading(false);
      setIsLoading(false);
    }
  };

  const handleQueryUpdate = (value: string | number, queryName: string) => {
    let updatedQuery = {...router.query, [queryName]: value};
    router.push({
      pathname: router.pathname,
      query: updatedQuery
    });
  };

  return (
    <section className="bg-white py-8 lg:py-20">
      {productsByCategory?.length > 0 && !isPageLoading && (
        <PaginationHeader
          pageNumber={parseInt(page) || 1}
          setPageNumber={(value: string | number) =>
            handleQueryUpdate(value, 'page')
          }
          pageSize={pageSize}
          setPageSize={setPageSize}
          totalPages={totalPages}
          sort={sort}
          setSort={setSort}
        />
      )}

      <div
        className={`${
          isContainer
            ? 'max-w-[100rem] mx-auto px-4 md:px-8 xl:px-24 relative'
            : ''
        }`}
      >
        {isLoading ? (
          <div className="flex justify-center align-middle items-center h-[20rem]">
            <CircularLoader />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {productsByCategory?.map(product => (
              <FeaturedProductCard
                key={product.id}
                isModal={isModal}
                product={product}
              />
            ))}
          </div>
        )}
        {productsByCategory?.length > 0 && !isPageLoading && (
          <PaginationHeader
            pageNumber={parseInt(page) || 1}
            setPageNumber={(value: string | number) =>
              handleQueryUpdate(value, 'page')
            }
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalPages={totalPages}
            sort={sort}
            setSort={setSort}
          />
        )}
      </div>
      {productsByCategory.length <= 0 && !isLoading && (
        <div className="m-16 flex items-center justify-center">
          <h4>No Products Found</h4>
        </div>
      )}
    </section>
  );
};

export default ProductsSection;
