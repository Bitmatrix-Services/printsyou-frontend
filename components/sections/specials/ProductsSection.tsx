import React, {FC, useEffect, useState} from 'react';
import Container from '../../globals/Container';
import {FeaturedProductCard} from '../../cards/FeaturedProductCard';
import TablePagination from '@mui/material/TablePagination';
import {http} from 'services/axios.service';
import {Product} from '@store/slices/product/product';

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
  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [productsByCategory, setProductsByCategory] = useState<Product[]>([]);

  useEffect(() => {
    if (categoryId) getProductByCategory();
  }, [categoryId]);

  const getProductByCategory = async () => {
    const {data} = await http.get(
      'product/byCategory/0f993462-4b96-4859-b053-10bac39c81e2?page=1'
    );

    setProductsByCategory(data.payload.content);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <section className="bg-white py-8 lg:py-20">
      {isContainer ? (
        <Container>
          <div className="flex flex-wrap items-center justify-center md:justify-start mb-6">
            <TablePagination
              component="div"
              count={100}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              className=""
            />
          </div>
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
          <div className="flex flex-wrap items-center justify-center md:justify-start mb-6">
            <TablePagination
              component="div"
              count={100}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              className=""
            />
          </div>
        </Container>
      ) : (
        <div>
          <div className="flex flex-wrap items-center justify-center md:justify-start mb-6">
            <TablePagination
              component="div"
              count={100}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              className=""
            />
          </div>
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
          <div className="flex flex-wrap items-center justify-center md:justify-start mb-6">
            <TablePagination
              component="div"
              count={100}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              className=""
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductsSection;
