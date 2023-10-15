import React, {FC, useEffect, useState} from 'react';
import {FeaturedProductCard} from '../../cards/FeaturedProductCard';
import {http} from 'services/axios.service';
import {Product} from '@store/slices/product/product';
import PaginationHeader from '@components/globals/PaginationHeader';

interface ProductsSectionProps {
  isModal?: boolean;
  onSale?: boolean;
  isContainer: boolean;
  categoryId: string;
}

const ProductsSection: FC<ProductsSectionProps> = ({
  isModal,
  onSale,
  isContainer,
  categoryId
}) => {
  const [productsByCategory, setProductsByCategory] = useState<Product[]>([]);

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number | string>(24);
  const [totalPages, setTotalPages] = useState<number>(1);
  // const [sort, setSort] = useState(25);

  useEffect(() => {
    if (categoryId) getProductByCategory();
  }, [categoryId, pageNumber, pageSize]);

  const getProductByCategory = async () => {
    const {data} = await http.get(
      `product/byCategory/${categoryId}?page=${pageNumber}&size=${pageSize}`
    );

    if (data.payload.content.length > 0) {
      setProductsByCategory(data.payload.content);
      setTotalPages(data.payload.totalPages);
    }
  };

  return (
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

      <div
        className={`${
          isContainer
            ? 'max-w-[100rem] mx-auto px-4 md:px-8 xl:px-24 relative'
            : ''
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-6">
          {productsByCategory?.map(product => (
            <FeaturedProductCard
              key={product.id}
              isModal={isModal}
              onSale={onSale}
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
      </div>
    </section>
  );
};

export default ProductsSection;
