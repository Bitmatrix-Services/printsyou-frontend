'use client';
import React, {FC, memo, useCallback, useState} from 'react';
import {useRouter, useSearchParams, usePathname} from 'next/navigation';
import {
  CategoryFilters,
  FilterGroup,
  FilterOption,
  FilterType,
  ActiveFilters,
  parseFiltersFromSearchParams,
  hasActiveFilters
} from './filter.types';
import {HiChevronDown, HiChevronUp, HiX} from 'react-icons/hi';

interface FilterSidebarProps {
  filters: CategoryFilters | null;
  categoryUniqueName: string;
}

const FilterSidebar: FC<FilterSidebarProps> = memo(({filters, categoryUniqueName}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentFilters = parseFiltersFromSearchParams(Object.fromEntries(searchParams.entries()));

  const updateFilters = useCallback((newFilters: Partial<ActiveFilters>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset page when filters change
    params.delete('page');

    // Update color filter
    if (newFilters.colors !== undefined) {
      if (newFilters.colors.length > 0) {
        params.set('colors', newFilters.colors.join(','));
      } else {
        params.delete('colors');
      }
    }

    // Update sizes filter
    if (newFilters.sizes !== undefined) {
      if (newFilters.sizes.length > 0) {
        params.set('sizes', newFilters.sizes.join(','));
      } else {
        params.delete('sizes');
      }
    }

    // Update materials filter
    if (newFilters.materials !== undefined) {
      if (newFilters.materials.length > 0) {
        params.set('materials', newFilters.materials.join(','));
      } else {
        params.delete('materials');
      }
    }

    // Update price range
    if (newFilters.minPrice !== undefined) {
      if (newFilters.minPrice !== null) {
        params.set('minPrice', newFilters.minPrice.toString());
      } else {
        params.delete('minPrice');
      }
    }
    if (newFilters.maxPrice !== undefined) {
      if (newFilters.maxPrice !== null) {
        params.set('maxPrice', newFilters.maxPrice.toString());
      } else {
        params.delete('maxPrice');
      }
    }

    // Update rush shipping
    if (newFilters.rushShipping !== undefined) {
      if (newFilters.rushShipping) {
        params.set('rushShipping', 'true');
      } else {
        params.delete('rushShipping');
      }
    }

    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`, {scroll: false});
  }, [router, pathname, searchParams]);

  const clearAllFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('colors');
    params.delete('sizes');
    params.delete('materials');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('rushShipping');
    params.delete('page');

    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`, {scroll: false});
  }, [router, pathname, searchParams]);

  if (!filters || filters.filterGroups.length === 0) {
    return null;
  }

  const showClearAll = hasActiveFilters(currentFilters);

  return (
    <nav aria-label="Product filters" className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide">
          Filters
        </h2>
        {showClearAll && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            aria-label="Clear all filters"
          >
            <HiX className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      <div className="divide-y divide-gray-200">
        {filters.filterGroups
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((group) => (
            <FilterGroupComponent
              key={group.filterType}
              group={group}
              currentFilters={currentFilters}
              onFilterChange={updateFilters}
              priceRange={{min: filters.minPrice, max: filters.maxPrice}}
            />
          ))}
      </div>
    </nav>
  );
});

FilterSidebar.displayName = 'FilterSidebar';

interface FilterGroupComponentProps {
  group: FilterGroup;
  currentFilters: ActiveFilters;
  onFilterChange: (filters: Partial<ActiveFilters>) => void;
  priceRange: {min: number | null; max: number | null};
}

const FilterGroupComponent: FC<FilterGroupComponentProps> = memo(({
  group,
  currentFilters,
  onFilterChange,
  priceRange
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getActiveValues = (): string[] => {
    switch (group.filterType) {
      case FilterType.COLOR:
        return currentFilters.colors;
      case FilterType.SIZE:
        return currentFilters.sizes;
      case FilterType.MATERIAL:
        return currentFilters.materials;
      default:
        return [];
    }
  };

  const handleCheckboxChange = (value: string, checked: boolean) => {
    const activeValues = getActiveValues();
    let newValues: string[];

    if (checked) {
      newValues = [...activeValues, value];
    } else {
      newValues = activeValues.filter(v => v !== value);
    }

    // If ALL options are selected, treat as "no filter" to include products without data
    // This prevents hiding products that don't have color/size/material data
    const allOptionsSelected = newValues.length >= group.options.length;
    const finalValues = allOptionsSelected ? [] : newValues;

    switch (group.filterType) {
      case FilterType.COLOR:
        onFilterChange({colors: finalValues});
        break;
      case FilterType.SIZE:
        onFilterChange({sizes: finalValues});
        break;
      case FilterType.MATERIAL:
        onFilterChange({materials: finalValues});
        break;
    }
  };

  const activeCount = getActiveValues().length;

  return (
    <fieldset className="p-0 m-0 border-0">
      <legend className="sr-only">{group.displayName}</legend>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
        aria-expanded={isExpanded}
        aria-controls={`filter-group-${group.filterType}`}
      >
        <span className="font-semibold text-gray-900 text-sm flex items-center gap-2">
          {group.displayName}
          {activeCount > 0 && (
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </span>
        {isExpanded ? (
          <HiChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <HiChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div id={`filter-group-${group.filterType}`} className="px-4 pb-3">
          {group.filterType === FilterType.COLOR && (
            <ColorFilterOptions
              options={group.options}
              activeValues={currentFilters.colors}
              onChange={handleCheckboxChange}
            />
          )}

          {group.filterType === FilterType.SIZE && (
            <CheckboxFilterOptions
              options={group.options}
              activeValues={currentFilters.sizes}
              onChange={handleCheckboxChange}
              filterType={group.filterType}
            />
          )}

          {group.filterType === FilterType.MATERIAL && (
            <CheckboxFilterOptions
              options={group.options}
              activeValues={currentFilters.materials}
              onChange={handleCheckboxChange}
              filterType={group.filterType}
            />
          )}

          {group.filterType === FilterType.PRICE_RANGE && (
            <PriceRangeFilter
              minPrice={priceRange.min ?? 0}
              maxPrice={priceRange.max ?? 1000}
              currentMin={currentFilters.minPrice}
              currentMax={currentFilters.maxPrice}
              onFilterChange={onFilterChange}
            />
          )}

          {group.filterType === FilterType.RUSH_SHIPPING && (
            <RushShippingFilter
              isActive={currentFilters.rushShipping}
              productCount={group.options[0]?.count ?? 0}
              onFilterChange={onFilterChange}
            />
          )}
        </div>
      )}
    </fieldset>
  );
});

FilterGroupComponent.displayName = 'FilterGroupComponent';

interface ColorFilterOptionsProps {
  options: FilterOption[];
  activeValues: string[];
  onChange: (value: string, checked: boolean) => void;
}

const ColorFilterOptions: FC<ColorFilterOptionsProps> = memo(({options, activeValues, onChange}) => {
  // Helper to determine if color is light (needs dark checkmark)
  const isLightColor = (hex: string | undefined): boolean => {
    if (!hex) return false;
    const color = hex.replace('#', '');
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    // Calculate perceived brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 180;
  };

  return (
    <div className="grid grid-cols-5 gap-2">
      {options.slice(0, 15).map((option) => {
        const isActive = activeValues.includes(option.value);
        const needsDarkCheck = isLightColor(option.colorHex);
        return (
          <label
            key={option.value}
            className="relative cursor-pointer group"
            title={`${option.label} (${option.count})`}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={isActive}
              onChange={(e) => onChange(option.value, e.target.checked)}
              aria-label={`Filter by color: ${option.label}`}
            />
            <div
              className={`
                w-7 h-7 rounded-full border-2 transition-all
                ${isActive ? 'border-blue-500 ring-2 ring-blue-200 scale-110' : 'border-gray-300 group-hover:border-gray-400'}
              `}
              style={{backgroundColor: option.colorHex || '#ccc'}}
              role="presentation"
            />
            {isActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className={`w-4 h-4 ${needsDarkCheck ? 'text-gray-800' : 'text-white'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  style={{filter: needsDarkCheck ? 'none' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))'}}
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </label>
        );
      })}
    </div>
  );
});

ColorFilterOptions.displayName = 'ColorFilterOptions';

interface CheckboxFilterOptionsProps {
  options: FilterOption[];
  activeValues: string[];
  onChange: (value: string, checked: boolean) => void;
  filterType: FilterType;
}

const CheckboxFilterOptions: FC<CheckboxFilterOptionsProps> = memo(({options, activeValues, onChange, filterType}) => {
  const [showAll, setShowAll] = useState(false);
  const displayOptions = showAll ? options : options.slice(0, 6);

  return (
    <div className="space-y-2">
      {displayOptions.map((option) => {
        const isActive = activeValues.includes(option.value);
        return (
          <label
            key={option.value}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              checked={isActive}
              onChange={(e) => onChange(option.value, e.target.checked)}
              aria-label={`Filter by ${filterType.toLowerCase()}: ${option.label}`}
            />
            <span className={`text-sm ${isActive ? 'text-gray-900 font-medium' : 'text-gray-700'} group-hover:text-gray-900`}>
              {option.label}
            </span>
            <span className="text-xs text-gray-400 ml-auto">({option.count})</span>
          </label>
        );
      })}

      {options.length > 6 && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-1"
        >
          {showAll ? 'Show less' : `Show ${options.length - 6} more`}
        </button>
      )}
    </div>
  );
});

CheckboxFilterOptions.displayName = 'CheckboxFilterOptions';

interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  currentMin: number | null;
  currentMax: number | null;
  onFilterChange: (filters: Partial<ActiveFilters>) => void;
}

const PriceRangeFilter: FC<PriceRangeFilterProps> = memo(({
  minPrice,
  maxPrice,
  currentMin,
  currentMax,
  onFilterChange
}) => {
  const [localMin, setLocalMin] = useState(currentMin?.toString() ?? '');
  const [localMax, setLocalMax] = useState(currentMax?.toString() ?? '');
  const [hasChanges, setHasChanges] = useState(false);

  const handleApply = () => {
    const newMin = localMin ? parseFloat(localMin) : null;
    const newMax = localMax ? parseFloat(localMax) : null;
    // Only apply if values actually changed
    if (newMin !== currentMin || newMax !== currentMax) {
      onFilterChange({minPrice: newMin, maxPrice: newMax});
    }
    setHasChanges(false);
  };

  const handleClear = () => {
    setLocalMin('');
    setLocalMax('');
    setHasChanges(false);
    onFilterChange({minPrice: null, maxPrice: null});
  };

  const handleMinChange = (value: string) => {
    setLocalMin(value);
    setHasChanges(true);
  };

  const handleMaxChange = (value: string) => {
    setLocalMax(value);
    setHasChanges(true);
  };

  // Auto-apply on blur if there are changes
  const handleBlur = () => {
    if (hasChanges) {
      handleApply();
    }
  };

  // Apply on Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  const isFilterActive = currentMin !== null || currentMax !== null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label htmlFor="price-min" className="sr-only">Minimum price</label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              id="price-min"
              type="number"
              placeholder={minPrice.toFixed(0)}
              value={localMin}
              onChange={(e) => handleMinChange(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="w-full pl-6 pr-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
              min={0}
              aria-label="Minimum price"
            />
          </div>
        </div>
        <span className="text-gray-400">-</span>
        <div className="flex-1">
          <label htmlFor="price-max" className="sr-only">Maximum price</label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              id="price-max"
              type="number"
              placeholder={maxPrice.toFixed(0)}
              value={localMax}
              onChange={(e) => handleMaxChange(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="w-full pl-6 pr-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
              min={0}
              aria-label="Maximum price"
            />
          </div>
        </div>
      </div>
      {/* Show Apply button only when there are pending changes, Clear when filter is active */}
      {(hasChanges || isFilterActive) && (
        <div className="flex gap-2">
          {hasChanges && (
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
            >
              Apply
            </button>
          )}
          {isFilterActive && (
            <button
              type="button"
              onClick={handleClear}
              className={`px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors ${hasChanges ? '' : 'flex-1'}`}
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
});

PriceRangeFilter.displayName = 'PriceRangeFilter';

interface RushShippingFilterProps {
  isActive: boolean;
  productCount: number;
  onFilterChange: (filters: Partial<ActiveFilters>) => void;
}

const RushShippingFilter: FC<RushShippingFilterProps> = memo(({isActive, productCount, onFilterChange}) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer group p-2 rounded hover:bg-gray-50 transition-colors">
      <input
        type="checkbox"
        checked={isActive}
        onChange={(e) => onFilterChange({rushShipping: e.target.checked})}
        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
        aria-label="Filter by rush shipping availability"
      />
      <div className="flex-1">
        <span className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
          Rush Shipping Available
        </span>
        <p className="text-xs text-gray-500">Get it faster with expedited delivery</p>
      </div>
      {productCount > 0 && (
        <span className="text-xs text-gray-400">({productCount})</span>
      )}
    </label>
  );
});

RushShippingFilter.displayName = 'RushShippingFilter';

export default FilterSidebar;
