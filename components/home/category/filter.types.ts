/* eslint-disable no-unused-vars */
export enum FilterType {
  COLOR = 'COLOR',
  MATERIAL = 'MATERIAL',
  SIZE = 'SIZE',
  PRICE_RANGE = 'PRICE_RANGE',
  RUSH_SHIPPING = 'RUSH_SHIPPING'
}
/* eslint-enable no-unused-vars */

export interface FilterOption {
  value: string;
  label: string;
  count: number;
  colorHex?: string;
  isIndexable?: boolean;
}

export interface FilterGroup {
  filterType: FilterType;
  displayName: string;
  displayOrder: number;
  isIndexable: boolean;
  options: FilterOption[];
}

export interface CategoryFilters {
  categoryId: string;
  categoryName: string;
  filterGroups: FilterGroup[];
  minPrice: number | null;
  maxPrice: number | null;
}

export interface ActiveFilters {
  colors: string[];
  sizes: string[];
  materials: string[];
  minPrice: number | null;
  maxPrice: number | null;
  rushShipping: boolean;
}

export const DEFAULT_ACTIVE_FILTERS: ActiveFilters = {
  colors: [],
  sizes: [],
  materials: [],
  minPrice: null,
  maxPrice: null,
  rushShipping: false
};

export const parseFiltersFromSearchParams = (searchParams: Record<string, string | string[] | undefined>): ActiveFilters => {
  return {
    colors: parseArrayParam(searchParams.colors),
    sizes: parseArrayParam(searchParams.sizes),
    materials: parseArrayParam(searchParams.materials),
    minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice as string) : null,
    maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice as string) : null,
    rushShipping: searchParams.rushShipping === 'true'
  };
};

export const buildFilterQueryString = (filters: ActiveFilters): string => {
  const params = new URLSearchParams();

  if (filters.colors.length > 0) {
    params.set('colors', filters.colors.join(','));
  }
  if (filters.sizes.length > 0) {
    params.set('sizes', filters.sizes.join(','));
  }
  if (filters.materials.length > 0) {
    params.set('materials', filters.materials.join(','));
  }
  if (filters.minPrice !== null) {
    params.set('minPrice', filters.minPrice.toString());
  }
  if (filters.maxPrice !== null) {
    params.set('maxPrice', filters.maxPrice.toString());
  }
  if (filters.rushShipping) {
    params.set('rushShipping', 'true');
  }

  return params.toString();
};

export const hasActiveFilters = (filters: ActiveFilters): boolean => {
  return (
    filters.colors.length > 0 ||
    filters.sizes.length > 0 ||
    filters.materials.length > 0 ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.rushShipping
  );
};

const parseArrayParam = (param: string | string[] | undefined): string[] => {
  if (!param) return [];
  if (Array.isArray(param)) return param;
  return param.split(',').filter(Boolean);
};
