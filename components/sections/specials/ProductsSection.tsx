import React from 'react';
import Link from 'next/link';
import Container from '../../globals/Container';
import {FeaturedCard} from '../../cards/FeaturedCard';
import TablePagination from '@mui/material/TablePagination';

const ProductsSection = () => {
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
          <FeaturedCard isModal={false} isSale={true} />
          <FeaturedCard isModal={false} isSale={true} />
          <FeaturedCard isModal={false} isSale={true} />
          <FeaturedCard isModal={false} isSale={true} />
          <FeaturedCard isModal={false} isSale={true} />
          <FeaturedCard isModal={false} isSale={true} />
          <FeaturedCard isModal={false} isSale={true} />
          <FeaturedCard isModal={false} isSale={true} />
          <FeaturedCard isModal={false} isSale={true} />
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
    </section>
  );
};

export default ProductsSection;
