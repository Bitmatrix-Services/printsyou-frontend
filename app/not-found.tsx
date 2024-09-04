import React from 'react';
import Link from 'next/link';

function PageNotFound() {
  return (
    <div className="m-16 flex flex-col items-center">
      <h1 className="text-[5rem] md:text-[7rem] lg:text-[10rem] text-[#8c8c8c]">404</h1>
      <h2 className="uppercase text-3xl mt-0 text-center">page not found</h2>
      <Link href="/" className="underline text-xl text-primary-500 my-4">
        Go back to Home Page
      </Link>
    </div>
  );
}

export default PageNotFound;
