import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";

import { ShoppingBagIcon } from "@heroicons/react/24/outline";

interface Product {
  title: string;
  imageSrc: string;
  color: string;
  categoryLinks: { title: string; href: string }[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  return (
    <button
      type="button"
      className={`product-card h-full w-full text-start block relative bg-white border border-[#d9dee4] border-t-2 border-t-body hover:border-t-[${product.color}]`}
    >
      <div className="py-10 flex flex-col 2xl:flex-row items-center px-6 2xl:px-0 gap-6 xl:gap-0">
        <figure className="block relative min-w-[13.125rem] w-[13.125rem] h-[13.125rem] 2xl:scale-105 2xl:-translate-x-11">
          <Image
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
            fill
            src={product.imageSrc}
            alt="..."
          />
        </figure>
        <div className="pr-4">
          <Link
            href="!#"
            className={`mb-4 block text-body hover:text-[${product.color}] font-bold text-lg capitalize`}
          >
            {product.title}
          </Link>
          <ul className="text-sm space-y-1 product-card__categories">
            {product.categoryLinks.map((category) => (
              <li key={category.title}>
                <Link
                  className={`capitalize text-mute3 hover:text-[${product.color}]`}
                  href={category.href}
                >
                  {category.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="absolute bottom-[-2.125rem] left-1/2 -translate-x-1/2 h-16 w-16 flex items-center justify-center bg-white hover:bg-body hover:text-white border border-[#3030411a]">
        <ShoppingBagIcon className="h-7 w-7" />
      </div>
    </button>
  );
};

export default ProductCard;
