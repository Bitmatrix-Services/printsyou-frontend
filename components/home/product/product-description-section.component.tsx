'use client';
import * as React from 'react';
import {Dispatch, FC, Fragment, SetStateAction, useMemo, useState} from 'react';
import {MdArrowForward, MdInfo} from 'react-icons/md';
import {PricingTable} from '@components/home/product/pricing-table.component';
import Link from 'next/link';
import {Product, productColors, ProductImage} from '@components/home/product/product.types';
import {getColorsWithHex} from '@utils/utils';
import {RiShoppingBag4Fill} from 'react-icons/ri';
import {Chip} from '@mui/joy';
import {ColorSwatch} from '@components/home/product/color-swatch.component';

interface ProductDescriptionComponent {
  product: Product;
  handleScroll?: () => void;
  setImages: Dispatch<SetStateAction<ProductImage[]>>;
  images: ProductImage[];
  relatedProductsLink?: boolean;
}

export const ProductDescriptionComponent: FC<ProductDescriptionComponent> = ({
  product,
  handleScroll,
  images,
  setImages,
  relatedProductsLink
}) => {
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);

  const productColors = useMemo(() => {
    const uniqueColors = new Map(
      product.productColors.map((color: productColors) => [color?.colorName.toLowerCase(), color])
    );
    return Array.from(uniqueColors.values())
      .map(getColorsWithHex)
      .filter(color => color?.colorName);
  }, [product.productColors]);

  const sortedCategories = useMemo(
    () => [...(product.crumbs ?? [])].sort((a, b) => b.sequenceNumber - a.sequenceNumber),
    [product.crumbs]
  );

  const isOutOfStock = useMemo(() => Boolean(product.outOfStock), [product.outOfStock]);

  const handleColorSelect = (color: productColors | null) => {
    if (!color?.coloredProductImage) return;

    const updatedImages = images.filter(img => img.imageUrl !== color.coloredProductImage);
    const newImg: ProductImage = {imageUrl: color.coloredProductImage, sequenceNumber: 0};

    setImages(selectedColor === color.colorName ? updatedImages : [newImg, ...updatedImages]);
    setSelectedColor(color.colorName);
  };

  const scrollToRelatedProducts = () => {
    const relatedProducts = document.getElementById('related-products');
    if (!relatedProducts) return;

    setTimeout(() => {
      window.scrollTo({
        top: relatedProducts.getBoundingClientRect().top + window.pageYOffset - 180,
        behavior: 'smooth'
      });
    }, 100);
  };

  return (
    <div className="col flex flex-col">
      <div className="text-sm mb-2 flex flex-wrap items-start">
        <div className="flex flex-wrap items-center">
          <span className="text-mute4 mr-1 whitespace-nowrap">Category:</span>
          {sortedCategories.map((category, index) => (
            <Fragment key={category.id}>
              {index > 0 && <MdArrowForward className="mx-2 h-5 w-6" />}
              <span className="font-semibold capitalize">{category.name}</span>
            </Fragment>
          ))}
        </div>
      </div>

      <div className="text-sm mb-2 flex items-center">
        <span className="text-mute4 mr-1 capitalize">SKU:</span>
        <span className="font-semibold text-primary-500">{product.sku}</span>
      </div>

      <h1 className="text-xl md:text-2xl font-bold capitalize min-h-[32px]">
        <span dangerouslySetInnerHTML={{__html: product?.productName ?? ''}} />
      </h1>

      <div className="mt-2 text-sm font-normal text-mute3">{product.metaDescription}</div>

      {isOutOfStock && (
        <div className="flex items-center my-2">
          <Chip size="sm" color="danger" variant="solid">
            Out of Stock
          </Chip>
          {relatedProductsLink && (
            <span
              className="ml-2 text-sm underline text-[#16467b] cursor-pointer hover:text-primary-500"
              onClick={scrollToRelatedProducts}
            >
              Checkout Related Products
            </span>
          )}
        </div>
      )}

      {handleScroll && (
        <h3 className="text-sm underline cursor-pointer hover:text-primary-500 mt-2" onClick={handleScroll}>
          See Details
        </h3>
      )}

      {/* Product Colors */}
      {productColors.length > 0 && (
        <div className="mt-4">
          <div className="text-mute text-sm font-normal">
            {selectedColor ? (
              <>
                Color: <span className="text-black font-bold">{selectedColor}</span>
              </>
            ) : (
              'Colors:'
            )}
          </div>
          <div className="flex flex-wrap gap-3 my-2">
            {productColors.map(color => (
              <ColorSwatch
                key={color?.colorName}
                color={color}
                selectedColor={selectedColor}
                onSelect={() => handleColorSelect(color)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap lg:flex-row lg:items-center gap-4 mt-3">
        <Link
          rel="preload"
          className={`py-2 px-6 border-2 flex items-center justify-center rounded-md text-white ${
            isOutOfStock
              ? 'border-mute4 bg-mute4 pointer-events-none'
              : 'border-primary bg-primary hover:bg-primary-400'
          } w-full lg:w-auto`}
          href={`/order-now?product_id=${product.id}`}
        >
          Order Now
          <RiShoppingBag4Fill className="ml-3 h-6 w-6" />
        </Link>
        <Link
          rel="preload"
          className="py-2 px-6 border-2 flex items-center justify-center rounded-md border-primary text-primary hover:bg-primary hover:text-white w-full lg:w-auto"
          href={`/more-info?item_id=${product.id}`}
        >
          Request More Info
          <MdInfo className="ml-3 h-6 w-6" />
        </Link>
      </div>

      <div className="min-h-[150px]">
        <PricingTable product={product} />
      </div>

      {/* Additional Rows */}
      {product.additionalRows.length > 0 && (
        <div className="mt-2 p-4 bg-[#f6f7f8] rounded-xl transition-all duration-300">
          <ul className={`text-xs text-mute3 ${isExpanded ? '' : 'max-h-[3.5rem] see-less-more'}`}>
            {product.additionalRows
              .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
              .map(row => (
                <li key={`${row.id}${row.name}`}>
                  <span className="block pt-[2px]">
                    <span className="text-mute3 font-base">{row.name}</span>
                    <span className="ml-2 text-primary-500 font-semibold">${row.priceDiff.toFixed(2)}</span>
                  </span>
                </li>
              ))}
          </ul>
          {product.additionalRows.length > 3 && (
            <span
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-500 text-sm font-medium cursor-pointer"
            >
              {isExpanded ? 'Show Less' : 'Show More'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
