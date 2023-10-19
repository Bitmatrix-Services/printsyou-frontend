import React, {useEffect, useState} from 'react';

import PageHeader from '@components/globals/PageHeader';
import PaginationHeader from '@components/globals/PaginationHeader';
import {http} from 'services/axios.service';
import Container from '@components/globals/Container';
import {Product} from '@store/slices/product/product';
import {FeaturedProductCard} from '@components/cards/FeaturedProductCard';

const Specials = () => {
  const [specialProducts, setSpecialProducts] = useState<Product[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number | string>(24);
  const [totalPages, setTotalPages] = useState<number>(1);
  // const [sort, setSort] = useState(25);

  useEffect(() => {
    getSpecialProducts();
  }, [pageNumber, pageSize]);

  const getSpecialProducts = async () => {
    const {data} = await http.get(
      `/product/byTag?tag=special`
    );

    if (data.payload?.length > 0) {
      setSpecialProducts(data.payload);
      setTotalPages(data.payload.totalPages);
    }
  };

  return (
    <>
      <PageHeader pageTitle={'Specials and Sales'} />

      <Container>
        <section className="bg-white py-8 lg:py-20">
          <PaginationHeader
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalPages={totalPages}
            // sort={sort}
            // setSort={setSort}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-6">
            {specialProducts?.map(product => (
              <FeaturedProductCard
                key={product.id}
                isModal={true}
                onSale={false}
                product={product}
              />
            ))}
          </div>
          <PaginationHeader
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalPages={totalPages}
            // sort={sort}
            // setSort={setSort}
          />
        </section>
      </Container>
    </>
  );
};

export default Specials;
