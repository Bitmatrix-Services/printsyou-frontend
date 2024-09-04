import Image from 'next/image';
import {FC} from 'react';

interface IPromotionalBannerProps {
  imageUrl: string;
}

export const PromotionalBanner: FC<IPromotionalBannerProps> = ({imageUrl}) => {
  return (
    <div className="py-60 relative">
      <Image fill objectFit="cover" src={imageUrl} alt={'promotions'} />
      <div className="absolute z-10 h-full w-full left-0 top-0 flex items-end justify-start pl-2 pb-2 ">
        <div className="bg-white py-5 px-5 rounded-2xl max-w-md text-start">
          <h2 className="text-primary-500 font-bold text-xl mb-1">Wear Your Creativity</h2>
          <p className="text-black text-base">
            Discover our range of customizable apparel. personalize your wardrobe with PrintsYou.
          </p>
          <div className="mt-3 flex flex-wrap justify-start">
            <button type="button" className="px-4 py-1 text-white bg-primary-500 text-sm rounded-full">
              Explore Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
