import React from "react";
import Image from "next/image";
import Link from "next/link";

import Container from "./Container";
import SearchBar from "@components/inputs/SearchBar";
import { Bars3Icon, ChevronDownIcon } from "@heroicons/react/24/solid";

const navItems = [
  { color: "#dd6c99", text: "About us", href: "/about_us" },
  {
    color: "#58c6f1",
    text: "How to order",
    href: "/aditional_information/how_to_order",
  },
  { color: "#8fc23f", text: "Specials", href: "/specials" },
  { color: "#9a605c", text: "Faq", href: "/faq" },
  { color: "#1f8b95", text: "Artwork", href: "/aditional_information/artwork" },
  { color: "#b658a2", text: "Contact us", href: "/contact_us" },
];

const Header = () => {
  return (
    <>
      <hr
        className="h-1 w-full"
        style={{ backgroundImage: "url(/assets/bg-line-top-banner.jpg)" }}
      />
      <div className="py-5 bg-body" />
      <header className="sticky z-20 top-0 bg-white border-b border-[#eceef1]">
        <Container>
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
        </Container>
      </header>
      <nav className="hidden lg:block bg-white border-b border-[#eceef1]">
        <Container>
          <div className="flex">
            <div
              className="p-5 lg:min-w-[13.4rem] border-l border-r border-b-4 border-b-primary-500 border-[#eceef1] relative transition-all duration-300 text-primary-500 hover:text-white after:transition-all after:duration-300 after:absolute after:left-0 after:bottom-0 after:w-full after:h-0 after:bg-primary-500 hover:after:h-full"
            >
              <div className="relative z-10 flex items-center gap-3">
                <span className="text-sm font-semibold uppercase mr-auto">
                  ALL PRODUCTS
                </span>
                <ChevronDownIcon className="h-3 w-3" />
              </div>
            </div>
            <ul className="w-full flex flex-wrap justify-between gap-8 xl:gap-12 ms-10 xl:ms-20">
              {navItems.map((link, index) => (
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
    </>
  );
};

export default Header;
