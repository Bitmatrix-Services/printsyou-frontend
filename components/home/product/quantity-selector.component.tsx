'use client';
import React, {FC, useMemo} from 'react';
import {PriceGrids} from '@components/home/product/product.types';

interface QuantitySelectorProps {
  priceGrids: PriceGrids[];
  selectedQuantity: number;
  onQuantitySelect: (quantity: number) => void;
}

export const QuantitySelector: FC<QuantitySelectorProps> = ({priceGrids, selectedQuantity, onQuantitySelect}) => {
  const sortedPrices = useMemo(
    () => [...priceGrids].sort((a, b) => a.countFrom - b.countFrom),
    [priceGrids]
  );

  const highestPriceItem = sortedPrices[0];
  const lowestPriceItem = sortedPrices[sortedPrices.length - 1];

  const calculateSavings = (price: number) => {
    if (!highestPriceItem || price >= highestPriceItem.price) return 0;
    return Math.round(((highestPriceItem.price - price) / highestPriceItem.price) * 100);
  };

  return (
    <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2">
      {sortedPrices.map((item, index) => {
        const isSelected = selectedQuantity === item.countFrom;
        const isBestValue = index === sortedPrices.length - 1 && sortedPrices.length > 2;
        const savings = calculateSavings(item.price);
        const displayPrice = item.salePrice || item.price;

        return (
          <button
            key={item.id}
            onClick={() => onQuantitySelect(item.countFrom)}
            className={`relative text-center py-2 px-1 rounded-lg transition text-xs
              ${isSelected ? 'border-2 border-primary bg-primary/5' : 'border border-gray-200 hover:border-primary hover:bg-primary/5'}
              ${isBestValue && !isSelected ? 'border-green-400 bg-green-50' : ''}
            `}
          >
            {isBestValue && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap">
                Best Value
              </span>
            )}
            {isSelected && (
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-primary" />
            )}
            <div className={`font-semibold ${isSelected ? 'text-primary' : isBestValue ? 'text-green-700' : ''}`}>
              {item.countFrom}
            </div>
            <div className={`${isSelected ? 'text-primary' : isBestValue ? 'text-green-600' : 'text-gray-500'}`}>
              ${displayPrice.toFixed(2)}
            </div>
            {savings > 0 && (
              <div className="text-[10px] text-green-600 font-medium">-{savings}%</div>
            )}
          </button>
        );
      })}
    </div>
  );
};
