'use client';

import React, {FC, useEffect, useMemo, useState} from 'react';
import {FaTshirt, FaExclamationTriangle} from 'react-icons/fa';

// Common apparel sizes in order
const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];

export interface SizeQuantity {
  size: string;
  quantity: number;
}

interface SizeBreakdownProps {
  availableSizes: string[];
  totalQuantity: number;
  onChange: (sizeBreakdown: SizeQuantity[]) => void;
  disabled?: boolean;
}

// Helper to extract sizes from product additional fields
export const extractSizesFromProduct = (additionalFields: Array<{fieldName: string; fieldValue: string}>): string[] => {
  if (!additionalFields?.length) return [];

  // Look for size-related fields
  const sizeField = additionalFields.find(f =>
    f.fieldName.toLowerCase().includes('size') &&
    !f.fieldName.toLowerCase().includes('logo') &&
    !f.fieldName.toLowerCase().includes('imprint')
  );

  if (!sizeField?.fieldValue) return [];

  // Parse sizes from field value
  // Could be: "S, M, L, XL, 2XL" or "S-3XL" or "Small, Medium, Large"
  let sizes: string[] = [];
  const value = sizeField.fieldValue.toUpperCase();

  // Check for range format (S-3XL)
  if (value.includes('-') && !value.includes(',')) {
    const [start, end] = value.split('-').map(s => s.trim());
    const startIdx = STANDARD_SIZES.findIndex(s => s === start || start.includes(s));
    const endIdx = STANDARD_SIZES.findIndex(s => s === end || end.includes(s));
    if (startIdx !== -1 && endIdx !== -1) {
      sizes = STANDARD_SIZES.slice(startIdx, endIdx + 1);
    }
  }

  // Check for comma-separated format
  if (sizes.length === 0 && value.includes(',')) {
    sizes = value.split(',').map(s => {
      const trimmed = s.trim();
      // Normalize common variations
      if (trimmed.includes('SMALL') || trimmed === 'SM') return 'S';
      if (trimmed.includes('MEDIUM') || trimmed === 'MED') return 'M';
      if (trimmed.includes('LARGE') && !trimmed.includes('X')) return 'L';
      if (trimmed.includes('XLARGE') || trimmed === 'EXTRA LARGE') return 'XL';
      return trimmed;
    });
  }

  // Filter to only valid sizes
  return sizes.filter(s => STANDARD_SIZES.includes(s) || /^\d?X{0,2}L$/i.test(s) || /^[SML]$/i.test(s));
};

// Check if product is apparel based on category or name
export const isApparelProduct = (productName: string, categories: Array<{name: string}>): boolean => {
  const apparelKeywords = ['shirt', 't-shirt', 'tee', 'polo', 'jacket', 'hoodie', 'vest', 'sweater',
    'sweatshirt', 'fleece', 'cap', 'hat', 'apron', 'uniform', 'apparel', 'clothing', 'wear',
    'safety', 'hi-vis', 'high-vis', 'visibility', 'reflective', 'workwear', 'coverall', 'overall'];

  const nameLower = productName.toLowerCase();
  const categoryNames = categories.map(c => c.name.toLowerCase()).join(' ');

  return apparelKeywords.some(keyword =>
    nameLower.includes(keyword) || categoryNames.includes(keyword)
  );
};

export const SizeBreakdown: FC<SizeBreakdownProps> = ({
  availableSizes,
  totalQuantity,
  onChange,
  disabled = false
}) => {
  const [sizeQuantities, setSizeQuantities] = useState<Record<string, number>>({});

  // Sort sizes in standard order
  const sortedSizes = useMemo(() => {
    return [...availableSizes].sort((a, b) => {
      const aIdx = STANDARD_SIZES.indexOf(a.toUpperCase());
      const bIdx = STANDARD_SIZES.indexOf(b.toUpperCase());
      if (aIdx === -1 && bIdx === -1) return a.localeCompare(b);
      if (aIdx === -1) return 1;
      if (bIdx === -1) return -1;
      return aIdx - bIdx;
    });
  }, [availableSizes]);

  // Calculate current total from size breakdown
  const currentTotal = useMemo(() => {
    return Object.values(sizeQuantities).reduce((sum, qty) => sum + qty, 0);
  }, [sizeQuantities]);

  const remaining = totalQuantity - currentTotal;
  const isValid = remaining === 0;

  // Notify parent of changes
  useEffect(() => {
    const breakdown: SizeQuantity[] = Object.entries(sizeQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([size, quantity]) => ({size, quantity}));
    onChange(breakdown);
  }, [sizeQuantities, onChange]);

  const handleSizeChange = (size: string, value: string) => {
    const qty = parseInt(value, 10) || 0;
    setSizeQuantities(prev => ({
      ...prev,
      [size]: Math.max(0, qty)
    }));
  };

  const handleQuickDistribute = () => {
    // Distribute evenly across all sizes
    const perSize = Math.floor(totalQuantity / sortedSizes.length);
    const remainder = totalQuantity % sortedSizes.length;

    const distributed: Record<string, number> = {};
    sortedSizes.forEach((size, idx) => {
      distributed[size] = perSize + (idx < remainder ? 1 : 0);
    });
    setSizeQuantities(distributed);
  };

  const handleClear = () => {
    setSizeQuantities({});
  };

  if (!availableSizes.length) return null;

  return (
    <div className="w-full">
      {/* Header with actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <FaTshirt className="w-4 h-4 text-primary-500" />
          Size Breakdown
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleQuickDistribute}
            disabled={disabled}
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors disabled:opacity-50"
          >
            Distribute Evenly
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-600 mb-3">
        Specify how many of each size you need. Total must equal {totalQuantity} units.
      </p>

      {/* Size Grid - responsive for narrow containers */}
      <div className="grid grid-cols-5 gap-2 mb-3">
        {sortedSizes.slice(0, 5).map(size => (
          <div key={size} className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-1 text-center">
              {size}
            </label>
            <input
              type="number"
              min="0"
              max={totalQuantity}
              value={sizeQuantities[size] || ''}
              onChange={(e) => handleSizeChange(size, e.target.value)}
              placeholder="0"
              disabled={disabled}
              className="w-full h-9 text-center text-sm border border-gray-300 rounded font-medium focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        ))}
      </div>

      {/* Second row for additional sizes (2XL, 3XL, 4XL, etc.) */}
      {sortedSizes.length > 5 && (
        <div className="grid grid-cols-5 gap-2 mb-3">
          {sortedSizes.slice(5).map(size => (
            <div key={size} className="flex flex-col">
              <label className="text-xs font-medium text-gray-700 mb-1 text-center">
                {size}
              </label>
              <input
                type="number"
                min="0"
                max={totalQuantity}
                value={sizeQuantities[size] || ''}
                onChange={(e) => handleSizeChange(size, e.target.value)}
                placeholder="0"
                disabled={disabled}
                className="w-full h-9 text-center text-sm border border-gray-300 rounded font-medium focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          ))}
        </div>
      )}

      {/* Status Bar */}
      <div className={`p-2 rounded flex items-center justify-between text-xs ${
        isValid
          ? 'bg-green-50 border border-green-200'
          : remaining > 0
            ? 'bg-yellow-50 border border-yellow-200'
            : 'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-center gap-1.5">
          {!isValid && <FaExclamationTriangle className={`w-3 h-3 ${remaining > 0 ? 'text-yellow-600' : 'text-red-600'}`} />}
          <span className={`font-medium ${
            isValid ? 'text-green-700' : remaining > 0 ? 'text-yellow-700' : 'text-red-700'
          }`}>
            {isValid
              ? 'Complete!'
              : remaining > 0
                ? `${remaining} more units to assign`
                : `${Math.abs(remaining)} units over`
            }
          </span>
        </div>
        <div>
          <span className="font-medium">{currentTotal}</span>
          <span className="text-gray-500"> / {totalQuantity}</span>
        </div>
      </div>
    </div>
  );
};
