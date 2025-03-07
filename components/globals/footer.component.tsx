'use client';
import React, {FC, memo, Suspense} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {Container} from '@components/globals/container.component';
import {Category} from '@components/home/home.types';
import {listType} from '@utils/util-types';
import dynamic from 'next/dynamic';

const Newsletter = dynamic(() => import('@components/home/newsletter-section.component').then(mod => mod.Newsletter), {
  ssr: false,
  loading: () => <div className="h-[25rem] animate-pulse bg-gray-100 mt-8" />
});

interface IFooter {
  categories: Category[];
}

interface FooterLinksProps {
  title: string;
  list: listType[];
}

export const Footer: FC<IFooter> = memo(({categories}) => {
  return (
    <>
      <Suspense fallback={<div className="h-[25rem] animate-pulse bg-gray-100 mt-8" />}>
        <Newsletter />
      </Suspense>
      <footer className="bg-primary-100/50 py-4">
        <Container>
          <div className="grid lg:grid-cols-12 gap-6 md:grid-cols-2">
            <div className="lg:col-span-4 md:col-span-2">
              <Image
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                width={176}
                height={80}
                className="block object-contain mb-2"
                src="/assets/logo-full.png"
                alt="logo"
                priority
              />
              <p className="text-sm lg:text-left">© 2024 PrintsYou. All rights reserved.</p>
              <div className="mt-6 flex space-x-6">
                {social.map(({name, href, icon: Icon}) => (
                  <Link key={name} href={href} target="_blank" aria-label={name}>
                    <Icon height={24} width={24} />
                  </Link>
                ))}
              </div>
            </div>
            <FooterLinks title="help" list={helpList} />
            <FooterLinks title="company" list={companyList} />
            <FooterLinks title="support" list={supportList} />
            <FooterLinks
              title="shop"
              list={categories?.map(category => {
                return {
                  name: category.categoryName,
                  url: `/categories/${category.uniqueCategoryName}`
                };
              })}
            />
          </div>
        </Container>
      </footer>
    </>
  );
});

const FooterLinks: FC<FooterLinksProps> = memo(({title, list}) => {
  return (
    <div className="col-span-1 lg:col-span-2 mt-6">
      <div>
        <h6 className="mb-4 text-lg lg:text-base font-bold text-headingColor capitalize">{title}</h6>
        <ul className="space-y-4">
          {(list ?? []).map(linkItem => (
            <li key={linkItem.url}>
              <Link href={linkItem.url} className="block text-sm hover:text-secondary-500 capitalize" prefetch={false}>
                {linkItem.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});
Footer.displayName = 'Footer';
FooterLinks.displayName = 'FooterLinks';

const helpList: listType[] = [
  {name: 'how to order', url: '/how-to-order'},
  {name: 'blogs', url: '/blog'}
];

const companyList: listType[] = [
  {name: 'Promotional Products', url: '/categories'},
  {name: 'Contact Us', url: '/contact-us'},
  {name: 'About Us', url: '/about-us'},
  {name: 'Terms & Conditions', url: '/terms-and-conditions'}
];

const supportList: listType[] = [{name: 'help center', url: '/'}];

const social = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/PrintsYouPromotional',
    icon: (props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
      <svg fill="black" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
          clipRule="evenodd"
        />
      </svg>
    )
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/printsyou',
    icon: (props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24">
        <path d="M24,4H6C4.895,4,4,4.895,4,6v18c0,1.105,0.895,2,2,2h18c1.105,0,2-0.895,2-2V6C26,4.895,25.105,4,24,4z M10.954,22h-2.95 v-9.492h2.95V22z M9.449,11.151c-0.951,0-1.72-0.771-1.72-1.72c0-0.949,0.77-1.719,1.72-1.719c0.948,0,1.719,0.771,1.719,1.719 C11.168,10.38,10.397,11.151,9.449,11.151z M22.004,22h-2.948v-4.616c0-1.101-0.02-2.517-1.533-2.517 c-1.535,0-1.771,1.199-1.771,2.437V22h-2.948v-9.492h2.83v1.297h0.04c0.394-0.746,1.356-1.533,2.791-1.533 c2.987,0,3.539,1.966,3.539,4.522V22z"></path>
      </svg>
    )
  }
];
