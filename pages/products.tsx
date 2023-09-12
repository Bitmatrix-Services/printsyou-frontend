import Container from '@components/globals/Container';
import Sidebar from '@components/globals/Sidebar';
import ProductDetailsSection from '@components/sections/promotionalProducts/ProductDetailsSection';
import React from 'react';

function Products() {
  return (
    <main>
      <div className="bg-white footer pt-10 lg:pt-24">
        <Container>
          <div className="flex flex-col md:flex-row gap-3 lg:gap-8">
            <Sidebar />
            <ProductDetailsSection />
          </div>
        </Container>
      </div>
    </main>
  );
}

export default Products;
