'use client';
import * as React from 'react';
import {Dispatch, FC, Fragment, SetStateAction, useMemo, useState} from 'react';
import {PricingTable} from '@components/home/product/pricing-table.component';
import Link from 'next/link';
import {Product, productColors, ProductImage} from '@components/home/product/product.types';
import {colorNameToHex, extractColorsArray, getColorsWithHex} from '@utils/utils';
import {RiShoppingBag4Fill, RiFileList3Line} from 'react-icons/ri';
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
    const colorsFromAdditionalFields = extractColorsArray(product.additionalFieldProductValues).map(color =>
      colorNameToHex(color)
    );

    let finalColors = [...colorsFromAdditionalFields, ...product.productColors];

    const uniqueColors = new Map(finalColors.map((color: productColors) => [color?.colorName.toLowerCase(), color]));
    return Array.from(uniqueColors.values())
      .map(getColorsWithHex)
      .filter(color => color?.colorName);
  }, [product.productColors, product.additionalFieldProductValues]);

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
    <div className="flex flex-col">
      {/* Product Title */}
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 capitalize leading-tight">
        <span dangerouslySetInnerHTML={{__html: product?.productName ?? ''}} />
      </h1>

      {/* Meta description */}
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{product.metaDescription}</p>

      {handleScroll && (
        <button
          className="mt-2 text-sm text-primary-500 hover:text-primary-600 underline underline-offset-2"
          onClick={handleScroll}
        >
          See Details
        </button>
      )}

      {isOutOfStock && (
        <div className="flex items-center mt-3 gap-2">
          <Chip size="sm" color="danger" variant="solid">
            Out of Stock
          </Chip>
          {relatedProductsLink && (
            <button
              className="text-sm text-primary-500 hover:text-primary-600 underline"
              onClick={scrollToRelatedProducts}
            >
              Checkout Related Products
            </button>
          )}
        </div>
      )}

      {/* Product Colors */}
      {productColors.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            {selectedColor ? (
              <>Colors: <span className="font-semibold text-gray-900">{selectedColor}</span></>
            ) : (
              'Colors:'
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {productColors.map(color => (
              <ColorSwatch
                key={color?.colorName}
                color={color}
                selectedColor={selectedColor}
                onSelect={() => color?.coloredProductImage && handleColorSelect(color)}
              />
            ))}
          </div>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        {(product.orderType === 'CHECKOUT' || product.orderType === 'BOTH') && (
          <Link
            rel="preload"
            className={`py-3 px-6 flex items-center justify-center rounded-lg text-white font-medium transition-all duration-200 ${
              isOutOfStock
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-500 hover:bg-primary-600'
            } flex-1 sm:flex-none`}
            href={`/checkout?product_id=${product.id}`}
          >
            Order Now
            <RiShoppingBag4Fill className="ml-2 h-5 w-5" />
          </Link>
        )}
        {(product.orderType === 'QUOTE_ONLY' || product.orderType === 'BOTH' || !product.orderType) && (
          <Link
            className={`py-3 px-6 flex items-center justify-center rounded-lg font-medium transition-all duration-200 flex-1 sm:flex-none ${
              product.orderType === 'QUOTE_ONLY' || !product.orderType
                ? 'bg-primary-500 text-white hover:bg-primary-600'
                : 'bg-white border-2 border-primary-500 text-primary-500 hover:bg-primary-50'
            }`}
            href={`/request-quote?product=${product.id}`}
          >
            Get a Free Quote
            <RiFileList3Line className="ml-2 h-5 w-5" />
          </Link>
        )}
      </div>

      {/* Pricing Table */}
      <PricingTable product={product} />

      {/* Setup/Additional Fees */}
      {product.additionalRows.length > 0 && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <ul className={`text-sm text-gray-600 space-y-1 ${isExpanded ? '' : 'max-h-[3rem] overflow-hidden'}`}>
            {product.additionalRows
              .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
              .map(row => (
                <li key={`${row.id}${row.name}`} className="flex items-center justify-between">
                  <span className="text-gray-600">{row.name}</span>
                  <span className="text-primary-500 font-semibold">${row.priceDiff.toFixed(2)}</span>
                </li>
              ))}
          </ul>
          {product.additionalRows.length > 2 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary-500 text-sm font-medium mt-2 hover:underline"
            >
              {isExpanded ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
