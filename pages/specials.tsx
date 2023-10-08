import React from 'react';
import PageHeader from '@components/globals/PageHeader';
import ProductsSection from '@components/sections/specials/ProductsSection';

const HowToOrderPage = () => {
  return (
    <>
      <PageHeader pageTitle={'Specials and Sales'} />

      <div className="py-12">
        <ProductsSection isModal={false} onSale={true} isContainer={true} />
      </div>
    </>
  );
};

export default HowToOrderPage;
