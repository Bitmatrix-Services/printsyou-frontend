import React, {FC} from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
      <div className="py-4 flex flex-col 2xl:flex-row items-center px-6 gap-2 ">
        <figure className="  flex justify-center sm:top-0 sm:left-0 sm:translate-x-0 relative min-w-[7rem] w-28 h-28 sm:min-w-[13.125rem] sm:w-[13.125rem] sm:h-[13.125rem] 2xl:scale-105 2xl:-translate-x-11 ">
          <Image
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain md:w-[60%] lg:w-[85%] "
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
