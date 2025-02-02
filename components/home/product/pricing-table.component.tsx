import React, {FC} from 'react';
import {PriceGrids, Product} from '@components/home/product/product.types';
import dayjs from 'dayjs';

interface IPricingTableProps {
  product: Product;
}

export const PricingTable: FC<IPricingTableProps> = ({product}) => {
  const countFrom: Set<PriceGrids['countFrom']> = new Set();
  const byRowTypeObjects: Record<PriceGrids['priceType'], {price: number; salePrice: number}[]> = {};

  if (product) {
    const isNullPriceType =
      product.priceGrids.filter(item => item.priceType == null || item.priceType == '').length > 0;
    product?.priceGrids?.length > 0 &&
      product.priceGrids
        ?.sort((a, b) => a.countFrom - b.countFrom)
        .forEach(gridItem => {
          countFrom.add(gridItem.countFrom);
          if ((isNullPriceType && gridItem.priceType == null) || gridItem.priceType == '') {
            if (!('' in byRowTypeObjects)) {
              byRowTypeObjects[''] = [];
            }
            byRowTypeObjects[''].push({price: gridItem.price, salePrice: gridItem.salePrice});
          }
          if (!isNullPriceType) {
            if (!(gridItem.priceType in byRowTypeObjects)) {
              byRowTypeObjects[gridItem.priceType] = [];
            }
            byRowTypeObjects[gridItem.priceType].push({price: gridItem.price, salePrice: gridItem.salePrice});
          }
        });
  }

  return (
    <div className="overflow-auto mt-6 px-6 pb-10 shadow-pricingTableShadow rounded-lg">
      <h4 className="text-2xl font-semibold mb-3 capitalize">pricing</h4>
      {product?.priceGrids?.length > 0 &&
        [...product.priceGrids].sort((a, b) => a.countFrom - b.countFrom)[0].countFrom !== 0 && (
          <table className="w-full">
            <tbody>
              <tr className="one">
                {'' in byRowTypeObjects || 'null' in byRowTypeObjects ? null : <td className="headcell"></td>}
                {Array.from(countFrom).map(row => (
                  <td className="headcell" key={row}>
                    {row} Items
                  </td>
                ))}
              </tr>
              {Object.keys(byRowTypeObjects)
                .sort((a: string, b: string) => a.localeCompare(b))
                .map(row => {
                  return (
                    <tr key={row} className="two">
                      {row && row != 'null' && <td className="pricecell font-bold text-left">{row}</td>}
                      {byRowTypeObjects[row].map(cell => (
                        <td className="pricecell" key={cell.price}>
                          {product.saleEndDate &&
                          Date.parse(product.saleEndDate) > new Date().getTime() &&
                          cell.salePrice ? (
                            <div className="flex justify-evenly flex-col">
                              <span className="line-through font-bold text-xl">
                                {cell.price < 0.01 ? '-' : `$${cell.price.toFixed(2)}`}
                              </span>
                              <span className="font-bold text-2xl">
                                {cell.salePrice < 0.01 ? '-' : `$${cell.salePrice.toFixed(2)}`}
                              </span>
                            </div>
                          ) : (
                            <span className="font-bold text-2xl">
                              {cell.price < 0.01 ? '-' : `$${cell.price.toFixed(2)}`}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              {product.saleEndDate && Date.parse(product.saleEndDate) > new Date().getTime() && (
                <tr className=" h-[3rem] px-3 text-center text-base border border-[#eceef1]">
                  <td colSpan={product.priceGrids.length + 1}>
                    Sale Ends:{' '}
                    <span className="text-lg font-semibold">{dayjs(product.saleEndDate).format('MM/DD/YYYY')}</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
    </div>
  );
};
