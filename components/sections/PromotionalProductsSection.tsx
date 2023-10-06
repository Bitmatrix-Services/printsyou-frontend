import React from 'react';

import Container from '../globals/Container';
import ProductCard from '../cards/ProductCard';
import {useAppSelector} from '@store/hooks';
import {selectPromotionalProducts} from '@store/slices/product/product.slice';

export const products = [
  {
    color: '#9a605c',
    title: 'Bags',
    imageSrc: '/assets/p-item-1.png',
    categoryLinks: [
      {
        title: 'Backpacks',
        href: '/bags/back-packs'
      },
      {
        title: 'Cooler Bags',
        href: '/bags/Coolers-and-Lunchbags'
      },
      {
        title: 'Drawstring Bags',
        href: '/bags/back-packs/drawstring-barrel'
      },
      {
        title: 'Plastic Bags',
        href: '/bags/plastic-bags'
      },
      {
        title: 'Totes - Nonwoven',
        href: '/bags/Nonwoven-Totes'
      }
    ]
  },
  {
    color: '#dd6c99',
    title: 'Calendars',
    imageSrc: '/assets/p-item-2.png',
    categoryLinks: [
      {
        title: 'Adhesive Calendars',
        href: '/bags/back-packs'
      },
      {
        title: 'Blotter Calendars',
        href: '/bags/Coolers-and-Lunchbags'
      },
      {
        title: 'Desk Calendars',
        href: '/bags/back-packs/drawstring-barrel'
      },
      {
        title: 'Pocket Planners',
        href: '/bags/plastic-bags'
      },
      {
        title: 'Wall Calendars',
        href: '/bags/Nonwoven-Totes'
      }
    ]
  },
  {
    color: '#58c6f1',
    title: 'Drinkware',
    imageSrc: '/assets/p-item-3.png',
    categoryLinks: [
      {
        title: 'Bottles',
        href: '/bags/back-packs'
      },
      {
        title: 'Koozies',
        href: '/bags/Coolers-and-Lunchbags'
      },
      {
        title: 'Mugs',
        href: '/bags/back-packs/drawstring-barrel'
      },
      {
        title: 'Stadium Cups',
        href: '/bags/plastic-bags'
      },
      {
        title: 'Tumblers',
        href: '/bags/Nonwoven-Totes'
      }
    ]
  },
  {
    color: '#9a605c',
    title: 'Bags',
    imageSrc: '/assets/p-item-1.png',
    categoryLinks: [
      {
        title: 'Backpacks',
        href: '/bags/back-packs'
      },
      {
        title: 'Cooler Bags',
        href: '/bags/Coolers-and-Lunchbags'
      },
      {
        title: 'Drawstring Bags',
        href: '/bags/back-packs/drawstring-barrel'
      },
      {
        title: 'Plastic Bags',
        href: '/bags/plastic-bags'
      },
      {
        title: 'Totes - Nonwoven',
        href: '/bags/Nonwoven-Totes'
      }
    ]
  },
  {
    color: '#dd6c99',
    title: 'Calendars',
    imageSrc: '/assets/p-item-2.png',
    categoryLinks: [
      {
        title: 'Adhesive Calendars',
        href: '/bags/back-packs'
      },
      {
        title: 'Blotter Calendars',
        href: '/bags/Coolers-and-Lunchbags'
      },
      {
        title: 'Desk Calendars',
        href: '/bags/back-packs/drawstring-barrel'
      },
      {
        title: 'Pocket Planners',
        href: '/bags/plastic-bags'
      },
      {
        title: 'Wall Calendars',
        href: '/bags/Nonwoven-Totes'
      }
    ]
  },
  {
    color: '#58c6f1',
    title: 'Drinkware',
    imageSrc: '/assets/p-item-3.png',
    categoryLinks: [
      {
        title: 'Bottles',
        href: '/bags/back-packs'
      },
      {
        title: 'Koozies',
        href: '/bags/Coolers-and-Lunchbags'
      },
      {
        title: 'Mugs',
        href: '/bags/back-packs/drawstring-barrel'
      },
      {
        title: 'Stadium Cups',
        href: '/bags/plastic-bags'
      },
      {
        title: 'Tumblers',
        href: '/bags/Nonwoven-Totes'
      }
    ]
  },
  {
    color: '#9a605c',
    title: 'Bags',
    imageSrc: '/assets/p-item-1.png',
    categoryLinks: [
      {
        title: 'Backpacks',
        href: '/bags/back-packs'
      },
      {
        title: 'Cooler Bags',
        href: '/bags/Coolers-and-Lunchbags'
      },
      {
        title: 'Drawstring Bags',
        href: '/bags/back-packs/drawstring-barrel'
      },
      {
        title: 'Plastic Bags',
        href: '/bags/plastic-bags'
      },
      {
        title: 'Totes - Nonwoven',
        href: '/bags/Nonwoven-Totes'
      }
    ]
  },
  {
    color: '#dd6c99',
    title: 'Calendars',
    imageSrc: '/assets/p-item-2.png',
    categoryLinks: [
      {
        title: 'Adhesive Calendars',
        href: '/bags/back-packs'
      },
      {
        title: 'Blotter Calendars',
        href: '/bags/Coolers-and-Lunchbags'
      },
      {
        title: 'Desk Calendars',
        href: '/bags/back-packs/drawstring-barrel'
      },
      {
        title: 'Pocket Planners',
        href: '/bags/plastic-bags'
      },
      {
        title: 'Wall Calendars',
        href: '/bags/Nonwoven-Totes'
      }
    ]
  },
  {
    color: '#58c6f1',
    title: 'Drinkware',
    imageSrc: '/assets/p-item-3.png',
    categoryLinks: [
      {
        title: 'Bottles',
        href: '/bags/back-packs'
      },
      {
        title: 'Koozies',
        href: '/bags/Coolers-and-Lunchbags'
      },
      {
        title: 'Mugs',
        href: '/bags/back-packs/drawstring-barrel'
      },
      {
        title: 'Stadium Cups',
        href: '/bags/plastic-bags'
      },
      {
        title: 'Tumblers',
        href: '/bags/Nonwoven-Totes'
      }
    ]
  }
];

const PromotionalProductsSection = () => {
  const promotionalProducts = useAppSelector(selectPromotionalProducts);
  console.log('first', promotionalProducts);
  return (
    <>
      <section className="bg-greyLight pt-10 pb-8 lg:pb-20">
        <Container>
          <div>
            <h2 className="mb-10 text-center text-body text-xl font-normal uppercase tracking-[3px]">
              POPULAR PROMOTIONAL PRODUCT CATEGORIES
            </h2>
            <ul className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-20 md:gap-16 xl:gap-8 2xl:gap-20">
              {products.map((product, index) => (
                <li key={index} className="mt-16 sm:mt-0">
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
};

export default PromotionalProductsSection;
