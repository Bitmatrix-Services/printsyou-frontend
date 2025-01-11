import Image from 'next/image';
import {FC} from 'react';
import Link from 'next/link';

interface IPromotionalBannerProps {
  link?: string;
  imageUrl: string;
  title?: string;
  description?: string;
}

export const PromotionalBanner: FC<IPromotionalBannerProps> = ({
  title = 'Wear Your Creativity',
  description = 'Discover our range of customizable apparel. personalize your wardrobe with PrintsYou.',
  imageUrl,
  link = '/categories/awards'
}) => {
  return (
    <div className="py-60 relative">
      <Image fill src={imageUrl} alt={'promotions'} className="object-cover" sizes="(max-width: 768px) 50vw, 100vw" />
      <div className="absolute z-10 h-full w-full left-0 top-0 flex items-end justify-start px-2 pb-2 ">
        <div className="bg-white py-5 px-5 rounded-2xl max-w-md text-start">
          <h2 className="text-primary-500 font-bold text-xl mb-1 capitalize">{title}</h2>
          <p className="text-black text-base">{description}</p>
          <div className="mt-3 flex flex-wrap justify-start">
            <Link href={link} className="px-4 py-1 text-white bg-primary-500 text-sm rounded-full">
              Explore Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
