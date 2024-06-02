import React, {FC, Fragment, useEffect, useState} from 'react';
import Container from '@components/globals/Container';
import Link from 'next/link';
import ImageWithFallback from '@components/globals/ImageWithFallback';
import {HomeCategoryProduts} from '@store/slices/product/product';

interface ProductCategoriesSectionProps {
  homeCategoryProducts: HomeCategoryProduts[];
}

const ProductCategoriesSection: FC<ProductCategoriesSectionProps> = ({
  homeCategoryProducts
}) => {
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    if (
      homeCategoryProducts?.length > 0 &&
      homeCategoryProducts[0].categoryName
    )
      setActiveTab(homeCategoryProducts[0].categoryName);
  }, []);

  const handleTabClick = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  return (
    <section className="bg-grey pt-14 pb-8 lg:pb-20">
      <Container>
        <div className="mb-12 border-b-2 border-[#eee] flex flex-wrap gap-6">
          <h2 className="text-headingColor text-xl font-normal uppercase after:mt-3 lg:after:mt-7 after:block atfer:w-full after:h-1 after:bg-primary-500 mr-auto">
            PRODUCT CATEGORIES
          </h2>
          <div className="flex flex-wrap gap-5 pb-5">
            {homeCategoryProducts?.map(category => (
              <button
                key={category.categoryName}
                className={`tab-link ${
                  activeTab === category.categoryName ? 'active' : ''
                }`}
                type="button"
                onClick={() => handleTabClick(category.categoryName)}
              >
                {category.categoryName}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
            {homeCategoryProducts
              ?.filter(homeCat => homeCat.categoryName === activeTab)
              .slice(0, 4)
              .map(category => (
                <Fragment key={category.categoryName}>
                  {category?.subCategory?.map(subCategory => (
                    <div key={subCategory.uniqueCategoryName} className="col">
                      <h2 className="text-headingColor text-lg font-normal capitalize inline-block border-b border-[#ddd] after:mt-3 after:block after:w-1/2 after:h-1 after:bg-primary-500">
                        {subCategory.categoryName}
                      </h2>
                      <div className="mt-8 space-y-4">
                        {subCategory?.products?.map(product => (
                          <Link
                            key={product.uniqueProductName}
                            href={`/products/${product.uniqueProductName}`}
                            className="product-card p-4 group block rounded border-r border-[#ddd] hover:bg-white hover:shadow-md"
                          >
                            <div className="flex items-center gap-3">
                              <ImageWithFallback
                                style={{minWidth: 75}}
                                width={75}
                                height={75}
                                src={product.imageUrl}
                                alt="category product"
                              />
                              <div>
                                <h6 className="mb-2 text-mute group-hover:text-headingColor text-sm font-semibold">
                                  {product.productName}
                                </h6>
                                {product.salePrice !== 0 ? (
                                  <>
                                    <h6 className="text-sm font-normal line-through text-gray-600 group-hover:text-headingColor">
                                      ${product.lowestPrice.toFixed(2)}
                                    </h6>
                                    <h6 className="text-md font-semibold text-gray-600 group-hover:text-headingColor">
                                      ${product.salePrice.toFixed(2)}
                                    </h6>
                                  </>
                                ) : (
                                  <h6 className="text-md font-semibold text-gray-600 group-hover:text-headingColor">
                                    ${product.lowestPrice.toFixed(2)}
                                  </h6>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                        <div className="text-center">
                          <Link
                            href={`/${subCategory.uniqueCategoryName}`}
                            className="py-2 px-8 text-sm font-semibold inline-flex items-center gap-1 btn-primary"
                          >
                            <span>View All</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </Fragment>
              ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ProductCategoriesSection;
