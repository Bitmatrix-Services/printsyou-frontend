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
    <div className="mt-4">
      <h4 className="text-lg font-semibold text-gray-900 mb-3">Pricing</h4>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {pricingTable.byRowTypeObjects && !pricingTable.byRowTypeObjects[''] && (
                <th className="px-3 py-2 text-xs font-medium text-gray-600 text-left">Type</th>
              )}
              {pricingTable.countFrom.map(row => (
                <th key={row} className="px-3 py-2 text-xs font-medium text-gray-600 text-center whitespace-nowrap">
                  {row} Items
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(pricingTable.byRowTypeObjects).map(([priceType, prices]) => (
              <tr key={priceType} className="border-b border-gray-100 last:border-b-0">
                {priceType && priceType !== 'null' && (
                  <td className="px-3 py-3 text-sm text-gray-700 capitalize font-medium">
                    {priceType.toLowerCase()}
                  </td>
                )}
                {prices.map(({price, salePrice}, idx) => (
                  <td key={idx} className="px-3 py-3 text-center">
                    {isSaleActive && salePrice ? (
                      <div className="flex flex-col">
                        {price > 0 && <span className="line-through text-gray-400 text-sm">${price.toFixed(2)}</span>}
                        {salePrice > 0 && <span className="font-bold text-lg text-gray-900">${salePrice.toFixed(2)}</span>}
                      </div>
                    ) : (
                      <span className="font-bold text-lg text-gray-900">
                        {price > 0 ? `$${price.toFixed(2)}` : <span className="text-gray-400">-</span>}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}

            {isSaleActive && (
              <tr className="bg-yellow-50">
                <td colSpan={product.priceGrids.length + 1} className="px-3 py-2 text-center text-sm">
                  Sale Ends: <span className="font-semibold">{dayjs(product.saleEndDate).format('MM/DD/YYYY')}</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
