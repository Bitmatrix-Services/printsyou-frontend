import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const bagsData = [
  {
    category: 'Cooler Bags',
    products: [
      {
        name: 'Tablet Thin EliteBook Revolve 810 G6',
        price: '$3.00',
        imageSrc: '/assets/p-item-4.png',
        link: '#'
      },
      {
        name: 'Tablet Thin EliteBook Revolve 810 G6',
        price: '$3.00',
        imageSrc: '/assets/p-item-1.png',
        link: '#'
      },
      {
        name: 'Tablet Thin EliteBook Revolve 810 G6',
        price: '$3.00',
        imageSrc: '/assets/p-item-2.png',
        link: '#'
      }
    ]
  },
  {
    category: 'Drawstring Bags',
    products: [
      {
        name: 'Tablet Thin EliteBook Revolve 810 G6',
        price: '$3.00',
        imageSrc: '/assets/p-item-3.png',
        link: '#'
      },
      {
        name: 'Tablet Thin EliteBook Revolve 810 G6',
        price: '$3.00',
        imageSrc: '/assets/p-item-1.png',
        link: '#'
      },
      {
        name: 'Tablet Thin EliteBook Revolve 810 G6',
        price: '$3.00',
        imageSrc: '/assets/p-item-2.png',
        link: '#'
      }
    ]
  },
  {
    category: 'Plastic Bags',
    products: [
      {
        name: 'Tablet Thin EliteBook Revolve 810 G6',
        price: '$3.00',
        imageSrc: '/assets/p-item-4.png',
        link: '#'
      },
      {
        name: 'Tablet Thin EliteBook Revolve 810 G6',
        price: '$3.00',
        imageSrc: '/assets/p-item-4.png',
        link: '#'
      },
      {
        name: 'Tablet Thin EliteBook Revolve 810 G6',
        price: '$3.00',
        imageSrc: '/assets/p-item-4.png',
        link: '#'
      }
    ]
  },
  {
    category: 'Totes - Nonwoven',
    products: [
      {
        name: 'Tablet Thin EliteBook Revolve 810 G6',
        price: '$3.00',
        imageSrc: '/assets/p-item-4.png',
        link: '#'
      },
      {
        name: 'Tablet Thin EliteBook Revolve 810 G6',
        price: '$3.00',
        imageSrc: '/assets/p-item-3.png',
        link: '#'
      },
      {
        name: 'Tablet Thin EliteBook Revolve 810 G6',
        price: '$3.00',
        imageSrc: '/assets/p-item-2.png',
        link: '#'
      }
    ]
  }
];

const ProductTabView = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
      {bagsData.map((bagCategory, index) => (
        <div key={index} className="col">
          <h2 className="text-headingColor text-lg font-normal capitalize inline-block border-b border-[#ddd] after:mt-3 after:block after:w-1/2 after:h-1 after:bg-primary-500">
            {bagCategory.category}
          </h2>
          <div className="mt-8 space-y-4">
            {bagCategory.products.map((product, productIndex) => (
              <Link
                key={productIndex}
                href={product.link}
                className="product-card p-4 group block rounded border-r border-[#ddd] hover:bg-white hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <Image
                    style={{minWidth: 75}}
                    width={75}
                    height={75}
                    src={product.imageSrc}
                    alt="..."
                  />
                  <div>
                    <h6 className="mb-2 text-mute group-hover:text-headingColor text-sm font-semibold">
                      {product.name}
                    </h6>
                    <h6 className="text-sm font-semibold text-gray-600 group-hover:text-headingColor">
                      {product.price}
                    </h6>
                  </div>
                </div>
              </Link>
            ))}
            <div className="text-center">
              <Link
                href="#"
                className="py-2 px-8 text-sm font-semibold inline-flex items-center gap-1 btn-primary"
              >
                <span>View All</span>
                {/* <ArrowRightIcon /> */}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductTabView;
