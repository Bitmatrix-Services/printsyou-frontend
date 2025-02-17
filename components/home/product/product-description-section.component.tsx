'use client';
import * as React from 'react';
import {Dispatch, FC, Fragment, SetStateAction, useMemo, useState} from 'react';
import {MdArrowForward, MdInfo} from 'react-icons/md';
import {PricingTable} from '@components/home/product/pricing-table.component';
import Link from 'next/link';
import {Product, productColors, ProductImage} from '@components/home/product/product.types';
import {getColorsWithHex, getContrastColor} from '@utils/utils';
import {RiShoppingBag4Fill} from 'react-icons/ri';
import {Chip} from '@mui/joy';

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

  const productColors = useMemo(() => {
    const uniqueColorsByName = Array.from(
      new Map(product.productColors.map((color: productColors) => [color?.colorName.toLowerCase(), color])).values()
    );

    return uniqueColorsByName.map(color => getColorsWithHex(color)).filter(color => Boolean(color?.colorName));
  }, [product.productColors]);

  const handleColorSelect = (color: productColors | null) => {
    if (color?.coloredProductImage) {
      let updatedImages = [...images];
      updatedImages = updatedImages.filter(img => img.imageUrl !== color.coloredProductImage);

      let newImg: ProductImage = {
        imageUrl: color.coloredProductImage,
        sequenceNumber: 0
      };

      if (selectedColor && selectedColor === color.colorName) updatedImages.shift();

      updatedImages.unshift(newImg);
      setImages(updatedImages);
      setSelectedColor(color.colorName);
    }
  };

  const scrollToRelatedProducts = () => {
    const relatedProducts = document.getElementById('related-products');

    if (relatedProducts) {
      setTimeout(() => {
        const yOffset = -180;
        const yPosition = relatedProducts.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({top: yPosition, behavior: 'smooth'});
      }, 100);
    }
  };

  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(prevState => !prevState);
  };

  return (
    <div className="col flex flex-col">
      <div className="text-sm mb-2 flex flex-wrap items-start">
        <div className="flex flex-wrap items-center">
        <span className="text-mute4 mr-1 whitespace-nowrap">Category:</span>
          {[...(product.crumbs ?? [])]
            .sort((a, b) => b.sequenceNumber - a.sequenceNumber)
            .map((productCategory, index) => (
              <Fragment key={productCategory.id}>
                {index > 0 && <span className="mx-2"><MdArrowForward className="h-5 w-6"/></span>}
                <span className="font-semibold capitalize">{productCategory.name}</span>
              </Fragment>
            ))}
        </div>
      </div>
      <div className="text-sm mb-2 flex items-center flex-wrap min-h-[24px]">
        <span className="text-mute4 mr-1 capitalize">sku:</span>
        <span className="font-semibold text-primary-500">{product.sku}</span>
      </div>
      <h1 className="text-xl md:text-2xl font-bold capitalize min-h-[32px]">
        <span dangerouslySetInnerHTML={{__html: product?.productName ?? ''}} />
      </h1>
      <div className="mt-2 flex flex-col sm:flex-row gap-3 min-h-[40px]">
        <p className="text-sm font-normal text-mute3">{product.metaDescription}</p>
      </div>
      <div className="">
        {product.outOfStock && (
          <div className="flex items-center my-2 min-h-[36px]">
            <Chip size="sm" color="danger" variant="solid">
              Out of Stock
            </Chip>
            {relatedProductsLink && (
              <div
                className="text-sm underline text-[#16467b] cursor-pointer hover:text-primary-500 ml-2"
                onClick={() => scrollToRelatedProducts()}
              >
                Checkout Related Products
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center min-h-[24px]">
        {handleScroll && (
          <h3 className="text-sm underline cursor-pointer hover:text-primary-500" onClick={handleScroll}>
            See Details
          </h3>
        )}
      </div>
      <div className="my-4 flex flex-col gap-3">
        {productColors.length > 0 ? (
          <div className="text-mute text-sm font-normal min-h-[50px]">
            {selectedColor ? (
              <>
                Color: <span className="text-black font-bold">{selectedColor}</span>
              </>
            ) : (
              'Colors:'
            )}
          </div>
        ) : null}
        <div className="flex flex-wrap gap-3">
          {productColors.map(color => (
            <div key={color?.id} style={{display: 'flex', gap: '10px', position: 'relative'}}>
              <div
                key={color?.id}
                className={color?.coloredProductImage ? 'hover:cursor-pointer' : ''}
                style={{
                  backgroundColor: color?.colorHex,
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  border: '1px solid grey',
                  position: 'relative'
                }}
                onClick={() => handleColorSelect(color)}
              />
              {selectedColor === color?.colorName && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '24px',
                    color: getContrastColor(color.colorHex),
                    fontWeight: 'bold'
                  }}
                >
                  ✔
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap lg:flex-row lg:items-center gap-4 min-h-[50px]">
        <Link
          className={`py-2 px-6 border-2 flex items-center justify-center rounded-md text-white ${
            product.outOfStock
              ? 'border-mute4 bg-mute4 pointer-events-none'
              : 'border-primary bg-primary hover:bg-primary-400'
          } w-full lg:w-auto`}
          href={`/order-now?product_id=${product.id}`}
        >
          Order Now
          <RiShoppingBag4Fill className=" ml-3 h-6 w-6" />
        </Link>
        <Link
          className="py-2 px-6 border-2 flex items-center justify-center rounded-md border-primary text-primary hover:bg-primary hover:text-white w-full lg:w-auto"
          href={`/more-info?item_id=${product.id}`}
        >
          Request More Info
          <MdInfo className=" ml-3 h-6 w-6" />
        </Link>
      </div>
      {/*<div className="text-mute border-t border mt-6 min-h-[10px]" />*/}
      <div className="min-h-[150px]">
        <PricingTable product={product} />
      </div>
      {product?.additionalRows.length > 0 && (
        <div className="mt-2 p-4 w-full bg-[#f6f7f8] rounded-xl transition-all duration-300">
          <ul className={`text-xs text-mute3 ${isExpanded ? '' : 'see-less-more'}`}>
            {[...product.additionalRows]
              ?.sort((a, b) => a.sequenceNumber - b.sequenceNumber)
              .map(row => (
                <li key={`${row.id}${row.name}`}>
                  <span className="pt-[2px] block">
                    <span className="text-mute3 font-base">{row.name}</span>
                    <span className="text-primary-500 ml-2 font-semibold">${row.priceDiff.toFixed(2)}</span>
                  </span>
                </li>
              ))}
          </ul>
          {product?.additionalRows.length > 4 && (
            <span onClick={handleToggle} className="text-blue-500 text-sm font-medium cursor-pointer">
              {isExpanded ? 'Show Less' : 'Show More'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
