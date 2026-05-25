import {
    getAllSiblingCategories,
    getCategoryDetailsByUniqueName,
    getCategoryReviews,
    getProductByCategoryWithFilers,
    getProductsLdForCategoryPage
} from '@components/home/category/category.apis';
import {getCategoryFilters} from '@components/home/category/filter.apis';
import {CategoryFilters, hasActiveFilters, parseFiltersFromSearchParams} from '@components/home/category/filter.types';
import {CategoryDetails} from '@components/home/category/category-details.component';
import {CategoryReviews} from '@components/home/category/category-reviews.component';
import {Category, parseCategoryUxSeo, AboutConcept} from '@components/home/home.types';
import {notFound, permanentRedirect, RedirectType} from 'next/navigation';
import {getAllCategories} from '@components/home/home-apis';
import {IconDescriptor} from 'next/dist/lib/metadata/types/metadata-types';
import React from 'react';
import {EnclosureProduct} from '@components/home/product/product.types';

type Params = Promise<{uniqueCategoryName: string[]}>;
type SearchParams = Promise<any>;

const CategoryPage = async (props: {params: Params; searchParams: SearchParams}) => {
    const params = await props.params;
    const searchParams = await props.searchParams;

    let uniqueName = params.uniqueCategoryName.join('/');

    const finalUrl = decodeURIComponent(uniqueName)
        .replace(/[™,®©'"''".]/g, '')
        .replace(/---|--|–/g, '-')
        .replace(/[½%+'&]/g, '')
        .replace(/\s+/g, '');

    if (uniqueName !== finalUrl) {
        permanentRedirect(`/categories/${finalUrl}`, RedirectType.replace);
    }

    const [categoriesRes, response] = await Promise.all([getAllCategories(), getCategoryDetailsByUniqueName(uniqueName)]);

    const siblingCat = await getAllSiblingCategories(response?.payload?.id!!);

    let category: Category | null = null;
    let productsByCategoryPaged: any | null = null;
    let filters: CategoryFilters | null = null;

    let reviewSummary: Awaited<ReturnType<typeof getCategoryReviews>> = null;

    if (response?.payload) {
        category = response.payload;
        // Fetch products, filters, and reviews in parallel
        const [productsResult, filtersResult, reviewsResult] = await Promise.all([
            getProductByCategoryWithFilers(category.id, searchParams),
            getCategoryFilters(category.id),
            getCategoryReviews(category.id)
        ]);
        productsByCategoryPaged = productsResult;
        filters = filtersResult;
        reviewSummary = reviewsResult;
    }

    let allCategories: Category[] = [];
    if (siblingCat?.payload) allCategories = categoriesRes.payload;
    let siblingCategories: Category[] = [];
    if (siblingCat?.payload) siblingCategories = siblingCat.payload;

    // Build canonical URL (page 1 = no query param, page 2+ = ?page=N)
    const currentPage = productsByCategoryPaged?.number ?? 0; // 0-indexed
    const baseUrl = `${process.env.NEXT_PUBLIC_FE_URL}categories/${category?.uniqueCategoryName}`;
    const canonicalUrl = currentPage > 0 ? `${baseUrl}?page=${currentPage + 1}` : baseUrl;

    // Parse UX/SEO data for schema generation
    const {faqs, aboutConcepts} = category ? parseCategoryUxSeo(category) : {faqs: [], aboutConcepts: []};

    // Generate simplified schemas
    const breadcrumbSchema = category ? generateBreadcrumbSchema(category, canonicalUrl) : null;
    const collectionPageSchema = category && productsByCategoryPaged
        ? generateCollectionPageSchema(category, productsByCategoryPaged, canonicalUrl, aboutConcepts)
        : null;

    // FAQ Schema - only if FAQs exist and are visible
    const faqSchema = faqs && faqs.length > 0 ? generateFAQSchema(faqs) : null;

    return (
        <section key={uniqueName}>
            {/* BreadcrumbList Schema */}
            {breadcrumbSchema && (
                <script
                    id="breadcrumb-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbSchema)}}
                />
            )}

            {/* CollectionPage Schema (includes ItemList) */}
            {collectionPageSchema && (
                <script
                    id="collection-page-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{__html: JSON.stringify(collectionPageSchema)}}
                />
            )}

            {/* FAQ Schema - only when FAQs are visible on page */}
            {faqSchema && (
                <script
                    id="faq-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{__html: JSON.stringify(faqSchema)}}
                />
            )}

            <CategoryDetails
                allCategories={allCategories}
                category={category}
                pagedData={productsByCategoryPaged}
                siblingCategories={siblingCategories}
                filters={filters}
            />

            {/* Google Reviews Section - only renders if reviews exist for this category */}
            {category?.id && <CategoryReviews categoryId={category.id} />}
        </section>
    );
};

export default CategoryPage;

export async function generateMetadata(props: {params: Params; searchParams: SearchParams}) {
    const params = await props.params;
    const searchParams = await props.searchParams;

    const response = await getCategoryDetailsByUniqueName(params.uniqueCategoryName.join('/'));
    const category: Category | null = response?.payload ?? null;

    const currentPage = +(searchParams.page ?? '1');
    const ld = await getProductsLdForCategoryPage(category?.id ?? '', currentPage.toString());
    const totalPages: number = ld?.payload.totalPages ?? 1;

    if (currentPage > totalPages) notFound();

    // Parse active filters from search params
    const activeFilters = parseFiltersFromSearchParams(searchParams);
    const hasFilters = hasActiveFilters(activeFilters);

    // SEO: Determine canonical URL
    // If canonicalToParent is true, point to the absorption parent category
    // Otherwise, canonical is self (base category URL without filters)
    const baseCanonicalURL = category?.canonicalToParent && category?.absorptionParentSlug
        ? `${process.env.FE_URL}categories/${category.absorptionParentSlug}`
        : `${process.env.FE_URL}categories/${category?.uniqueCategoryName}`;

    // For pagination on base pages, include page in canonical (only if not redirecting to parent)
    const canonicalURL = !hasFilters && currentPage > 1 && !category?.canonicalToParent
        ? `${baseCanonicalURL}?page=${currentPage}`
        : baseCanonicalURL;

    // SEO: Determine if page should be noindexed
    // Priority order:
    // 1. Backend seoIndexable=false → noindex (based on automated rules: thin content, attribute pages, etc.)
    // 2. Filtered pages → noindex (prevents duplicate content from filter combinations)
    // 3. Pagination pages (page > 1) → noindex (prevents duplicate content)
    const backendNoIndex = category?.seoIndexable === false;
    const shouldNoIndex = backendNoIndex || hasFilters || currentPage > 1;

    const descriptors: IconDescriptor[] = [];
    if (currentPage > 1) {
        descriptors.push({
            rel: 'prev',
            url: `${process.env.FE_URL}categories/${category?.uniqueCategoryName}${
                currentPage - 1 === 1 ? '' : `?page=${currentPage - 1}`
            }`
        });
    }
    if (currentPage < totalPages) {
        descriptors.push({
            rel: 'next',
            url: `${process.env.FE_URL}categories/${category?.uniqueCategoryName}?page=${currentPage + 1}`
        });
    }

    const categoryTitle = category?.metaTitle || category?.categoryName || 'Custom Products';
    const defaultDescription = `Shop custom ${categoryTitle} at PrintsYou. Fast turnaround, competitive pricing, and quality guaranteed. Free quotes available!`;

    return {
        title: `${categoryTitle}${category?.suffix ? ` ${category.suffix}` : ''} | Custom Printing | PrintsYou`,
        description: category?.metaDescription || defaultDescription,
        keywords: category?.keywords || category?.categoryName,
        // SEO: Add robots directive for filtered/paginated pages
        robots: shouldNoIndex
            ? {index: false, follow: true}
            : {index: true, follow: true},
        icons: {
            other: descriptors
        },
        alternates: {
            canonical: canonicalURL
        },
        openGraph: {
            type: 'website',
            url: canonicalURL,
            siteName: 'PrintsYou',
            images: category?.imageUrl
                ? [
                    {
                        url: `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${category?.imageUrl}`,
                        width: 1200,
                        height: 630,
                        alt: category?.categoryName
                    }
                ]
                : [],
            description: category?.metaDescription ?? '',
            title: `${category?.metaTitle || category?.categoryName} | PrintsYou`
        },
        twitter: {
            card: 'summary_large_image',
            title: `${category?.metaTitle || category?.categoryName} | PrintsYou`,
            description: category?.metaDescription ?? '',
            images: category?.imageUrl ? [`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${category?.imageUrl}`] : []
        }
    };
}

// ============================================
// SCHEMA GENERATORS (Simplified)
// ============================================

/**
 * BreadcrumbList Schema
 * Standard breadcrumb navigation for category pages
 */
const generateBreadcrumbSchema = (category: Category, canonicalUrl: string) => {
    if (!category?.crumbs) return null;

    const breadcrumbItems = [
        {sequenceNumber: 0, uniqueCategoryName: '', name: 'Home'},
        {sequenceNumber: 1, uniqueCategoryName: '', name: 'Categories'},
        ...(category.crumbs ?? [])
    ].sort((a, b) => a.sequenceNumber - b.sequenceNumber);

    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: breadcrumbItems.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.sequenceNumber === 0
                ? process.env.NEXT_PUBLIC_FE_URL
                : item.sequenceNumber === 1
                    ? `${process.env.NEXT_PUBLIC_FE_URL}categories`
                    : `${process.env.NEXT_PUBLIC_FE_URL}categories/${item.uniqueCategoryName}`
        }))
    };
};

/**
 * CollectionPage Schema
 * Main schema for category pages - includes ItemList with full Product entities
 */
const generateCollectionPageSchema = (
    category: Category,
    productsByCategoryPaged: any,
    canonicalUrl: string,
    aboutConcepts: AboutConcept[] = []
) => {
    const products: EnclosureProduct[] = productsByCategoryPaged?.content ?? [];

    // Filter out out-of-stock products for schema
    const inStockProducts = products.filter(p => !p.outOfStock);

    // Build rich ItemList with full Product entities including AggregateOffer
    const itemList = inStockProducts.length > 0 ? {
        '@type': 'ItemList',
        '@id': `${canonicalUrl}#itemlist`,
        numberOfItems: inStockProducts.length,
        itemListElement: inStockProducts.map((product, index) => {
            // Sort price grids by countFrom (ascending) to get MOQ and price range
            const sortedPrices = [...(product.priceGrids || [])].sort((a, b) => a.countFrom - b.countFrom);
            const lowestTier = sortedPrices[0]; // First tier (MOQ)
            const highestTier = sortedPrices[sortedPrices.length - 1]; // Last tier (bulk price)

            // Calculate prices - salePrice takes priority, fallback to price
            const highPrice = lowestTier ? (lowestTier.salePrice || lowestTier.price) : product.salePrice || product.minPrice;
            const lowPrice = highestTier ? (highestTier.salePrice || highestTier.price) : product.salePrice || product.minPrice;
            const moq = lowestTier?.countFrom || 1;

            return {
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'Product',
                    name: product.productName,
                    image: product.imageUrl ? `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${product.imageUrl}` : undefined,
                    description: product.metaDescription || `Custom ${product.productName} with bulk tier pricing`,
                    url: `${process.env.NEXT_PUBLIC_FE_URL}products/${product.uniqueProductName}`,
                    sku: product.sku,
                    offers: {
                        '@type': 'AggregateOffer',
                        priceCurrency: 'USD',
                        lowPrice: lowPrice.toFixed(2),
                        highPrice: highPrice.toFixed(2),
                        offerCount: sortedPrices.length.toString(),
                        availability: 'https://schema.org/InStock',
                        eligibleQuantity: {
                            '@type': 'QuantitativeValue',
                            minValue: moq.toString(),
                            unitCode: 'C62' // UN/CEFACT code for "pieces/units"
                        }
                    }
                }
            };
        })
    } : null;

    // Build "about" property for topical authority (Wikipedia/Wikidata links)
    const aboutProperty = aboutConcepts.length > 0 ? aboutConcepts.map(concept => ({
        '@type': 'Thing',
        name: concept.name,
        sameAs: concept.sameAs
    })) : null;

    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${canonicalUrl}#collection`,
        url: canonicalUrl,
        name: category.categoryName,
        description: category.metaDescription || category.heroSubtitle || category.categoryDescription?.substring(0, 160),
        inLanguage: 'en-US',

        // Reference to breadcrumb
        breadcrumb: {
            '@id': `${canonicalUrl}#breadcrumb`
        },

        // Part of the main website
        isPartOf: {
            '@type': 'WebSite',
            '@id': `${process.env.NEXT_PUBLIC_FE_URL}#website`,
            name: 'PrintsYou',
            url: process.env.NEXT_PUBLIC_FE_URL
        },

        // About property - links to Wikipedia/Wikidata concepts for topical authority
        ...(aboutProperty && {
            about: aboutProperty
        }),

        // Primary image if exists
        ...(category.imageUrl && {
            primaryImageOfPage: {
                '@type': 'ImageObject',
                url: `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${category.imageUrl}`,
                width: 1200,
                height: 630,
                caption: category.categoryName
            }
        }),

        // Main entity is the ItemList of products
        ...(itemList && {
            mainEntity: itemList
        })
    };
};

/**
 * FAQPage Schema
 * Only generated when FAQs are actually visible on the page
 */
const generateFAQSchema = (faqs: Array<{question: string; answer: string; order: number}>) => {
    if (!faqs || faqs.length === 0) return null;

    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs
            .sort((a, b) => a.order - b.order)
            .map(faq => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer
                }
            }))
    };
};
