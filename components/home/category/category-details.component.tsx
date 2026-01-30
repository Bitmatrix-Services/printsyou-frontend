'use client';
import React, {FC, memo, Suspense, useState} from 'react';
import {Category, parseCategoryUxSeo, FAQ} from '@components/home/home.types';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import CategoriesSidebar from '@components/home/category/categories-sidebar.component';
import FilterSidebar from '@components/home/category/filter-sidebar.component';
import {CategoryFilters} from '@components/home/category/filter.types';
import dynamic from 'next/dynamic';
import {HiChevronDown, HiChevronUp, HiFilter, HiX} from 'react-icons/hi';
import Image from 'next/image';
import { FaTags, FaArrowRightToBracket ,FaAngleRight} from "react-icons/fa6";
import { FaCheckCircle,FaInfoCircle } from "react-icons/fa";

interface ICategoryDetails {
  allCategories: Category[];
  category: Category | null;
  siblingCategories: Category[];
  pagedData: any;
  filters?: CategoryFilters | null;
}

const ProductSectionSkeleton = <div className="h-96 animate-pulse bg-gray-100 rounded-lg" />;

// Keep SSR disabled - enabling it increases TBT significantly due to hydration
const ProductsSection = dynamic(
  () => import('@components/home/product/products-section.component').then(mod => mod.ProductsSection),
  {
    ssr: false,
    loading: () => ProductSectionSkeleton
  }
);

export const CategoryDetails: FC<ICategoryDetails> = memo(
  ({allCategories, pagedData, category, siblingCategories, filters}) => {
    if (!category) notFound();

    const {faqs, ctaSection} = parseCategoryUxSeo(category);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    return (
      <div className="bg-white min-h-screen">
        {/* Hero Section with integrated breadcrumb */}
        <div className="relative overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm mb-8">
              <Link href="/" className="text-slate-600 hover:text-primary-500 transition-colors font-medium">
                Home
              </Link>
              <FaAngleRight className="w-4 h-4 text-slate-400" />
              <Link href="/categories" className="text-slate-600 hover:text-primary-600 transition-colors font-medium">
                Categories
              </Link>
              {category.crumbs?.map((crumb, index) => (
                <React.Fragment key={index}>
                 <FaAngleRight className="w-4 h-4 text-slate-400" />
                  {index === (category.crumbs?.length ?? 0) - 1 ? (
                    <span className="text-primary-500 font-semibold">{crumb.name}</span>
                  ) : (
                    <Link
                      href={`/categories/${crumb.uniqueCategoryName}`}
                      className="text-slate-600 hover:text-primary-600 transition-colors font-medium"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* LEFT: Content */}
              <div className="space-y-6">
                {/* Category Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                <FaTags className="w-4 h-4 mr-2" />
                  Category
                </div>

                {/* Heading */}
                <h1 className="text-4xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                  {category.categoryName}
                </h1>

                {/* Subtitle */}
                {category.heroSubtitle && (
                  <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl">{category.heroSubtitle}</p>
                )}

                {/* CTA Section */}
                <div className="pt-16">
                  <button className="group relative inline-flex items-center px-8 py-4 bg-primary-500 text-white font-semibold rounded-xl shadow-lg hover:bg-primary-600 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                    <span className="relative z-10">Request a Quote</span>
                    <FaArrowRightToBracket className="w-5 h-5 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-primary-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>

                  <div className="flex items-center mt-4 text-sm text-slate-500 space-x-4">
                    <div className="flex items-center">
                    <FaCheckCircle className="w-5 h-5 mr-1.5 text-green-500" />
                      Takes 1–2 minutes
                    </div>
                    <div className="flex items-center">
                    <FaInfoCircle className="w-5 h-5 mr-1.5 text-primary-500" />
                      No obligation
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Image */}
              <div className="relative">
                <div className="max-h-72 sm:max-h-[18rem] lg:max-h-[22rem] sm:min-h-[18rem] lg:min-h-[22rem] rounded-2xl overflow-hidden">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${category.imageUrl}`}
                    alt={category.categoryName}
                    fill
                    priority
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Button - Fixed at bottom on mobile */}
        <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold rounded-full shadow-lg hover:bg-slate-800 transition-colors"
          >
            <HiFilter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFiltersOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
            {/* Drawer */}
            <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
                <h2 className="font-bold text-gray-900">Filters & Categories</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <HiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                {/* Filters */}
                {filters && <FilterSidebar filters={filters} categoryUniqueName={category.uniqueCategoryName} />}

                {/* Categories */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Categories</h3>
                  </div>
                  <div className="p-3">
                    <CategoriesSidebar
                      allCategories={allCategories}
                      selectedCategory={category}
                      siblingCategories={siblingCategories}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Sidebar - Desktop Only: Filters + Categories ONLY */}
            <aside className="hidden lg:block lg:col-span-3 w-full min-w-0">
              <div className="sticky top-4 space-y-4 max-h-[calc(100vh-2rem)] overflow-y-auto pr-1">
                {/* Filters */}
                {filters && (
                  <Suspense
                    fallback={
                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 animate-pulse h-48" />
                    }
                  >
                    <FilterSidebar filters={filters} categoryUniqueName={category.uniqueCategoryName} />
                  </Suspense>
                )}

                {/* Categories */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                    <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Categories</h2>
                  </div>
                  <div className="p-3">
                    <CategoriesSidebar
                      allCategories={allCategories}
                      selectedCategory={category}
                      siblingCategories={siblingCategories}
                    />
                  </div>
                </div>

                {/* REMOVED: Trust Badges / "Why Choose Us" section */}
              </div>
            </aside>

            {/* Product Area */}
            <main className="lg:col-span-9">
              {/* Products - sorting controls handled inside ProductsSection */}
              <Suspense fallback={ProductSectionSkeleton}>
                <ProductsSection category={category} pagedData={pagedData} />
              </Suspense>
            </main>
          </div>

          {/* REMOVED: Key Features strip below products */}
        </div>

        {/* Below-Grid Content - Collapsed sections */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
          {/* About Section - Collapsed by default */}
          <CollapsibleSection title={`About ${category.categoryName}`} defaultOpen={false}>
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{__html: category.categoryDescription}}
            />
          </CollapsibleSection>

          {/* FAQ Section - Collapsed by default */}
          {faqs.length > 0 && (
            <CollapsibleSection title="Frequently Asked Questions" defaultOpen={false}>
              <div className="space-y-2">
                {faqs
                  .sort((a: FAQ, b: FAQ) => a.order - b.order)
                  .map((faq: FAQ, index: number) => (
                    <FAQItem key={index} faq={faq} />
                  ))}
              </div>
            </CollapsibleSection>
          )}
        </div>

        {/* Single CTA Section - Only one, at the bottom */}
        {ctaSection && (
          <div className="border-t border-gray-200 bg-slate-800">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
              <h2 className="text-xl font-bold text-white mb-2">{ctaSection.title}</h2>
              <p className="text-slate-300 mb-4 max-w-xl mx-auto text-sm">{ctaSection.description}</p>
              <Link
                href={ctaSection.buttonLink}
                className="inline-block px-6 py-2.5 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
              >
                {ctaSection.buttonText}
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }
);
CategoryDetails.displayName = 'CategoryDetails';

const CollapsibleSection = memo(
  ({title, children, defaultOpen = false}: {title: string; children: React.ReactNode; defaultOpen?: boolean}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
        >
          <h2 className="text-sm font-bold text-gray-900">{title}</h2>
          {isOpen ? (
            <HiChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <HiChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        {isOpen && <div className="px-4 py-4 border-t border-gray-200">{children}</div>}
      </div>
    );
  }
);
CollapsibleSection.displayName = 'CollapsibleSection';

const FAQItem = memo(({faq}: {faq: FAQ}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-left rounded-lg"
      >
        <span className="font-medium text-gray-900 text-sm pr-4">{faq.question}</span>
        {isOpen ? (
          <HiChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
        ) : (
          <HiChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-sm text-gray-700 leading-relaxed">{faq.answer}</p>
        </div>
      )}
    </div>
  );
});
FAQItem.displayName = 'FAQItem';
