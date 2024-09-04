import React, {FC} from 'react';
import {PriceGrids, Product} from '@components/home/product/product.types';

interface IPricingTableProps {
  product: Product;
}

export const PricingTable: FC<IPricingTableProps> = ({product}) => {
  const countFrom: Set<PriceGrids['countFrom']> = new Set();
  const byRowTypeObjects: Record<PriceGrids['priceType'], PriceGrids['price'][]> = {};

  if (product) {
    product?.priceGrids?.length > 0 &&
      product.priceGrids
        ?.sort((a, b) => a.countFrom - b.countFrom)
        .forEach(gridItem => {
          countFrom.add(gridItem.countFrom);
          if (!(gridItem.priceType in byRowTypeObjects)) {
            byRowTypeObjects[gridItem.priceType] = [];
          }
          byRowTypeObjects[gridItem.priceType].push(gridItem.price);
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
                        <td className="pricecell" key={cell}>
                          {cell < 0.01 ? '-' : `$${cell}`}
                        </td>
                      ))}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
    </div>
  );
};
