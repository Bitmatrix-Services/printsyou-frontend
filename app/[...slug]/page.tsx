/**
 * Clean URL Catch-All Route
 *
 * This route handles clean URLs that don't have /categories/ or /products/ prefix.
 * It resolves paths like /apparel/t-shirts or /apparel/t-shirts/custom-cotton-tee
 * to either a category or product page.
 *
 * Resolution Order:
 * 1. Try to resolve as a clean category
 * 2. Try to resolve as a clean product
 * 3. Return 404 if neither matches
 */

import {notFound, permanentRedirect, RedirectType} from 'next/navigation';
import axios from 'axios';
import {ApiResponse} from '@utils/api/axios-utils';
import {Category} from '@components/home/home.types';
import {Product} from '@components/home/product/product.types';
import {CategoryRoutes, ProductRoutes} from '@utils/routes/be-routes';
import {buildCategoryUrl, withPreservedQueryParams} from '@utils/url-builder';
import {getCategoryDetailsByUniqueName} from '@components/home/category/category.apis';

// Import the underlying renderers directly (not the page.tsx default exports,
// which are typed strictly to Next's PageProps and can't accept skipCleanRedirect)
import {generateCategoryPageMetadata, renderCategoryPage} from '@components/home/category/category-page-renderer';
import {generateProductPageMetadata, renderProductsPage} from '@components/home/product/product-page-renderer';

type Params = Promise<{slug: string[]}>;
type SearchParams = Promise<any>;

/**
 * Resolve a clean URL path to a category.
 */
async function resolveCleanCategory(path: string): Promise<Category | null> {
    try {
        const response = await axios.get<ApiResponse<Category>>(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}${CategoryRoutes.ResolveClean}?path=${encodeURIComponent(path)}`
        );
        return response.data?.payload ?? null;
    } catch (error: any) {
        // 404 means not found - that's expected
        if (error?.response?.status === 404) {
            return null;
        }
        console.error('Error resolving clean category:', error);
        return null;
    }
}

/**
 * Resolve a clean URL path to a product.
 */
async function resolveCleanProduct(path: string): Promise<Product | null> {
    try {
        const response = await axios.get<ApiResponse<Product>>(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}${ProductRoutes.ResolveClean}?path=${encodeURIComponent(path)}`
        );
        return response.data?.payload ?? null;
    } catch (error: any) {
        // 404 means not found - that's expected
        if (error?.response?.status === 404) {
            return null;
        }
        console.error('Error resolving clean product:', error);
        return null;
    }
}

/**
 * Clean URL Page Component
 *
 * Resolves clean URLs and delegates to the appropriate page component.
 */
const CleanUrlPage = async (props: {params: Params; searchParams: SearchParams}) => {
    const params = await props.params;
    const path = params.slug.join('/');

    // 1. Try to resolve as clean category
    const category = await resolveCleanCategory(path);
    if (category) {
        // Delegate to category page by creating params in expected format
        const categoryParams = Promise.resolve({uniqueCategoryName: params.slug});
        return renderCategoryPage({params: categoryParams, searchParams: props.searchParams, skipCleanRedirect: true});
    }

    // 2. Try to resolve as clean product
    const product = await resolveCleanProduct(path);
    if (product) {
        // Delegate to product page by creating params in expected format
        const productParams = Promise.resolve({uniqueProductName: params.slug});
        return renderProductsPage({params: productParams, searchParams: props.searchParams, skipCleanRedirect: true});
    }

    // 3. Guard: neither a category nor a product matched this path - it may have been
    // deleted, or moved during taxonomy restructuring without a redirect being created
    // (see the same guard in product-page-renderer.tsx). Walk up the path from most
    // specific to least specific (immediate parent first, root last) and redirect to
    // the first ancestor category that still resolves, so a Google-indexed link doesn't
    // dead-end at a 404. Ancestor category may be CLEAN or still LEGACY format - try both.
    for (let i = params.slug.length - 1; i > 0; i--) {
        const ancestorCategoryPath = params.slug.slice(0, i).join('/');
        const ancestorCategory = (await resolveCleanCategory(ancestorCategoryPath))
            ?? (await getCategoryDetailsByUniqueName(ancestorCategoryPath))?.payload
            ?? null;
        if (ancestorCategory) {
            permanentRedirect(withPreservedQueryParams(buildCategoryUrl(ancestorCategory), await props.searchParams), RedirectType.replace);
        }
    }

    // 4. Not found
    notFound();
};

export default CleanUrlPage;

/**
 * Generate metadata for clean URL pages.
 * This delegates to the appropriate page's metadata generation.
 */
export async function generateMetadata(props: {params: Params; searchParams: SearchParams}) {
    const params = await props.params;
    const path = params.slug.join('/');

    // Try category first
    const category = await resolveCleanCategory(path);
    if (category) {
        const categoryParams = Promise.resolve({uniqueCategoryName: params.slug});
        return generateCategoryPageMetadata({params: categoryParams, searchParams: props.searchParams});
    }

    // Try product
    const product = await resolveCleanProduct(path);
    if (product) {
        const productParams = Promise.resolve({uniqueProductName: params.slug});
        return generateProductPageMetadata({params: productParams});
    }

    // Not found - return minimal metadata
    return {
        title: 'Page Not Found | PrintsYou',
        description: 'The page you are looking for does not exist.',
        robots: {index: false, follow: false}
    };
}
