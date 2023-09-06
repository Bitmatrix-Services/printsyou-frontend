import React from "react";
import Link from "next/link";
import Image from "next/image";

import Container from "./Container";
import SearchBar from "@components/inputs/SearchBar";

const Header = () => {
  return (
    <header>
      <hr
        className="h-1 w-full"
        style={{ backgroundImage: "url(/assets/bg-line-top-banner.jpg)" }}
      />
      <div className="py-5 bg-body" />
      <div>
        <Container>
          <nav className="flex">
            <div className="flex flex-col md:flex-row gap-3 flex-1 py-4">
              <Link
                href="/"
                className="w-44 h-11 block relative mx-auto md:mx-0"
              >
                <Image
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fill
                  className="block object-contain object-left"
                  src="/assets/logo.png"
                  alt=""
                />
              </Link>
              <div className="flex-1 md:ml-6">
                <SearchBar />
              </div>
            </div>
          </nav>
        </Container>
      </div>
    </header>
  );
};

export default Header;
