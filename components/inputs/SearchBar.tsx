import React from "react";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  imageUrl: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "UL 2 Port Wall Charger",
    imageUrl:
      "https://media.nextopia.net/b2048795ebfaa31a43ee438499a75b21/56bb9f81c27e7062218429c381430b4a.jpg?wm=0&h=50&w=50&bg=ffffff&src=https%3A%2F%2Fwww.identity-links.com%2Fimg%2Fucart%2Fimages%2Fpimage%2F135176%2Fmain.jpg",
  },
  {
    id: 2,
    name: "UL 2 Port Wall Charger",
    imageUrl:
      "https://media.nextopia.net/b2048795ebfaa31a43ee438499a75b21/56bb9f81c27e7062218429c381430b4a.jpg?wm=0&h=50&w=50&bg=ffffff&src=https%3A%2F%2Fwww.identity-links.com%2Fimg%2Fucart%2Fimages%2Fpimage%2F135176%2Fmain.jpg",
  },
];

interface Category {
  name: string;
  imageUrl: string;
}

const categories: Category[] = [
  {
    name: "Kids Products",
    imageUrl:
      "https://www.identity-links.com/img/ucart/images/catimage/614/small.JPG",
  },
  {
    name: "Kids Products 2",
    imageUrl:
      "https://www.identity-links.com/img/ucart/images/catimage/614/small.JPG",
  },
];

const populars: string[] = ["Kids Products", "Electronics", "Clothing"];

const SearchBar = () => {
  return (
    <form className="w-full relative">
      <div className="w-full flex">
        <input
          className="border border-[#eceef1] outline-none rounded-none py-4 px-4 text-sm flex-1"
          type="search"
          name="search"
          placeholder="Search entire store here..."
        />
        <button
          type="button"
          className="py-4 px-12 bg-primary-500 hover:bg-body text-white bg-center bg-no-repeat transition-all duration-300"
          style={{
            backgroundImage: 'url("/assets/icon-search-white.png")',
            backgroundSize: "20px auto",
          }}
        />
      </div>
      <div className="absolute hidden z-20 w-full max-h-96 overflow-auto top-14 left-0 bg-white border border-[#ddd] shadow-md p-2 rounded-b-md">
        <div className="space-y-3">
          <fieldset>
            <h6 className="mb-3 text-base font-semibold text-primary-500 uppercase">
              Category
            </h6>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.name}>
                  <div className="flex gap-3 hover:bg-gray-100 p-2">
                    <span className="block relative h-28 w-28 min-w-[7rem]">
                      <Image
                        fill
                        className="object-contain"
                        src={category.imageUrl}
                        alt={category.name}
                      />
                    </span>
                    <span className="font-normal text-xs">
                      <b className="underline">{category.name}</b>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </fieldset>
          <fieldset>
            <h6 className="mb-3 text-base font-semibold text-primary-500 uppercase">
              Product Matches
            </h6>
            <ul className="space-y-2">
              {products.map((product) => (
                <li key={product.id}>
                  <div className="flex gap-3 hover:bg-gray-100 p-2">
                    <span className="block relative h-12 w-12 min-w-[3rem]">
                      <Image
                        fill
                        className="object-contain"
                        src={product.imageUrl}
                        alt={product.name}
                      />
                    </span>
                    <span className="font-normal text-xs">
                      <b className="underline">{product.name}</b>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </fieldset>
          <fieldset>
            <h6 className="mb-3 text-base font-semibold text-primary-500 uppercase">
              Popular Searches
            </h6>
            <ul className="space-y-2">
              {populars.map((name) => (
                <li key={name}>
                  <div className="flex gap-3 hover:bg-gray-100 p-2">
                    <span className="font-normal text-xs">
                      <b className="underline">{name}</b>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </fieldset>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
