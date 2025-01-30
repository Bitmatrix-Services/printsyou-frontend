'use client';
import * as React from 'react';
import {Dispatch, FC, Fragment, SetStateAction, useMemo, useState} from 'react';
import {MdArrowForward, MdInfo} from 'react-icons/md';
import {PricingTable} from '@components/home/product/pricing-table.component';
import Link from 'next/link';
import {Product, productColors, ProductImage} from '@components/home/product/product.types';
import {colorNameToHex, extractColorsArray, getColorsWithHex, getContrastColor} from '@utils/utils';
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

  const colorsArray = useMemo(() => {
    const availableColors = extractColorsArray(product.additionalFieldProductValues);
    return availableColors?.filter(color => colorNameToHex(color));
  }, [product.additionalFieldProductValues]);

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

  return (
    <div className="col flex flex-col">
      <div className="text-sm mb-2 flex items-center flex-wrap">
        <span className="text-mute4 mr-1">Category:</span>
        {[...(product.crumbs ?? [])]
          .sort((a, b) => b.sequenceNumber - a.sequenceNumber)
          .map((productCategory, index) => (
            <Fragment key={productCategory.id}>
              {index !== 0 && index < product.crumbs.length - 1 ? (
                <span className="mx-2">
                  <MdArrowForward className=" h-5 w-6" />
                </span>
              ) : null}
              {index < product.crumbs.length - 1 ? (
                <span className="font-semibold capitalize ">{productCategory.name}</span>
              ) : null}
            </Fragment>
          ))}
      </div>
      <div className="text-sm mb-2 flex items-center flex-wrap">
        <span className="text-mute4 mr-1 capitalize">sku:</span>
        <span className="font-semibold text-primary-500">{product.sku}</span>
      </div>
      <h1 className=" text-xl md:text-2xl font-bold capitalize">
        <span
          dangerouslySetInnerHTML={{
            __html: product?.productName ?? ''
          }}
        />
      </h1>

      {/*<div className=" lg:flex md:flex-row flex-col items-center gap-5">*/}
      {/*  <div className="flex gap-x-2 items-center">*/}
      {/*    <ViewRating rating={3.1} totalReviews={100104454} />*/}
      {/*  </div>*/}
      {/*  <div className="flex">*/}
      {/*    <FaRegHeart className="h-6 w-6 text-primary-500  cursor-pointer" />*/}
      {/*  </div>*/}
      {/*</div>*/}
      <div className="mt-2 flex flex-col sm:flex-row gap-3">
        <p className="text-sm font-normal text-mute3">{product.metaDescription}</p>
      </div>

      {product.outOfStock ? (
        <div className="flex items-center my-2">
          <Chip size="sm" color="danger" variant="solid">
            Out of Stock
          </Chip>
          {relatedProductsLink ? (
            <div
              className="text-sm underline text-[#16467b] cursor-pointer hover:text-primary-500 ml-2"
              onClick={() => scrollToRelatedProducts()}
            >
              Checkout Related Products
            </div>
          ) : null}
        </div>
      ) : null}

      {handleScroll && (
        <div className="flex items-center">
          <h3 className="text-sm underline cursor-pointer hover:text-primary-500" onClick={handleScroll}>
            See Details
          </h3>
        </div>
      )}
      {productColors?.length > 0 || colorsArray.length > 0 ? (
        <div className="my-4 flex flex-col gap-3">
          <div className="text-mute text-sm font-normal">
            {selectedColor ? (
              <>
                Color: <span className="text-black font-bold">{selectedColor}</span>
              </>
            ) : (
              'Colors:'
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {productColors.length > 0
              ? productColors.map(color => (
                  <div key={color?.id} style={{display: 'flex', gap: '10px', position: 'relative'}}>
                    <div
                      key={color?.id}
                      className={color?.coloredProductImage ? 'hover:cursor-pointer' : ''}
                      style={{
                        backgroundColor: color?.colorHex,
                        width: color?.colorName === selectedColor ? 30 : 25,
                        height: color?.colorName === selectedColor ? 30 : 25,
                        borderRadius: '50%',
                        border: `1px solid grey`,
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
                ))
              : colorsArray?.map(color => (
                  <div
                    key={color}
                    style={{
                      backgroundColor: color,
                      width: 25,
                      height: 25,
                      borderRadius: '50%',
                      border: `1px solid grey`
                    }}
                  />
                ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col flex-wrap lg:flex-row lg:items-center lg:justify-start gap-4 w-full mt-4  ">
        {/*TODO: Commenting this for watching user behaviour on PostHog */}
        {/*<button*/}
        {/*  className="py-2 px-6 flex border-2 items-center justify-center border-primary-500 rounded-md  bg-primary-500 text-white w-full lg:w-auto capitalize"*/}
        {/*  onClick={e => {*/}
        {/*    dispatch(*/}
        {/*      setCartStateForModal({*/}
        {/*        selectedProduct: structuredClone(product),*/}
        {/*        open: true,*/}
        {/*        selectedItem: null,*/}
        {/*        cartMode: 'new'*/}
        {/*      })*/}
        {/*    );*/}
        {/*    e.stopPropagation();*/}
        {/*  }}*/}
        {/*>*/}
        {/*  Add to cart <PiShoppingCartSimple className=" ml-3 h-5 w-5" />*/}
        {/*</button>*/}
        <Link
          className={`py-2 px-6 border-2 flex items-center justify-center rounded-md text-white ${product.outOfStock ? 'border-mute4 bg-mute4 pointer-events-none' : 'border-primary bg-primary hover:bg-primary-400'} w-full lg:w-auto`}
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
      <div className="text-mute border-t border mt-6" />

      <PricingTable product={product} />

      {product?.additionalRows.length > 0 && (
        <div className="mt-2 p-4 w-full bg-[#f6f7f8] rounded-xl">
          <ul className="text-xs text-mute3">
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
        </div>
      )}

      {/* Size Selection */}
      {/*<div className="flex flex-row gap-2 items-center capitalize">*/}
      {/*  <h3 className="text-xl font-bold">Size:</h3>*/}
      {/*  {['XS', 'S', 'M', 'L', 'XL'].map(size => (*/}
      {/*    <button*/}
      {/*      key={uuidv4()}*/}
      {/*      className="sm:px-3 sm:py-2 lg:px-4 lg:py-2 text-sm font-semibold text-gray-700 border rounded hover:bg-gray-100"*/}
      {/*    >*/}
      {/*      {size}*/}
      {/*    </button>*/}
      {/*  ))}*/}
      {/*</div>*/}

      {/*<div className="flex mt-4 justify-between">*/}
      {/*  <div className="flex capitalize">*/}
      {/*    <h4>share product : </h4>*/}
      {/*    <div className=" flex space-x-3">*/}
      {/*      {social.map(item => (*/}
      {/*        <Link key={uuidv4()} href={item.href} target="_blank">*/}
      {/*          <span className="sr-only">{item.name}</span>*/}
      {/*          <item.icon className="h-6 w-6" aria-hidden="true" />*/}
      {/*        </Link>*/}
      {/*      ))}*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
};
