import {Container} from '@components/globals/container.component';
import React from 'react';
import {Breadcrumb} from '@components/globals/breadcrumb.component';
import {CiCircleRemove} from 'react-icons/ci';
import Image from 'next/image';
import {v4 as uuidv4} from 'uuid';
import {MdShoppingBag} from 'react-icons/md';
import {PiShoppingCartSimple} from 'react-icons/pi';

export const WishListComponent = () => {
  return (
    <>
      <Breadcrumb list={[]} prefixTitle="Contact Us" />
      <Container>
        <div className="my-14 border-2">
          <div className="flex flex-wrap justify-between items-center gap-4 p-4">
            <h3 className="capitalize text-lg">wishlist (5)</h3>
            <div className="flex gap-3">
              <button className="bg-primary-200 border-2 border-primary-500 hover:bg-primary-700 hover:text-white p-3">
                Move all to cart
              </button>
              <button className="bg-primary-200 border-2 border-primary-500 hover:bg-primary-700 hover:text-white p-3">
                Delete All
              </button>
            </div>
          </div>

          <div className="w-full overflow-auto">
            <table className="w-full border-collapse text-nowrap">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left px-6 py-3">Product</th>
                  <th className="text-left px-6 py-3">Price</th>
                  <th className="text-center px-6 py-3">
                    <div className="ml-auto w-full max-w-52">Actions</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {wishListItems.map(product => (
                  <tr key={uuidv4()} className="border-b">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-4 pr-6">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={50}
                          height={50}
                          className="object-cover rounded-full"
                        />
                        <span className="text-sm sm:text-base md:text-lg font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm sm:text-base md:text-lg font-medium text-gray-700">
                      <div className="pr-4">{product.price}</div>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="py-2 px-4 flex items-center bg-primary-500 text-white hover:bg-primary-600 rounded-md">
                          Add to Cart <PiShoppingCartSimple className="ml-2 h-5 w-5" />
                        </button>
                        <CiCircleRemove className="text-xl sm:text-2xl md:text-3xl text-gray-500 cursor-pointer hover:text-red-800" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </>
  );
};

const wishListItems = [
  {
    id: 1,
    name: 'COSMETIC BAG SPA KIT',
    price: '$2,300.00',
    status: 'IN STOCK',
    image: '/assets/cat-image.jpg'
  },
  {
    id: 2,
    name: 'TRAVEL DUFFEL BAG',
    price: '$1,200.00',
    status: 'IN STOCK',
    image: '/assets/cat-image.jpg'
  },
  {
    id: 3,
    name: 'TRAVEL DUFFEL BAG',
    price: '$950.00',
    status: 'IN STOCK',
    image: '/assets/cat-image.jpg'
  },
  {
    id: 4,
    name: 'SPORTS WATER BOTTLE',
    price: '$15.99',
    status: 'OUT OF STOCK',
    image: '/assets/cat-image.jpg'
  },
  {
    id: 5,
    name: 'SPORTS WATER BOTTLE',
    price: '$15.99',
    status: 'IN STOCK',
    image: '/assets/cat-image.jpg'
  }
];
