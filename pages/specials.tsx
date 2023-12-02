import React, {useEffect, useState} from 'react';

import PageHeader from '@components/globals/PageHeader';
import PaginationHeader from '@components/globals/PaginationHeader';
import {http} from 'services/axios.service';
import Container from '@components/globals/Container';
import {Product} from '@store/slices/product/product';
import {FeaturedProductCard} from '@components/cards/FeaturedProductCard';
import CircularProgress from '@mui/material/CircularProgress';
import {NextSeo} from 'next-seo';
import {metaConstants} from '@utils/Constants';

const Specials = () => {
  const [specialProducts, setSpecialProducts] = useState<Product[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(24);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sort, setSort] = useState('priceLowToHigh');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getSpecialProducts();
  }, [pageNumber, pageSize, sort]);

  const getSpecialProducts = async () => {
    setIsLoading(true);
    const {data} = await http.get(
      `/product/byTag?tag=special&page=${pageNumber}&size=${pageSize}&filter=${sort}`
    );

    if (data.payload?.content?.length > 0) {
      setSpecialProducts(data.payload.content);
      setTotalPages(data.payload.totalPages);
    }
    setIsLoading(false);
  };

  return (
    <>
      <NextSeo title={`Special Products | ${metaConstants.SITE_NAME}`} />
      <PageHeader pageTitle={'Specials and Sales'} />
      <Container>
        <section className="bg-white py-8 lg:py-20">
          <PaginationHeader
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalPages={totalPages}
            sort={sort}
            setSort={setSort}
          />
          {isLoading ? (
            <div className="flex justify-center align-middle items-center h-[20rem]">
              <CircularProgress color="warning" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {specialProducts?.map(product => (
                <FeaturedProductCard
                  key={product.id}
                  isModal={true}
                  product={product}
                />
              ))}
            </div>
          )}
          <PaginationHeader
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalPages={totalPages}
            sort={sort}
            setSort={setSort}
          />
        </section>
      </Container>
    </>
  );
};

export default Specials;
