'use client';
import * as React from 'react';
import {FC, Fragment, useMemo} from 'react';
import {MdArrowForward, MdInfo} from 'react-icons/md';
import {PricingTable} from '@components/home/product/pricing-table.component';
import {setCartStateForModal} from '../../../store/slices/cart/cart.slice';
import Link from 'next/link';
import {Product} from '@components/home/product/product.types';
import {useAppDispatch} from '../../../store/hooks';
import {PiShoppingCartSimple} from 'react-icons/pi';

interface ProductDescriptionComponent {
  product: Product;
  handleScroll?: () => void;
}

export const ProductDescriptionComponent: FC<ProductDescriptionComponent> = ({product, handleScroll}) => {
  const dispatch = useAppDispatch();

  const colorsArray = useMemo(() => {
    return [];
  }, [product.additionalFieldProductValues]);

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
        ></span>
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
      <h3
        className="text-sm mt-1 underline cursor-pointer hover:text-primary-500"
        onClick={handleScroll && handleScroll}
      >
        See Details
      </h3>

      {colorsArray.length > 0 ? (
        <div className="my-4 flex flex-col gap-3">
          <div className="text-mute text-sm font-normal">Colors:</div>
          <div className="flex flex-wrap gap-3">
            {colorsArray?.map(color => (
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

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-start gap-4 w-full mt-4  ">
        <button
          className="py-2 px-6 flex border-2 items-center justify-center border-primary-500 rounded-md  bg-primary-500 text-white w-full lg:w-auto capitalize"
          onClick={e => {
            dispatch(
              setCartStateForModal({
                selectedProduct: structuredClone(product),
                open: true,
                selectedItem: null,
                cartMode: 'new'
              })
            );
            e.stopPropagation();
          }}
        >
          Add to cart <PiShoppingCartSimple className=" ml-3 h-5 w-5" />
        </button>
        <Link
          className="py-2 px-6 border-2 flex items-center justify-center rounded-md border-primary-500 text-primary-500 w-full lg:w-auto"
          href={`/more-info?item_id=${product.id}`}
        >
          More Info
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
