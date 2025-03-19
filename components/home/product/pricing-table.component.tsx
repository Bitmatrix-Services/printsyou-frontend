import React, {FC, useMemo} from 'react';
import {Product} from '@components/home/product/product.types';
import dayjs from 'dayjs';
import {buildPriceMatrix} from '@utils/utils';

interface IPricingTableProps {
  product: Product;
}

export const PricingTable: FC<IPricingTableProps> = ({product}) => {
  const pricingTable = useMemo(() => buildPriceMatrix(product.priceGrids), [product.priceGrids]);

  const sortedPriceGrids = useMemo(
    () => [...product.priceGrids].sort((a, b) => a.countFrom - b.countFrom),
    [product.priceGrids]
  );

  const hasValidCountFrom = sortedPriceGrids.length > 0 && sortedPriceGrids[0].countFrom !== 0;
  const isSaleActive = product.saleEndDate && Date.parse(product.saleEndDate) > new Date().getTime();

  if (!hasValidCountFrom) return null;

  return (
    <div className="overflow-auto mt-6 px-6 pb-10 shadow-pricingTableShadow rounded-lg">
      <h4 className="text-2xl font-semibold mb-3 capitalize">Pricing</h4>

      <table className="w-full">
        <tbody>
          <tr className="one">
            {pricingTable.byRowTypeObjects && !pricingTable.byRowTypeObjects[''] && (
              <td className="headcell">Decoration Type</td>
            )}
            {pricingTable.countFrom.map(row => (
              <td key={row} className="headcell">
                {row} Items
              </td>
            ))}
          </tr>

          {Object.entries(pricingTable.byRowTypeObjects).map(([priceType, prices]) => (
            <tr key={priceType} className="two">
              {priceType && priceType !== 'null' && (
                <td className="pricecell text-left capitalize" style={{fontWeight: 500}}>
                  {priceType.toLowerCase()}
                </td>
              )}
              {prices.map(({price, salePrice}) => (
                <td key={price} className="pricecell">
                  {isSaleActive && salePrice ? (
                    <div className="flex justify-evenly flex-col">
                      {price > 0 && <span className="line-through font-bold text-xl">${price.toFixed(2)}</span>}
                      {salePrice > 0 && <span className="font-bold text-2xl">${salePrice.toFixed(2)}</span>}
                    </div>
                  ) : (
                    <span className="font-bold text-2xl">
                      {price > 0 ? `$${price.toFixed(2)}` : <span className="font-normal text-xl">-</span>}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}

          {isSaleActive && (
            <tr className="h-[3rem] px-3 text-center text-base border border-[#eceef1]">
              <td colSpan={product.priceGrids.length + 1}>
                Sale Ends:{' '}
                <span className="text-lg font-semibold">{dayjs(product.saleEndDate).format('MM/DD/YYYY')}</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
