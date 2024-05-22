import React, {useEffect, useState} from 'react';

import PageHeader from '@components/globals/PageHeader';
import PaginationHeader from '@components/globals/PaginationHeader';
import {http} from 'services/axios.service';
import Container from '@components/globals/Container';
import {Product} from '@store/slices/product/product';
import {FeaturedProductCard} from '@components/cards/FeaturedProductCard';
import {NextSeo} from 'next-seo';
import {metaConstants} from '@utils/Constants';
import {CircularLoader} from '@components/globals/CircularLoader';

const Specials = () => {
  const [specialProducts, setSpecialProducts] = useState<Product[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(24);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sort, setSort] = useState('priceLowToHigh');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);

  useEffect(() => {
    getSpecialProducts();
  }, [pageNumber, pageSize, sort]);

  const getSpecialProducts = async () => {
    try {
      setIsLoading(true);
      const {data} = await http.get(
        `/product/byTag?tag=special&page=${pageNumber}&size=${pageSize}&filter=${sort}`
      );

      if (data.payload?.content?.length > 0) {
        setSpecialProducts(data.payload.content);
        setTotalPages(data.payload.totalPages);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false);
      setIsPageLoading(false);
    }
  };

  return (
    <>
      <NextSeo title={`Special Products | ${metaConstants.SITE_NAME}`} />
      <PageHeader pageTitle={'Specials and Sales'} />
      <Container>
        <section className="bg-white py-8 lg:py-20">
          {specialProducts?.length > 0 && !isPageLoading && (
            <PaginationHeader
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              pageSize={pageSize}
              setPageSize={setPageSize}
              totalPages={totalPages}
              sort={sort}
              setSort={setSort}
            />
          )}
          {isLoading ? (
            <div className="flex justify-center align-middle items-center h-[20rem]">
              <CircularLoader />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {specialProducts?.map(product => (
                <FeaturedProductCard
                  key={product.id}
                  isModal={true}
                  product={product}
                />
              ))}
            </div>
          )}
          {specialProducts?.length > 0 && !isPageLoading && (
            <PaginationHeader
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              pageSize={pageSize}
              setPageSize={setPageSize}
              totalPages={totalPages}
              sort={sort}
              setSort={setSort}
            />
          )}
          {specialProducts.length <= 0 && !isLoading && (
            <div className="m-16 flex items-center justify-center">
              <h4>No Products Found</h4>
            </div>
          )}
        </section>
      </Container>
    </>
  );
};

export default Specials;
