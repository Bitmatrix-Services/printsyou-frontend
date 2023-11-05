import React, {FC} from 'react';

import Container from '@components/globals/Container';
import {Category} from '@store/slices/category/category';
import {GetServerSidePropsContext} from 'next';
import {http} from 'services/axios.service';
import SearchSidebar from '@components/globals/SearchSidebar';
import SearchResultsSection from '@components/sections/searchResults/SearchResultsSection';

interface CategoryDetailsProps {
  products: Category;
}

const CategoryDetails: FC<CategoryDetailsProps> = ({products}) => {
  console.log('products', products);

  return (
    <main>
      <div className="bg-white footer pt-8">
        <Container>
          <div className="flex flex-col md:flex-row gap-3 lg:gap-8">
            {/* <SearchSidebar selectedCategory={products} />
            <SearchResultsSection category={products} /> */}
          </div>
        </Container>
      </div>
    </main>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const keywords = context.params?.keywords;

  let products = {};
  const {data} = await http.get(`product?uProductName=${keywords}`);
  products = data.payload;

  return {props: {products}};
};

export default CategoryDetails;
