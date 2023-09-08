import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {Drawer} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/solid';

import SearchBar from '@components/inputs/SearchBar';
import Container from './Container';

const links = [
  {color: '#dd6c99', text: 'About us', href: '/about-us'},
  {
    color: '#58c6f1',
    text: 'How to order',
    href: '/how-to-order'
  },
  {color: '#8fc23f', text: 'Specials', href: '/specials'},
  {color: '#9a605c', text: 'Faq', href: '/faq'},
  {color: '#1f8b95', text: 'Artwork', href: '/aditional_information/artwork'},
  {color: '#b658a2', text: 'Contact us', href: '/contact-us'}
];

const menuLinks = [
  {href: '/apparel', text: 'Apparel'},
  {href: '/awards', text: 'Awards'},
  {href: '/bags', text: 'Bags'},
  {href: '/calendars', text: 'Calendars'},
  {href: '/cookie-amp-candy-jars', text: 'Candy Jars'},
  {href: '/car-and-truck', text: 'Car and Truck'},
  {href: '/clipboards', text: 'Clipboards'},
  {href: '/clocks-watches', text: 'Clocks & Watches'},
  {href: '/desktop-office', text: 'Desktop & Office'},
  {href: '/Displays-and-Signs', text: 'Displays and Signage'},
  {href: '/drinkware', text: 'Drinkware'},
  {href: '/emt-ems', text: 'EMT / EMS'},
  {href: '/environmentally-friendly', text: 'Environmentally Friendly'},
  {href: '/events', text: 'Events and Holidays'},
  {href: '/foam-promotional-products', text: 'Foam'},
  {href: '/food-amp-snack', text: 'Food & Snack'},
  {href: '/health-safety', text: 'Health & Safety'},
  {href: '/home-amp-garden', text: 'Home & Garden'},
  {href: '/keychains', text: 'Keychains'},
  {href: '/kids', text: 'Kids'},
  {href: '/lanyards-badges', text: 'Lanyards & Badges'},
  {href: '/light-up', text: 'Light Up and Sound'},
  {href: '/Made-in-USA', text: 'Made In the USA'},
  {href: '/magnets', text: 'Magnets'},
  {href: '/mouse-pads', text: 'Mouse Pads'},
  {href: '/outdoor-items', text: 'Outdoor Items'},
  {href: '/padfolios-journals', text: 'Padfolios & Journals'},
  {href: '/paper-products', text: 'Paper Products'},
  {href: '/pens-pencils-amp-more', text: 'Pens, Pencils, & More'},
  {href: '/personal-care', text: 'Personal Care'},
  {href: '/pet-products', text: 'Pet Products'},
  {href: '/Protection-and-Wellness', text: 'PPE'},
  {href: '/professions', text: 'Professions'},
  {href: '/school', text: 'School'},
  {href: '/Shapes', text: 'Shapes'},
  {href: '/sports', text: 'Sports'},
  {href: '/sticky-notes', text: 'Sticky Notes'},
  {href: '/stress-relievers', text: 'Stress Relievers'},
  {href: '/electronics', text: 'Technology & Mobile'},
  {href: '/tools-amp-flashlights', text: 'Tools & Flashlights'},
  {href: '/Towels', text: 'Towels'},
  {href: '/trade-show', text: 'Trade Show'},
  {href: '/travel-amp-luggage', text: 'Travel & Luggage'},
  {href: '/umbrellas', text: 'Umbrellas'}
];

const Header = () => {
  const [mobileMenu, setMobileMenu] = React.useState(false);

  const handleOpen = () => {
    setMobileMenu(true);
  };
  const handleClose = () => {
    setMobileMenu(false);
  };

  return (
    <div className="mb-5">
      <hr
        className="h-1 w-full"
        style={{backgroundImage: 'url(/assets/bg-line-top-banner.jpg)'}}
      />
      <div className="py-5 bg-body" />
      <header className="sticky z-20 top-0 bg-white border-b border-[#eceef1]">
        <div className="max-w-[100rem] mx-auto px-4 md:px-8 xl:px-0 relative">
          <nav className="flex">
            <div className="flex flex-col lg:flex-row gap-3 flex-1 py-4">
              <div className="flex">
                <Link href="/" className="w-44 h-11 block relative mr-auto">
                  <Image
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                    className="block object-contain object-left"
                    src="/assets/logo.png"
                    alt=""
                  />
                </Link>
                <div className="flex lg:hidden items-center gap-3">
                  <a
                    href="tel: 8882829507"
                    className="h-full flex items-center"
                  >
                    <div className="w-7 h-7 relative">
                      <Image
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        fill
                        src="/assets/phone.png"
                        alt="..."
                      />
                    </div>
                  </a>
                  <button
                    onClick={handleOpen}
                    type="button"
                    className="text-body transition-all duration-300 active:scale-105"
                  >
                    <Bars3Icon className="h-7 w-7" />
                  </button>
                </div>
              </div>
              <div className="flex-1 lg:ml-6">
                <SearchBar />
              </div>
            </div>
            <div className="hidden lg:block ml-6 xl:ml-28 pl-6 border-l border-[#eceef1]">
              <a
                href="tel: 8882829507"
                className="h-full flex items-center gap-3"
              >
                <div className="w-9 h-9 relative">
                  <Image
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                    src="/assets/phone.png"
                    alt="..."
                  />
                </div>
                <div className="phone-number">
                  <div className="text-primary text-[0.625rem] font-bold uppercase">
                    TOLL FREE NUMBER
                  </div>
                  <div className="text-xl font-bold text-black hover:text-primary-500">
                    (888) 282 9507
                  </div>
                </div>
              </a>
            </div>
          </nav>
        </div>
      </header>
      <nav className="hidden lg:block bg-white border-b border-[#eceef1]">
        <Container>
          <div className="flex">
            <div className="megamenu">
              <button
                type="button"
                className="megamenu-button p-5 lg:min-w-[13.4rem] border-l border-r border-b-4 border-b-primary-500 border-[#eceef1] relative transition-all duration-300 text-primary-500 hover:text-white after:transition-all after:duration-300 after:absolute after:left-0 after:bottom-0 after:w-full after:h-0 after:bg-primary-500 hover:after:h-full"
              >
                <div className="relative z-10 flex items-center gap-3">
                  <span className="text-sm font-semibold uppercase mr-auto">
                    ALL PRODUCTS
                  </span>
                  <ExpandMoreIcon className="h-6 w-6" />
                </div>
              </button>
              <div className="megamenu-inner">
                <Container>
                  <ul className="menu-link grid grid-cols-4 xl:grid-cols-5 gap-6">
                    {menuLinks.map((link, index) => (
                      <li key={index}>
                        <Link
                          className="flex text-sm text-mute hover:text-body transition-all duration-150 group"
                          href={link.href}
                        >
                          <span>{link.text}</span>
                          <span className="ml-1 transition-all duration-150 opacity-0 group-hover:opacity-100">
                            <TrendingFlatIcon />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Container>
              </div>
            </div>

            <ul className="w-full flex flex-wrap justify-between gap-8 xl:gap-12 ms-10 xl:ms-20">
              {links.map((link, index) => (
                <li key={`link-${index}`}>
                  <Link
                    href={link.href}
                    className={`nav-link text-body hover:text-[${link.color}] after:bg-[${link.color}]`}
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </nav>

      <Drawer
        open={mobileMenu}
        onClose={handleClose}
        classes={{paper: 'bg-[#303546] text-white w-full max-w-[25rem]'}}
      >
        <div>
          <fieldset>
            <div className="flex pt-6 pb-4 px-6">
              <Link
                href="/"
                className="w-44 h-11 block relative mr-auto invert"
              >
                <Image
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fill
                  className="block object-contain object-left"
                  src="/assets/logo.png"
                  alt=""
                />
              </Link>
              <button
                onClick={handleClose}
                type="button"
                className="text-white"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </fieldset>
          <fieldset className="border-b border-gray-600">
            <Accordion className="bg-[#303546] px-2 border-0">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className="text-white" />}
              >
                <h6 className="text-white text-sm font-semibold uppercase">
                  ALL PRODUCTS
                </h6>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  <ul className="menu-link grid grid-cols-2 gap-6">
                    {menuLinks.map((link, index) => (
                      <li key={index}>
                        <Link
                          className="text-sm text-[#b5b8c1] hover:text-primary-500"
                          href={link.href}
                        >
                          {link.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <ul className="menu-link grid grid-cols-2 gap-6 text-sm text-[#b5b8c1]">
                    {menuLinks.map((item, index) => (
                      <li key={index}>
                        <a href={item.href}>{item.text}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </AccordionDetails>
            </Accordion>
          </fieldset>
          <figure className="p-6">
            <ul className="grid grid-cols-2 gap-6">
              {links.map((link, index) => (
                <li key={`link-${index}`}>
                  <Link
                    href={link.href}
                    className={`nav-link text-white hover:text-primary-500`}
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </figure>
          <fieldset className="p-6">
            <div className="flex gap-1">
              <a href="tel: 8882829507" className="p-3 w-full bg-[#3f4553]">
                <div className="w-6 h-6 mx-auto relative">
                  <Image
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                    src="/assets/icon-chat.png"
                    alt="..."
                  />
                </div>
              </a>
              <a href="tel: 8882829507" className="p-3 w-full bg-[#3f4553]">
                <div className="w-6 h-6 mx-auto relative">
                  <Image
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                    src="/assets/icon-phone.png"
                    alt="..."
                  />
                </div>
              </a>
            </div>
          </fieldset>
        </div>
      </Drawer>
    </div>
  );
};

export default Header;
