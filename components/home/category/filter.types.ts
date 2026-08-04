/* eslint-disable no-unused-vars */
export enum FilterType {
  COLOR = 'COLOR',
  MATERIAL = 'MATERIAL',
  SIZE = 'SIZE',
  PRICE_RANGE = 'PRICE_RANGE',
  RUSH_SHIPPING = 'RUSH_SHIPPING',
  CUSTOM = 'CUSTOM'
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
  // Only populated for CUSTOM groups - the "cf[<slug>]" query param key, and the join key
  // into ActiveFilters.custom below. Automatic groups keep using their fixed field names.
  slug?: string;
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
  // Keyed by custom filter slug -> selected value slugs, e.g. {"best-for": ["construction"]}.
  custom: Record<string, string[]>;
}

export const DEFAULT_ACTIVE_FILTERS: ActiveFilters = {
  colors: [],
  sizes: [],
  materials: [],
  minPrice: null,
  maxPrice: null,
  rushShipping: false,
  custom: {}
};

const CUSTOM_FILTER_PARAM_PATTERN = /^cf\[(.+)]$/;

export const parseFiltersFromSearchParams = (searchParams: Record<string, string | string[] | undefined>): ActiveFilters => {
  const custom: Record<string, string[]> = {};
  Object.keys(searchParams).forEach((key) => {
    const match = key.match(CUSTOM_FILTER_PARAM_PATTERN);
    if (!match) return;
    const values = parseArrayParam(searchParams[key]);
    if (values.length > 0) custom[match[1]] = values;
  });

  return {
    colors: parseArrayParam(searchParams.colors),
    sizes: parseArrayParam(searchParams.sizes),
    materials: parseArrayParam(searchParams.materials),
    minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice as string) : null,
    maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice as string) : null,
    rushShipping: searchParams.rushShipping === 'true',
    custom
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
  Object.entries(filters.custom ?? {}).forEach(([slug, values]) => {
    if (values && values.length > 0) {
      params.set(`cf[${slug}]`, values.join(','));
    }
  });

  return params.toString();
};

export const hasActiveFilters = (filters: ActiveFilters): boolean => {
  return (
    filters.colors.length > 0 ||
    filters.sizes.length > 0 ||
    filters.materials.length > 0 ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.rushShipping ||
    Object.values(filters.custom ?? {}).some((values) => values.length > 0)
  );
};

interface ActiveDiscreteFilterGroup {
  filterType: FilterType;
  slug?: string;
  values: string[];
}

// Only discrete, admin/data-curated value sets (color/size/material/custom) are eligible for
// indexable treatment - price range and rush shipping are continuous/binary controls, not the
// kind of "high-value combination" (e.g. orange for safety vests) the indexable-values feature
// is meant for, so they're excluded from this list entirely.
const getActiveDiscreteFilterGroups = (filters: ActiveFilters): ActiveDiscreteFilterGroup[] => {
  const groups: ActiveDiscreteFilterGroup[] = [];
  if (filters.colors.length > 0) groups.push({filterType: FilterType.COLOR, values: filters.colors});
  if (filters.sizes.length > 0) groups.push({filterType: FilterType.SIZE, values: filters.sizes});
  if (filters.materials.length > 0) groups.push({filterType: FilterType.MATERIAL, values: filters.materials});
  Object.entries(filters.custom ?? {}).forEach(([slug, values]) => {
    if (values.length > 0) groups.push({filterType: FilterType.CUSTOM, slug, values});
  });
  return groups;
};

// A filtered category page is indexable only when exactly one discrete filter group is active
// and every one of its selected values is explicitly marked indexable by an admin - multi-filter
// combinations, price/rush-shipping selections, and any non-curated value stay noindex.
export const isFilterSelectionIndexable = (filters: ActiveFilters, config: CategoryFilters | null): boolean => {
  if (!config) return false;
  if (filters.minPrice !== null || filters.maxPrice !== null || filters.rushShipping) return false;

  const activeGroups = getActiveDiscreteFilterGroups(filters);
  if (activeGroups.length !== 1) return false;

  const [active] = activeGroups;
  const matchingGroup = config.filterGroups.find((group) =>
    active.filterType === FilterType.CUSTOM ? group.slug === active.slug : group.filterType === active.filterType
  );
  if (!matchingGroup || !matchingGroup.isIndexable) return false;

  return active.values.every((value) => {
    const option = matchingGroup.options.find((o) => o.value === value);
    return option?.isIndexable === true;
  });
};

const parseArrayParam = (param: string | string[] | undefined): string[] => {
  if (!param) return [];
  if (Array.isArray(param)) return param;
  return param.split(',').filter(Boolean);
};
