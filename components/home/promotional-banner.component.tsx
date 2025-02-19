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
    <div className="relative h-[480px] sm:h-[500px] md:h-[550px] lg:h-[600px] w-full">
      <Image
        className="object-cover w-full h-full rounded-lg"
        sizes="(max-width: 768px) 50vw, 100vw"
        src={`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${imageUrl}`}
        alt={title}
        width={800}
        height={600}
      />

      {/* Text Overlay Inside Image */}
      <div className="absolute inset-0 flex items-end justify-start p-4 sm:p-6 bg-gradient-to-t from-black/50 via-black/20 to-transparent">
        <div className="bg-white/90 backdrop-blur-sm py-4 px-5 rounded-xl max-w-md text-start">
          <h2
            className="text-primary-500 font-bold text-xl mb-1 capitalize"
            dangerouslySetInnerHTML={{__html: title}}
          ></h2>
          <p className="text-black text-base" dangerouslySetInnerHTML={{__html: description}}></p>
          <div className="mt-3 flex flex-wrap justify-start">
            <Link href={`/categories/${link}`} className="px-4 py-1 text-white bg-primary-500 text-sm rounded-full">
              Explore Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
