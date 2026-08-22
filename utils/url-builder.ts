/**
 * Centralized URL builder for categories and products.
 *
 * This module is the SINGLE SOURCE OF TRUTH for URL construction in the frontend.
 * All code generating category or product URLs should use these functions.
 *
 * URL Formats:
 * - LEGACY: Uses /categories/ or /products/ prefix (existing entities)
 * - CLEAN: No prefix, uses root path (new and migrated entities)
 */

export type UrlFormat = 'LEGACY' | 'CLEAN';

/**
 * Entity with URL-related fields.
 */
export interface UrlAwareEntity {
    uniqueCategoryName?: string;
    uniqueProductName?: string;
    urlFormat?: UrlFormat;
}

/**
 * Build URL for a category.
 *
 * @param category Entity with uniqueCategoryName and urlFormat
 * @returns Relative URL path (e.g., "/categories/apparel" or "/apparel")
 */
export function buildCategoryUrl(category: UrlAwareEntity): string {
    const slug = category.uniqueCategoryName;
    if (!slug) return '/';

    if (category.urlFormat === 'CLEAN') {
        return `/${slug}`;
    }

    // Default to LEGACY format
    return `/categories/${slug}`;
}

/**
 * Build URL for a product.
 *
 * @param product Entity with uniqueProductName and urlFormat
 * @returns Relative URL path (e.g., "/products/apparel/tee" or "/apparel/tee")
 */
export function buildProductUrl(product: UrlAwareEntity): string {
    const slug = product.uniqueProductName;
    if (!slug) return '/';

    if (product.urlFormat === 'CLEAN') {
        return `/${slug}`;
    }

    // Default to LEGACY format
    return `/products/${slug}`;
}

/**
 * Build full URL (with base URL) for a category.
 *
 * @param baseUrl Base URL (e.g., "https://printsyou.com")
 * @param category Entity with uniqueCategoryName and urlFormat
 * @returns Full URL (e.g., "https://printsyou.com/categories/apparel")
 */
export function buildCategoryFullUrl(baseUrl: string, category: UrlAwareEntity): string {
    const path = buildCategoryUrl(category);

    // Remove leading slash since we'll add it
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;

    // Ensure base URL ends without slash
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    return `${cleanBase}/${cleanPath}`;
}

/**
 * Build full URL (with base URL) for a product.
 *
 * @param baseUrl Base URL (e.g., "https://printsyou.com")
 * @param product Entity with uniqueProductName and urlFormat
 * @returns Full URL (e.g., "https://printsyou.com/products/apparel/tee")
 */
export function buildProductFullUrl(baseUrl: string, product: UrlAwareEntity): string {
    const path = buildProductUrl(product);

    // Remove leading slash since we'll add it
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;

    // Ensure base URL ends without slash
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    return `${cleanBase}/${cleanPath}`;
}

/**
 * Build URL for a category by slug and format directly.
 * Use when you don't have the full entity object.
 *
 * @param slug The unique category name
 * @param urlFormat The URL format (defaults to LEGACY)
 * @returns Relative URL path
 */
export function buildCategoryUrlBySlug(slug: string, urlFormat?: UrlFormat): string {
    if (!slug) return '/';

    if (urlFormat === 'CLEAN') {
        return `/${slug}`;
    }

    return `/categories/${slug}`;
}

/**
 * Build URL for a product by slug and format directly.
 * Use when you don't have the full entity object.
 *
 * @param slug The unique product name
 * @param urlFormat The URL format (defaults to LEGACY)
 * @returns Relative URL path
 */
export function buildProductUrlBySlug(slug: string, urlFormat?: UrlFormat): string {
    if (!slug) return '/';

    if (urlFormat === 'CLEAN') {
        return `/${slug}`;
    }

    return `/products/${slug}`;
}

/**
 * Check if a URL format is CLEAN.
 *
 * @param urlFormat The URL format to check
 * @returns true if CLEAN, false otherwise
 */
export function isCleanFormat(urlFormat?: UrlFormat): boolean {
    return urlFormat === 'CLEAN';
}

/**
 * Get the resolved URL for a category, considering urlFormat.
 * Useful for server-side rendering where you need the full resolved path.
 *
 * @param category Entity with uniqueCategoryName and urlFormat
 * @returns The resolved URL path without leading slash
 */
export function getCategoryResolvedPath(category: UrlAwareEntity): string {
    const slug = category.uniqueCategoryName;
    if (!slug) return '';

    if (category.urlFormat === 'CLEAN') {
        return slug;
    }

    return `categories/${slug}`;
}

/**
 * Get the resolved URL for a product, considering urlFormat.
 * Useful for server-side rendering where you need the full resolved path.
 *
 * @param product Entity with uniqueProductName and urlFormat
 * @returns The resolved URL path without leading slash
 */
export function getProductResolvedPath(product: UrlAwareEntity): string {
    const slug = product.uniqueProductName;
    if (!slug) return '';

    if (product.urlFormat === 'CLEAN') {
        return slug;
    }

    return `products/${slug}`;
}

/**
 * Append the incoming request's query params (e.g. fbclid, gclid, utm_*) onto a
 * redirect target path. Next.js's `searchParams` prop is the only way a Server
 * Component sees the original query string - a bare `permanentRedirect(path)`
 * silently drops it. Ad-click landing pages frequently redirect once (legacy
 * URL cleanup, clean-format migration, etc.) before the Meta/Google Pixel
 * scripts ever mount, so losing these here means the click ID never reaches
 * the page that would otherwise capture it.
 *
 * @param path Destination path (no query string)
 * @param searchParams The resolved Next.js searchParams object for the current request
 * @returns path with the original query string re-appended, if any
 */
export function withPreservedQueryParams(
    path: string,
    searchParams: Record<string, string | string[] | undefined> | null | undefined
): string {
    if (!searchParams) return path;

    const query = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
        if (value === undefined) return;
        if (Array.isArray(value)) {
            value.forEach(v => query.append(key, v));
        } else {
            query.append(key, value);
        }
    });

    const queryString = query.toString();
    return queryString ? `${path}?${queryString}` : path;
}
