import React, {FC} from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {ShoppingBagIcon} from '@heroicons/react/24/outline';

interface Product {
  title: string;
  imageSrc: string;
  color: string;
  categoryLinks: {title: string; href: string}[];
}

interface ProductsSubCategoryCardProps {
  product: Product;
}

const ProductsSubCategoryCard: FC<ProductsSubCategoryCardProps> = ({
  product
}) => {
  return (
    <button
      type="button"
      className={`tp-product-sub-cat product-card h-full w-full text-start block relative bg-white border border-[#d9dee4]  `}
    >
      <div className="sm:py-4 flex flex-col 2xl:flex-row items-center px-6 2xl:px-0 gap-6 xl:gap-0">
        <figure className=" absolute flex justify-center -top-16 left-1/2 -translate-x-1/2 sm:top-0 sm:left-0 sm:translate-x-0 sm:relative min-w-[7rem] w-28 h-28 sm:min-w-[13.125rem] sm:w-[13.125rem] sm:h-[13.125rem] 2xl:scale-105 2xl:-translate-x-11 ">
          <Image
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain w-[85%]"
            width={100}
            height={100}
            src={product.imageSrc}
            alt="..."
          />
        </figure>
        <div className="xl:pr-4">
          <Link
            href="!#"
            className={`mb-1 block text-body hover:text-[#feab40] font-bold text-sm sm:text-lg capitalize`}
          >
            {product.title}
          </Link>
        </div>
      </div>
    </button>
  );
};

export default ProductsSubCategoryCard;
