import {
    getAllSiblingCategories,
    getCategoryDetailsByUniqueName,
    getProductByCategoryWithFilers,
    getProductsLdForCategoryPage
} from '@components/home/category/category.apis';
import {getCategoryFilters} from '@components/home/category/filter.apis';
import {CategoryFilters, hasActiveFilters, parseFiltersFromSearchParams} from '@components/home/category/filter.types';
import {CategoryDetails} from '@components/home/category/category-details.component';
import {Category, parseCategoryUxSeo} from '@components/home/home.types';
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
        .replace(/[™,®©'”‘’".]/g, '')
        .replace(/---|--|–/g, '-')
        .replace(/[½%+’&]/g, '')
        .replace(/\s+/g, '');

    if (uniqueName !== finalUrl) {
        permanentRedirect(`/categories/${finalUrl}`, RedirectType.replace);
    }

    const [categoriesRes, response] = await Promise.all([getAllCategories(), getCategoryDetailsByUniqueName(uniqueName)]);

    const siblingCat = await getAllSiblingCategories(response?.payload?.id!!);

    let category: Category | null = null;
    let productsByCategoryPaged: any | null = null;
    let filters: CategoryFilters | null = null;

    if (response?.payload) {
        category = response.payload;
        // Fetch products and filters in parallel
        const [productsResult, filtersResult] = await Promise.all([
            getProductByCategoryWithFilers(category.id, searchParams),
            getCategoryFilters(category.id)
        ]);
        productsByCategoryPaged = productsResult;
        filters = filtersResult;
    }

    let allCategories: Category[] = [];
    if (siblingCat?.payload) allCategories = categoriesRes.payload;
    let siblingCategories: Category[] = [];
    if (siblingCat?.payload) siblingCategories = siblingCat.payload;

    let currentUrl: any = category && `${process.env.NEXT_PUBLIC_FE_URL}categories/${category.uniqueCategoryName}`;
    if (productsByCategoryPaged?.number > 0) {
        currentUrl = `${currentUrl}?page=${productsByCategoryPaged?.number + 1}`;
    }

    // Parse UX/SEO data for schema generation
    const {trustBadges, keyFeatures, faqs} = category ? parseCategoryUxSeo(category) : {trustBadges: [], keyFeatures: [], faqs: []};

    // Generate all schemas
    const breadcrumbSchema = generateBreadcrumbSchema(category);
    const productCatalogSchema =
        category && productsByCategoryPaged
            ? generateProductCatalogSchema(category, productsByCategoryPaged, currentUrl)
            : null;

    // NEW: FAQ Schema
    const faqSchema = generateFAQSchema(faqs);

    // NEW: Organization Schema
    const organizationSchema = generateOrganizationSchema(trustBadges);

    // NEW: CollectionPage Schema
    const collectionPageSchema = category ? generateCollectionPageSchema(category, currentUrl) : null;

    // NEW: ItemList Schema (for sub-categories)
    const itemListSchema = category && (category.subCategories?.length ?? 0) > 0 ? generateItemListSchema(category) : null;

    // NEW: Service Schema for printing services
    const serviceSchema = category ? generateServiceSchema(category, currentUrl) : null;

    // NEW: AggregateOffer Schema for price range visibility
    const aggregateOfferSchema =
        category && productsByCategoryPaged?.content?.length > 0
            ? generateAggregateOfferSchema(category, productsByCategoryPaged, currentUrl)
            : null;

    return (
        <section key={uniqueName}>
            {/* Existing Schemas */}
            <script
                id="breadcrumb-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbSchema)}}
            />
            {productCatalogSchema && (
                <script
                    id="product-catalog-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{__html: JSON.stringify(productCatalogSchema)}}
                />
            )}

            {/* NEW: FAQ Schema */}
            {faqSchema && (
                <script
                    id="faq-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{__html: JSON.stringify(faqSchema)}}
                />
            )}

            {/* NEW: Organization Schema */}
            {organizationSchema && (
                <script
                    id="organization-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{__html: JSON.stringify(organizationSchema)}}
                />
            )}

            {/* NEW: CollectionPage Schema */}
            {collectionPageSchema && (
                <script
                    id="collection-page-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{__html: JSON.stringify(collectionPageSchema)}}
                />
            )}

            {/* NEW: ItemList Schema */}
            {itemListSchema && (
                <script
                    id="itemlist-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{__html: JSON.stringify(itemListSchema)}}
                />
            )}

            {/* NEW: Service Schema */}
            {serviceSchema && (
                <script
                    id="service-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{__html: JSON.stringify(serviceSchema)}}
                />
            )}

            {/* NEW: AggregateOffer Schema */}
            {aggregateOfferSchema && (
                <script
                    id="aggregate-offer-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{__html: JSON.stringify(aggregateOfferSchema)}}
                />
            )}

            <CategoryDetails
                allCategories={allCategories}
                category={category}
                pagedData={productsByCategoryPaged}
                siblingCategories={siblingCategories}
                filters={filters}
            />
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

    // Canonical URL always points to base category (without filters)
    const baseCanonicalURL = `${process.env.FE_URL}categories/${category?.uniqueCategoryName}`;

    // For pagination on base pages, include page in canonical
    const canonicalURL = !hasFilters && currentPage > 1
        ? `${baseCanonicalURL}?page=${currentPage}`
        : baseCanonicalURL;

    // SEO: Filtered pages get noindex by default to prevent thin content indexing
    // Pagination pages (page > 1) also get noindex
    const shouldNoIndex = hasFilters || currentPage > 1;

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

    return {
        title: `${category?.metaTitle || category?.categoryName} ${category?.suffix ?? ''} | PrintsYou`,
        description: category?.metaDescription || '',
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
                        url: `${process.env.ASSETS_SERVER_URL}${category?.imageUrl}`,
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
            images: category?.imageUrl ? [`${process.env.ASSETS_SERVER_URL}${category?.imageUrl}`] : []
        }
    };
}

// Existing breadcrumb schema (kept as is)
const generateBreadcrumbSchema = (category: Category | null) => {
    if (!category?.crumbs) return null;

    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            ...(category.crumbs ?? []),
            {sequenceNumber: 1, uniqueCategoryName: '', name: 'Categories'},
            {sequenceNumber: 0, uniqueCategoryName: '', name: 'Home'}
        ]
            .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
            .map(item => ({
                '@type': 'ListItem',
                position: item.sequenceNumber + 1,
                name: item.name,
                item:
                    item.sequenceNumber === 0
                        ? `${process.env.FE_URL}`
                        : `${process.env.FE_URL}categories/${item.uniqueCategoryName}`
            }))
    };
};

// Enhanced product catalog schema with better product data
const generateProductCatalogSchema = (category: Category, productsByCategoryPaged: any, currentUrl: string) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': currentUrl,
        url: currentUrl,
        name: category.categoryName,
        description: category.metaDescription || category.heroSubtitle,
        mainEntity: {
            '@context': 'https://schema.org',
            '@type': 'OfferCatalog',
            '@id': `${currentUrl}#catalog`,
            name: category.categoryName,
            url: currentUrl,
            offerCount: productsByCategoryPaged.totalElements,
            numberOfItems: productsByCategoryPaged.totalElements,
            itemListElement: (productsByCategoryPaged.content ?? []).map((product: EnclosureProduct, index: number) => ({
                '@type': 'Product',
                '@id': `${process.env.NEXT_PUBLIC_FE_URL}products/${product.uniqueProductName}`,
                url: `${process.env.NEXT_PUBLIC_FE_URL}products/${product.uniqueProductName}`,
                name: product.productName,
                description: product.metaDescription,
                sku: product.sku,
                image: {
                    '@type': 'ImageObject',
                    url: `${process.env.ASSETS_SERVER_URL}${product?.imageUrl}`,
                    width: 800,
                    height: 800,
                    caption: product?.productName
                },
                offers: {
                    '@type': 'Offer',
                    price: [...(product.priceGrids ?? [])]
                        .filter(item => item.price !== 0)
                        .sort((a, b) => a.price - b.price)
                        .shift()?.price,
                    priceCurrency: 'USD',
                    availability: product.outOfStock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
                    itemCondition: 'https://schema.org/NewCondition',
                    seller: {
                        '@type': 'Organization',
                        name: 'PrintsYou',
                        url: process.env.NEXT_PUBLIC_FE_URL
                    }
                },
                category: category.categoryName
            }))
        },
        primaryImageOfPage: {
            '@type': 'ImageObject',
            url: `${process.env.ASSETS_SERVER_URL}${category?.imageUrl}`,
            width: 1200,
            height: 630,
            caption: category.metaTitle || category.categoryName
        },
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                ...(category.crumbs ?? []),
                {sequenceNumber: 1, uniqueCategoryName: '', name: 'Categories'},
                {sequenceNumber: 0, uniqueCategoryName: '', name: 'Home'}
            ]
                .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
                .map(item => ({
                    '@type': 'ListItem',
                    position: item.sequenceNumber + 1,
                    name: item.name,
                    item:
                        item.sequenceNumber === 0
                            ? `${process.env.FE_URL}`
                            : `${process.env.FE_URL}categories/${item.uniqueCategoryName}`
                }))
        },
        isPartOf: {
            '@type': 'CollectionPage',
            name: category.categoryName,
            url: `${process.env.NEXT_PUBLIC_FE_URL}categories/${category.uniqueCategoryName}`
        },
        hasPart: [
            {
                '@type': 'WebPage',
                name: 'Previous Page',
                url:
                    productsByCategoryPaged.number > 1
                        ? `${process.env.NEXT_PUBLIC_FE_URL}categories/${category.uniqueCategoryName}?page=${productsByCategoryPaged.number}`
                        : productsByCategoryPaged.number === 1
                            ? `${process.env.NEXT_PUBLIC_FE_URL}categories/${category.uniqueCategoryName}`
                            : null
            },
            {
                '@type': 'WebPage',
                name: 'Next Page',
                url:
                    productsByCategoryPaged.number + 1 < productsByCategoryPaged.totalPages
                        ? `${process.env.NEXT_PUBLIC_FE_URL}categories/${category.uniqueCategoryName}?page=${productsByCategoryPaged.number + 2}`
                        : null
            }
        ].filter(page => page.url !== null)
    };
};

// NEW: FAQ Schema Generator
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

// NEW: Organization Schema Generator
const generateOrganizationSchema = (trustBadges: Array<{icon: string; title: string; subtitle: string}>) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${process.env.NEXT_PUBLIC_FE_URL}#organization`,
        name: 'PrintsYou',
        url: process.env.NEXT_PUBLIC_FE_URL,
        logo: {
            '@type': 'ImageObject',
            url: `${process.env.NEXT_PUBLIC_FE_URL}/logo.png`,
            width: 250,
            height: 60
        },
        description: 'Premium custom printing services with fast delivery, competitive rates, and quality guaranteed products.',
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+1-469-434-7035',
            contactType: 'Customer Service',
            availableLanguage: 'English',
            areaServed: 'US'
        },
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'US'
        },
        sameAs: [
            // Add your social media URLs here if available
            'https://www.facebook.com/printsyoupromo',
            'https://www.linkedin.com/company/printsyou'
        ].filter(Boolean),
        ...(trustBadges.length > 0 && {
            slogan: trustBadges.map(b => b.title).join(' • ')
        })
    };
};

// NEW: CollectionPage Schema Generator
const generateCollectionPageSchema = (category: Category, currentUrl: string) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${currentUrl}#collectionpage`,
        name: category.categoryName,
        description: category.metaDescription || category.heroSubtitle || category.categoryDescription?.substring(0, 160),
        url: currentUrl,
        inLanguage: 'en-US',
        ...(category.imageUrl && {
            image: {
                '@type': 'ImageObject',
                url: `${process.env.ASSETS_SERVER_URL}${category.imageUrl}`,
                width: 1200,
                height: 630,
                caption: category.categoryName
            }
        }),
        breadcrumb: {
            '@id': `${currentUrl}#breadcrumb`
        },
        ...(category.subCategories?.length > 0 && {
            hasPart: category.subCategories.slice(0, 10).map(sub => ({
                '@type': 'CollectionPage',
                name: sub.categoryName,
                url: `${process.env.NEXT_PUBLIC_FE_URL}categories/${sub.uniqueCategoryName}`,
                ...(sub.imageUrl && {
                    image: `${process.env.ASSETS_SERVER_URL}${sub.imageUrl}`
                })
            }))
        }),
        isPartOf: {
            '@type': 'WebSite',
            '@id': `${process.env.NEXT_PUBLIC_FE_URL}#website`,
            name: 'PrintsYou',
            url: process.env.NEXT_PUBLIC_FE_URL
        }
    };
};

// NEW: ItemList Schema for Sub-Categories
const generateItemListSchema = (category: Category) => {
    if (!category.subCategories || category.subCategories.length === 0) return null;

    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `${category.categoryName} Categories`,
        description: `Browse all ${category.categoryName} sub-categories`,
        numberOfItems: category.subCategories.length,
        itemListElement: category.subCategories.map((sub, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: sub.categoryName,
            url: `${process.env.NEXT_PUBLIC_FE_URL}categories/${sub.uniqueCategoryName}`,
            ...(sub.imageUrl && {
                image: {
                    '@type': 'ImageObject',
                    url: `${process.env.ASSETS_SERVER_URL}${sub.imageUrl}`,
                    caption: sub.categoryName
                }
            })
        }))
    };
};

// NEW: Service Schema for printing services - helps with local SEO and service visibility
const generateServiceSchema = (category: Category, currentUrl: string) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${currentUrl}#service`,
        name: `${category.categoryName} Printing Services`,
        description: category.metaDescription || category.heroSubtitle || `Professional ${category.categoryName} printing and customization services`,
        url: currentUrl,
        provider: {
            '@type': 'Organization',
            '@id': `${process.env.NEXT_PUBLIC_FE_URL}#organization`,
            name: 'PrintsYou',
            url: process.env.NEXT_PUBLIC_FE_URL
        },
        serviceType: 'Custom Printing',
        areaServed: {
            '@type': 'Country',
            name: 'United States'
        },
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            '@id': `${currentUrl}#catalog`,
            name: category.categoryName
        },
        ...(category.imageUrl && {
            image: {
                '@type': 'ImageObject',
                url: `${process.env.ASSETS_SERVER_URL}${category.imageUrl}`,
                width: 800,
                height: 800,
                caption: category.categoryName
            }
        }),
        termsOfService: `${process.env.NEXT_PUBLIC_FE_URL}terms-and-conditions`,
        availableChannel: {
            '@type': 'ServiceChannel',
            serviceUrl: currentUrl,
            servicePhone: '+1-469-434-7035',
            availableLanguage: {
                '@type': 'Language',
                name: 'English'
            }
        }
    };
};

// NEW: AggregateOffer Schema for price range visibility in search results
const generateAggregateOfferSchema = (category: Category, productsByCategoryPaged: any, currentUrl: string) => {
    const products = productsByCategoryPaged.content || [];
    if (products.length === 0) return null;

    // Calculate price range from all products
    const prices = products
        .flatMap((product: EnclosureProduct) => (product.priceGrids ?? []).map((pg: {price: number}) => pg.price))
        .filter((price: number) => price > 0);

    if (prices.length === 0) return null;

    const lowPrice = Math.min(...prices);
    const highPrice = Math.max(...prices);

    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `${currentUrl}#aggregate-product`,
        name: category.categoryName,
        description: category.metaDescription || category.heroSubtitle || `Browse our collection of ${category.categoryName}`,
        url: currentUrl,
        brand: {
            '@type': 'Brand',
            name: 'PrintsYou'
        },
        ...(category.imageUrl && {
            image: {
                '@type': 'ImageObject',
                url: `${process.env.ASSETS_SERVER_URL}${category.imageUrl}`,
                width: 800,
                height: 800
            }
        }),
        offers: {
            '@type': 'AggregateOffer',
            '@id': `${currentUrl}#aggregate-offer`,
            priceCurrency: 'USD',
            lowPrice: lowPrice.toFixed(2),
            highPrice: highPrice.toFixed(2),
            offerCount: productsByCategoryPaged.totalElements,
            availability: 'https://schema.org/InStock',
            seller: {
                '@type': 'Organization',
                '@id': `${process.env.NEXT_PUBLIC_FE_URL}#organization`,
                name: 'PrintsYou'
            }
        },
        category: category.categoryName,
        ...(category.subCategories?.length > 0 && {
            isRelatedTo: category.subCategories.slice(0, 5).map(sub => ({
                '@type': 'Product',
                name: sub.categoryName,
                url: `${process.env.NEXT_PUBLIC_FE_URL}categories/${sub.uniqueCategoryName}`
            }))
        })
    };
};