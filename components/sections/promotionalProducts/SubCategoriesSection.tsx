import React, {FC} from 'react';
import SubCategoryCard from '@components/cards/SubCategoryCard';
import {Category} from '@store/slices/category/category';

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

interface SubCategoriesSectionProps {
  subCategoryList: Category[];
}

const SubCategoriesSection: FC<SubCategoriesSectionProps> = ({
  subCategoryList
}) => {
  return (
    <>
      <div>
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 xl:gap-4 2xl:gap-10">
          {subCategoryList.map((category, index) => (
            <li key={category.id} className="mt-16 sm:mt-0">
              <SubCategoryCard category={category} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default SubCategoriesSection;
