import React, {FC} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {Container} from '@components/globals/container.component';
import {Newsletter} from '@components/home/newsletter-section.component';
import {Category} from '@components/home/home.types';
import {listType} from '@utils/util-types';

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

interface IFooter {
  categories: Category[];
}

export const Footer: FC<IFooter> = async ({categories}) => {
  return (
    <>
      <Newsletter />
      <footer className="bg-primary-100/50 py-4">
        <Container>
          <div className="grid lg:grid-cols-12 gap-6 md:grid-cols-2">
            <div className="lg:col-span-4 md:col-span-2">
              <div className="w-44 h-20 relative mb-2">
                <Image
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fill
                  className="block object-contain"
                  src="/assets/logo-full.png"
                  alt="logo"
                />
              </div>
              <div className="text-sm lg:text-left">
                <div>Copyright © 2024 PrintsYou</div>
                <div className="text-muted">All rights reserved</div>
              </div>
              <div className="mt-6 flex space-x-6">
                {social.map(item => (
                  <Link key={item.name} href={item.href} target="_blank">
                    <span className="sr-only">{item.name}</span>
                    <item.icon className="h-6 w-6" aria-hidden="true" />
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
};

interface FooterLinksProps {
  title: string;
  list: listType[];
}

const FooterLinks: FC<FooterLinksProps> = ({title, list}) => {
  return (
    <div className="col-span-1 lg:col-span-2 mt-6">
      <div>
        <h6 className="mb-4 text-lg lg:text-base font-bold text-headingColor capitalize">{title}</h6>
        <div className="space-y-4">
          {(list ?? []).map(linkItem => (
            <Link href={linkItem.url} className="block text-sm hover:text-secondary-500" key={linkItem.url}>
              <span className="capitalize">{linkItem.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export const social = [
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
      <svg {...props} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30">
        <path d="M24,4H6C4.895,4,4,4.895,4,6v18c0,1.105,0.895,2,2,2h18c1.105,0,2-0.895,2-2V6C26,4.895,25.105,4,24,4z M10.954,22h-2.95 v-9.492h2.95V22z M9.449,11.151c-0.951,0-1.72-0.771-1.72-1.72c0-0.949,0.77-1.719,1.72-1.719c0.948,0,1.719,0.771,1.719,1.719 C11.168,10.38,10.397,11.151,9.449,11.151z M22.004,22h-2.948v-4.616c0-1.101-0.02-2.517-1.533-2.517 c-1.535,0-1.771,1.199-1.771,2.437V22h-2.948v-9.492h2.83v1.297h0.04c0.394-0.746,1.356-1.533,2.791-1.533 c2.987,0,3.539,1.966,3.539,4.522V22z"></path>
      </svg>
    )
  }
  // {
  //   name: 'Instagram',
  //   href: 'https://www.instagram.com/',
  //   icon: (props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
  //     <svg fill="black" viewBox="0 0 24 24" {...props}>
  //       <path
  //         fillRule="evenodd"
  //         d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
  //         clipRule="evenodd"
  //       />
  //     </svg>
  //   )
  // },
  // {
  //   name: 'X',
  //   href: 'https://twitter.com/',
  //   icon: (props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
  //     <svg fill="black" viewBox="0 0 24 24" {...props}>
  //       <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
  //     </svg>
  //   )
  // }
];
