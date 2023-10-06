import React, {FC} from 'react';
import Container from '../../globals/Container';
import {FeaturedProductCard} from '../../cards/FeaturedProductCard';
import TablePagination from '@mui/material/TablePagination';

interface ProductsSectionProps {
  isModal?: boolean;
  onSale?: boolean;
  isContainer: boolean;
}

const ProductsSection: FC<ProductsSectionProps> = ({
  isModal,
  onSale,
  isContainer
}) => {
  const [page, setPage] = React.useState(2);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => (
              <FeaturedProductCard
                key={item}
                isModal={isModal}
                onSale={onSale}
                product={''}
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
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => (
              <FeaturedProductCard
                key={item}
                isModal={isModal}
                onSale={onSale}
                product={''}
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
