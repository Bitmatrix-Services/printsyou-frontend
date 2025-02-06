import React, {FC, useMemo} from 'react';
import {Product} from '@components/home/product/product.types';
import dayjs from 'dayjs';
import {buildPriceMatrix} from '@utils/utils';

interface IPricingTableProps {
  product: Product;
}

export const PricingTable: FC<IPricingTableProps> = ({product}) => {
  const pricingTable = useMemo(() => {
    return buildPriceMatrix(product.priceGrids);
  }, [product.priceGrids]);

  return (
    <div className="overflow-auto mt-6 px-6 pb-10 shadow-pricingTableShadow rounded-lg">
      <h4 className="text-2xl font-semibold mb-3 capitalize">pricing</h4>
      {product?.priceGrids?.length > 0 &&
        [...product.priceGrids].sort((a, b) => a.countFrom - b.countFrom)[0].countFrom !== 0 && (
          <table className="w-full">
            <tbody>
              <tr className="one">
                {!pricingTable.byRowTypeObjects || '' in pricingTable.byRowTypeObjects ? null : (
                  <td className="headcell">
                    <h3 className="font-semibold">Decoration Type</h3>
                  </td>
                )}
                {pricingTable.countFrom.map(row => (
                  <td className="headcell" key={row}>
                    <h3 className="font-semibold">{row} Items</h3>
                  </td>
                ))}
              </tr>
              {Object.entries(pricingTable.byRowTypeObjects).map(([priceType, prices]) => {
                return (
                  <tr key={priceType} className="two">
                    {priceType && priceType != 'null' && (
                      <td className="pricecell font-bold text-left capitalize">{priceType.toLowerCase()}</td>
                    )}
                    {prices?.map((priceData: any) => (
                      <td className="pricecell" key={priceData.price}>
                        {product.saleEndDate &&
                        Date.parse(product.saleEndDate) > new Date().getTime() &&
                        priceData.salePrice ? (
                          <div className="flex justify-evenly flex-col">
                            <span className="line-through font-bold text-xl">
                              {priceData.price < 0.01 ? (
                                <span className="font-normal text-xl">-</span>
                              ) : (
                                `$${priceData.price.toFixed(2)}`
                              )}
                            </span>
                            <span className="font-bold text-2xl">
                              {priceData.salePrice < 0.01 ? (
                                <span className="font-normal text-xl">-</span>
                              ) : (
                                `$${priceData.salePrice.toFixed(2)}`
                              )}
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-2xl">
                            {priceData.price < 0.01 ? (
                              <span className="font-normal text-xl">-</span>
                            ) : (
                              `$${priceData.price.toFixed(2)}`
                            )}
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
